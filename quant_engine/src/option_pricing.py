import math
from scipy.stats import norm
import numpy as np

def calculate_option_price(S: float, K: float, T: float, r: float, sigma: float, option_type: str = "call") -> float:
    """
    Calculates the theoretical fair value of a European option using the Black-Scholes-Merton model.

    Args:
        S (float): Current Spot Price of the underlying asset.
        K (float): Strike Price (the price at which the option can be exercised).
        T (float): Time to Expiration expressed in years (e.g., 0.25 for 3 months).
        r (float): Annualized risk-free interest rate (decimal form).
        sigma (float): Annualized volatility of the underlying asset's returns.
        option_type (str): Directional contract type, either "call" or "put".

    Returns:
        float: Theoretical option premium.
    """
    # Boundary condition: If expired, return intrinsic value
    if T <= 0:
        return max(0, S - K) if option_type.lower() == "call" else max(0, K - S)
    
    if sigma <= 0:
        # If volatility is zero/negative, it behaves like intrinsic value (deterministic)
        # But commonly we raise error or handle gracefully. 
        # For robustness, returning intrinsic might be safer than crashing if math domain error risks exist.
        return max(0, S - K) if option_type.lower() == "call" else max(0, K - S)

    # d1 represents the distance of the spot price from the strike price, 
    # adjusted for time, interest rates, and volatility.
    d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
    
    # d2 represents the probability of the option expiring in-the-money 
    # under the risk-neutral measure.
    d2 = d1 - sigma * math.sqrt(T)

    if option_type.lower() == "call":
        price = S * norm.cdf(d1) - K * math.exp(-r * T) * norm.cdf(d2)
    elif option_type.lower() == "put":
        price = K * math.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
    else:
        raise ValueError("Invalid option_type. Use 'call' or 'put'.")

    return price
