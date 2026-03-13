export interface ExchangeRate {
  base: string
  updated_at: string
  rates: Record<string, number>
}

const API_BASE = '/api'

export async function fetchExchangeRates(): Promise<ExchangeRate> {
  // Using direct public API for live currency rates
  const response = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json')
  
  if (!response.ok) {
    throw new Error(`Failed to fetch exchange rates: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  return {
    base: 'USD',
    updated_at: data.date,
    rates: data.usd
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/health`)
    return response.ok
  } catch {
    return false
  }
}

export function isOnline(): boolean {
  return navigator.onLine
}
