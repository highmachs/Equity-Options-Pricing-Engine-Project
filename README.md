# Equity Options Pricing Engine

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SciPy](https://img.shields.io/badge/SciPy-%230C55A5.svg?style=for-the-badge&logo=scipy&logoColor=%23white)

## Overview

Equity Options Pricing Engine (EOPE) is a specialized financial analysis terminal designed to calculate and visualize option prices and Greeks in real time. The system bridges theoretical quantitative finance and interactive visual analysis by combining a bespoke Python quantitative engine, a Node.js orchestration layer, and a cinematic React frontend.

**➡️ Read the Technical Retrospective (learnings.md)**  
A deep dive into the engineering and quantitative insights gained from building this project.

---

## Architecture

- Python Quantitative Engine solves Black Scholes Merton partial differential equations with high numerical precision.
- Node.js backend orchestrates and manages the persistent Python process.
- React and TypeScript frontend delivers a cinematic, interactive visualization layer.
- Docker ensures deterministic, platform independent deployment.

---

## Tech Stack

| Layer | Technologies | Description |
|------|-------------|-------------|
| Frontend | React, TypeScript, Tailwind CSS | Primary interface with cinematic data visualization |
| Backend | Node.js, Express | API orchestration and Python process control |
| Quant Engine | Python, SciPy | Black Scholes PDE solving and Greeks computation |
| Data Processing | Pandas, NumPy | Time series handling and vectorized mathematics |
| Containerization | Docker, Docker Compose | Reproducible multi service deployment |

---

## Features

- **Cinematic Visualization**  
  Mission Control style interface visualizing the full pricing pipeline. Data Ingestion, Volatility Calibration, PDE Solving, Greeks.

- **Advanced Mathematics**  
  Direct numerical solution of Black Scholes partial differential equations using cubic splines for volatility surfaces rather than closed form approximations.

- **Interactive Risk Analysis**  
  Hover driven explanations and real world hedging intuition for Delta, Gamma, Theta, and Vega.

- **Dockerized Execution**  
  Fully isolated environment guaranteeing consistent numerical libraries and runtime behavior.

- **Real Time Projection**  
  Dynamic PnL projections and sensitivity visualizations driven by live recomputation.

---

## Project Structure

```text
Equity-Options-Engine/
├── frontend/
│   └── src/
│       ├── pages/
│       └── components/
├── backend/
├── quant_engine/
│   ├── main.py
│   ├── option_pricing.py
│   └── greeks.py
├── Dockerfile
└── docker-compose.yml
```
---

## Getting Started

### Option 1. Docker (Recommended)

```bash
docker-compose up --build
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

---

### Option 2. Local Installation

```bash
pip install -r quant_engine/requirements.txt
npm install
npm run dev
```

Requires Python 3.11+ and Node.js 20+.

---

## License

MIT License

```
```
