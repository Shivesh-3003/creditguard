# CreditGuard - Rule-Based Fraud Detection System

A clean, educational fraud detection system demonstrating backend architecture, rules engines, and API design.

**Built for Capital One Assessment Centre**

---

## Overview

CreditGuard evaluates credit card transactions using a configurable rule-based engine. The system demonstrates:

- **Clean Architecture**: Separation of concerns (API → Service → Rules)
- **Extensibility**: Easy to add new fraud detection rules
- **Type Safety**: Pydantic (backend) and TypeScript (frontend)
- **Explainability**: Clear reasons for each fraud flag

## ✨ Key Features

- **Single Transaction Evaluation**: Real-time fraud assessment with instant feedback
- **Transaction History**: Track and review past evaluations
- **Batch Processing**: Upload JSON datasets for bulk analysis
- **Capital One Branding**: Professional UI with brand-aligned colors
- **Card Dashboard Design**: Modern fintech aesthetic with clean separation

---

## Tech Stack

**Backend:**
- FastAPI (Python 3.10+)
- Pydantic for validation
- Rule-based fraud engine

**Frontend:**
- React 18 + TypeScript
- Vite for fast development
- Clean component architecture

---

## Project Structure

```
creditguard/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI endpoints
│   │   ├── schemas.py           # Pydantic models
│   │   ├── services/
│   │   │   ├── fraud_engine.py  # Orchestration layer
│   │   │   └── rules/           # Individual fraud rules
│   │   └── utils/
│   │       └── scoring.py       # Risk level mapping
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── App.tsx              # Main component
    │   ├── api.ts               # API client
    │   ├── types.ts             # TypeScript types
    │   └── components/          # UI components
    └── package.json
```

---

## Quick Start

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**

API docs available at: **http://localhost:8000/docs**

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## Architecture

### Request Flow

```
User Input → FastAPI → FraudEngine → Rules → Scoring → Response
```

### Rules Engine

Each rule is independent and follows the **Strategy Pattern**:

**Critical Fraud Signals:**
1. **ImpossibleTravelRule** (70 points): Detects geographically impossible transactions
   - Example: NYC → London in 30 minutes
   - Uses distance/time calculation with max speed threshold

2. **VelocityRule** (50 points): Flags >3 transactions in 10 minutes
   - Catches card testing and rapid fraudulent spending
   - Industry-standard fraud pattern

**Geographic & Behavioral Patterns:**
3. **CountryChangeRule** (40 points): Flags high-risk countries
   - Based on known fraud hotspots

4. **RoundAmountRule** (35 points): Detects card testing patterns
   - Flags suspicious round amounts ($1, $5, $10, etc.)
   - Legitimate purchases rarely use exact dollar amounts

**Amount & Time Patterns:**
5. **HighAmountRule** (30 points): Flags transactions above $1000
   - Large amounts carry higher fraud risk

6. **UnusualTimeRule** (25 points): Detects transactions at 1 AM - 5 AM
   - Fraudsters often operate during early morning hours

Rules are easily extensible by implementing `BaseRule`.

### Scoring System

```
Total Score = Sum of triggered rule weights

Risk Levels:
- LOW:    0-49 points
- MEDIUM: 50-99 points
- HIGH:   100+ points

Maximum possible score: 280 points (all rules triggered)
```

---

## API Endpoints

### `POST /evaluate`

Evaluate a single transaction.

**Request:**
```json
{
  "user_id": "user_12345",
  "amount": 1500.00,
  "currency": "USD",
  "country": "US",
  "merchant": "Electronics Store",
  "timestamp": "2024-01-15T10:30:00"
}
```

**Response:**
```json
{
  "user_id": "user_12345",
  "risk_level": "MEDIUM",
  "total_score": 30,
  "triggered_rules": [
    {
      "rule_name": "High Amount Rule",
      "reason": "Transaction amount $1500.00 exceeds threshold $1000.00",
      "score_contribution": 30
    }
  ],
  "timestamp": "2024-01-15T10:30:05"
}
```

### `POST /batch-evaluate`

Evaluate multiple transactions (batch mode).

### `GET /rules`

List all active fraud detection rules.

---

## Design Trade-offs

### What This System Does Well:
- **Explainability**: Every decision has clear reasons
- **Simplicity**: Easy to understand and modify
- **Fast iteration**: Add/remove rules quickly
- **No external dependencies**: No database needed for demo

### Known Limitations (Discussion Points):
- **Rule-based vs ML**: Static thresholds vs learned patterns
- **In-memory storage**: Velocity rule uses dict (use Redis in production)
- **No historical context**: Limited user behavior analysis
- **Sequential processing**: Could be parallelized for scale

### Future Improvements:
1. **Machine Learning**: Train models on historical fraud data
2. **Real-time streaming**: Kafka + Flink for event processing
3. **Graph analysis**: Network effects (linked accounts)
4. **Feature store**: Centralized feature computation
5. **A/B testing**: Compare rule versions

---

## Demo Scenarios

### Scenario 1: Single Transaction - Low Risk
```
User: user_123
Amount: $50
Country: US
→ No rules triggered, LOW risk
```

### Scenario 2: Single Transaction - High Risk
```
User: user_123
Amount: $2500
Country: XX (high-risk)
Multiple transactions in 5 minutes
→ All rules triggered, HIGH risk
```

### Scenario 3: Batch Processing
```
Upload sample-transactions.json (8 transactions)
→ Shows breakdown: X HIGH, Y MEDIUM, Z LOW
→ All results saved to transaction history
→ Demonstrates batch analysis capability
```

---

## Testing the System

### Single Transaction Testing
1. Start backend and frontend
2. Use default values (LOW risk)
3. Change amount to 1500 (triggers HIGH amount rule)
4. Submit 4 transactions quickly (triggers VELOCITY rule)
5. Change country to "XX" (triggers COUNTRY rule)
6. View results in Transaction History

### Batch Processing Testing
1. Click "Choose JSON File" in the Batch Evaluation card
2. Upload `sample-transactions.json` from project root
3. View summary showing HIGH/MEDIUM/LOW breakdown
4. Check Transaction History to see all 8 transactions
5. Click "Clear History" to reset

---

## Presentation Talking Points

### Architecture Discussion:
- Why separate rules from engine?
- How would you add a new rule?
- Trade-offs: rules vs ML models

### Scalability:
- How would this handle 10,000 TPS?
- Where are the bottlenecks?
- What persistence layer would you add?

### Production Readiness:
- What's missing for production?
- How would you monitor this?
- Security considerations?

---

## Built With

- FastAPI for clean REST APIs
- Pydantic for data validation
- React + TypeScript for type-safe frontend
- Strategy pattern for extensible rules

---

**Author**: Built for Capital One Assessment Centre
**Purpose**: Demonstrate clean architecture, engineering reasoning, and communication skills
