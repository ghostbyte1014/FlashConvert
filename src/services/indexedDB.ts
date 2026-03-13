import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface ExchangeRate {
  base: string
  updated_at: string
  rates: Record<string, number>
}

interface FlashConvertDB extends DBSchema {
  exchangeRates: {
    key: string
    value: {
      id: string
      base: string
      updated_at: string
      rates: Record<string, number>
      fetchedAt: number
    }
  }
}

const DB_NAME = 'flashconvert-db'
const DB_VERSION = 1
const STORE_NAME = 'exchangeRates'
const RATE_KEY = 'latest-rates'

let dbPromise: Promise<IDBPDatabase<FlashConvertDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<FlashConvertDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      },
    })
  }
  return dbPromise
}

export async function saveExchangeRates(rates: ExchangeRate): Promise<void> {
  const db = await getDB()
  await db.put(STORE_NAME, {
    id: RATE_KEY,
    base: rates.base,
    updated_at: rates.updated_at,
    rates: rates.rates,
    fetchedAt: Date.now(),
  }, RATE_KEY)
}

export async function getExchangeRates(): Promise<ExchangeRate | null> {
  const db = await getDB()
  const data = await db.get(STORE_NAME, RATE_KEY)
  
  if (!data) return null
  
  return {
    base: data.base,
    updated_at: data.updated_at,
    rates: data.rates,
  }
}

export async function getStoredRatesAge(): Promise<number | null> {
  const db = await getDB()
  const data = await db.get(STORE_NAME, RATE_KEY)
  
  if (!data) return null
  
  return Date.now() - data.fetchedAt
}

export async function hasStoredRates(): Promise<boolean> {
  const db = await getDB()
  const data = await db.get(STORE_NAME, RATE_KEY)
  return !!data
}

export async function isRatesDataStale(hoursOld: number = 24): Promise<boolean> {
  const age = await getStoredRatesAge()
  if (age === null) return true
  const msOld = hoursOld * 60 * 60 * 1000
  return age > msOld
}
