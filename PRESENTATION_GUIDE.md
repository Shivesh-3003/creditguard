# CreditGuard - Assessment Centre Presentation Guide

Quick reference for presenting your project professionally.

---

## 🎯 Opening (1 minute)

**"I built CreditGuard, a rule-based fraud detection system for credit card transactions."**

**Key Points:**
- Demonstrates clean backend architecture
- Uses FastAPI + React + TypeScript
- Focus on clarity, not complexity
- Real-world applicable design patterns

---

## 🏗️ Architecture Overview (2-3 minutes)

### System Flow
```
User Input → FastAPI → FraudEngine → Rules → Scoring → Risk Level
```

### Key Architectural Decisions

**1. Separation of Concerns**
- API layer (main.py) - HTTP handling only
- Service layer (fraud_engine.py) - Business logic
- Rules layer - Individual detection logic
- Clean interfaces between layers

**2. Strategy Pattern for Rules**
- Each rule is independent (BaseRule interface)
- Easy to add/remove rules without changing engine
- Each rule contributes a score

**3. No Database (Trade-off)**
- ✅ Faster development, simpler demo
- ✅ Stateless evaluation (except velocity)
- ❌ No persistent transaction history
- 💡 In production: Would use PostgreSQL/Redis

---

## 📊 Live Demo (3-4 minutes)

### Scenario 1: Normal Transaction
```
Amount: $50, Country: US
→ Result: LOW RISK (0 points)
```

### Scenario 2: High Amount
```
Amount: $1500, Country: US
→ Result: MEDIUM RISK (30 points)
→ Shows "High Amount Rule" triggered
```

### Scenario 3: Multiple Flags
```
Amount: $2500, Country: XX
→ Result: HIGH RISK (70 points)
→ Shows both rules triggered with explanations
```

### Scenario 4: Velocity Attack
```
Submit 4 transactions quickly
→ Shows velocity rule trigger on 4th transaction
```

---

## 💡 Design Trade-offs Discussion

### Rule-Based vs Machine Learning

**Why Rules for This Project:**
- ✅ Explainable (required for regulatory compliance)
- ✅ Fast to build and iterate
- ✅ No training data needed
- ✅ Deterministic behavior

**When to Use ML:**
- Complex patterns humans can't define
- Historical fraud data available
- Need to adapt to new fraud patterns
- Can sacrifice some explainability

### Current Limitations & Production Improvements

**Current State:**
1. In-memory velocity tracking (would use Redis)
2. Static country risk list (would use live threat intel)
3. Fixed thresholds (would A/B test different values)
4. Sequential processing (would parallelize for scale)

**Production Architecture Would Add:**
1. **Persistence**: PostgreSQL for transactions, Redis for real-time state
2. **Streaming**: Kafka for event processing
3. **Monitoring**: Prometheus metrics, fraud rate tracking
4. **Feature Store**: Centralized user behavior features
5. **A/B Testing**: Compare rule versions
6. **ML Layer**: Complementary neural network for anomaly detection

---

## 🔧 Extensibility Demo

**"How would you add a new rule?"**

```python
class MerchantRiskRule(BaseRule):
    def __init__(self, score_weight: int = 35):
        super().__init__(score_weight)
        self.high_risk_merchants = {"Casino", "Crypto"}

    @property
    def name(self) -> str:
        return "Merchant Risk Rule"

    def evaluate(self, transaction: Transaction) -> Optional[RuleTrigger]:
        if transaction.merchant in self.high_risk_merchants:
            return RuleTrigger(
                rule_name=self.name,
                reason=f"High-risk merchant: {transaction.merchant}",
                score_contribution=self.score_weight
            )
        return None
```

**Then add to engine:**
```python
fraud_engine.add_rule(MerchantRiskRule())
```

---

## 📈 Scalability Discussion

### Current Throughput
- Single instance: ~1,000 TPS (sufficient for demo)
- Bottleneck: In-memory velocity storage

### Scaling to Production

**Horizontal Scaling:**
```
Load Balancer
    ↓
[API] [API] [API]  (Stateless FastAPI instances)
    ↓
Redis Cluster      (Shared velocity state)
    ↓
PostgreSQL         (Transaction history)
```

**Further Optimizations:**
1. **Async Processing**: FastAPI async/await
2. **Caching**: Redis for rule results
3. **Batching**: Batch evaluate for efficiency
4. **Event Streaming**: Kafka for real-time processing
5. **Geographic Distribution**: Multi-region deployment

---

## 🛡️ Security Considerations

**Not Implemented (Time Constraint):**
- Authentication/Authorization (would use OAuth2)
- Rate limiting (would use Redis)
- Input sanitization (Pydantic provides some)
- Audit logging (who evaluated what)

**Would Add:**
```python
@app.post("/evaluate")
async def evaluate_transaction(
    transaction: Transaction,
    user: User = Depends(get_current_user)  # OAuth2
):
    # Log audit trail
    await audit_log.record(user.id, transaction)
    # Rate limit check
    await rate_limiter.check(user.id)
    # Evaluate
    result = fraud_engine.evaluate(transaction)
    return result
```

---

## 📝 Code Quality Highlights

**Show in IDE:**
1. **Type Safety**: Pydantic + TypeScript end-to-end
2. **Clear Naming**: `FraudEngine`, `evaluate()`, `RuleTrigger`
3. **Comments**: Trade-offs documented in code
4. **Single Responsibility**: Each class has one job
5. **DRY Principle**: BaseRule prevents duplication

---

## 🎤 Common Questions & Answers

**Q: Why not use a pre-built fraud detection service?**
A: This demonstrates architectural thinking and engineering skills. Pre-built services are black boxes.

**Q: How would you handle false positives?**
A: Add feedback loop - let analysts mark false positives, use to tune thresholds or train ML model.

**Q: What if a rule is too slow?**
A: Use timeout decorator, skip rule if exceeds threshold, log metric. Add circuit breaker pattern.

**Q: How do you test this?**
A: Unit tests for each rule, integration tests for engine, load tests for API. Mock transactions for edge cases.

**Q: What about data privacy?**
A: Anonymize user_id, encrypt PII, comply with PCI DSS. Separate fraud detection from sensitive data storage.

---

## ✨ Closing Statement

**"This project demonstrates my ability to:"**
1. Design clean, maintainable backend systems
2. Make and explain engineering trade-offs
3. Build end-to-end working applications
4. Think about production readiness and scale
5. Communicate technical concepts clearly

**"While this is simplified for a one-day build, the patterns and thinking extend to production systems."**

---

## 🚀 Quick Setup for Demo

```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn app.main:app --reload

# Terminal 2 - Frontend
cd frontend
npm run dev

# Terminal 3 - Test (Optional)
cd backend
python test_api.py
```

**URLs:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

**Good luck with your assessment centre! 🎯**
