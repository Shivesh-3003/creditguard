"""
Rule: Flags users with too many transactions in a short time window.
Trade-off: Using in-memory storage instead of Redis/database for simplicity.
"""
from app.services.rules.base_rule import BaseRule
from app.schemas import Transaction, RuleTrigger
from typing import Optional, Dict, List
from datetime import datetime, timedelta
from collections import defaultdict


class VelocityRule(BaseRule):
    """Detects high transaction velocity (frequency) for a user."""

    # In-memory storage: user_id -> list of transaction timestamps
    # Note: In production, this would use Redis or a time-series database
    _transaction_history: Dict[str, List[datetime]] = defaultdict(list)

    def __init__(self, max_transactions: int = 3, time_window_minutes: int = 10, score_weight: int = 50):
        """
        Args:
            max_transactions: Max allowed transactions in time window
            time_window_minutes: Time window to check (minutes)
            score_weight: Points added if rule triggers
        """
        super().__init__(score_weight)
        self.max_transactions = max_transactions
        self.time_window = timedelta(minutes=time_window_minutes)

    @property
    def name(self) -> str:
        return "Velocity Rule"

    def evaluate(self, transaction: Transaction) -> Optional[RuleTrigger]:
        user_id = transaction.user_id
        current_time = transaction.timestamp

        # Get user's transaction history
        user_history = self._transaction_history[user_id]

        # Remove transactions outside the time window
        cutoff_time = current_time - self.time_window
        user_history[:] = [ts for ts in user_history if ts > cutoff_time]

        # Add current transaction
        user_history.append(current_time)

        # Check if velocity exceeded
        if len(user_history) > self.max_transactions:
            return RuleTrigger(
                rule_name=self.name,
                reason=f"User has {len(user_history)} transactions in last {self.time_window.seconds // 60} minutes (max: {self.max_transactions})",
                score_contribution=self.score_weight
            )
        return None
