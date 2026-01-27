# Equity Options Pricing Engine

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white) ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![SciPy](https://img.shields.io/badge/SciPy-%230C55A5.svg?style=for-the-badge&logo=scipy&logoColor=%23white)

Equity Options Pricing Engine (EOPE) is a specialized financial analysis terminal designed to calculate and visualize option prices and Greeks in real-time. Developed to bridge the gap between theoretical financial models and interactive visual analysis, it leverages a bespoke Python Quantitative Engine to solve Black-Scholes-Merton partial differential equations with high precision, orchestration via Node.js, and a cinematic React frontend.

## Tech Stack




| ---------------- | ----------------- | ------------------------------------------------------------------------- |
| Frontend         | React, TypeScript | Primary interface with Tailwind CSS for cinematic visualization.          |
| Backend          | Node.js, Express  | API orchestration layer that manages the persistent Python process.       |
| Quant Engine     | Python, SciPy     | Core mathematical module solving Black-Scholes PDEs and computing Greeks. |
| Containerization | Docker            | Ensures reproducible, platform-independent deployment.                    |
| Data Processing  | Pandas, NumPy     | Efficient Time-Series manipulation and vector mathematics.                |

## Features

- **Cinematic Visualization**: A "Mission Control" interface that visualizes the pricing pipeline: Data Ingestion -> Volatility Calibration -> PDE Solving -> Greeks.
- **Advanced Math**: Solves actual Black-Scholes partial differential equations using cubic splines for volatility surfaces, rather than simple estimation approximations.
- **Interactive Risk Analysis**: providing granular definitions and real-world hedging examples for Delta, Gamma, Theta, and Vega on hover.
- **Dockerized Environment**: Fully isolated execution environment ensuring consistent mathematical libraries across platforms.
- **Real-Time Projection**: Dynamic PnL charting and risk sensitivity visualization.

## Project Structure

```
Equity-Options-Engine/
├── frontend/             # React application source code
│   ├── src/pages/        # Dashboard and Visualization logic
│   └── src/components/   # UI definitions
├── backend/              # Node.js API Orchestrator
├── quant_engine/         # Core Python Mathematics Module
│   ├── main.py           # CLI Entry point
│   ├── option_pricing.py # Black-Scholes Implementation
│   └── greeks.py         # Derivatives calculation
├── Dockerfile            # Multi-stage container configuration
└── docker-compose.yml    # Orchestration service
```

## Quick Start

### Option 1: Docker (Recommended)

The most reliable way to run the engine is via the provided Docker container, which handles the complex Python/Node.js variable environments.

# Build the container

docker-compose up --build

# Access the Terminal

Open http://localhost:5000 in your browser.

### Option 2: Local Installation

Requires Python 3.11+ and Node.js 20+.

# Install Python Dependencies

pip install -r quant_engine/requirements.txt

# Install Node Dependencies

npm install

# Run Development Server

npm run dev

## License

This project is licensed under the MIT License.
