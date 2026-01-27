import math
from scipy.stats import norm

def calculate_greeks(S: float, K: float, T: float, r: float, sigma: float, option_type: str = "call"):
    """
    Computes primary risk sensitivities (Greeks) using analytical formulas.

    Returns:
        dict: Values for Delta, Theta (daily), and Vega (1% vol shift).
    """
    if T <= 0:
        return {"delta": 0.0, "theta": 0.0, "vega": 0.0}

    d1 = (math.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * math.sqrt(T))
    d2 = d1 - sigma * math.sqrt(T)

    # Delta: Price Sensitivity
    # Represents the expected change in option value for a $1 move in the underlying.
    if option_type.lower() == "call":
        delta = norm.cdf(d1)
    else:
        delta = norm.cdf(d1) - 1

    # Vega: Volatility Sensitivity
    # Represents the expected change in option value for a 1 percentage point move in volatility.
    vega = (S * norm.pdf(d1) * math.sqrt(T)) / 100

    # Theta: Time Sensitivity
    # Represents the daily erosion of the option's value as expiration approaches.
    term1 = -(S * norm.pdf(d1) * sigma) / (2 * math.sqrt(T))
    
    if option_type.lower() == "call":
        term2 = r * K * math.exp(-r * T) * norm.cdf(d2)
        theta = (term1 - term2) / 365
    else:
        term2 = r * K * math.exp(-r * T) * norm.cdf(-d2)
        theta = (term1 + term2) / 365

    return {
        "delta": delta,
        "vega": vega,
        "theta": theta
    }
