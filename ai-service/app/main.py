"""
AI Service - Main Application Entry Point
Serves AI-powered product discovery endpoints
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.ai_products import router as ai_products_router
from app.api.v1.health import router as health_router

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="OffGrid AI Product Discovery",
    description="""
    AI-powered product discovery system for off-grid and sustainable living products.

    Features:
    - Semantic product search (multilingual)
    - AI product enrichment (tags, categories, summaries)
    - Intelligent recommendations (LLM-powered ranking)
    - Calculator integration (solar, water, battery sizing)
    - Affiliate monetization (Amazon, Awin, ShareASale)

    Technology Stack:
    - LLM: Qwen2.5-7B-Instruct (via Ollama)
    - Embeddings: multilingual-e5-large (sentence-transformers)
    - Vector DB: ChromaDB
    - Orchestration: LangChain
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration (allow frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Next.js dev server
        "http://localhost:8000",  # Backend dev server
        "https://offgrid.com",  # Production (update with actual domain)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==================== Startup/Shutdown Events ====================


@app.on_event("startup")
async def startup_event():
    """Initialize AI services on startup"""
    logger.info("=" * 70)
    logger.info("Starting OffGrid AI Product Discovery Service")
    logger.info("=" * 70)

    try:
        # Pre-load AI models
        logger.info("Loading AI models...")

        from app.core.chromadb_client import get_chromadb_client
        from app.core.embeddings import get_embedding_service
        from app.core.ollama_client import get_ollama_client

        # Initialize embedding service
        embedding_service = get_embedding_service()
        logger.info("✓ Embedding model loaded: %s", embedding_service.model_name)
        logger.info("  - Dimension: %s", embedding_service.embedding_dim)
        logger.info("  - Device: %s", embedding_service.device)

        # Initialize ChromaDB
        chromadb = get_chromadb_client()
        product_count = chromadb.count()
        logger.info("✓ ChromaDB connected: %s products indexed", product_count)

        # Initialize Ollama client
        ollama = get_ollama_client()
        logger.info("✓ Ollama LLM ready: %s", ollama.model)

        logger.info("=" * 70)
        logger.info("✓ AI Service Ready!")
        logger.info("  - API Docs: http://localhost:8001/docs")
        logger.info("  - Health Check: http://localhost:8001/ai/health")
        logger.info("=" * 70)

    except Exception as e:
        logger.error("✗ Failed to initialize AI services: %s", e)
        logger.error("Please check:")
        logger.error("  1. Ollama is running: ollama serve")
        logger.error("  2. Models are downloaded: ollama pull qwen2.5:7b-instruct-q4_K_M")
        logger.error("  3. Python dependencies installed: pip install -r requirements-ai.txt")
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown"""
    logger.info("Shutting down AI Product Discovery Service")


# ==================== Include Routers ====================

app.include_router(health_router, prefix="/health", tags=["health"])
app.include_router(ai_products_router, prefix="/api/v1")


# ==================== Root Endpoints ====================


@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "service": "OffGrid AI Product Discovery",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "docs": "/docs",
            "health": "/ai/health",
            "search": "/ai/search",
            "recommend": "/ai/recommend",
            "enrich": "/ai/enrich",
            "embed": "/ai/embed",
        },
        "technology": {
            "llm": "Qwen2.5-7B-Instruct (Ollama)",
            "embeddings": "multilingual-e5-large",
            "vector_db": "ChromaDB",
            "orchestration": "LangChain",
        },
    }


# ==================== Example Usage ====================

if __name__ == "__main__":
    import uvicorn

    logger.info("Starting AI service in development mode...")
    logger.info("Make sure Ollama is running: ollama serve")

    uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True, log_level="info")
