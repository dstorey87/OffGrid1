"""
Seed ChromaDB with test solar products for demonstration
"""

import sys
from pathlib import Path

# Add app to path
sys.path.insert(0, str(Path(__file__).parent))

from app.core.chromadb_client import get_chromadb_client
from app.core.embeddings import get_embedding_service


def seed_products():
    """Add test solar products to the database"""

    print("Initializing services...")
    chromadb = get_chromadb_client()
    embedding_service = get_embedding_service()

    # Test products with affiliate links
    products = [
        {
            "id": "solar-panel-ja-400w",
            "name": "JA Solar JAM72S30 400W Monocrystalline Solar Panel",
            "category": "solar-panels",
            "price": 169.99,
            "currency": "EUR",
            "description": "High efficiency 400W monocrystalline solar panel with 20.9% efficiency. Perfect for off-grid systems. 72 half-cut cells, IP68 junction box, 25-year warranty.",
            "supplier": "Solar Store EU",
            "in_stock": True,
            "ships_portugal": True,
            "tags": ["solar", "400W", "monocrystalline", "high-efficiency", "off-grid"],
            "image_url": "https://example.com/ja-solar-400w.jpg",
            "affiliate_link": "https://amzn.to/example-ja-400w",
        },
        {
            "id": "solar-panel-longi-450w",
            "name": "LONGi Solar Hi-MO 5 450W Half-Cell Panel",
            "category": "solar-panels",
            "price": 195.00,
            "currency": "EUR",
            "description": "Premium 450W half-cell technology solar panel from LONGi. Industry-leading efficiency of 21.5%. Excellent low-light performance. 30-year power warranty.",
            "supplier": "European Solar Shop",
            "in_stock": True,
            "ships_portugal": True,
            "tags": ["solar", "450W", "half-cell", "premium", "high-efficiency"],
            "image_url": "https://example.com/longi-450w.jpg",
            "affiliate_link": "https://amzn.to/example-longi-450w",
        },
        {
            "id": "battery-pylontech-us3000c",
            "name": "Pylontech US3000C 3.5kWh LiFePO4 Battery",
            "category": "batteries",
            "price": 899.00,
            "currency": "EUR",
            "description": "Reliable 3.5kWh lithium iron phosphate battery. Stackable design up to 21kWh. Built-in BMS. 6000+ cycle life. Perfect for solar storage systems.",
            "supplier": "Battery World",
            "in_stock": True,
            "ships_portugal": True,
            "tags": ["battery", "lifepo4", "3.5kwh", "stackable", "bms", "off-grid"],
            "image_url": "https://example.com/pylontech-us3000c.jpg",
            "affiliate_link": "https://amzn.to/example-pylontech",
        },
        {
            "id": "battery-victron-12v-200ah",
            "name": "Victron Energy Smart 12V 200Ah LiFePO4 Battery",
            "category": "batteries",
            "price": 1249.00,
            "currency": "EUR",
            "description": "Premium 12V 200Ah lithium battery with Bluetooth monitoring. Victron quality. 2.56kWh capacity. Built-in cell balancing. 10-year warranty.",
            "supplier": "Victron Energy",
            "in_stock": True,
            "ships_portugal": True,
            "tags": ["battery", "victron", "12v", "200ah", "lifepo4", "bluetooth"],
            "image_url": "https://example.com/victron-12v-200ah.jpg",
            "affiliate_link": "https://amzn.to/example-victron-battery",
        },
        {
            "id": "inverter-victron-multiplus-3000",
            "name": "Victron MultiPlus II 3000VA 48V Inverter/Charger",
            "category": "inverters",
            "price": 1499.00,
            "currency": "EUR",
            "description": "Professional 3000VA hybrid inverter/charger. Pure sine wave. Grid-tie capable. PowerAssist technology. VE.Bus communication. 5-year warranty.",
            "supplier": "Victron Energy",
            "in_stock": True,
            "ships_portugal": True,
            "tags": ["inverter", "victron", "3000va", "hybrid", "grid-tie", "charger"],
            "image_url": "https://example.com/victron-multiplus-3000.jpg",
            "affiliate_link": "https://amzn.to/example-victron-inverter",
        },
        {
            "id": "charge-controller-victron-100-50",
            "name": "Victron SmartSolar MPPT 100/50 Charge Controller",
            "category": "charge-controllers",
            "price": 359.00,
            "currency": "EUR",
            "description": "MPPT solar charge controller 50A with Bluetooth. Ultra-fast maximum power point tracking. VE.Direct communication. Battery life algorithm. 5-year warranty.",
            "supplier": "Victron Energy",
            "in_stock": True,
            "ships_portugal": True,
            "tags": ["mppt", "victron", "50a", "bluetooth", "solar-controller"],
            "image_url": "https://example.com/victron-mppt-100-50.jpg",
            "affiliate_link": "https://amzn.to/example-victron-mppt",
        },
        {
            "id": "solar-kit-2kw-offgrid",
            "name": "Complete 2kW Off-Grid Solar Kit",
            "category": "solar-kits",
            "price": 2899.00,
            "currency": "EUR",
            "description": "Complete off-grid solar system: 5x 400W panels, 5kWh battery, 3000W inverter, MPPT controller, mounting hardware, cables. Everything you need!",
            "supplier": "Solar Kits Direct",
            "in_stock": True,
            "ships_portugal": True,
            "tags": ["solar-kit", "complete-system", "2kw", "off-grid", "package"],
            "image_url": "https://example.com/2kw-kit.jpg",
            "affiliate_link": "https://amzn.to/example-2kw-kit",
        },
        {
            "id": "monitoring-victron-cerbo-gx",
            "name": "Victron Cerbo GX Monitoring System",
            "category": "monitoring",
            "price": 289.00,
            "currency": "EUR",
            "description": "Central monitoring hub for Victron systems. Remote monitoring via VRM portal. Touch screen display. Connect all devices. Real-time data.",
            "supplier": "Victron Energy",
            "in_stock": True,
            "ships_portugal": True,
            "tags": ["monitoring", "victron", "cerbo-gx", "remote-monitoring", "vrm"],
            "image_url": "https://example.com/cerbo-gx.jpg",
            "affiliate_link": "https://amzn.to/example-cerbo",
        },
    ]

    # Generate embeddings
    print(f"Generating embeddings for {len(products)} products...")
    texts = [p["description"] for p in products]
    embeddings = [embedding_service.encode(text).tolist() for text in texts]

    # Prepare data
    ids = [p["id"] for p in products]
    metadatas = [
        {
            "name": p["name"],
            "category": p["category"],
            "price": p["price"],
            "currency": p["currency"],
            "supplier": p["supplier"],
            "in_stock": p["in_stock"],
            "ships_portugal": p["ships_portugal"],
            "tags": ",".join(p["tags"]),  # Convert list to comma-separated string
            "image_url": p["image_url"],
            "affiliate_link": p["affiliate_link"],
        }
        for p in products
    ]
    documents = [p["description"] for p in products]

    # Add to ChromaDB
    print("Adding products to database...")
    chromadb.add_products(ids=ids, embeddings=embeddings, metadatas=metadatas, documents=documents)

    print(f"✓ Successfully added {len(products)} products!")
    print(f"Total products in database: {chromadb.count()}")

    # Test search
    print("\nTesting search for '400W solar panel'...")
    query_embedding = embedding_service.encode("400W solar panel").tolist()
    results = chromadb.search_with_filters(query_embedding=query_embedding, n_results=3)

    print(f"\nTop 3 results:")
    for i, product_id in enumerate(results["ids"][0]):
        metadata = results["metadatas"][0][i]
        distance = results["distances"][0][i]
        similarity = 1.0 - distance
        print(f"{i+1}. {metadata['name']}")
        print(f"   Price: €{metadata['price']}")
        print(f"   Similarity: {similarity:.2%}")
        print(f"   Link: {metadata['affiliate_link']}")
        print()


if __name__ == "__main__":
    seed_products()
