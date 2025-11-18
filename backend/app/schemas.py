"""
Pydantic schemas for request/response validation.
Clean data models with type safety.
"""
from datetime import datetime, timezone
from pydantic import BaseModel, Field, field_validator
from typing import List, Optional


class Transaction(BaseModel):
    """Incoming transaction data for fraud evaluation."""
    user_id: str = Field(..., description="Unique user identifier")
    amount: float = Field(..., gt=0, description="Transaction amount")
    currency: str = Field(..., min_length=3, max_length=3, description="ISO currency code")
    country: str = Field(..., min_length=2, max_length=2, description="ISO country code")
    merchant: str = Field(..., description="Merchant name or category")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Transaction timestamp (UTC)")

    @field_validator('timestamp')
    @classmethod
    def validate_timezone(cls, v: datetime) -> datetime:
        """Ensure timestamp is timezone-aware and convert to UTC."""
        if v.tzinfo is None:
            # Naive datetime - assume UTC
            return v.replace(tzinfo=timezone.utc)
        # Convert to UTC if in different timezone
        return v.astimezone(timezone.utc)

    class Config:
        json_schema_extra = {
            "example": {
                "user_id": "user_12345",
                "amount": 1500.00,
                "currency": "USD",
                "country": "US",
                "merchant": "Electronics Store",
                "timestamp": "2024-01-15T10:30:00Z"
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
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
