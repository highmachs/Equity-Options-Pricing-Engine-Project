import sys
import json
import argparse
from data_loader import fetch_data, calculate_volatility
from option_pricing import calculate_option_price
from greeks import calculate_greeks

def main():
    parser = argparse.ArgumentParser(description='Equity Options Pricing Engine')
    parser.add_argument('ticker', type=str, help='Stock ticker symbol')
    parser.add_argument('--spot', type=float, help='Manual spot price override')
    parser.add_argument('--strike', type=float, help='Strike price')
    parser.add_argument('--expiry', type=float, help='Time to expiry in years')
    parser.add_argument('--rate', type=float, default=0.045, help='Risk-free interest rate')
    parser.add_argument('--vol', type=float, help='Volatility override')
    parser.add_argument('--json', action='store_true', help='Output results in JSON format')
    args = parser.parse_args()

    try:
        # Fetch Data
        hist = fetch_data(args.ticker)
        market_spot = hist['Close'].iloc[-1]
        market_vol = calculate_volatility(hist) # Calculate anyway for reference
        
        # Determine Parameters
        spot_price = args.spot if args.spot is not None else market_spot
        # If strike not provided, use ATM (spot_price)
        K = args.strike if args.strike is not None else spot_price
        # Default Expiry 0.25 (3 months)
        T = args.expiry if args.expiry is not None else 0.25
        r = args.rate
        volatility = args.vol if args.vol is not None else market_vol
        
        # Pricing & Greeks
        # Call
        call_price = calculate_option_price(spot_price, K, T, r, volatility, 'call')
        call_greeks = calculate_greeks(spot_price, K, T, r, volatility, 'call')
        
        # Put
        put_price = calculate_option_price(spot_price, K, T, r, volatility, 'put')
        put_greeks = calculate_greeks(spot_price, K, T, r, volatility, 'put')
        
        output = {
            "ticker": args.ticker,
            "spot_price": float(spot_price),
            "strike": float(K),
            "expiry": float(T),
            "rate": float(r),
            "volatility": float(volatility),
            "market_spot": float(market_spot),
            "market_vol": float(market_vol),
            "call_price": float(call_price),
            "put_price": float(put_price),
            "call_delta": float(call_greeks['delta']),
            "call_vega": float(call_greeks['vega']),
            "call_theta": float(call_greeks['theta']),
            "put_delta": float(put_greeks['delta']),
            "put_vega": float(put_greeks['vega']),
            "put_theta": float(put_greeks['theta'])
        }
        
        if args.json:
            print(json.dumps(output))
        else:
             print(f"Analysis for {args.ticker}:")
             print(f"Spot: {spot_price:.2f}, Strike: {K:.2f}, Vol: {volatility:.2%}")
             print(f"Call Price: {call_price:.2f}, Delta: {call_greeks['delta']:.3f}")
        
    except Exception as e:
        # If data fetch fails, we might still want to calculate if manual inputs are provided?
        # For now, simplistic error handling
        error_output = {"error": str(e)}
        print(json.dumps(error_output))
        sys.exit(1)

if __name__ == "__main__":
    main()
