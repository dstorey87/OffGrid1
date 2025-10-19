"""
Test AI Product Search API
"""

import requests

BASE_URL = "http://localhost:8001/api/v1/ai"


def test_search():
    """Test product search with natural language query"""

    print("=" * 70)
    print("Testing AI Product Search")
    print("=" * 70)

    # Test query
    query = "I need a 400W solar panel for my off-grid cabin"

    print(f"\nQuery: {query}\n")

    # Make request
    response = requests.post(
        f"{BASE_URL}/search",
        json={"query": query, "in_stock": True, "ships_portugal": True, "n_results": 3},
    )

    if response.status_code == 200:
        data = response.json()

        print(f"✓ Found {data['total_results']} products")
        print(f"Search time: {data['search_time_ms']:.2f}ms\n")

        if data.get("requirements"):
            print("AI Extracted Requirements:")
            for key, value in data["requirements"].items():
                print(f"  - {key}: {value}")
            print()

        print("Top Results:\n")
        for i, product in enumerate(data["products"], 1):
            print(f"{i}. {product['name']}")
            print(f"   Price: €{product['price']}")
            print(f"   Category: {product['category']}")
            print(f"   Supplier: {product['supplier']}")
            print(f"   Similarity: {product['similarity_score']:.2%}")
            print(f"   Affiliate Link: {product['affiliate_link']}")
            if product.get("ai_rank"):
                print(f"   AI Rank: {product['ai_rank']}")
                print(f"   AI Relevance: {product['ai_relevance']:.2%}")
                if product.get("ai_reason"):
                    print(f"   Reason: {product['ai_reason']}")
            print()
    else:
        print(f"✗ Error: {response.status_code}")
        print(response.text)


def test_recommendation():
    """Test product recommendation based on calculator results"""

    print("=" * 70)
    print("Testing AI Product Recommendations")
    print("=" * 70)

    # Simulated calculator results
    calculator_results = {
        "recommended_panel_power": 2000,  # 2kW system
        "battery_capacity_ah": 400,
        "system_voltage": 48,
    }

    print(f"\nCalculator Results: {calculator_results}\n")

    # Make request
    response = requests.post(
        f"{BASE_URL}/recommend",
        json={
            "calculator_type": "solar-panel-sizing",
            "calculator_results": calculator_results,
            "n_results": 5,
        },
    )

    if response.status_code == 200:
        data = response.json()

        print(f"✓ Found {data['total_results']} recommended products\n")

        print("Recommendations:\n")
        for i, product in enumerate(data["products"], 1):
            print(f"{i}. {product['name']}")
            print(f"   Price: €{product['price']}")
            print(f"   Category: {product['category']}")
            print(f"   Affiliate Link: {product['affiliate_link']}")
            print()
    else:
        print(f"✗ Error: {response.status_code}")
        print(response.text)


def test_enrich():
    """Test product enrichment with AI"""

    print("=" * 70)
    print("Testing AI Product Enrichment")
    print("=" * 70)

    product = {
        "name": "Renogy 100W Flexible Solar Panel",
        "description": "Lightweight bendable solar panel, perfect for RVs and boats. Monocrystalline cells, 22% efficiency.",
        "specifications": {
            "power": "100W",
            "efficiency": "22%",
            "weight": "2.1kg",
            "dimensions": "1050x540x2.5mm",
        },
    }

    print(f"\nProduct: {product['name']}\n")

    # Make request
    response = requests.post(f"{BASE_URL}/enrich", json=product)

    if response.status_code == 200:
        data = response.json()

        print("✓ AI Enrichment Results:\n")
        print(f"Category: {data['category']}")
        print(f"Tags: {', '.join(data['tags'])}")
        print(f"\nSummary (Portuguese): {data['summary_pt']}")
        print(f"Summary (English): {data['summary_en']}")
        print("\nUse Cases:")
        for use_case in data["use_cases"]:
            print(f"  - {use_case}")
        print(f"\nCompatibility: {data['compatibility']}")
    else:
        print(f"✗ Error: {response.status_code}")
        print(response.text)


if __name__ == "__main__":
    # Test all endpoints
    test_search()
    print("\n")
    test_recommendation()
    print("\n")
    test_enrich()
