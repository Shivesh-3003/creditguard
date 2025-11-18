"""
Rule: Flags transactions with unusually high amounts.
Simple threshold-based approach.
"""
from app.services.rules.base_rule import BaseRule
from app.schemas import Transaction, RuleTrigger
from typing import Optional


class HighAmountRule(BaseRule):
    """Detects transactions above a threshold amount."""

    def __init__(self, threshold: float = 1000.0, score_weight: int = 30):
        """
        Args:
            threshold: Amount above which transaction is flagged (default: $1000)
            score_weight: Points added if rule triggers
        """
        super().__init__(score_weight)
        self.threshold = threshold

    @property
    def name(self) -> str:
        return "High Amount Rule"

    def evaluate(self, transaction: Transaction) -> Optional[RuleTrigger]:
        if transaction.amount > self.threshold:
            return RuleTrigger(
                rule_name=self.name,
                reason=f"Transaction amount ${transaction.amount:.2f} exceeds threshold ${self.threshold:.2f}",
                score_contribution=self.score_weight
            )
        return None
