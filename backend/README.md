# CreditGuard Backend

FastAPI-based fraud detection service.

## Quick Start

```bash
# Setup
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run
uvicorn app.main:app --reload
```

Server: http://localhost:8000
Docs: http://localhost:8000/docs

## Test API

```bash
# Test evaluate endpoint
curl -X POST "http://localhost:8000/evaluate" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_123",
    "amount": 1500,
    "currency": "USD",
    "country": "US",
    "merchant": "Test Store"
  }'
```

## Architecture

```
main.py          → API endpoints
schemas.py       → Data models
fraud_engine.py  → Orchestration
rules/           → Individual rules
scoring.py       → Risk calculation
```
