/**
 * Transaction History Component
 * Displays recent transaction evaluations with expandable details
 */
import { useState } from 'react';
import { FraudResult } from '../types';

interface TransactionHistoryProps {
  history: FraudResult[];
  onClear: () => void;
}

export default function TransactionHistory({ history, onClear }: TransactionHistoryProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (history.length === 0) {
    return (
      <div style={styles.card}>
        <h2 style={styles.heading}>Transaction History</h2>
        <p style={styles.emptyState}>No transactions evaluated yet</p>
      </div>
    );
  }

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.heading}>Transaction History</h2>
        <button
          onClick={onClear}
          style={styles.clearButton}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#D4002A';
            e.currentTarget.style.color = '#fff';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(212,0,42,0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#D4002A';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(0.95)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px) scale(1)';
          }}
        >
          Clear History
        </button>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}></th>
              <th style={styles.th}>User ID</th>
              <th style={styles.th}>Risk</th>
              <th style={styles.th}>Score</th>
              <th style={styles.th}>Rules</th>
              <th style={styles.th}>Time</th>
            </tr>
          </thead>
          <tbody>
            {history.slice(-10).reverse().map((result, index) => (
              <>
                <tr
                  key={index}
                  style={{
                    ...styles.row,
                    cursor: 'pointer',
                    backgroundColor: expandedIndex === index ? '#F7F7F7' : 'transparent',
                  }}
                  onClick={() => toggleExpand(index)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFAFA'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = expandedIndex === index ? '#F7F7F7' : 'transparent'}
                >
                  <td style={styles.tdIcon}>
                    <span style={{
                      ...styles.chevron,
                      transform: expandedIndex === index ? 'rotate(90deg)' : 'rotate(0deg)',
                    }}>
                      ▶
                    </span>
                  </td>
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
                  <td style={styles.td}>
                    <span style={styles.ruleCount}>
                      {result.triggered_rules.length}
                    </span>
                  </td>
                  <td style={styles.tdTime}>
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </td>
                </tr>
                {expandedIndex === index && (
                  <tr key={`${index}-details`}>
                    <td colSpan={6} style={styles.expandedCell}>
                      <div style={styles.detailsContainer}>
                        <h4 style={styles.detailsHeading}>Triggered Rules:</h4>
                        {result.triggered_rules.length === 0 ? (
                          <p style={styles.noRules}>✓ No suspicious patterns detected</p>
                        ) : (
                          <div style={styles.rulesList}>
                            {result.triggered_rules.map((rule, ruleIndex) => (
                              <div key={ruleIndex} style={styles.ruleItem}>
                                <div style={styles.ruleHeader}>
                                  <strong style={styles.ruleName}>{rule.rule_name}</strong>
                                  <span style={styles.ruleScore}>+{rule.score_contribution} pts</span>
                                </div>
                                <p style={styles.ruleReason}>{rule.reason}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
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
    transition: 'background-color 0.2s ease',
  },
  td: {
    padding: '12px 8px',
    color: '#333',
  },
  tdIcon: {
    padding: '12px 8px',
    width: '30px',
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
  ruleCount: {
    fontWeight: 600,
    color: '#004879',
  },
  chevron: {
    display: 'inline-block',
    fontSize: '10px',
    color: '#004879',
    transition: 'transform 0.2s ease',
  },
  expandedCell: {
    padding: 0,
    backgroundColor: '#FAFAFA',
  },
  detailsContainer: {
    padding: '16px 24px',
    borderTop: '2px solid #E5E5E5',
  },
  detailsHeading: {
    margin: '0 0 12px 0',
    fontSize: '14px',
    fontWeight: 600,
    color: '#004879',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  noRules: {
    color: '#00AC4E',
    fontStyle: 'italic' as const,
    margin: 0,
  },
  rulesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  ruleItem: {
    backgroundColor: '#fff',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #E5E5E5',
    borderLeft: '3px solid #D4002A',
  },
  ruleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '6px',
  },
  ruleName: {
    fontSize: '14px',
    color: '#004879',
  },
  ruleScore: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#D4002A',
  },
  ruleReason: {
    margin: 0,
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.5',
  },
};
