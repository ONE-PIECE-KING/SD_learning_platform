"""金流模組 ORM 模型"""
import uuid as uuid_module
from datetime import datetime
from decimal import Decimal
from enum import Enum
from uuid import UUID as PythonUUID

from sqlalchemy import Column, String, Numeric, DateTime, ForeignKey, Text, TypeDecorator
from sqlalchemy.orm import relationship

from app.core.database import Base


# ===================== 自訂 GUID 類型 (解決 SQLite UUID 相容性問題) =====================

class GUID(TypeDecorator):
    """
    Platform-independent GUID type.
    
    Uses String(32) for storage, and converts UUID objects to/from hex strings.
    This avoids SQLite driver issues with native UUID types.
    """
    impl = String(32)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        """寫入資料庫時：UUID -> 字串"""
        if value is not None:
            if isinstance(value, PythonUUID):
                return value.hex  # 轉成 32 字元的 hex 字串
            elif isinstance(value, str):
                return PythonUUID(value).hex
        return value

    def process_result_value(self, value, dialect):
        """讀取資料庫時：字串 -> UUID"""
        if value is not None:
            return PythonUUID(value)
        return value


# ===================== Enums =====================

class OrderStatus(str, Enum):
    """訂單狀態"""
    PENDING = "pending"           # 待付款
    PAID = "paid"                 # 已付款
    CANCELLED = "cancelled"       # 已取消
    REFUNDED = "refunded"         # 已退款


class TradeStatus(str, Enum):
    """ECPay 交易狀態"""
    PENDING = "pending"           # 待付款
    AUTHORIZED = "authorized"     # 已授權
    CAPTURED = "captured"         # 已關帳
    FAILED = "failed"             # 失敗


class RefundStatus(str, Enum):
    """退款狀態"""
    PENDING = "pending"                     # 待處理
    PENDING_APPROVAL = "pending_approval"   # 待審核
    PROCESSING = "processing"               # 處理中
    SUCCESS = "success"                     # 成功
    FAILED = "failed"                       # 失敗
    REJECTED = "rejected"                   # 已拒絕


class RefundSource(str, Enum):
    """退款來源"""
    USER = "user"       # 學員申請
    ADMIN = "admin"     # 管理員操作


class ApprovalStatus(str, Enum):
    """審核狀態"""
    PENDING = "pending_approval"  # 待審核
    APPROVED = "approved"         # 已通過
    REJECTED = "rejected"         # 已拒絕


# ===================== ORM Models =====================

class Order(Base):
    """訂單主表"""
    __tablename__ = "orders"
    
    id = Column(GUID(), primary_key=True, default=uuid_module.uuid4)
    order_no = Column(String(20), unique=True, nullable=False, index=True)
    user_id = Column(GUID(), nullable=False, index=True)
    course_id = Column(GUID(), nullable=False, index=True)
    
    # 金額資訊
    amount = Column(Numeric(10, 2), nullable=False)
    platform_fee = Column(Numeric(10, 2), nullable=False)       # 平台抽成 20%
    creator_income = Column(Numeric(10, 2), nullable=False)     # 創作者收入 80%
    
    # 狀態
    status = Column(String(20), nullable=False, default=OrderStatus.PENDING.value)
    
    # 時間戳
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    paid_at = Column(DateTime(timezone=True), nullable=True)
    expired_at = Column(DateTime(timezone=True), nullable=True)
    
    # 關聯
    transactions = relationship("ECPayTransaction", back_populates="order")
    refund_records = relationship("RefundRecord", back_populates="order")


class ECPayTransaction(Base):
    """ECPay 交易記錄表"""
    __tablename__ = "ecpay_transactions"
    
    id = Column(GUID(), primary_key=True, default=uuid_module.uuid4)
    order_id = Column(GUID(), ForeignKey("orders.id"), nullable=False)
    
    # ECPay 交易資訊
    merchant_trade_no = Column(String(20), unique=True, nullable=False, index=True)
    trade_no = Column(String(20), nullable=True)                # 綠界交易編號
    payment_type = Column(String(20), nullable=False)           # 付款方式
    payment_type_charge = Column(String(20), nullable=True)     # 實際付款方式
    
    # 金額
    trade_amt = Column(Numeric(10, 2), nullable=False)
    
    # 狀態
    rtn_code = Column(String(10), nullable=True)                # 回傳代碼
    rtn_msg = Column(String(200), nullable=True)                # 回傳訊息
    trade_status = Column(String(20), nullable=False, default=TradeStatus.PENDING.value)
    
    # 信用卡資訊
    card_4_no = Column(String(4), nullable=True)                # 卡號末四碼
    auth_code = Column(String(6), nullable=True)                # 授權碼
    
    # ATM/超商資訊
    bank_code = Column(String(3), nullable=True)
    v_account = Column(String(16), nullable=True)
    expire_date = Column(DateTime, nullable=True)
    payment_no = Column(String(14), nullable=True)
    
    # 時間戳
    trade_date = Column(DateTime(timezone=True), nullable=True)
    payment_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 關聯
    order = relationship("Order", back_populates="transactions")
    refund_records = relationship("RefundRecord", back_populates="transaction")


class RefundRecord(Base):
    """退款記錄表"""
    __tablename__ = "refund_records"
    
    id = Column(GUID(), primary_key=True, default=uuid_module.uuid4)
    order_id = Column(GUID(), ForeignKey("orders.id"), nullable=False)
    transaction_id = Column(GUID(), ForeignKey("ecpay_transactions.id"), nullable=False)
    
    # 退款資訊
    refund_type = Column(String(20), nullable=False)            # full | partial
    refund_amount = Column(Numeric(10, 2), nullable=False)
    reason = Column(Text, nullable=True)
    
    # 申請來源
    request_source = Column(String(20), nullable=False)         # user | admin
    requested_by = Column(GUID(), nullable=False)               # 申請人 ID
    
    # 審核資訊
    approval_status = Column(String(20), default=ApprovalStatus.APPROVED.value)
    reviewed_by = Column(GUID(), nullable=True)                 # 審核人 ID
    reviewed_at = Column(DateTime(timezone=True), nullable=True)
    reject_reason = Column(Text, nullable=True)
    
    # ECPay 退款回應
    action = Column(String(5), nullable=True)                   # N | R | E
    rtn_code = Column(String(10), nullable=True)
    rtn_msg = Column(String(200), nullable=True)
    
    # 狀態
    status = Column(String(20), nullable=False, default=RefundStatus.PENDING.value)
    
    # 時間戳
    requested_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    processed_at = Column(DateTime(timezone=True), nullable=True)
    
    # 關聯
    order = relationship("Order", back_populates="refund_records")
    transaction = relationship("ECPayTransaction", back_populates="refund_records")
