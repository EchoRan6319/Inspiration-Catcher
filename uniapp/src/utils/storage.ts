
import type { Inspiration, AIConfig } from '../types'

const STORAGE_KEYS = {
  INSPIRATIONS: 'inspiration_tracker_inspirations',
  AI_CONFIG: 'inspiration_tracker_ai_config',
}

export function storageGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : defaultValue
  } catch {
    return defaultValue
  }
}

export function storageSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to localStorage:', error)
  }
}

export function storageRemove(key: string): void {
  localStorage.removeItem(key)
}

export function getInspirations(): Inspiration[] {
  const inspirations = storageGet<Inspiration[]>(STORAGE_KEYS.INSPIRATIONS, [])
  return inspirations.map((insp) => ({
    ...insp,
    createdAt: new Date(insp.createdAt),
    updatedAt: new Date(insp.updatedAt),
    supplements: (insp.supplements || []).map((sup) => ({
      ...sup,
      createdAt: new Date(sup.createdAt),
      attachments: (sup.attachments || []).map((att) => ({
        ...att,
        createdAt: new Date(att.createdAt),
      })),
    })),
    attachments: (insp.attachments || []).map((att) => ({
      ...att,
      createdAt: new Date(att.createdAt),
    })),
  }))
}

export function saveInspirations(inspirations: Inspiration[]): void {
  storageSet(STORAGE_KEYS.INSPIRATIONS, inspirations)
}

export function getAIConfig(): AIConfig | null {
  return storageGet<AIConfig | null>(STORAGE_KEYS.AI_CONFIG, null)
}

export function saveAIConfig(config: AIConfig): void {
  storageSet(STORAGE_KEYS.AI_CONFIG, config)
}

export function removeAIConfig(): void {
  storageRemove(STORAGE_KEYS.AI_CONFIG)
}
