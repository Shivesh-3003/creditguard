/**
 * Main App component - Card Dashboard Design
 * Professional fintech layout with transaction history and batch processing
 */
import { useState } from "react";
import TransactionForm from "./components/TransactionForm";
import ResultCard from "./components/ResultCard";
import TransactionHistory from "./components/TransactionHistory";
import DatasetImport from "./components/DatasetImport";
import { Transaction, FraudResult } from "./types";
import { evaluateTransaction, batchEvaluateTransactions } from "./api";

function App() {
  const [result, setResult] = useState<FraudResult | null>(null);
  const [history, setHistory] = useState<FraudResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEvaluate = async (transaction: Transaction) => {
    setIsLoading(true);
    setError(null);

    try {
      const fraudResult = await evaluateTransaction(transaction);
      setResult(fraudResult);
      setHistory((prev) => [...prev, fraudResult]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to evaluate transaction"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBatchEvaluate = async (
    transactions: Transaction[]
  ): Promise<FraudResult[]> => {
    const results = await batchEvaluateTransactions(transactions);
    setHistory((prev) => [...prev, ...results]);
    return results;
  };

  const handleClearHistory = () => {
    setHistory([]);
    setResult(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>
              <span style={styles.icon}>🛡️</span> CreditGuard
            </h1>
            <p style={styles.subtitle}>Rule-Based Fraud Detection System</p>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {/* Transaction Form */}
        <div style={styles.gridItem}>
          <TransactionForm onSubmit={handleEvaluate} isLoading={isLoading} />
        </div>

        {/* Result Card */}
        <div style={styles.gridItem}>
          {error && (
            <div style={styles.error}>
              <strong>⚠️ Error:</strong> {error}
            </div>
          )}

          {result && <ResultCard result={result} />}

          {!result && !error && (
            <div style={styles.placeholder}>
              <span style={{ fontSize: "48px", marginBottom: "16px" }}>📊</span>
              <p>
                Enter transaction details or upload a dataset to begin
                evaluation
              </p>
            </div>
          )}
        </div>

        {/* Batch Import */}
        <div style={styles.gridItem}>
          <DatasetImport onBatchEvaluate={handleBatchEvaluate} />
        </div>

        {/* Transaction History */}
        <div style={styles.gridItemFull}>
          <TransactionHistory history={history} onClear={handleClearHistory} />
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#F7F7F7",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    background: "linear-gradient(135deg, #D4002A 0%, #A30021 100%)",
    color: "#ffffff",
    padding: "32px 24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  headerContent: {
    maxWidth: "1400px",
    margin: "0 auto",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "36px",
    fontWeight: 700,
    letterSpacing: "-0.5px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  icon: {
    fontSize: "36px",
  },
  subtitle: {
    margin: 0,
    fontSize: "16px",
    opacity: 0.95,
    fontWeight: 400,
  },
  main: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    padding: "24px",
    maxWidth: "1600px",
    margin: "0 auto",
  },
  gridItem: {
    minWidth: 0, // Prevents grid blowout
  },
  gridItemFull: {
    gridColumn: "1 / -1", // Span all columns
  },
  error: {
    backgroundColor: "#FEE",
    color: "#D4002A",
    padding: "16px 20px",
    borderRadius: "8px",
    border: "2px solid #D4002A",
    fontWeight: 500,
    boxShadow: "0 2px 8px rgba(212,0,42,0.15)",
  },
  placeholder: {
    backgroundColor: "#ffffff",
    padding: "40px 24px",
    borderRadius: "12px",
    textAlign: "center" as const,
    color: "#666",
    boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
  },
};

export default App;
