"""
Rule: Detects round-amount transactions (card testing pattern).
Fraudsters test stolen cards with small, round amounts before making large purchases.
"""
from app.services.rules.base_rule import BaseRule
from app.schemas import Transaction, RuleTrigger
from typing import Optional


class RoundAmountRule(BaseRule):
    """
    Detects suspicious round-amount transactions.

    Pattern: Card testers use round amounts like $1.00, $5.00, $10.00
    to verify card validity before larger fraud.

    Real purchases: $47.23, $103.67, $28.99 (rarely exact dollars)

    Trade-off: Simple modulo check vs statistical analysis of user patterns
    """

    # Round amounts to check (in dollars)
    SUSPICIOUS_AMOUNTS = {1.0, 5.0, 10.0, 20.0, 50.0, 100.0}

    def __init__(self, score_weight: int = 35):
        """
        Args:
            score_weight: Moderate-high weight - common fraud pattern
        """
        super().__init__(score_weight)

    @property
    def name(self) -> str:
        return "Round Amount Rule"

    def evaluate(self, transaction: Transaction) -> Optional[RuleTrigger]:
        amount = transaction.amount

        # Check if amount is exactly a suspicious round number
        if amount in self.SUSPICIOUS_AMOUNTS:
            return RuleTrigger(
                rule_name=self.name,
                reason=f"Suspicious round amount: ${amount:.2f}. Card testers often use small, round amounts to verify stolen cards before larger fraud.",
                score_contribution=self.score_weight
            )

        # Also check for any exact dollar amount under $25 (e.g., $3.00, $7.00)
        # Real purchases rarely result in exact dollars
        if amount <= 25.0 and amount % 1.0 == 0.0:
            return RuleTrigger(
                rule_name=self.name,
                reason=f"Exact dollar amount: ${amount:.0f}.00. Legitimate purchases typically include cents (e.g., $23.47 not $23.00).",
                score_contribution=self.score_weight
            )

        return None
