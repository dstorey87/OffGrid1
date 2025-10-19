"""
ChromaDB Client for Vector Storage and Retrieval
Stores product embeddings for semantic search
"""

import logging
from pathlib import Path
from typing import Any

import chromadb

logger = logging.getLogger(__name__)


class ChromaDBClient:
    """Manages ChromaDB collections for product search"""

    def __init__(
        self,
        persist_directory: str = "C:/OffGrid1/OffGrid1/data/chromadb",
        collection_name: str = "products",
    ):
        """
        Initialize ChromaDB client

        Args:
            persist_directory: Where to store the database
            collection_name: Name of the product collection
        """
        self.persist_directory = Path(persist_directory)
        self.persist_directory.mkdir(parents=True, exist_ok=True)

        logger.info(f"Initializing ChromaDB at {persist_directory}")

        # Create client with persistent storage (new API)
        self.client = chromadb.PersistentClient(path=str(self.persist_directory))

        # Get or create collection
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={
                "hnsw:space": "cosine",  # Cosine similarity
                "hnsw:construction_ef": 100,  # Build quality
                "hnsw:M": 16,  # Number of connections per layer
            },
        )

        logger.info(f"Collection '{collection_name}' ready with {self.collection.count()} products")

    def add_products(
        self,
        ids: list[str],
        embeddings: list[list[float]],
        metadatas: list[dict[str, Any]],
        documents: list[str],
    ) -> None:
        """
        Add products to the collection

        Args:
            ids: Unique product IDs
            embeddings: Product embeddings (from sentence-transformers)
            metadatas: Product metadata (category, price, etc.)
            documents: Product descriptions (for retrieval context)
        """
        logger.info(f"Adding {len(ids)} products to ChromaDB")

        self.collection.add(
            ids=ids, embeddings=embeddings, metadatas=metadatas, documents=documents
        )

        logger.info(f"Successfully added {len(ids)} products")

    def search(
        self,
        query_embedding: list[float],
        n_results: int = 10,
        where: dict[str, Any] | None = None,
        where_document: dict[str, str] | None = None,
    ) -> dict[str, Any]:
        """
        Search for products by embedding similarity

        Args:
            query_embedding: Query embedding vector
            n_results: Number of results to return
            where: Metadata filters (e.g., {"category": "solar-panels", "price": {"$lt": 500}})
            where_document: Document text filters (e.g., {"$contains": "400W"})

        Returns:
            Dictionary with:
                - ids: Product IDs
                - distances: Similarity distances (lower = more similar)
                - metadatas: Product metadata
                - documents: Product descriptions
                - embeddings: Product embeddings (optional)
        """
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results,
            where=where,
            where_document=where_document,
            include=["metadatas", "documents", "distances"],
        )

        return results

    def search_with_filters(
        self,
        query_embedding: list[float],
        category: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        in_stock: bool | None = None,
        ships_portugal: bool | None = None,
        tags: list[str] | None = None,
        n_results: int = 10,
    ) -> dict[str, Any]:
        """
        Search with common filters

        Args:
            query_embedding: Query embedding
            category: Product category filter
            min_price: Minimum price filter
            max_price: Maximum price filter
            in_stock: Only in-stock products
            ships_portugal: Only ships to Portugal
            tags: Must have any of these tags
            n_results: Number of results

        Returns:
            Search results
        """
        # Build metadata filter using $and operator
        filter_conditions = []

        if category:
            filter_conditions.append({"category": category})

        if min_price is not None and max_price is not None:
            filter_conditions.append({"price": {"$gte": min_price, "$lte": max_price}})
        elif min_price is not None:
            filter_conditions.append({"price": {"$gte": min_price}})
        elif max_price is not None:
            filter_conditions.append({"price": {"$lte": max_price}})

        if in_stock is not None:
            filter_conditions.append({"in_stock": in_stock})

        if ships_portugal is not None:
            filter_conditions.append({"ships_portugal": ships_portugal})

        # Combine conditions with $and
        where_filter = None
        if len(filter_conditions) > 1:
            where_filter = {"$and": filter_conditions}
        elif len(filter_conditions) == 1:
            where_filter = filter_conditions[0]

        # Tags filter requires different approach (ChromaDB limitation)
        # We'll filter in post-processing if needed

        results = self.search(
            query_embedding=query_embedding,
            n_results=n_results * 2 if tags else n_results,  # Get more for tag filtering
            where=where_filter if where_filter else None,
        )

        # Post-filter by tags if needed
        if tags and results["ids"]:
            filtered_ids = []
            filtered_metadatas = []
            filtered_documents = []
            filtered_distances = []

            for i, metadata in enumerate(results["metadatas"][0]):
                # Tags are stored as comma-separated string
                product_tags_str = metadata.get("tags", "")
                product_tags = [t.strip() for t in product_tags_str.split(",") if t.strip()]
                if any(tag in product_tags for tag in tags):
                    filtered_ids.append(results["ids"][0][i])
                    filtered_metadatas.append(metadata)
                    filtered_documents.append(results["documents"][0][i])
                    filtered_distances.append(results["distances"][0][i])

                    if len(filtered_ids) >= n_results:
                        break

            results = {
                "ids": [filtered_ids],
                "metadatas": [filtered_metadatas],
                "documents": [filtered_documents],
                "distances": [filtered_distances],
            }

        return results

    def update_product(
        self,
        product_id: str,
        embedding: list[float] | None = None,
        metadata: dict[str, Any] | None = None,
        document: str | None = None,
    ) -> None:
        """
        Update a product in the collection

        Args:
            product_id: Product ID to update
            embedding: New embedding (optional)
            metadata: New metadata (optional)
            document: New document text (optional)
        """
        self.collection.update(
            ids=[product_id],
            embeddings=[embedding] if embedding else None,
            metadatas=[metadata] if metadata else None,
            documents=[document] if document else None,
        )

    def delete_products(self, ids: list[str]) -> None:
        """Delete products from collection"""
        self.collection.delete(ids=ids)
        logger.info(f"Deleted {len(ids)} products")

    def get_product(self, product_id: str) -> dict[str, Any] | None:
        """Get a single product by ID"""
        results = self.collection.get(
            ids=[product_id], include=["metadatas", "documents", "embeddings"]
        )

        if results["ids"]:
            return {
                "id": results["ids"][0],
                "metadata": results["metadatas"][0],
                "document": results["documents"][0],
                "embedding": results["embeddings"][0] if results["embeddings"] else None,
            }

        return None

    def count(self) -> int:
        """Get total number of products"""
        return self.collection.count()

    def clear(self) -> None:
        """Clear all products (use with caution!)"""
        self.client.delete_collection(self.collection.name)
        self.collection = self.client.create_collection(
            name=self.collection.name, metadata={"hnsw:space": "cosine"}
        )
        logger.warning("Collection cleared")


# Global instance
_chromadb_client: ChromaDBClient = None


def get_chromadb_client() -> ChromaDBClient:
    """Get or create global ChromaDB client"""
    global _chromadb_client

    if _chromadb_client is None:
        _chromadb_client = ChromaDBClient()

    return _chromadb_client


# Example usage
if __name__ == "__main__":
    # Test ChromaDB
    client = ChromaDBClient()

    # Add test products
    client.add_products(
        ids=["test-1", "test-2"],
        embeddings=[[0.1] * 1024, [0.2] * 1024],  # Dummy embeddings
        metadatas=[
            {
                "name": "JA Solar 400W Panel",
                "category": "solar-panels",
                "price": 169.0,
                "currency": "EUR",
                "in_stock": True,
                "ships_portugal": True,
                "tags": ["solar", "400W", "monocrystalline"],
            },
            {
                "name": "LONGi 450W Panel",
                "category": "solar-panels",
                "price": 195.0,
                "currency": "EUR",
                "in_stock": True,
                "ships_portugal": True,
                "tags": ["solar", "450W", "half-cell"],
            },
        ],
        documents=[
            "JA Solar 400W Monocrystalline Panel - High efficiency 20.9%",
            "LONGi 450W Half-Cell Panel - Premium quality",
        ],
    )

    print(f"Total products: {client.count()}")

    # Test search
    results = client.search_with_filters(
        query_embedding=[0.15] * 1024, category="solar-panels", max_price=200, n_results=5
    )

    print(f"Found {len(results['ids'][0])} products")
    for i, product_id in enumerate(results["ids"][0]):
        metadata = results['metadatas'][0][i]
        print(
            f"  {product_id}: {metadata['name']} - €{metadata['price']}"
        )
