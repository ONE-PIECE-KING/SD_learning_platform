"""
Common Schemas
通用的 Pydantic 模型
"""
from datetime import datetime
from typing import Any, Generic, Optional, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


# Generic type for paginated responses
T = TypeVar("T")


class BaseSchema(BaseModel):
    """基礎 Schema 配置"""
    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )


class TimestampSchema(BaseSchema):
    """包含時間戳的基礎 Schema"""
    created_at: datetime
    updated_at: datetime


class HealthResponse(BaseSchema):
    """健康檢查回應"""
    status: str = Field(..., examples=["healthy"])
    app: str = Field(..., examples=["Learning Platform API"])
    version: str = Field(..., examples=["1.0.0"])


class DetailedHealthResponse(HealthResponse):
    """詳細健康檢查回應"""
    checks: dict[str, str] = Field(
        default_factory=dict,
        examples=[{"database": "healthy", "redis": "healthy"}],
    )


class ErrorResponse(BaseSchema):
    """錯誤回應"""
    detail: str = Field(..., examples=["Resource not found"])
    error_code: Optional[str] = Field(None, examples=["NOT_FOUND"])


class ValidationErrorDetail(BaseSchema):
    """驗證錯誤詳情"""
    loc: list[str | int]
    msg: str
    type: str


class ValidationErrorResponse(BaseSchema):
    """驗證錯誤回應"""
    detail: list[ValidationErrorDetail]


class PaginatedResponse(BaseSchema, Generic[T]):
    """分頁回應基類"""
    items: list[T]
    total: int = Field(..., ge=0)
    skip: int = Field(..., ge=0)
    limit: int = Field(..., ge=1)
    has_more: bool = False


class MessageResponse(BaseSchema):
    """通用訊息回應"""
    message: str
    success: bool = True


class IDResponse(BaseSchema):
    """返回 ID 的回應"""
    id: UUID
