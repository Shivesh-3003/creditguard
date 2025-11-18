"""
Rule: Flags transactions at unusual/suspicious hours.
Fraud often occurs during early morning hours when legitimate cardholders are asleep.
"""
from app.services.rules.base_rule import BaseRule
from app.schemas import Transaction, RuleTrigger
from typing import Optional


class UnusualTimeRule(BaseRule):
    """
    Detects transactions during suspicious hours.

    High-risk hours: 1 AM - 5 AM (when most people are asleep)
    Fraudsters often operate during these hours to delay detection.

    Trade-off: Not accounting for user's timezone or historical patterns
    In production: Would learn user's typical transaction times
    """

    # Suspicious hours (24-hour format)
    SUSPICIOUS_START_HOUR = 1  # 1 AM
    SUSPICIOUS_END_HOUR = 5    # 5 AM

    def __init__(self, score_weight: int = 25):
        """
        Args:
            score_weight: Moderate weight - suspicious but not definitive
        """
        super().__init__(score_weight)

    @property
    def name(self) -> str:
        return "Unusual Time Rule"

    def evaluate(self, transaction: Transaction) -> Optional[RuleTrigger]:
        # Get hour of transaction (0-23)
        hour = transaction.timestamp.hour

        # Check if transaction is during suspicious hours
        if self.SUSPICIOUS_START_HOUR <= hour < self.SUSPICIOUS_END_HOUR:
            return RuleTrigger(
                rule_name=self.name,
                reason=f"Transaction at {hour}:00 (suspicious hours: {self.SUSPICIOUS_START_HOUR}:00-{self.SUSPICIOUS_END_HOUR}:00). Legitimate users rarely transact during early morning.",
                score_contribution=self.score_weight
            )

        return None
