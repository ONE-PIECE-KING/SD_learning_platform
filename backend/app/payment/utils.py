"""ECPay 工具函數"""
import hashlib
import urllib.parse
from datetime import datetime
from typing import Any


def generate_check_mac_value(params: dict[str, Any], hash_key: str, hash_iv: str) -> str:
    """
    產生 ECPay CheckMacValue
    
    Args:
        params: 交易參數
        hash_key: ECPay HashKey
        hash_iv: ECPay HashIV
        
    Returns:
        CheckMacValue 字串
    """
    # 1. 過濾掉 CheckMacValue 參數
    filtered_params = {k: v for k, v in params.items() if k != "CheckMacValue"}
    
    # 2. 依照參數名稱 ASCII 排序
    sorted_params = sorted(filtered_params.items(), key=lambda x: x[0])
    
    # 3. 組成查詢字串
    raw_str = "&".join(f"{k}={v}" for k, v in sorted_params)
    
    # 4. 加上 HashKey 和 HashIV
    raw_str = f"HashKey={hash_key}&{raw_str}&HashIV={hash_iv}"
    
    # 5. URL Encode (轉小寫)
    encoded = urllib.parse.quote_plus(raw_str).lower()
    
    # 6. SHA256 雜湊 (轉大寫)
    check_mac_value = hashlib.sha256(encoded.encode("utf-8")).hexdigest().upper()
    
    return check_mac_value


def verify_check_mac_value(params: dict[str, Any], hash_key: str, hash_iv: str) -> bool:
    """
    驗證 ECPay CheckMacValue
    
    Args:
        params: 包含 CheckMacValue 的參數
        hash_key: ECPay HashKey
        hash_iv: ECPay HashIV
        
    Returns:
        驗證是否通過
    """
    received_mac = params.get("CheckMacValue", "")
    calculated_mac = generate_check_mac_value(params, hash_key, hash_iv)
    return received_mac.upper() == calculated_mac.upper()


def generate_merchant_trade_no(prefix: str = "OLP") -> str:
    """
    產生特店訂單編號
    
    格式: {prefix}{YYYYMMDDHHmmss}{3位隨機數}
    總長度: 20 字元
    
    Args:
        prefix: 前綴 (預設 OLP = Online Learning Platform)
        
    Returns:
        訂單編號
    """
    import random
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    random_suffix = str(random.randint(100, 999))
    return f"{prefix}{timestamp}{random_suffix}"[:20]


def format_trade_date(dt: datetime | None = None) -> str:
    """
    格式化交易時間
    
    Args:
        dt: 日期時間物件 (預設為當前時間)
        
    Returns:
        格式化字串 (YYYY/MM/DD HH:mm:ss)
    """
    if dt is None:
        dt = datetime.now()
    return dt.strftime("%Y/%m/%d %H:%M:%S")


def parse_ecpay_date(date_str: str) -> datetime | None:
    """
    解析 ECPay 回傳的日期
    
    Args:
        date_str: ECPay 日期字串 (YYYY/MM/DD HH:mm:ss)
        
    Returns:
        datetime 物件或 None
    """
    if not date_str:
        return None
    try:
        return datetime.strptime(date_str, "%Y/%m/%d %H:%M:%S")
    except ValueError:
        return None
