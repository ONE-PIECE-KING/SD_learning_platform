"""ECPay 信用卡操作模組"""
from enum import Enum
from typing import Any

import httpx

from app.core.config import get_settings
from app.payment.ecpay.utils import generate_check_mac_value


class CreditAction(str, Enum):
    """信用卡操作類型"""
    CLOSE = "C"     # 關帳 (請款)
    CANCEL = "E"    # 取消關帳
    ABANDON = "N"   # 放棄 (取消授權)
    REFUND = "R"    # 退刷


class ECPayCredit:
    """ECPay 信用卡操作 API"""
    
    def __init__(self):
        self.settings = get_settings()
    
    async def do_action(
        self,
        merchant_trade_no: str,
        trade_no: str,
        action: CreditAction,
        total_amount: int,
    ) -> dict[str, Any]:
        """
        執行信用卡操作 (關帳/退刷/取消)
        
        Args:
            merchant_trade_no: 特店訂單編號
            trade_no: 綠界交易編號
            action: 操作類型
            total_amount: 金額
            
        Returns:
            ECPay API 回應
        """
        params = {
            "MerchantID": self.settings.ECPAY_MERCHANT_ID,
            "MerchantTradeNo": merchant_trade_no,
            "TradeNo": trade_no,
            "Action": action.value,
            "TotalAmount": total_amount,
        }
        
        # 產生 CheckMacValue
        params["CheckMacValue"] = generate_check_mac_value(
            params,
            self.settings.ECPAY_HASH_KEY,
            self.settings.ECPAY_HASH_IV
        )
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                self.settings.ECPAY_CREDIT_ACTION_URL,
                data=params,
            )
            
        # 解析回應
        return self._parse_response(response.text)
    
    async def refund(
        self,
        merchant_trade_no: str,
        trade_no: str,
        refund_amount: int,
        trade_status: str,
    ) -> dict[str, Any]:
        """
        執行退款
        
        根據交易狀態決定操作:
        - 已授權 (authorized): 執行放棄 (N)
        - 已關帳 (captured): 執行退刷 (R)
        
        Args:
            merchant_trade_no: 特店訂單編號
            trade_no: 綠界交易編號
            refund_amount: 退款金額
            trade_status: 交易狀態
            
        Returns:
            ECPay API 回應
        """
        if trade_status == "authorized":
            # 已授權但未關帳 -> 放棄授權
            action = CreditAction.ABANDON
        else:
            # 已關帳 -> 退刷
            action = CreditAction.REFUND
        
        return await self.do_action(
            merchant_trade_no=merchant_trade_no,
            trade_no=trade_no,
            action=action,
            total_amount=refund_amount,
        )
    
    def _parse_response(self, response_text: str) -> dict[str, Any]:
        """解析 ECPay 回應"""
        result = {}
        for pair in response_text.split("&"):
            if "=" in pair:
                key, value = pair.split("=", 1)
                result[key] = value
        return result
