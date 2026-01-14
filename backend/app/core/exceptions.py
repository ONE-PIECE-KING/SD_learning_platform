"""
Custom Exceptions and Error Handlers
自訂例外與錯誤處理
"""
from typing import Any, Optional

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError


class AppException(Exception):
    """應用程式基礎例外"""

    def __init__(
        self,
        message: str,
        error_code: str = "APP_ERROR",
        status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR,
        details: Optional[dict[str, Any]] = None,
    ):
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}
        super().__init__(self.message)


class NotFoundError(AppException):
    """資源未找到"""

    def __init__(self, resource: str, identifier: Any = None):
        message = f"{resource} not found"
        if identifier:
            message = f"{resource} with id '{identifier}' not found"
        super().__init__(
            message=message,
            error_code="NOT_FOUND",
            status_code=status.HTTP_404_NOT_FOUND,
            details={"resource": resource, "identifier": str(identifier) if identifier else None},
        )


class UnauthorizedError(AppException):
    """未授權存取"""

    def __init__(self, message: str = "Authentication required"):
        super().__init__(
            message=message,
            error_code="UNAUTHORIZED",
            status_code=status.HTTP_401_UNAUTHORIZED,
        )


class ForbiddenError(AppException):
    """權限不足"""

    def __init__(self, message: str = "Permission denied"):
        super().__init__(
            message=message,
            error_code="FORBIDDEN",
            status_code=status.HTTP_403_FORBIDDEN,
        )


class ConflictError(AppException):
    """資源衝突"""

    def __init__(self, message: str, resource: str = None):
        super().__init__(
            message=message,
            error_code="CONFLICT",
            status_code=status.HTTP_409_CONFLICT,
            details={"resource": resource} if resource else {},
        )


class BadRequestError(AppException):
    """請求錯誤"""

    def __init__(self, message: str, details: dict = None):
        super().__init__(
            message=message,
            error_code="BAD_REQUEST",
            status_code=status.HTTP_400_BAD_REQUEST,
            details=details or {},
        )


class ServiceUnavailableError(AppException):
    """服務不可用"""

    def __init__(self, service: str, message: str = None):
        super().__init__(
            message=message or f"Service '{service}' is currently unavailable",
            error_code="SERVICE_UNAVAILABLE",
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            details={"service": service},
        )


def setup_exception_handlers(app: FastAPI) -> None:
    """設定全域例外處理器"""

    @app.exception_handler(AppException)
    async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
        """處理自訂應用程式例外"""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": exc.message,
                "error_code": exc.error_code,
                **exc.details,
            },
        )

    @app.exception_handler(HTTPException)
    async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
        """處理 HTTP 例外"""
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "detail": exc.detail,
                "error_code": "HTTP_ERROR",
            },
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(
        request: Request, exc: RequestValidationError
    ) -> JSONResponse:
        """處理請求驗證錯誤"""
        errors = []
        for error in exc.errors():
            errors.append({
                "loc": list(error.get("loc", [])),
                "msg": error.get("msg", ""),
                "type": error.get("type", ""),
            })
        return JSONResponse(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            content={
                "detail": errors,
                "error_code": "VALIDATION_ERROR",
            },
        )

    @app.exception_handler(Exception)
    async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
        """處理未預期的例外"""
        # Log the error for debugging
        import traceback
        traceback.print_exc()

        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "detail": "An unexpected error occurred",
                "error_code": "INTERNAL_ERROR",
            },
        )
