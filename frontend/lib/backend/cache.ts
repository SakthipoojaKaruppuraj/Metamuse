// In-memory cache for server-side operations
// Useful to hold block timestamps, collection data, and analysis results during execution

class MemoryCache {
  private store: Map<string, any>

  constructor() {
    this.store = new Map()
  }

  get<T = any>(key: string): T | null {
    if (this.store.has(key)) {
      return this.store.get(key) as T
    }
    return null
  }

  set<T = any>(key: string, value: T): void {
    this.store.set(key, value)
  }

  has(key: string): boolean {
    return this.store.has(key)
  }

  clear(): void {
    this.store.clear()
  }
}

// Instantiate global singleton cache
export const serverCache = new MemoryCache()
