
![CI](https://github.com/Shravann-2011/MarketBridge/actions/workflows/ci.yml/badge.svg)

# MarketBridge – Multi-Agent GenAI Campaign Planner

**1st Place, Silver Spectrum Hackathon 2025** (180+ teams)

MarketBridge automates marketing campaign planning with specialized LLM agents (Creative, Finance, Inventory) that collaborate to produce a feasible, data-driven plan. Agents use Retrieval-Augmented Generation (RAG) over ChromaDB and Google Gemini.

## Features

- **Multi-agent collaboration:** Creative, Finance and Inventory agents negotiate a final campaign plan
- **RAG-enabled agents:** retrieval over ChromaDB for CRM, finance and inventory context
- **What-If ROI simulator:** compare scenarios by discount, duration, target size and budget before spending
- **Sentiment and trend analysis:** analyzes campaign text and keywords for optimization
- **Real-time updates:** WebSocket channel for live agent collaboration

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, Framer Motion |
| Backend | Python, FastAPI |
| AI / LLM | Google Gemini API |
| Retrieval | RAG, ChromaDB |

## API Endpoints

| Method | Path | Purpose |
|---|---|---|
| POST | `/run_campaign` | Run the multi-agent planning system |
| POST | `/api/what_if` | Generate what-if scenarios |
| POST | `/api/sentiment_analysis` | Sentiment and trend analysis |
| GET | `/health` | Health check |
| WS | `/ws/{client_id}` | Real-time agent updates |

## Setup

### Backend

    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    python main.py

Runs at http://localhost:8000 (API docs at /docs). Create `backend/.env`:

    GOOGLE_API_KEY=your_google_generative_ai_key

### Frontend

    cd frontend
    npm install
    npm run dev

Runs at http://localhost:5173.

## Testing

    pip install fastapi==0.104.1 httpx==0.27.2 pytest pytest-cov python-dotenv numpy uvicorn
    pytest --cov=main

17 pytest tests cover the API layer (94% of `main.py`). Gemini agents and the sentiment analyzer are mocked, so tests run offline with no API key. CI runs on every push via GitHub Actions.

## Folder Structure

    MarketBridge/
    ├── frontend/          # React + Vite UI
    ├── backend/
    │   ├── agents/        # Creative, Finance, Inventory agents
    │   ├── agent_manager.py
    │   ├── rag_system.py
    │   ├── scenario_generator.py
    │   └── main.py        # FastAPI entry point
    ├── tests/             # pytest suite
    └── .github/workflows/ # CI

Benchmark the What-If endpoint (in-process latency): `python benchmark.py`
