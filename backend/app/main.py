"""
CreditGuard API - FastAPI application for fraud detection.
Clean REST API with clear separation of concerns.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import Transaction, FraudResult
from app.services.fraud_engine import FraudEngine
from typing import List

# Initialize FastAPI app
app = FastAPI(
    title="CreditGuard API",
    description="Rule-based credit card fraud detection system",
    version="1.0.0"
)

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite/CRA default ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize fraud detection engine (singleton pattern)
fraud_engine = FraudEngine()


@app.get("/")
def root():
    """Health check endpoint."""
    return {
        "service": "CreditGuard API",
        "status": "running",
        "version": "1.0.0"
    }


@app.post("/evaluate", response_model=FraudResult)
def evaluate_transaction(transaction: Transaction) -> FraudResult:
    """
    Evaluate a single transaction for fraud.

    Process:
    1. Validate transaction data (Pydantic)
    2. Pass to fraud engine
    3. Return risk assessment

    Returns:
        FraudResult with risk level and triggered rules
    """
    try:
        result = fraud_engine.evaluate(transaction)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Evaluation failed: {str(e)}")


@app.post("/batch-evaluate", response_model=List[FraudResult])
def batch_evaluate_transactions(transactions: List[Transaction]) -> List[FraudResult]:
    """
    Evaluate multiple transactions (batch processing).

    Useful for testing or processing historical data.
    Trade-off: Simple sequential processing vs. parallel/async for production.
    """
    try:
        results = [fraud_engine.evaluate(txn) for txn in transactions]
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Batch evaluation failed: {str(e)}")


@app.get("/rules")
def list_rules():
    """
    List all active fraud detection rules.
    Useful for transparency and explainability.
    """
    return {
        "active_rules": [
            {
                "name": rule.name,
                "weight": rule.score_weight
            }
            for rule in fraud_engine.rules
        ]
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
