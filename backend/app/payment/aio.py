"""ECPay All-In-One 金流模組"""
from dataclasses import dataclass
from enum import Enum
from typing import Any

from app.core.config import get_settings
from app.payment.ecpay.utils import generate_check_mac_value, format_trade_date, generate_merchant_trade_no


class PaymentType(str, Enum):
    """付款方式"""
    ALL = "ALL"                     # 不指定 (顯示所有可用方式)
    CREDIT = "Credit"               # 信用卡
    WEBATM = "WebATM"              # 網路 ATM
    ATM = "ATM"                     # ATM 虛擬帳號
    CVS = "CVS"                     # 超商代碼
    BARCODE = "BARCODE"            # 超商條碼
    TWQR = "TWQR"                   # TWQR 行動支付


class CreditInstallment(str, Enum):
    """信用卡分期期數"""
    PAY_3 = "3"
    PAY_6 = "6"
    PAY_12 = "12"
    PAY_18 = "18"
    PAY_24 = "24"


@dataclass
class AioCheckoutParams:
    """AIO 結帳參數"""
    merchant_trade_no: str          # 特店訂單編號
    trade_desc: str                 # 交易描述
    item_name: str                  # 商品名稱
    total_amount: int               # 交易金額 (整數)
    return_url: str                 # 付款完成後導向
    payment_type: PaymentType = PaymentType.CREDIT
    
    # 選填
    choose_payment: str = "Credit"  # 付款方式
    client_back_url: str = ""       # 使用者取消時返回  
    order_result_url: str = ""      # 付款結果通知
    need_extra_paid_info: str = "Y" # 額外付款資訊
    
    # 信用卡分期 (選填)
    credit_installment: str = ""    # 分期期數 (3,6,12,18,24)
    installment_amount: int = 0     # 分期金額
    

class ECPayAIO:
    """ECPay All-In-One 金流 API"""
    
    def __init__(self):
        self.settings = get_settings()
    
    def create_checkout_form(
        self,
        trade_no: str,
        amount: int,
        item_name: str,
        trade_desc: str,
        return_url: str | None = None,
        payment_type: PaymentType = PaymentType.CREDIT,
        credit_installment: str = "",
    ) -> dict[str, Any]:
        """
        建立結帳表單參數
        
        Args:
            trade_no: 訂單編號
            amount: 金額
            item_name: 商品名稱
            trade_desc: 交易描述
            return_url: 完成後導向 URL
            payment_type: 付款方式
            credit_installment: 分期期數
            
        Returns:
            結帳表單參數 (含 CheckMacValue)
        """
        params = {
            "MerchantID": self.settings.ECPAY_MERCHANT_ID,
            "MerchantTradeNo": trade_no,
            "MerchantTradeDate": format_trade_date(),
            "PaymentType": "aio",
            "TotalAmount": amount,
            "TradeDesc": trade_desc,
            "ItemName": item_name,
            "ReturnURL": self.settings.ECPAY_CALLBACK_URL,
            "ChoosePayment": payment_type.value,
            "EncryptType": 1,
            "NeedExtraPaidInfo": "Y",
        }
        
        # 設定 OrderResultURL (用戶看到的結果頁)
        if return_url:
            params["OrderResultURL"] = return_url
        else:
            params["OrderResultURL"] = self.settings.ECPAY_RETURN_URL
        
        # 信用卡分期設定
        if payment_type == PaymentType.CREDIT and credit_installment:
            params["CreditInstallment"] = credit_installment
        
        # 產生 CheckMacValue
        params["CheckMacValue"] = generate_check_mac_value(
            params,
            self.settings.ECPAY_HASH_KEY,
            self.settings.ECPAY_HASH_IV
        )
        
        return params
    
    def get_checkout_url(self) -> str:
        """取得結帳 API URL"""
        return self.settings.ECPAY_AIO_CHECKOUT_URL
    
    def build_checkout_html(self, params: dict[str, Any]) -> str:
        """
        建立自動提交的 HTML 表單
        
        Args:
            params: 結帳參數
            
        Returns:
            HTML 表單字串
        """
        form_inputs = "\n".join(
            f'<input type="hidden" name="{k}" value="{v}">'
            for k, v in params.items()
        )
        
        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>正在導向付款頁面...</title>
        </head>
        <body>
            <form id="ecpay_form" method="POST" action="{self.get_checkout_url()}">
                {form_inputs}
            </form>
            <script>document.getElementById('ecpay_form').submit();</script>
        </body>
        </html>
        """
