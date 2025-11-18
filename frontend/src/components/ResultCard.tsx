/**
 * Result display component.
 * Shows fraud evaluation results with visual risk indicator.
 */
import { FraudResult } from '../types';

interface ResultCardProps {
  result: FraudResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const riskColor = getRiskColor(result.risk_level);

  return (
    <div style={styles.card}>
      <h2 style={styles.heading}>Fraud Evaluation Result</h2>

      <div style={{ ...styles.riskBadge, backgroundColor: riskColor }}>
        {result.risk_level} RISK
      </div>

      <div style={styles.scoreSection}>
        <span style={styles.label}>Total Risk Score:</span>
        <span style={styles.scoreValue}>{result.total_score}</span>
      </div>

      <div style={styles.rulesSection}>
        <h3 style={styles.subheading}>Triggered Rules</h3>
        {result.triggered_rules.length === 0 ? (
          <p style={styles.noRules}>No suspicious patterns detected</p>
        ) : (
          <ul style={styles.rulesList}>
            {result.triggered_rules.map((rule, index) => (
              <li key={index} style={styles.ruleItem}>
                <strong>{rule.rule_name}</strong> (+{rule.score_contribution} points)
                <br />
                <span style={styles.ruleReason}>{rule.reason}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={styles.footer}>
        <small style={styles.timestamp}>
          Evaluated at: {new Date(result.timestamp).toLocaleString()}
        </small>
      </div>
    </div>
  );
}

function getRiskColor(level: string): string {
  switch (level) {
    case 'HIGH':
      return '#D4002A'; // Capital One red
    case 'MEDIUM':
      return '#FF6F3C'; // Warning orange
    case 'LOW':
      return '#00AC4E'; // Success green
    default:
      return '#6c757d';
  }
}

const styles = {
  card: {
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    maxWidth: '540px',
    border: '1px solid #E5E5E5',
  },
  heading: {
    margin: '0 0 20px 0',
    fontSize: '22px',
    fontWeight: 600,
    color: '#004879',
    borderBottom: '2px solid #D4002A',
    paddingBottom: '12px',
  },
  riskBadge: {
    display: 'inline-block',
    padding: '12px 24px',
    borderRadius: '8px',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '18px',
    marginBottom: '20px',
    letterSpacing: '1px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  },
  scoreSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 20px',
    backgroundColor: '#F7F7F7',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #E5E5E5',
  },
  label: {
    fontSize: '15px',
    fontWeight: 600,
    color: '#004879',
  },
  scoreValue: {
    fontSize: '32px',
    fontWeight: 700,
    color: '#D4002A',
  },
  rulesSection: {
    marginTop: '20px',
  },
  subheading: {
    fontSize: '17px',
    fontWeight: 600,
    marginBottom: '14px',
    color: '#004879',
  },
  noRules: {
    color: '#00AC4E',
    fontStyle: 'italic' as const,
    margin: '12px 0',
    fontSize: '15px',
    fontWeight: 500,
  },
  rulesList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  ruleItem: {
    padding: '14px 16px',
    backgroundColor: '#FFF5F5',
    borderLeft: '4px solid #D4002A',
    marginBottom: '10px',
    borderRadius: '6px',
    fontSize: '14px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  ruleReason: {
    color: '#666',
    fontSize: '13px',
    marginTop: '4px',
    display: 'block',
  },
  footer: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '2px solid #E5E5E5',
  },
  timestamp: {
    color: '#004879',
    fontSize: '12px',
    fontWeight: 500,
  },
};
