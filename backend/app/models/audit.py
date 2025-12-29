# backend/app/models/audit.py
"""
稽核日誌資料模型
"""
from sqlalchemy import Column, String, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy.orm import relationship
from uuid import uuid4
from datetime import datetime
from .base import Base


class AuditLog(Base):
    """稽核日誌"""
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    action = Column(String(100), nullable=False)  # e.g., COURSE_APPROVED
    entity_type = Column(String(50), nullable=False)  # e.g., Course
    entity_id = Column(UUID(as_uuid=True), nullable=False)
    old_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # 關聯
    user = relationship("User", back_populates="audit_logs")
