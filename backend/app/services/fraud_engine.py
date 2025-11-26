"""
Fraud Engine: Orchestrates rule evaluation and scoring.
Clean separation: Rules define logic, Engine coordinates execution.
"""
from typing import List
from app.schemas import Transaction, FraudResult, RuleTrigger
from app.services.rules.base_rule import BaseRule
from app.services.rules.high_amount_rule import HighAmountRule
from app.services.rules.country_change_rule import CountryChangeRule
from app.services.rules.velocity_rule import VelocityRule
from app.services.rules.impossible_travel_rule import ImpossibleTravelRule
from app.services.rules.unusual_time_rule import UnusualTimeRule
from app.services.rules.round_amount_rule import RoundAmountRule
from app.utils.scoring import calculate_risk_level


class FraudEngine:
    """
    Main fraud detection engine.
    Evaluates transactions against configured rules and produces risk assessment.
    Implements Singleton pattern to ensure only one instance exists.
    """
    _instance = None
    _initialized = False

    def __new__(cls):
        """Singleton pattern: Ensure only one instance exists."""
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self):
        """
        Initialize engine with comprehensive rule set.
        Only runs once due to singleton pattern.

        Rules ordered by severity/importance:
        1. Impossible Travel (70) - Strong fraud signal
        2. Velocity (50) - Common attack pattern
        3. Country Risk (40) - Geographic risk
        4. Round Amount (35) - Card testing
        5. High Amount (30) - Large transaction
        6. Unusual Time (25) - Suspicious hours
        """
        # Prevent re-initialization of singleton
        if FraudEngine._initialized:
            return

        self.rules: List[BaseRule] = [
            # Critical fraud signals
            ImpossibleTravelRule(score_weight=70),
            VelocityRule(max_transactions=3, time_window_minutes=10, score_weight=50),

            # Geographic and behavioral patterns
            CountryChangeRule(score_weight=40),
            RoundAmountRule(score_weight=35),

            # Amount and time-based rules
            HighAmountRule(threshold=1000.0, score_weight=30),
            UnusualTimeRule(score_weight=25),
        ]

        FraudEngine._initialized = True

    def add_rule(self, rule: BaseRule) -> None:
        """Add a custom rule to the engine (extensibility)."""
        self.rules.append(rule)

    def evaluate(self, transaction: Transaction) -> FraudResult:
        """
        Evaluate transaction against all rules.

        Process:
        1. Run each rule's evaluate() method
        2. Collect triggered rules
        3. Sum scores
        4. Map to risk level

        Returns:
            FraudResult with risk assessment
        """
        triggered_rules: List[RuleTrigger] = []

        # Evaluate each rule
        for rule in self.rules:
            trigger = rule.evaluate(transaction)
            if trigger:
                triggered_rules.append(trigger)

        # Calculate total score
        total_score = sum(trigger.score_contribution for trigger in triggered_rules)

        # Determine risk level
        risk_level = calculate_risk_level(total_score)

        return FraudResult(
            user_id=transaction.user_id,
            risk_level=risk_level,
            total_score=total_score,
            triggered_rules=triggered_rules
        )
