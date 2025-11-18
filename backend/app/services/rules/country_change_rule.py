"""
Rule: Flags transactions from high-risk countries.
Trade-off: Using a static list instead of real-time risk data.
"""
from app.services.rules.base_rule import BaseRule
from app.schemas import Transaction, RuleTrigger
from typing import Optional, Set


class CountryChangeRule(BaseRule):
    """Detects transactions from high-risk countries."""

    # Sample high-risk countries
    HIGH_RISK_COUNTRIES: Set[str] = {
    "AF",  # Afghanistan
    "IR",  # Iran
    "IQ",  # Iraq
    "SY",  # Syria
    "KP",  # North Korea
    "SD",  # Sudan
    "SO",  # Somalia
    "CU",  # Cuba
    "YE",  # Yemen
    "LY",  # Libya
}

    def __init__(self, score_weight: int = 40):
        super().__init__(score_weight)

    @property
    def name(self) -> str:
        return "Country Risk Rule"

    def evaluate(self, transaction: Transaction) -> Optional[RuleTrigger]:
        if transaction.country in self.HIGH_RISK_COUNTRIES:
            return RuleTrigger(
                rule_name=self.name,
                reason=f"Transaction originated from high-risk country: {transaction.country}",
                score_contribution=self.score_weight
            )
        return None
