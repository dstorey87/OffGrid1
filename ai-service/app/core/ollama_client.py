"""
Ollama Client for Qwen2.5-7B LLM Inference
Handles product enrichment, requirement extraction, and ranking
"""

import json
import logging
from dataclasses import dataclass
from typing import Any

import requests

logger = logging.getLogger(__name__)


@dataclass
class OllamaResponse:
    """Response from Ollama inference"""

    content: str
    model: str
    total_duration_ms: float
    prompt_tokens: int
    completion_tokens: int


class OllamaClient:
    """Client for local Ollama LLM inference"""

    def __init__(
        self,
        model: str = "qwen2.5:7b-instruct-q4_K_M",
        base_url: str = "http://localhost:11434",
        temperature: float = 0.3,
        max_tokens: int = 512,
    ):
        """
        Initialize Ollama client

        Args:
            model: Ollama model name (must be pulled first with `ollama pull`)
            base_url: Ollama server URL
            temperature: Sampling temperature (0.0 = deterministic, 1.0 = creative)
            max_tokens: Maximum tokens to generate
        """
        self.model = model
        self.base_url = base_url
        self.temperature = temperature
        self.max_tokens = max_tokens

        logger.info(f"Initializing Ollama client for model: {model}")

        # Verify connection
        try:
            response = requests.get(f"{base_url}/api/tags", timeout=5)
            if response.status_code == 200:
                models = response.json().get("models", [])
                model_names = [m["name"] for m in models]

                if any(model in name for name in model_names):
                    logger.info(f"✓ Model '{model}' is available")
                else:
                    logger.warning(f"✗ Model '{model}' not found. Available: {model_names}")
                    logger.warning(f"Run: ollama pull {model}")
            else:
                logger.error(f"Ollama server returned status {response.status_code}")
        except requests.exceptions.RequestException as e:
            logger.error(f"Cannot connect to Ollama server at {base_url}: {e}")
            logger.error("Is Ollama running? Start with: ollama serve")

    def generate(
        self,
        prompt: str,
        system: str | None = None,
        temperature: float | None = None,
        max_tokens: int | None = None,
        json_mode: bool = False,
    ) -> OllamaResponse:
        """
        Generate text completion

        Args:
            prompt: User prompt
            system: System prompt (instructions)
            temperature: Override default temperature
            max_tokens: Override default max tokens
            json_mode: Force JSON output

        Returns:
            OllamaResponse with generated text and metadata
        """
        # Build request
        data = {
            "model": self.model,
            "prompt": prompt,
            "stream": False,
            "options": {
                "temperature": temperature if temperature is not None else self.temperature,
                "num_predict": max_tokens if max_tokens is not None else self.max_tokens,
            },
        }

        if system:
            data["system"] = system

        if json_mode:
            data["format"] = "json"

        # Send request
        try:
            response = requests.post(f"{self.base_url}/api/generate", json=data, timeout=60)
            response.raise_for_status()

            result = response.json()

            return OllamaResponse(
                content=result["response"],
                model=result["model"],
                total_duration_ms=result.get("total_duration", 0) / 1_000_000,  # ns to ms
                prompt_tokens=result.get("prompt_eval_count", 0),
                completion_tokens=result.get("eval_count", 0),
            )

        except requests.exceptions.RequestException as e:
            logger.error(f"Ollama request failed: {e}")
            raise

    def enrich_product(
        self, name: str, description: str = "", specifications: dict[str, Any] = None
    ) -> dict[str, Any]:
        """
        Enrich product data with AI-generated insights

        Args:
            name: Product name
            description: Product description
            specifications: Product specifications

        Returns:
            Dictionary with:
                - tags: List of relevant tags
                - category: Product category
                - summary_pt: Portuguese summary
                - summary_en: English summary
                - use_cases: List of use cases
                - compatibility: Compatibility notes
        """
        specs_text = ""
        if specifications:
            specs_text = "\nSpecifications:\n" + "\n".join(
                f"- {k}: {v}" for k, v in specifications.items()
            )

        system_prompt = (
            "You are an expert in off-grid energy systems, water systems, "
            "and sustainable living products. Your task is to analyze product "
            "information and generate structured metadata to improve product "
            "discovery. Always respond in valid JSON format."
        )

        user_prompt = f"""Analyze this product and extract structured information:

Product Name: {name}
Description: {description or "N/A"}
{specs_text}

Generate a JSON response with:
1. "tags": Array of 5-10 relevant keywords (Portuguese and English)
2. "category": Single best category (solar-panels, batteries, inverters,
   water-pumps, water-tanks, tools, etc.)
3. "summary_pt": 2-sentence Portuguese product summary
4. "summary_en": 2-sentence English product summary
5. "use_cases": Array of 3-5 specific use cases
6. "compatibility": Brief notes on what this works with

Example output:
{{
  "tags": ["solar", "painel solar", "400W", "monocrystalline", "high-efficiency"],
  "category": "solar-panels",
  "summary_pt": "Painel solar monocristalino de 400W com eficiência de 20.9%. "
                "Ideal para sistemas off-grid residenciais.",
  "summary_en": "400W monocrystalline solar panel with 20.9% efficiency. "
                "Ideal for residential off-grid systems.",
  "use_cases": [
    "Off-grid home power", "RV solar system",
    "Remote cabin electricity", "Battery charging"
  ],
  "compatibility": "Compatible with 24V/48V systems, requires MPPT controller"
}}"""

        try:
            response = self.generate(
                prompt=user_prompt, system=system_prompt, temperature=0.3, json_mode=True
            )

            # Parse JSON
            enriched_data = json.loads(response.content)

            logger.info(f"Enriched product '{name}' in {response.total_duration_ms:.0f}ms")

            return enriched_data

        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"Failed to parse enrichment response: {e}")
            # Return minimal fallback
            return {
                "tags": [name.lower()],
                "category": "other",
                "summary_pt": name,
                "summary_en": name,
                "use_cases": ["General use"],
                "compatibility": "Unknown",
            }

    def extract_requirements(self, user_query: str) -> dict[str, Any]:
        """
        Extract product requirements from natural language query

        Args:
            user_query: User's natural language query

        Returns:
            Dictionary with:
                - categories: List of relevant categories
                - power: Power requirement (watts)
                - voltage: Voltage requirement (volts)
                - capacity: Capacity requirement (Ah, liters, etc.)
                - price_range: {"min": float, "max": float}
                - keywords: List of important keywords
                - intent: User's intent (buy, compare, learn)
        """
        system_prompt = (
            "You are an AI assistant that extracts product requirements from user queries. "
            "Analyze the query and identify technical requirements, budget, and intent. "
            "Always respond in valid JSON format."
        )

        user_prompt = f"""Extract product requirements from this query:

Query: "{user_query}"

Generate JSON with:
1. "categories": Array of relevant product categories
2. "power_watts": Power requirement (null if not specified)
3. "voltage_volts": Voltage requirement (null if not specified)
4. "capacity": Capacity/size requirement with unit (null if not specified)
5. "price_range": {{"min": number or null, "max": number or null}}
6. "keywords": Array of 5-10 important search keywords
7. "intent": One of ["buy", "compare", "learn", "calculate"]
8. "language": "pt" or "en"

Example:
Query: "preciso de painel solar 400W para bomba de água, máximo €200"
Output:
{{
  "categories": ["solar-panels"],
  "power_watts": 400,
  "voltage_volts": null,
  "capacity": null,
  "price_range": {{"min": null, "max": 200}},
  "keywords": ["solar panel", "painel solar", "400W", "water pump", "bomba de água"],
  "intent": "buy",
  "language": "pt"
}}"""

        try:
            response = self.generate(
                prompt=user_prompt, system=system_prompt, temperature=0.2, json_mode=True
            )

            requirements = json.loads(response.content)

            logger.info(f"Extracted requirements in {response.total_duration_ms:.0f}ms")

            return requirements

        except (json.JSONDecodeError, KeyError) as e:
            logger.error(f"Failed to parse requirements: {e}")
            # Return minimal fallback
            return {
                "categories": [],
                "power_watts": None,
                "voltage_volts": None,
                "capacity": None,
                "price_range": {"min": None, "max": None},
                "keywords": user_query.lower().split(),
                "intent": "learn",
                "language": "en",
            }

    def rank_products(
        self, query: str, products: list[dict[str, Any]], top_k: int = 10
    ) -> list[dict[str, Any]]:
        """
        Re-rank products by relevance and compatibility

        Args:
            query: User's query
            products: List of candidate products (from vector search)
            top_k: Number of products to return

        Returns:
            Re-ranked list of products with explanations
        """
        # Prepare product descriptions
        product_list = []
        for i, p in enumerate(products[:20]):  # Limit to top 20 candidates
            product_list.append(
                f"{i+1}. {p.get('name', 'Unknown')} - €{p.get('price', 0):.2f}\n"
                f"   Category: {p.get('category', 'N/A')}\n"
                f"   Description: {p.get('summary_en', p.get('description', 'N/A')[:100])}"
            )

        products_text = "\n\n".join(product_list)

        system_prompt = (
            "You are an expert product advisor for off-grid and sustainable living products. "
            "Analyze the user's query and product candidates, then rank products by "
            "relevance and value. Always respond in valid JSON format."
        )

        user_prompt = f"""Rank these products for the user's query:

User Query: "{query}"

Candidate Products:
{products_text}

Generate JSON with:
1. "rankings": Array of objects with:
   - "rank": 1-{top_k}
   - "product_index": Original product number (1-{len(product_list)})
   - "relevance_score": 0.0-1.0
   - "reason": Brief explanation why recommended
2. "overall_advice": Brief guidance for the user

Only include the top {top_k} most relevant products."""

        try:
            response = self.generate(
                prompt=user_prompt,
                system=system_prompt,
                temperature=0.3,
                max_tokens=1024,
                json_mode=True,
            )

            ranking_data = json.loads(response.content)

            # Map back to original products
            ranked_products = []
            for rank_info in ranking_data.get("rankings", [])[:top_k]:
                product_idx = rank_info["product_index"] - 1
                if 0 <= product_idx < len(products):
                    product = products[product_idx].copy()
                    product["ai_rank"] = rank_info["rank"]
                    product["ai_relevance"] = rank_info["relevance_score"]
                    product["ai_reason"] = rank_info["reason"]
                    ranked_products.append(product)

            logger.info(
                f"Ranked {len(ranked_products)} products in {response.total_duration_ms:.0f}ms"
            )

            return ranked_products

        except (json.JSONDecodeError, KeyError, IndexError) as e:
            logger.error(f"Failed to rank products: {e}")
            # Return original order
            return products[:top_k]


# Global instance
_ollama_client: OllamaClient = None


def get_ollama_client() -> OllamaClient:
    """Get or create global Ollama client"""
    global _ollama_client

    if _ollama_client is None:
        _ollama_client = OllamaClient()

    return _ollama_client


# Example usage
if __name__ == "__main__":
    # Test Ollama
    client = OllamaClient()

    # Test product enrichment
    print("\n=== Testing Product Enrichment ===")
    enriched = client.enrich_product(
        name="JA Solar 400W Painel Monocristalino",
        description="High efficiency 20.9% monocrystalline solar panel",
        specifications={
            "Power": "400W",
            "Efficiency": "20.9%",
            "Voltage": "24V",
            "Dimensions": "1722x1134x30mm",
        },
    )
    print(json.dumps(enriched, indent=2, ensure_ascii=False))

    # Test requirement extraction
    print("\n=== Testing Requirement Extraction ===")
    requirements = client.extract_requirements(
        "preciso de um sistema solar 800W com bateria para casa, máximo €2000"
    )
    print(json.dumps(requirements, indent=2, ensure_ascii=False))

    # Test product ranking
    print("\n=== Testing Product Ranking ===")
    test_products = [
        {"name": "JA Solar 400W Panel", "price": 169.0, "category": "solar-panels"},
        {"name": "LONGi 450W Panel", "price": 195.0, "category": "solar-panels"},
        {"name": "LiFePO4 200Ah Battery", "price": 749.0, "category": "batteries"},
    ]
    ranked = client.rank_products(query="sistema solar 800W", products=test_products, top_k=3)
    for p in ranked:
        print(f"{p.get('ai_rank')}. {p['name']} - €{p['price']} ({p.get('ai_relevance', 0):.2f})")
        print(f"   Reason: {p.get('ai_reason', 'N/A')}")
