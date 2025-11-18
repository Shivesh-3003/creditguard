/**
 * Transaction input form component.
 * Clean, simple form with validation.
 */
import { useState, FormEvent } from 'react';
import { Transaction } from '../types';

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  isLoading: boolean;
}

export default function TransactionForm({ onSubmit, isLoading }: TransactionFormProps) {
  const [formData, setFormData] = useState<Transaction>({
    user_id: 'user_12345',
    amount: 500,
    currency: 'USD',
    country: 'US',
    merchant: 'Online Store',
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Transaction Details</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>User ID</label>
        <input
          type="text"
          value={formData.user_id}
          onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#004879'}
          onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Amount</label>
        <input
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#004879'}
          onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Currency</label>
        <input
          type="text"
          maxLength={3}
          value={formData.currency}
          onChange={(e) => setFormData({ ...formData, currency: e.target.value.toUpperCase() })}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#004879'}
          onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Country Code</label>
        <input
          type="text"
          maxLength={2}
          value={formData.country}
          onChange={(e) => setFormData({ ...formData, country: e.target.value.toUpperCase() })}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#004879'}
          onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Merchant</label>
        <input
          type="text"
          value={formData.merchant}
          onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
          style={styles.input}
          onFocus={(e) => e.target.style.borderColor = '#004879'}
          onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        style={{
          ...styles.button,
          opacity: isLoading ? 0.6 : 1,
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(212,0,42,0.35)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(212,0,42,0.25)';
        }}
        onMouseDown={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = 'translateY(0) scale(0.98)';
          }
        }}
        onMouseUp={(e) => {
          if (!isLoading) {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1)';
          }
        }}
      >
        {isLoading ? 'Evaluating...' : 'Evaluate Transaction'}
      </button>
    </form>
  );
}

const styles = {
  form: {
    backgroundColor: '#ffffff',
    padding: '28px',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    maxWidth: '420px',
    border: '1px solid #E5E5E5',
  },
  heading: {
    margin: '0 0 24px 0',
    fontSize: '22px',
    fontWeight: 600,
    color: '#004879',
    borderBottom: '2px solid #D4002A',
    paddingBottom: '12px',
  },
  formGroup: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#004879',
    letterSpacing: '0.3px',
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '15px',
    border: '2px solid #E5E5E5',
    borderRadius: '6px',
    boxSizing: 'border-box' as const,
    transition: 'all 0.2s ease',
    fontFamily: 'inherit',
  } as React.CSSProperties & { ':focus'?: React.CSSProperties },
  button: {
    width: '100%',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 700,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #D4002A 0%, #A30021 100%)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '12px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(212,0,42,0.25)',
    letterSpacing: '0.5px',
  },
};
