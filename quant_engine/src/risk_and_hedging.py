def summarize_risks(delta: float, theta: float, vega: float, option_type: str = "call"):
    """
    Provides a concise risk assessment for the specified position.
    """
    sentiment = "bullish" if option_type.lower() == "call" else "bearish"
    
    summary = [
        f"- Directional (Delta): Position is {sentiment}. A $1 move against the trend results in a ${abs(delta * 100):.2f} P&L impact per contract.",
        f"- Time Decay (Theta): Position erodes by approximately ${abs(theta * 100):.2f} per contract daily.",
        f"- Volatility (Vega): A 1% decrease in implied volatility results in a ${abs(vega * 100):.2f} P&L drag per contract."
    ]
    return "\n".join(summary)

def calculate_delta_hedge(delta: float, num_contracts: int = 1):
    """
    Calculates the required share count to neutralize directional exposure.
    Assumes standard 100-share contract multiplier.
    """
    total_delta = delta * 100 * num_contracts
    shares_to_trade = -round(total_delta)
    
    action = "SELL" if shares_to_trade < 0 else "BUY"
    return {
        "exposure": total_delta,
        "shares": abs(shares_to_trade),
        "action": action
    }
