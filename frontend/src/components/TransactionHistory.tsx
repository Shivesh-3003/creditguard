/**
 * Transaction History Component
 * Displays recent transaction evaluations
 */
import { FraudResult } from '../types';

interface TransactionHistoryProps {
  history: FraudResult[];
  onClear: () => void;
}

export default function TransactionHistory({ history, onClear }: TransactionHistoryProps) {
  if (history.length === 0) {
    return (
      <div style={styles.card}>
        <h2 style={styles.heading}>Transaction History</h2>
        <p style={styles.emptyState}>No transactions evaluated yet</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Transaction History</h2>
        <button onClick={onClear} style={styles.clearButton}>
          Clear History
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Risk</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Rules</th>
              <th style={styles.th}>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(-10).reverse().map((result, index) => (
              <tr key={index} style={styles.row}>
                <td style={styles.td}>{result.user_id}</td>
                <td style={styles.td}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: getRiskColor(result.risk_level),
                  }}>
                    {result.risk_level}
                  </span>
                </td>
                <td style={styles.td}>{result.total_score}</td>
                <td style={styles.td}>{result.triggered_rules.length}</td>
                <td style={styles.tdTime}>
                  {new Date(result.timestamp).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getRiskColor(level: string): string {
  switch (level) {
    case 'HIGH': return '#D4002A';
    case 'MEDIUM': return '#FF6F3C';
    case 'LOW': return '#00AC4E';
    default: return '#6c757d';
  }
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    padding: '24px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    border: '1px solid #E5E5E5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  heading: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#004879',
  },
  clearButton: {
    padding: '8px 16px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#D4002A',
    backgroundColor: 'transparent',
    border: '1px solid #D4002A',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    textAlign: 'center' as const,
    color: '#999',
    padding: '40px',
    fontStyle: 'italic' as const,
  },
  tableContainer: {
    overflowX: 'auto' as const,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '14px',
  },
  headerRow: {
    borderBottom: '2px solid #E5E5E5',
  },
  th: {
    textAlign: 'left' as const,
    padding: '12px 8px',
    fontWeight: 600,
    color: '#004879',
    fontSize: '13px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  row: {
    borderBottom: '1px solid #F0F0F0',
  },
  td: {
    padding: '12px 8px',
    color: '#333',
  },
  tdTime: {
    padding: '12px 8px',
    color: '#666',
    fontSize: '13px',
  },
  badge: {
    padding: '4px 10px',
    borderRadius: '4px',
    color: '#fff',
    fontSize: '12px',
    fontWeight: 700,
    display: 'inline-block',
  },
};
