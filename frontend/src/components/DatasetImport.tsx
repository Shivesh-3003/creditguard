/**
 * Dataset Import Component
 * Allows batch evaluation of transactions from JSON file
 */
import { useState } from 'react';
import { Transaction, FraudResult } from '../types';

interface DatasetImportProps {
  onBatchEvaluate: (transactions: Transaction[]) => Promise<FraudResult[]>;
}

export default function DatasetImport({ onBatchEvaluate }: DatasetImportProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<FraudResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Support both single object and array
      const transactions: Transaction[] = Array.isArray(data) ? data : [data];

      const batchResults = await onBatchEvaluate(transactions);
      setResults(batchResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsProcessing(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const getSummary = () => {
    if (!results) return null;

    const high = results.filter(r => r.risk_level === 'HIGH').length;
    const medium = results.filter(r => r.risk_level === 'MEDIUM').length;
    const low = results.filter(r => r.risk_level === 'LOW').length;

    return { high, medium, low, total: results.length };
  };

  const summary = getSummary();

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Batch Evaluation</h2>
      <p style={styles.description}>Upload a JSON file with transaction data for bulk analysis</p>

      <div style={styles.uploadSection}>
        <label htmlFor="file-upload" style={styles.uploadButton}>
          {isProcessing ? 'Processing...' : 'Choose JSON File'}
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          disabled={isProcessing}
          style={styles.fileInput}
        />
      </div>

      {error && (
        <div style={styles.error}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {summary && (
        <div style={styles.results}>
          <h3 style={styles.resultsHeading}>Batch Results</h3>
          <div style={styles.summaryGrid}>
            <div style={styles.summaryCard}>
              <div style={styles.summaryNumber}>{summary.total}</div>
              <div style={styles.summaryLabel}>Total</div>
            </div>
            <div style={{ ...styles.summaryCard, borderLeft: '3px solid #D4002A' }}>
              <div style={{ ...styles.summaryNumber, color: '#D4002A' }}>{summary.high}</div>
              <div style={styles.summaryLabel}>High Risk</div>
            </div>
            <div style={{ ...styles.summaryCard, borderLeft: '3px solid #FF6F3C' }}>
              <div style={{ ...styles.summaryNumber, color: '#FF6F3C' }}>{summary.medium}</div>
              <div style={styles.summaryLabel}>Medium Risk</div>
            </div>
            <div style={{ ...styles.summaryCard, borderLeft: '3px solid #00AC4E' }}>
              <div style={{ ...styles.summaryNumber, color: '#00AC4E' }}>{summary.low}</div>
              <div style={styles.summaryLabel}>Low Risk</div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.hint}>
        <strong>Example JSON format:</strong>
        <pre style={styles.codeBlock}>
{`[
  {
    "user_id": "user_001",
    "amount": 1500,
    "currency": "USD",
    "country": "US",
    "merchant": "Store"
  }
]`}
        </pre>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #E5E5E5',
  },
  heading: {
    margin: '0 0 8px 0',
    fontSize: '20px',
    fontWeight: 600,
    color: '#004879',
  },
  description: {
    margin: '0 0 20px 0',
    fontSize: '14px',
    color: '#666',
  },
  uploadSection: {
    marginBottom: '20px',
  },
  uploadButton: {
    display: 'inline-block',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 600,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #004879 0%, #003057 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0,72,121,0.25)',
  },
  fileInput: {
    display: 'none',
  },
  error: {
    backgroundColor: '#FEE',
    color: '#D4002A',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #D4002A',
    fontSize: '14px',
    marginBottom: '16px',
  },
  results: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '2px solid #E5E5E5',
  },
  resultsHeading: {
    margin: '0 0 16px 0',
    fontSize: '17px',
    fontWeight: 600,
    color: '#004879',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
  },
  summaryCard: {
    padding: '16px',
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
    textAlign: 'center' as const,
  },
  summaryNumber: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#004879',
    marginBottom: '4px',
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#666',
    fontWeight: 500,
  },
  hint: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
    fontSize: '13px',
    color: '#666',
  },
  codeBlock: {
    marginTop: '8px',
    padding: '12px',
    backgroundColor: '#fff',
    border: '1px solid #E5E5E5',
    borderRadius: '6px',
    fontSize: '12px',
    fontFamily: 'monospace',
    overflowX: 'auto' as const,
    color: '#004879',
  },
};
