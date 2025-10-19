"""
Middleware for logging and exception handling
"""

import logging
import time
from collections.abc import Callable

from fastapi import FastAPI, Request, Response, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


def setup_logging(app: FastAPI) -> None:
    """Configure structured logging for the application"""

    # Configure logging format
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S",
    )


async def log_requests_middleware(request: Request, call_next: Callable) -> Response:
    """
    Middleware to log all requests with timing information
    """
    start_time = time.time()

    # Log incoming request
    logger.info(
        "Incoming request: %s %s",
        request.method,
        request.url.path,
        extra={
            "method": request.method,
            "path": request.url.path,
            "client": request.client.host if request.client else None,
        },
    )

    # Process request
    response = await call_next(request)

    # Log response with timing
    duration = time.time() - start_time
    logger.info(
        "Request completed: %s %s - Status: %s - Duration: %.3fs",
        request.method,
        request.url.path,
        response.status_code,
        duration,
        extra={
            "method": request.method,
            "path": request.url.path,
            "status_code": response.status_code,
            "duration": duration,
        },
    )

    return response


def setup_exception_handlers(app: FastAPI) -> None:
    """
    Configure global exception handlers
    All unhandled exceptions will be caught and logged
    """

    @app.exception_handler(StarletteHTTPException)
    async def http_exception_handler(request: Request, exc: StarletteHTTPException) -> JSONResponse:
        """Handle HTTP exceptions"""
        logger.warning(
            "HTTP exception: %s - %s",
            exc.status_code,
            exc.detail,
            extra={
                "status_code": exc.status_code,
                "detail": exc.detail,
                "path": request.url.path,
            },
        )
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.detail},
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """Handle validation errors"""
        logger.warning(
            "Validation error: %s",
            exc.errors(),
            extra={
                "errors": exc.errors(),
                "path": request.url.path,
            },
        )
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={"detail": exc.errors()},
        )

    @app.exception_handler(Exception)
    async def general_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """
        Catch-all handler for any unhandled exceptions
        Logs the error and returns 500
        """
        logger.error(
            "Unhandled exception: %s - %s",
            type(exc).__name__,
            str(exc),
            extra={
                "exception_type": type(exc).__name__,
                "exception_message": str(exc),
                "path": request.url.path,
            },
            exc_info=True,  # Include stack trace
        )
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "Internal server error",
                "error": str(exc) if app.debug else None,
            },
        )


def register_middleware(app: FastAPI) -> None:
    """
    Register all middleware with the application
    """
    app.middleware("http")(log_requests_middleware)
    setup_exception_handlers(app)
    setup_logging(app)
