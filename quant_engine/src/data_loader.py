import yfinance as yf
import pandas as pd
import numpy as np
from typing import Optional

def fetch_data(ticker: str, period: str = "1y") -> pd.DataFrame:
    """
    Downloads historical daily price data for a given ticker using yfinance.

    Args:
        ticker (str): The stock symbol (e.g., 'AAPL').
        period (str): The historical period to download (default is '1y').

    Returns:
        pd.DataFrame: DataFrame containing historical data, or raises Exception if failed.
    """
    try:
        # Download data
        data = yf.download(ticker, period=period, progress=False)
        
        if data.empty:
            raise ValueError(f"No data found for {ticker}.")
        
        # Flatten MultiIndex columns if present (common in recent yfinance versions)
        if isinstance(data.columns, pd.MultiIndex):
            # If the second level contains the ticker, drop it
            if ticker in data.columns.get_level_values(1):
                 data.columns = data.columns.get_level_values(0)
            
        return data
    except Exception as e:
        raise e

def calculate_volatility(data: pd.DataFrame, window: int = 252) -> float:
    """
    Calculates annualized historical volatility based on log returns.
    
    Args:
        data (pd.DataFrame): Historical price data with a 'Close' column.
        window (int): Number of trading days to annualize (default 252).
        
    Returns:
        float: Annualized volatility (decimal).
    """
    if 'Close' not in data.columns:
        raise ValueError("Data must likely contain a 'Close' column")

    log_returns = np.log(data['Close'] / data['Close'].shift(1))
    volatility = log_returns.std() * np.sqrt(window)
    return float(volatility)
