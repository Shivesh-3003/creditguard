"""
Simple scoring logic to map total fraud score to risk levels.
Trade-off: Using fixed thresholds rather than ML-based probability.
"""


def calculate_risk_level(total_score: int) -> str:
    """
    Map total score to risk level.

    Thresholds updated for 6-rule system (max 280 points):
    - LOW: 0-49 (minor or no flags)
    - MEDIUM: 50-99 (moderate concern, 1-2 significant rules)
    - HIGH: 100+ (multiple serious flags or critical rule like impossible travel)

    Examples:
    - Velocity (50) = MEDIUM
    - Impossible Travel (70) + Unusual Time (25) = 95 = MEDIUM
    - Impossible Travel (70) + Round Amount (35) = 105 = HIGH
    """
    if total_score >= 100:
        return "HIGH"
    elif total_score >= 50:
        return "MEDIUM"
    else:
        return "LOW"
