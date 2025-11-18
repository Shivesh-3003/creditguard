/**
 * API client for CreditGuard backend.
 * Clean separation: All API calls centralized here.
 */
import { Transaction, FraudResult } from './types';

const API_BASE_URL = 'http://localhost:8000';

export async function evaluateTransaction(transaction: Transaction): Promise<FraudResult> {
  const response = await fetch(`${API_BASE_URL}/evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}

export async function batchEvaluateTransactions(transactions: Transaction[]): Promise<FraudResult[]> {
  const response = await fetch(`${API_BASE_URL}/batch-evaluate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(transactions),
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
}
