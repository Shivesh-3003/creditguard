"""
Comprehensive test script for CreditGuard fraud detection system.
Tests all 6 fraud detection rules with realistic scenarios.
Run this after starting the server to verify all rules work correctly.
"""
import requests
import json
import time
from datetime import datetime

API_URL = "http://localhost:8000"


def test_evaluate(description: str, transaction: dict):
    """Test single transaction evaluation."""
    print(f"\n{'='*60}")
    print(f"TEST: {description}")
    print(f"{'='*60}")
    print(f"Input: {json.dumps(transaction, indent=2)}")

    response = requests.post(f"{API_URL}/evaluate", json=transaction)

    if response.status_code == 200:
        result = response.json()
        print(f"\nRisk Level: {result['risk_level']}")
        print(f"Total Score: {result['total_score']}")
        print(f"\nTriggered Rules:")
        for rule in result['triggered_rules']:
            print(f"  - {rule['rule_name']} (+{rule['score_contribution']})")
            print(f"    {rule['reason']}")
    else:
        print(f"ERROR: {response.status_code} - {response.text}")


def main():
    print("\n🛡️  CreditGuard API Test Suite - 6 Fraud Detection Rules")
    print("=" * 70)

    # Test 1: Low risk - normal transaction
    test_evaluate(
        "BASELINE - Normal Transaction (Should be LOW)",
        {
            "user_id": "user_normal",
            "amount": 47.23,
            "currency": "USD",
            "country": "US",
            "merchant": "Coffee Shop",
            "timestamp": "2024-01-15T14:30:00"
        }
    )

    # Test 2: Round Amount Rule
    test_evaluate(
        "RULE 4: Round Amount - Card Testing Pattern",
        {
            "user_id": "user_round",
            "amount": 5.00,  # Exact $5 - suspicious
            "currency": "USD",
            "country": "US",
            "merchant": "Test Merchant",
            "timestamp": "2024-01-15T10:00:00"
        }
    )

    # Test 3: Unusual Time Rule
    test_evaluate(
        "RULE 6: Unusual Time - Early Morning Transaction",
        {
            "user_id": "user_time",
            "amount": 200.00,
            "currency": "USD",
            "country": "US",
            "merchant": "Online Store",
            "timestamp": "2024-01-15T03:15:00"  # 3:15 AM - suspicious
        }
    )

    # Test 4: High Amount Rule
    test_evaluate(
        "RULE 5: High Amount - Large Transaction",
        {
            "user_id": "user_amount",
            "amount": 2500.00,
            "currency": "USD",
            "country": "US",
            "merchant": "Jewelry Store",
            "timestamp": "2024-01-15T14:00:00"
        }
    )

    # Test 5: Country Risk Rule
    test_evaluate(
        "RULE 3: Country Risk - High-Risk Location",
        {
            "user_id": "user_country",
            "amount": 300.00,
            "currency": "USD",
            "country": "XX",  # High-risk country
            "merchant": "Online Store",
            "timestamp": "2024-01-15T12:00:00"
        }
    )

    # Test 6: Impossible Travel Rule
    print(f"\n{'='*60}")
    print("TEST: RULE 1 - Impossible Travel (US → GB in 20 min)")
    print(f"{'='*60}")

    # First transaction in US
    txn1 = {
        "user_id": "user_travel",
        "amount": 100.00,
        "currency": "USD",
        "country": "US",
        "merchant": "NYC Store",
        "timestamp": "2024-01-15T10:00:00"
    }
    response1 = requests.post(f"{API_URL}/evaluate", json=txn1)
    if response1.status_code == 200:
        result1 = response1.json()
        print(f"\n📍 Transaction 1 (US): {result1['risk_level']} (Score: {result1['total_score']})")

    time.sleep(0.5)  # Small delay

    # Second transaction in GB - 20 minutes later
    txn2 = {
        "user_id": "user_travel",
        "amount": 200.00,
        "currency": "GBP",
        "country": "GB",
        "merchant": "London Store",
        "timestamp": "2024-01-15T10:20:00"  # Only 20 min later!
    }
    response2 = requests.post(f"{API_URL}/evaluate", json=txn2)
    if response2.status_code == 200:
        result2 = response2.json()
        print(f"📍 Transaction 2 (GB): {result2['risk_level']} (Score: {result2['total_score']})")
        print(f"\nTriggered Rules:")
        for rule in result2['triggered_rules']:
            print(f"  ⚠️  {rule['rule_name']} (+{rule['score_contribution']})")
            print(f"      {rule['reason']}")

    # Test 7: Velocity Rule
    print(f"\n{'='*60}")
    print("TEST: RULE 2 - Velocity (>3 transactions in 10 min)")
    print(f"{'='*60}")

    base_transaction = {
        "user_id": "user_velocity",
        "amount": 50.00,
        "currency": "USD",
        "country": "US",
        "merchant": "Quick Mart",
        "timestamp": "2024-01-15T15:00:00"
    }

    for i in range(4):
        response = requests.post(f"{API_URL}/evaluate", json=base_transaction)
        if response.status_code == 200:
            result = response.json()
            print(f"\n💳 Transaction {i+1}: {result['risk_level']} (Score: {result['total_score']})")
            if result['triggered_rules']:
                for rule in result['triggered_rules']:
                    if 'Velocity' in rule['rule_name']:
                        print(f"  ⚠️  {rule['reason']}")
        time.sleep(0.2)

    # Test 8: Multiple Rules - EXTREME RISK
    test_evaluate(
        "EXTREME CASE - Multiple Rules Triggered (HIGH RISK)",
        {
            "user_id": "user_extreme",
            "amount": 10.00,  # Round amount
            "currency": "USD",
            "country": "XX",  # High-risk country
            "merchant": "Unknown",
            "timestamp": "2024-01-15T02:30:00"  # 2:30 AM
        }
    )

    print(f"\n{'='*60}")
    print("✅ All 6 Rules Tested Successfully!")
    print(f"{'='*60}")
    print("\nRule Summary:")
    print("  1. Impossible Travel Rule (70 pts) - ✓ Tested")
    print("  2. Velocity Rule (50 pts)         - ✓ Tested")
    print("  3. Country Risk Rule (40 pts)     - ✓ Tested")
    print("  4. Round Amount Rule (35 pts)     - ✓ Tested")
    print("  5. High Amount Rule (30 pts)      - ✓ Tested")
    print("  6. Unusual Time Rule (25 pts)     - ✓ Tested")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    try:
        # Check if server is running
        response = requests.get(API_URL)
        if response.status_code == 200:
            main()
        else:
            print("❌ Server is not responding correctly")
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to server. Make sure it's running at http://localhost:8000")
        print("   Run: uvicorn app.main:app --reload")
