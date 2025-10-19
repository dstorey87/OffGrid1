"""
AI Products API Endpoints
Handles AI-powered product discovery, enrichment, search, and recommendations
"""

import logging
from typing import Any

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.core.chromadb_client import get_chromadb_client
from app.core.embeddings import get_embedding_service
from app.core.ollama_client import get_ollama_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI Products"])


# ==================== Request/Response Models ====================


class ProductEnrichRequest(BaseModel):
    """Request to enrich a product with AI"""

    name: str = Field(..., description="Product name")
    description: str | None = Field(None, description="Product description")
    specifications: dict[str, Any] | None = Field(None, description="Product specifications")


class ProductEnrichResponse(BaseModel):
    """Enriched product data"""

    tags: list[str]
    category: str
    summary_pt: str
    summary_en: str
    use_cases: list[str]
    compatibility: str


class ProductSearchRequest(BaseModel):
    """Request to search products"""

    query: str = Field(..., description="Search query (natural language)")
    category: str | None = Field(None, description="Filter by category")
    min_price: float | None = Field(None, description="Minimum price (EUR)")
    max_price: float | None = Field(None, description="Maximum price (EUR)")
    in_stock: bool | None = Field(None, description="Only in-stock products")
    ships_portugal: bool | None = Field(None, description="Only ships to Portugal")
    tags: list[str] | None = Field(None, description="Filter by tags")
    n_results: int = Field(10, ge=1, le=50, description="Number of results")


class ProductResult(BaseModel):
    """Single product result"""

    id: str
    name: str
    price: float
    currency: str
    category: str
    description: str
    image_url: str | None
    affiliate_link: str
    supplier: str
    in_stock: bool
    ships_portugal: bool
    tags: list[str]
    similarity_score: float
    ai_rank: int | None = None
    ai_relevance: float | None = None
    ai_reason: str | None = None


class ProductSearchResponse(BaseModel):
    """Search results"""

    query: str
    total_results: int
    products: list[ProductResult]
    search_time_ms: float
    requirements: dict[str, Any] | None = None


class RecommendationRequest(BaseModel):
    """Request for product recommendations"""

    calculator_type: str | None = Field(
        None, description="Calculator type (e.g., 'solar-panel-sizing')"
    )
    calculator_results: dict[str, Any] | None = Field(None, description="Calculator output")
    user_query: str | None = Field(None, description="User's natural language query")
    budget: float | None = Field(None, description="Maximum budget (EUR)")
    n_results: int = Field(10, ge=1, le=20, description="Number of recommendations")


# ==================== Endpoints ====================


@router.post("/enrich", response_model=ProductEnrichResponse)
async def enrich_product(request: ProductEnrichRequest):
    """
    Enrich product data with AI-generated tags, categories, summaries, and insights

    This endpoint uses Qwen2.5-7B to analyze product information and generate:
    - Relevant tags (Portuguese + English)
    - Product category
    - Summaries in both languages
    - Use cases
    - Compatibility notes
    """
    try:
        ollama = get_ollama_client()

        enriched = ollama.enrich_product(
            name=request.name,
            description=request.description or "",
            specifications=request.specifications,
        )

        return ProductEnrichResponse(**enriched)

    except Exception as e:
        logger.error("Product enrichment failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Enrichment failed: {str(e)}") from e


@router.post("/embed")
async def generate_embedding(
    text: str = Query(..., description="Text to embed"),
    normalize: bool = Query(True, description="L2-normalize embedding"),
):
    """
    Generate embedding vector for text

    Uses multilingual-e5-large for semantic embeddings
    Returns 1024-dimensional vector
    """
    try:
        embedding_service = get_embedding_service()

        embedding = embedding_service.encode(text, normalize=normalize)

        return {
            "text": text,
            "embedding": embedding.tolist(),
            "dimension": len(embedding),
            "model": embedding_service.model_name,
        }

    except Exception as e:
        logger.error("Embedding generation failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Embedding failed: {str(e)}") from e


@router.post("/search", response_model=ProductSearchResponse)
async def search_products(request: ProductSearchRequest):
    """
    Semantic product search with AI-powered ranking

    Process:
    1. Extract requirements from query (Qwen2.5)
    2. Generate query embedding (multilingual-e5)
    3. Search vector database (ChromaDB)
    4. Filter by metadata (category, price, stock)
    5. Re-rank by relevance (Qwen2.5)
    6. Return results with affiliate links
    """
    import time

    start_time = time.time()

    try:
        # Services
        embedding_service = get_embedding_service()
        chromadb = get_chromadb_client()
        ollama = get_ollama_client()

        # 1. Extract requirements
        logger.info("Extracting requirements from: %s", request.query)
        requirements = ollama.extract_requirements(request.query)

        # Use requirements to enhance filters
        if not request.category and requirements.get("categories"):
            # Use first category from requirements
            request.category = requirements["categories"][0]

        if not request.max_price and requirements.get("price_range", {}).get("max"):
            request.max_price = requirements["price_range"]["max"]

        if not request.min_price and requirements.get("price_range", {}).get("min"):
            request.min_price = requirements["price_range"]["min"]

        # 2. Generate query embedding
        logger.info("Generating query embedding")
        query_embedding = embedding_service.encode(request.query)

        # 3. Search ChromaDB
        logger.info("Searching vector database")
        search_results = chromadb.search_with_filters(
            query_embedding=query_embedding.tolist(),
            category=request.category,
            min_price=request.min_price,
            max_price=request.max_price,
            in_stock=request.in_stock,
            ships_portugal=request.ships_portugal,
            tags=request.tags,
            n_results=request.n_results * 2,  # Get more for re-ranking
        )

        # 4. Convert to product objects
        products = []
        for i, product_id in enumerate(search_results["ids"][0]):
            metadata = search_results["metadatas"][0][i]
            distance = search_results["distances"][0][i]

            # Convert distance to similarity (cosine distance = 1 - cosine_similarity)
            similarity_score = 1.0 - distance

            # Tags are stored as comma-separated string
            tags_str = metadata.get("tags", "")
            tags_list = [t.strip() for t in tags_str.split(",") if t.strip()]

            products.append(
                {
                    "id": product_id,
                    "name": metadata.get("name", "Unknown"),
                    "price": metadata.get("price", 0.0),
                    "currency": metadata.get("currency", "EUR"),
                    "category": metadata.get("category", "other"),
                    "description": search_results["documents"][0][i],
                    "image_url": metadata.get("image_url"),
                    "affiliate_link": metadata.get("affiliate_link", "#"),
                    "supplier": metadata.get("supplier", "Unknown"),
                    "in_stock": metadata.get("in_stock", False),
                    "ships_portugal": metadata.get("ships_portugal", False),
                    "tags": tags_list,
                    "similarity_score": similarity_score,
                }
            )

        # 5. Re-rank with LLM
        if products and len(products) > 3:
            logger.info("Re-ranking products with LLM")
            products = ollama.rank_products(
                query=request.query, products=products, top_k=request.n_results
            )
        else:
            products = products[: request.n_results]

        search_time = (time.time() - start_time) * 1000  # ms

        return ProductSearchResponse(
            query=request.query,
            total_results=len(products),
            products=[ProductResult(**p) for p in products],
            search_time_ms=search_time,
            requirements=requirements,
        )

    except Exception as e:
        logger.error("Product search failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}") from e


@router.post("/recommend", response_model=ProductSearchResponse)
async def recommend_products(request: RecommendationRequest):
    """
    Get AI-powered product recommendations

    Can be triggered by:
    - Calculator results (e.g., solar panel sizing)
    - Natural language query
    - Hybrid (calculator + query)

    Returns ranked products with explanations
    """
    import time

    time.time()

    try:
        get_ollama_client()

        # Build query from calculator results or user query
        if request.calculator_results:
            # Convert calculator results to query
            calc_type = request.calculator_type or "calculator"

            if calc_type == "solar-panel-sizing":
                power = request.calculator_results.get("recommended_panel_power", 0)
                battery = request.calculator_results.get("battery_capacity_ah", 0)
                query = f"sistema solar {power}W com bateria {battery}Ah"
            elif calc_type == "battery-sizing":
                capacity = request.calculator_results.get("battery_capacity_ah", 0)
                voltage = request.calculator_results.get("system_voltage", 12)
                query = f"bateria {capacity}Ah {voltage}V para sistema off-grid"
            elif calc_type == "water-independence":
                storage = request.calculator_results.get("storage_needed_liters", 0)
                query = f"tanque de água {storage} litros para casa"
            else:
                # Generic calculator query
                query = f"{calc_type} products"
        elif request.user_query:
            query = request.user_query
        else:
            raise HTTPException(
                status_code=400, detail="Must provide calculator_results or user_query"
            )

        # Use search endpoint
        search_request = ProductSearchRequest(
            query=query,
            max_price=request.budget,
            in_stock=True,
            ships_portugal=True,
            n_results=request.n_results,
        )

        response = await search_products(search_request)

        return response

    except HTTPException:
        raise
    except Exception as e:
        logger.error("Product recommendation failed: %s", e)
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}") from e


@router.get("/health")
async def health_check():
    """
    Check AI service health

    Verifies:
    - Ollama connection
    - Embedding model loaded
    - ChromaDB accessible
    """
    try:
        # Check Ollama
        ollama = get_ollama_client()
        ollama_status = "connected"

        # Check embeddings
        embedding_service = get_embedding_service()
        embedding_status = f"loaded ({embedding_service.model_name})"

        # Check ChromaDB
        chromadb = get_chromadb_client()
        product_count = chromadb.count()
        chromadb_status = f"connected ({product_count} products)"

        return {
            "status": "healthy",
            "ollama": ollama_status,
            "embeddings": embedding_status,
            "chromadb": chromadb_status,
            "models": {
                "llm": ollama.model,
                "embeddings": embedding_service.model_name,
                "embedding_dim": embedding_service.embedding_dim,
            },
        }

    except (RuntimeError, ValueError, ConnectionError) as e:
        logger.error("Health check failed: %s", e)
        return {"status": "unhealthy", "error": str(e)}


# Example: Add this router to your FastAPI app
# from fastapi import FastAPI
# app = FastAPI()
# app.include_router(router)
