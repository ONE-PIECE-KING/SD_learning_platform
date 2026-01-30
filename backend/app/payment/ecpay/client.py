"""ECPay API 客戶端"""
from typing import Any

import httpx

from app.core.config import get_settings
from app.payment.ecpay.utils import generate_check_mac_value, verify_check_mac_value
from app.payment.ecpay.aio import ECPayAIO, PaymentType
from app.payment.ecpay.credit import ECPayCredit, CreditAction


class ECPayClient:
    """ECPay 統一 API 客戶端"""
    
    def __init__(self):
        self.settings = get_settings()
        self.aio = ECPayAIO()
        self.credit = ECPayCredit()
    
    def verify_callback(self, params: dict[str, Any]) -> bool:
        """
        驗證回調資料
        
        Args:
            params: ECPay 回調參數
            
        Returns:
            驗證是否通過
        """
        return verify_check_mac_value(
            params,
            self.settings.ECPAY_HASH_KEY,
            self.settings.ECPAY_HASH_IV
        )
    
    async def query_trade_info(self, merchant_trade_no: str) -> dict[str, Any]:
        """
        查詢交易資訊
        
        Args:
            merchant_trade_no: 特店訂單編號
            
        Returns:
            交易資訊
        """
        from datetime import datetime
        
        params = {
            "MerchantID": self.settings.ECPAY_MERCHANT_ID,
            "MerchantTradeNo": merchant_trade_no,
            "TimeStamp": int(datetime.now().timestamp()),
        }
        
        params["CheckMacValue"] = generate_check_mac_value(
            params,
            self.settings.ECPAY_HASH_KEY,
            self.settings.ECPAY_HASH_IV
        )
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.settings.ECPAY_QUERY_TRADE_URL,
                data=params,
            )
        
        return self._parse_response(response.text)
    
    def _parse_response(self, response_text: str) -> dict[str, Any]:
        """解析 ECPay 回應"""
        result = {}
        for pair in response_text.split("&"):
            if "=" in pair:
                key, value = pair.split("=", 1)
                result[key] = value
        return result


# 單例
_client: ECPayClient | None = None


def get_ecpay_client() -> ECPayClient:
    """取得 ECPay 客戶端實例"""
    global _client
    if _client is None:
        _client = ECPayClient()
    return _client
