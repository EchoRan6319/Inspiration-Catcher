import Taro from '@tarojs/taro'

const STORAGE_KEYS = {
  INSPIRATIONS: 'inspiration_tracker_inspirations',
  AI_CONFIG: 'inspiration_tracker_ai_config',
}

export function storageGet(key, defaultValue) {
  try {
    const item = Taro.getStorageSync(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function storageSet(key, value) {
  try {
    Taro.setStorageSync(key, JSON.stringify(value))
  } catch (error) {
    console.error('Failed to save to storage:', error)
  }
}

export function storageRemove(key) {
  try {
    Taro.removeStorageSync(key)
  } catch (error) {
    console.error('Failed to remove from storage:', error)
  }
}

export function getInspirations() {
  const inspirations = storageGet(STORAGE_KEYS.INSPIRATIONS, [])
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

export function saveInspirations(inspirations) {
  storageSet(STORAGE_KEYS.INSPIRATIONS, inspirations)
}

export function getAIConfig() {
  return storageGet(STORAGE_KEYS.AI_CONFIG, null)
}

export function saveAIConfig(config) {
  storageSet(STORAGE_KEYS.AI_CONFIG, config)
}

export function removeAIConfig() {
  storageRemove(STORAGE_KEYS.AI_CONFIG)
}