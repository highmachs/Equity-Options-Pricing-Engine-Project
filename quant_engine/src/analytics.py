import pandas as pd
import numpy as np

def calculate_daily_returns(data: pd.DataFrame) -> pd.DataFrame:
    """
    Calculates daily log returns based on the 'Close' price.
    
    Args:
        data (pd.DataFrame): Historical price data.
        
    Returns:
        pd.DataFrame: Data with an added 'Log_Return' column.
    """
    # Ensure we are using the 'Close' column. 
    # yfinance often returns a MultiIndex if multiple tickers, but here we assume one.
    # We use 'Adj Close' if available for total return, otherwise 'Close'.
    col = 'Adj Close' if 'Adj Close' in data.columns else 'Close'
    
    # Calculate Log Returns: ln(Pt / Pt-1)
    # Log returns are preferred for financial analysis over simple percentage returns
    # because they are additive over time.
    data['Log_Return'] = np.log(data[col] / data[col].shift(1))
    
    return data

def estimate_annualized_volatility(data: pd.DataFrame, trading_days: int = 252) -> float:
    """
    Estimates annualized historical volatility from daily log returns.
    
    Args:
        data (pd.DataFrame): Historical data with 'Log_Return' column.
        trading_days (int): Number of trading days in a year (default 252).
        
    Returns:
        float: Annualized volatility (sigma).
    """
    if 'Log_Return' not in data.columns:
        raise ValueError("DataFrame must contain 'Log_Return' column.")
        
    # Standard deviation of daily returns
    daily_vol = data['Log_Return'].std()
    
    # Annualize: sigma_annual = sigma_daily * sqrt(T)
    annualized_vol = daily_vol * np.sqrt(trading_days)
    
    return annualized_vol
