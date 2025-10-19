"""
AI Product Discovery System - Test Suite
Validates embeddings, ChromaDB, Ollama, and full RAG pipeline
"""

import sys
import time
from pathlib import Path

from app.core.chromadb_client import ChromaDBClient
from app.core.embeddings import EmbeddingService
from app.core.ollama_client import OllamaClient

# Add ai-service to path
sys.path.insert(0, str(Path(__file__).parent))


def print_test_header(test_name):
    """Print formatted test header"""
    print("\n" + "=" * 70)
    print(f"TEST: {test_name}")
    print("=" * 70)


def print_success(message):
    """Print success message"""
    print(f"✓ {message}")


def print_error(message):
    """Print error message"""
    print(f"✗ ERROR: {message}")


def test_embeddings():
    """Test embedding generation and similarity"""
    print_test_header("Embedding Service")

    try:
        # Initialize service
        service = EmbeddingService()
        print_success(f"Loaded model: {service.model_name}")
        print_success(f"Embedding dimension: {service.embedding_dim}")
        print_success(f"Device: {service.device}")

        # Test single embedding
        start = time.time()
        text = "painel solar 400W monocristalino alta eficiência"
        embedding = service.encode(text)
        duration = (time.time() - start) * 1000

        print_success(f"Single embedding: {embedding.shape} in {duration:.1f}ms")

        # Test batch embeddings
        start = time.time()
        texts = [
            "painel solar 400W",
            "bateria LiFePO4 200Ah",
            "inversor 3000W onda pura",
            "bomba de água solar",
            "tanque de água 1000 litros",
        ]
        embeddings = service.encode(texts)
        duration = (time.time() - start) * 1000

        print_success(
            f"Batch embeddings: {embeddings.shape} in {duration:.1f}ms ({duration/len(texts):.1f}ms each)"
        )

        # Test product encoding
        product_emb = service.encode_product(
            name="JA Solar 400W Painel Monocristalino",
            description="High efficiency 20.9% monocrystalline solar panel for off-grid systems",
            tags=["solar", "400W", "monocrystalline", "high-efficiency"],
            category="solar-panels",
        )
        print_success(f"Product encoding: {product_emb.shape}")

        # Test similarity
        query_emb = service.encode("painel solar 400W de alta qualidade")
        similarity = service.similarity(query_emb, product_emb)
        print_success(f"Similarity: {similarity:.3f} (higher = more similar)")

        # Test batch similarity
        similarities = service.batch_similarity(query_emb, embeddings)
        print_success(f"Batch similarity: {similarities.shape}")
        print("   Top matches:")
        for i, score in enumerate(similarities):
            print(f"      {i+1}. {texts[i]}: {score:.3f}")

        return True

    except Exception as e:
        print_error(f"Embedding test failed: {e}")
        return False


def test_chromadb():
    """Test ChromaDB vector storage and search"""
    print_test_header("ChromaDB Vector Database")

    try:
        # Initialize client
        client = ChromaDBClient(collection_name="test_products")
        initial_count = client.count()
        print_success(f"ChromaDB connected: {initial_count} products")

        # Clear test collection
        if initial_count > 0:
            client.clear()
            print_success("Cleared test collection")

        # Generate test embeddings
        embedding_service = EmbeddingService()

        test_products = [
            {
                "id": "test-solar-1",
                "name": "JA Solar 400W Monocrystalline Panel",
                "category": "solar-panels",
                "price": 169.0,
                "description": "High efficiency 20.9% monocrystalline solar panel. Perfect for off-grid systems.",
                "tags": ["solar", "400W", "monocrystalline", "high-efficiency"],
            },
            {
                "id": "test-solar-2",
                "name": "LONGi 450W Half-Cell Panel",
                "category": "solar-panels",
                "price": 195.0,
                "description": "Premium half-cell technology for maximum efficiency. 21.5% efficiency rating.",
                "tags": ["solar", "450W", "half-cell", "premium"],
            },
            {
                "id": "test-battery-1",
                "name": "LiFePO4 200Ah 12V Battery",
                "category": "batteries",
                "price": 749.0,
                "description": "Long-lasting lithium iron phosphate battery. 4000+ cycles. Built-in BMS.",
                "tags": ["battery", "LiFePO4", "200Ah", "12V", "BMS"],
            },
            {
                "id": "test-inverter-1",
                "name": "Victron 3000W Pure Sine Inverter",
                "category": "inverters",
                "price": 899.0,
                "description": "High quality pure sine wave inverter. 24V to 230V. Peak power 6000W.",
                "tags": ["inverter", "3000W", "pure-sine", "victron"],
            },
            {
                "id": "test-pump-1",
                "name": "Solar Water Pump 500W",
                "category": "water-pumps",
                "price": 245.0,
                "description": "Submersible solar pump. 50m max head. Flow rate 3000 L/h. DC 48V.",
                "tags": ["pump", "solar", "500W", "submersible", "48V"],
            },
        ]

        # Generate embeddings
        print("   Generating embeddings...")
        embeddings = []
        for product in test_products:
            emb = embedding_service.encode_product(
                name=product["name"],
                description=product["description"],
                tags=product["tags"],
                category=product["category"],
            )
            embeddings.append(emb.tolist())

        print_success(f"Generated {len(embeddings)} embeddings")

        # Add to ChromaDB
        client.add_products(
            ids=[p["id"] for p in test_products],
            embeddings=embeddings,
            metadatas=[
                {
                    "name": p["name"],
                    "category": p["category"],
                    "price": p["price"],
                    "currency": "EUR",
                    "in_stock": True,
                    "ships_portugal": True,
                    "tags": p["tags"],
                }
                for p in test_products
            ],
            documents=[p["description"] for p in test_products],
        )
        print_success(f"Added {len(test_products)} products to ChromaDB")

        # Test search
        query = "painel solar 400W de alta eficiência"
        query_emb = embedding_service.encode(query)

        start = time.time()
        results = client.search(query_embedding=query_emb.tolist(), n_results=3)
        duration = (time.time() - start) * 1000

        print_success(f"Search completed in {duration:.1f}ms")
        print(f"   Query: '{query}'")
        print(f"   Top {len(results['ids'][0])} results:")

        for i, _product_id in enumerate(results["ids"][0]):
            metadata = results["metadatas"][0][i]
            distance = results["distances"][0][i]
            similarity = 1.0 - distance

            print(f"      {i+1}. {metadata['name']}")
            print(f"         Price: €{metadata['price']:.2f} | Similarity: {similarity:.3f}")

        # Test filtered search
        filtered_results = client.search_with_filters(
            query_embedding=query_emb.tolist(),
            category="solar-panels",
            max_price=200,
            in_stock=True,
            n_results=5,
        )

        print_success(f"Filtered search: {len(filtered_results['ids'][0])} results")
        print("   Filters: category=solar-panels, max_price=€200, in_stock=true")

        # Test product retrieval
        product = client.get_product("test-solar-1")
        if product:
            print_success(f"Retrieved product: {product['metadata']['name']}")

        return True

    except Exception as e:
        print_error(f"ChromaDB test failed: {e}")
        import traceback

        traceback.print_exc()
        return False


def test_ollama():
    """Test Ollama LLM inference"""
    print_test_header("Ollama LLM Client")

    try:
        # Initialize client
        client = OllamaClient()
        print_success(f"Ollama client initialized: {client.model}")

        # Test simple generation
        print("\n   Testing simple generation...")
        start = time.time()
        response = client.generate(
            prompt="Olá! Por favor, responde apenas com uma palavra: OK",
            temperature=0.1,
            max_tokens=10,
        )
        duration = (time.time() - start) * 1000

        print_success(f"Generation completed in {duration:.0f}ms")
        print(f"   Response: {response.content}")
        print(
            f"   Tokens: {response.prompt_tokens} prompt + {response.completion_tokens} completion"
        )

        # Test product enrichment
        print("\n   Testing product enrichment...")
        start = time.time()
        enriched = client.enrich_product(
            name="JA Solar 400W Painel Monocristalino",
            description="Painel solar monocristalino de alta eficiência 20.9%",
            specifications={
                "Power": "400W",
                "Efficiency": "20.9%",
                "Voltage": "24V",
                "Technology": "Monocrystalline PERC",
            },
        )
        duration = (time.time() - start) * 1000

        print_success(f"Enrichment completed in {duration:.0f}ms")
        print(f"   Category: {enriched.get('category')}")
        print(f"   Tags: {', '.join(enriched.get('tags', [])[:5])}")
        print(f"   Summary (PT): {enriched.get('summary_pt', '')[:80]}...")
        print(f"   Use Cases: {', '.join(enriched.get('use_cases', [])[:3])}")

        # Test requirement extraction
        print("\n   Testing requirement extraction...")
        start = time.time()
        requirements = client.extract_requirements(
            "preciso de um sistema solar 800W com bateria para casa, máximo €2000"
        )
        duration = (time.time() - start) * 1000

        print_success(f"Extraction completed in {duration:.0f}ms")
        print(f"   Categories: {requirements.get('categories')}")
        print(f"   Power: {requirements.get('power_watts')}W")
        print(f"   Budget: €{requirements.get('price_range', {}).get('max')}")
        print(f"   Intent: {requirements.get('intent')}")
        print(f"   Keywords: {', '.join(requirements.get('keywords', [])[:5])}")

        # Test product ranking
        print("\n   Testing product ranking...")
        test_products = [
            {"name": "JA Solar 400W Panel", "price": 169.0, "category": "solar-panels"},
            {"name": "LONGi 450W Panel", "price": 195.0, "category": "solar-panels"},
            {"name": "LiFePO4 200Ah Battery", "price": 749.0, "category": "batteries"},
            {"name": "Victron 3000W Inverter", "price": 899.0, "category": "inverters"},
        ]

        start = time.time()
        ranked = client.rank_products(
            query="sistema solar 800W com bateria", products=test_products, top_k=3
        )
        duration = (time.time() - start) * 1000

        print_success(f"Ranking completed in {duration:.0f}ms")
        print("   Top 3 recommendations:")
        for p in ranked:
            print(
                f"      {p.get('ai_rank')}. {p['name']} - €{p['price']} ({p.get('ai_relevance', 0):.2f})"
            )
            print(f"         Reason: {p.get('ai_reason', 'N/A')}")

        return True

    except Exception as e:
        print_error(f"Ollama test failed: {e}")
        import traceback

        traceback.print_exc()
        return False


def test_full_rag_pipeline():
    """Test complete RAG pipeline"""
    print_test_header("Full RAG Pipeline (End-to-End)")

    try:
        print("   Initializing services...")
        embedding_service = EmbeddingService()
        chromadb = ChromaDBClient(collection_name="test_products")
        ollama = OllamaClient()

        print_success("All services initialized")

        # User query
        user_query = "preciso de painéis solares 400W de alta qualidade, máximo €200 cada"
        print(f"\n   User Query: '{user_query}'")

        # Step 1: Extract requirements
        print("\n   Step 1: Extracting requirements...")
        start = time.time()
        requirements = ollama.extract_requirements(user_query)
        step1_time = (time.time() - start) * 1000

        print(f"      Requirements extracted in {step1_time:.0f}ms")
        print(f"      - Categories: {requirements.get('categories')}")
        print(f"      - Max Price: €{requirements.get('price_range', {}).get('max')}")

        # Step 2: Generate embedding
        print("\n   Step 2: Generating query embedding...")
        start = time.time()
        query_embedding = embedding_service.encode(user_query)
        step2_time = (time.time() - start) * 1000

        print(f"      Embedding generated in {step2_time:.0f}ms")
        print(f"      - Shape: {query_embedding.shape}")

        # Step 3: Vector search
        print("\n   Step 3: Searching vector database...")
        start = time.time()
        search_results = chromadb.search_with_filters(
            query_embedding=query_embedding.tolist(),
            category=requirements.get("categories", [None])[0],
            max_price=requirements.get("price_range", {}).get("max"),
            n_results=5,
        )
        step3_time = (time.time() - start) * 1000

        print(f"      Search completed in {step3_time:.0f}ms")
        print(f"      - Found: {len(search_results['ids'][0])} products")

        # Step 4: Re-rank with LLM
        print("\n   Step 4: Re-ranking with LLM...")
        products = []
        for i, product_id in enumerate(search_results["ids"][0]):
            metadata = search_results["metadatas"][0][i]
            distance = search_results["distances"][0][i]

            products.append(
                {
                    "id": product_id,
                    "name": metadata.get("name"),
                    "price": metadata.get("price"),
                    "category": metadata.get("category"),
                    "description": search_results["documents"][0][i],
                    "similarity_score": 1.0 - distance,
                }
            )

        start = time.time()
        ranked_products = ollama.rank_products(query=user_query, products=products, top_k=3)
        step4_time = (time.time() - start) * 1000

        print(f"      Re-ranking completed in {step4_time:.0f}ms")

        # Results
        print("\n   FINAL RECOMMENDATIONS:")
        for p in ranked_products:
            print(f"\n      {p.get('ai_rank')}. {p['name']}")
            print(f"         Price: €{p['price']:.2f}")
            print(f"         Similarity: {p.get('similarity_score', 0):.3f}")
            print(f"         AI Relevance: {p.get('ai_relevance', 0):.2f}")
            print(f"         Reason: {p.get('ai_reason', 'N/A')}")

        # Performance summary
        total_time = step1_time + step2_time + step3_time + step4_time
        print("\n   PERFORMANCE:")
        print(f"      Step 1 (Requirements): {step1_time:.0f}ms")
        print(f"      Step 2 (Embedding): {step2_time:.0f}ms")
        print(f"      Step 3 (Search): {step3_time:.0f}ms")
        print(f"      Step 4 (Ranking): {step4_time:.0f}ms")
        print(f"      TOTAL: {total_time:.0f}ms")

        if total_time < 15000:
            print_success(f"Performance target met: {total_time:.0f}ms < 15000ms")
        else:
            print(f"   ⚠ Performance target missed: {total_time:.0f}ms > 15000ms")

        return True

    except Exception as e:
        print_error(f"RAG pipeline test failed: {e}")
        import traceback

        traceback.print_exc()
        return False


def main():
    """Run all tests"""
    print("\n" + "=" * 70)
    print("AI PRODUCT DISCOVERY SYSTEM - TEST SUITE")
    print("=" * 70)

    tests = [
        ("Embeddings", test_embeddings),
        ("ChromaDB", test_chromadb),
        ("Ollama", test_ollama),
        ("Full RAG Pipeline", test_full_rag_pipeline),
    ]

    results = {}

    for test_name, test_func in tests:
        try:
            results[test_name] = test_func()
        except KeyboardInterrupt:
            print("\n\nTests interrupted by user.")
            sys.exit(1)
        except Exception as e:
            print_error(f"Test '{test_name}' crashed: {e}")
            results[test_name] = False

    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)

    passed = sum(1 for result in results.values() if result)
    total = len(results)

    for test_name, result in results.items():
        status = "✓ PASS" if result else "✗ FAIL"
        print(f"{status}: {test_name}")

    print(f"\nPassed: {passed}/{total}")

    if passed == total:
        print("\n🎉 All tests passed! AI system is ready.")
        return 0
    else:
        print(f"\n⚠ {total - passed} test(s) failed. Please fix issues before proceeding.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
