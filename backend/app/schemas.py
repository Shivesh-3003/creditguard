"""
Pydantic schemas for request/response validation.
Clean data models with type safety.
"""
from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional


class Transaction(BaseModel):
    """Incoming transaction data for fraud evaluation."""
    user_id: str = Field(..., description="Unique user identifier")
    amount: float = Field(..., gt=0, description="Transaction amount")
    currency: str = Field(..., min_length=3, max_length=3, description="ISO currency code")
    country: str = Field(..., min_length=2, max_length=2, description="ISO country code")
    merchant: str = Field(..., description="Merchant name or category")
    timestamp: datetime = Field(default_factory=datetime.now, description="Transaction timestamp")

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_12345",
                "amount": 1500.00,
                "currency": "USD",
                "country": "US",
                "merchant": "Electronics Store",
                "timestamp": "2024-01-15T10:30:00"
            }
        }


class RuleTrigger(BaseModel):
    """Individual rule that was triggered during evaluation."""
    rule_name: str
    reason: str
    score_contribution: int


class FraudResult(BaseModel):
    """Fraud evaluation result with risk level and triggered rules."""
    user_id: str
    risk_level: str  # LOW, MEDIUM, HIGH
    total_score: int
    triggered_rules: List[RuleTrigger]
    timestamp: datetime = Field(default_factory=datetime.now)
