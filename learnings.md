# Project Retrospective: Technical & Quantitative Insights

## 1. Quantitative Mechanics (Black-Scholes-Merton)
Developed a deep understanding of the mathematical relationship between the five core variables of option pricing.
- **Volatility Surface**: Learned that "Volatility" is not a constant inputs, but a dynamic surface that impacts pricing non-linearly (Vega).
- **Time Decay (Theta)**: Visualized the exponential nature of decay as expiry approaches, quantifying why long-term options behave differently than near-term weekly contracts.

## 2. Risk Management (The Greeks)
Moved beyond textbook definitions to practical application:
- **Delta as Hedge Ratio**: Implemented logic to calculate the exact share count required to neutralize directional risk (Delta Neutrality).
- **Vega Sensitivity**: Quantified how "implied volatility crush" can devalue a position even if the underlying asset price moves favorably.
- **Gamma Risk**: Understood the "acceleration" of Delta and the risks involved in large gap moves for short-gamma positions.

## 3. Engineering Challenges
- **Polyglot Architecture**: Successfully architected a system where a high-performance Python kernel (SciPy/NumPy) handles computation, while Node.js manages state and API orchestration.
- **Latency Optimization**: Optimized the "round-trip" time for pricing requests, ensuring that the heavy mathematical solving did not degrade the user experience.
- **Containerization**: Solved dependency consistency issues across Python and Node.js environments using a multi-stage Docker build.

## 4. Institutional Perspective
- **Transparency**: Recognized that "black box" calculators are insufficient for professional use. Implemented detailed operation logs to expose the mathematical steps (e.g., cubic spline interpolation) to the user.
- **Data Integrity**: Integrated robust fallback mechanisms for market data ingestion to ensure reliability in production environments.
