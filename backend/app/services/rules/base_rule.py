"""
Abstract base class for fraud detection rules.
Strategy pattern: Each rule is independent and pluggable.
"""
from abc import ABC, abstractmethod
from app.schemas import Transaction, RuleTrigger
from typing import Optional


class BaseRule(ABC):
    """
    Base class for all fraud detection rules.
    Each rule evaluates a transaction and returns a trigger if suspicious.
    """

    def __init__(self, score_weight: int):
        self.score_weight = score_weight

    @abstractmethod
    def evaluate(self, transaction: Transaction) -> Optional[RuleTrigger]:
        """
        Evaluate transaction against this rule.

        Returns:
            RuleTrigger if rule is triggered, None otherwise.
        """
        pass

    @property
    @abstractmethod
    def name(self) -> str:
        """Human-readable rule name."""
        pass
