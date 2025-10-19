"""
Sentence Transformer Embeddings for Product Search
Uses multilingual-e5-large for Portuguese + English support
"""

import logging

import numpy as np
import torch
from sentence_transformers import SentenceTransformer

logger = logging.getLogger(__name__)


class EmbeddingService:
    """Manages product embeddings for semantic search"""

    def __init__(self, model_name: str = "intfloat/multilingual-e5-large"):
        """
        Initialize embedding model

        Args:
            model_name: Hugging Face model ID
                - multilingual-e5-large: 1024 dims, best quality, 2GB VRAM
                - paraphrase-multilingual-mpnet-base-v2: 768 dims, lighter
        """
        self.model_name = model_name
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info("Initializing embedding model on %s", self.device)

        # Load model (downloads on first run)
        self.model = SentenceTransformer(model_name, device=self.device)

        # Get embedding dimension
        self.embedding_dim = self.model.get_sentence_embedding_dimension()
        logger.info("Embedding dimension: %s", self.embedding_dim)

    def encode(
        self, texts: str | list[str], normalize: bool = True, batch_size: int = 32
    ) -> np.ndarray:
        """
        Generate embeddings for text(s)

        Args:
            texts: Single text or list of texts
            normalize: Whether to L2-normalize embeddings (recommended for cosine similarity)
            batch_size: Batch size for encoding

        Returns:
            numpy array of embeddings (shape: [n_texts, embedding_dim])
        """
        # Convert single text to list
        if isinstance(texts, str):
            texts = [texts]
            single_input = True
        else:
            single_input = False

        # Add instruction prefix for e5 models (improves performance)
        if "e5" in self.model_name.lower():
            texts = [f"query: {text}" for text in texts]

        # Generate embeddings
        embeddings = self.model.encode(
            texts,
            normalize_embeddings=normalize,
            batch_size=batch_size,
            show_progress_bar=len(texts) > 100,
            convert_to_numpy=True,
        )

        # Return single embedding if single input
        if single_input:
            return embeddings[0]

        return embeddings

    def encode_product(
        self, name: str, description: str = "", tags: list[str] = None, category: str = ""
    ) -> np.ndarray:
        """
        Generate embedding for a product

        Combines multiple fields into a single rich representation

        Args:
            name: Product name
            description: Product description
            tags: Product tags/keywords
            category: Product category

        Returns:
            Single embedding vector
        """
        # Combine fields into rich text
        text_parts = [name]

        if category:
            text_parts.append(f"Category: {category}")

        if tags:
            text_parts.append(f"Tags: {', '.join(tags)}")

        if description:
            # Truncate long descriptions
            desc = description[:500] if len(description) > 500 else description
            text_parts.append(desc)

        combined_text = " | ".join(text_parts)

        return self.encode(combined_text)

    def similarity(self, embedding1: np.ndarray, embedding2: np.ndarray) -> float:
        """
        Calculate cosine similarity between two embeddings

        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector

        Returns:
            Similarity score (0 to 1, higher = more similar)
        """
        # Ensure normalized
        emb1_norm = embedding1 / np.linalg.norm(embedding1)
        emb2_norm = embedding2 / np.linalg.norm(embedding2)

        # Cosine similarity = dot product of normalized vectors
        similarity = np.dot(emb1_norm, emb2_norm)

        return float(similarity)

    def batch_similarity(
        self, query_embedding: np.ndarray, product_embeddings: np.ndarray
    ) -> np.ndarray:
        """
        Calculate similarity between query and multiple products

        Args:
            query_embedding: Single query embedding (shape: [embedding_dim])
            product_embeddings: Multiple product embeddings (shape: [n_products, embedding_dim])

        Returns:
            Similarity scores (shape: [n_products])
        """
        # Normalize
        query_norm = query_embedding / np.linalg.norm(query_embedding)
        products_norm = product_embeddings / np.linalg.norm(
            product_embeddings, axis=1, keepdims=True
        )

        # Batch dot product
        similarities = np.dot(products_norm, query_norm)

        return similarities


# Global instance (lazy loaded)
_embedding_service: EmbeddingService = None


def get_embedding_service() -> EmbeddingService:
    """Get or create global embedding service instance"""
    global _embedding_service

    if _embedding_service is None:
        _embedding_service = EmbeddingService()

    return _embedding_service


# Example usage
if __name__ == "__main__":
    # Test embeddings
    service = EmbeddingService()

    # Test Portuguese query
    query = "painel solar 400W monocristalino alta eficiência"
    query_emb = service.encode(query)
    print(f"Query embedding shape: {query_emb.shape}")

    # Test product encoding
    product_emb = service.encode_product(
        name="JA Solar 400W Painel Monocristalino",
        description="High efficiency 20.9% monocrystalline panel",
        tags=["solar", "400W", "monocrystalline", "high-efficiency"],
        category="solar-panels",
    )
    print(f"Product embedding shape: {product_emb.shape}")

    # Test similarity
    similarity = service.similarity(query_emb, product_emb)
    print(f"Similarity: {similarity:.3f}")
