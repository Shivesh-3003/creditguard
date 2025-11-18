"""
Rule: Detects geographically impossible transactions.
Flags transactions that occur too quickly across distant locations.
"""
from app.services.rules.base_rule import BaseRule
from app.schemas import Transaction, RuleTrigger
from typing import Optional, Dict
from datetime import datetime, timedelta
from collections import defaultdict


class ImpossibleTravelRule(BaseRule):
    """
    Detects geographically impossible transactions.

    Example: Transaction in NYC at 2:00 PM, then London at 2:30 PM
    → Physically impossible to travel 3500 miles in 30 minutes

    Trade-off: Using simplified country-distance model vs precise geolocation
    """

    # Approximate distances between countries (in miles)
    # In production, would use precise lat/long and distance calculation
    COUNTRY_DISTANCES = {
        ('US', 'GB'): 3500,
        ('US', 'FR'): 3800,
        ('US', 'DE'): 4000,
        ('US', 'CN'): 6900,
        ('US', 'JP'): 6300,
        ('GB', 'CN'): 5100,
        ('GB', 'JP'): 5900,
        ('FR', 'CN'): 5200,
        ('DE', 'JP'): 5500,
    }

    # Maximum possible travel speed: 600 mph (commercial jet)
    MAX_SPEED_MPH = 600

    # Store last transaction per user: {user_id: (country, timestamp)}
    _last_transactions: Dict[str, tuple] = defaultdict(lambda: (None, None))

    def __init__(self, score_weight: int = 70):
        """
        Args:
            score_weight: High weight - impossible travel is strong fraud signal
        """
        super().__init__(score_weight)

    @property
    def name(self) -> str:
        return "Impossible Travel Rule"

    def evaluate(self, transaction: Transaction) -> Optional[RuleTrigger]:
        user_id = transaction.user_id
        current_country = transaction.country
        current_time = transaction.timestamp

        # Get user's last transaction
        last_country, last_time = self._last_transactions[user_id]

        # Update storage
        self._last_transactions[user_id] = (current_country, current_time)

        # First transaction for this user
        if last_country is None or last_time is None:
            return None

        # Same country - no travel
        if current_country == last_country:
            return None

        # Calculate time difference in hours
        time_diff = (current_time - last_time).total_seconds() / 3600

        # Get distance between countries
        distance = self._get_distance(last_country, current_country)

        if distance is None:
            # Countries not in our distance matrix - can't determine
            return None

        # Calculate required speed
        required_speed = distance / time_diff if time_diff > 0 else float('inf')

        # Check if travel is impossible
        if required_speed > self.MAX_SPEED_MPH:
            return RuleTrigger(
                rule_name=self.name,
                reason=f"Impossible travel: {last_country} → {current_country} in {time_diff:.1f} hours (requires {required_speed:.0f} mph, max possible: {self.MAX_SPEED_MPH} mph)",
                score_contribution=self.score_weight
            )

        return None

    def _get_distance(self, country1: str, country2: str) -> Optional[float]:
        """Get distance between two countries (bidirectional lookup)."""
        # Try both orderings
        key1 = (country1, country2)
        key2 = (country2, country1)

        return self.COUNTRY_DISTANCES.get(key1) or self.COUNTRY_DISTANCES.get(key2)
