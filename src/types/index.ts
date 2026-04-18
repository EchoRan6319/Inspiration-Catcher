
export interface Attachment {
  id: string
  type: 'image' | 'audio'
  dataUrl: string
  fileName: string
  createdAt: Date
}

export interface Inspiration {
  id: string
  content: string
  tags: string[]
  emotion: 'excited' | 'calm' | 'curious' | 'anxious' | 'neutral'
  color: string
  createdAt: Date
  updatedAt: Date
  supplements: Supplement[]
  attachments: Attachment[]
  aiAnalysis?: AIAnalysis
}

export interface Supplement {
  id: string
  content: string
  type: 'thought' | 'link' | 'progress' | 'note'
  attachments: Attachment[]
  createdAt: Date
}

export interface AIAnalysis {
  summary: string
  keywords: string[]
  categories: string[]
  suggestions: string[]
}

export interface AIConfig {
  provider: 'wenxin' | 'tongyi' | 'zhipu' | 'deepseek' | 'openai' | 'gemini' | 'custom'
  apiKey: string
  model?: string
  apiUrl?: string
}

export const EMOTION_OPTIONS = [
  { value: 'excited', label: '兴奋', color: '#f59e0b' },
  { value: 'calm', label: '平静', color: '#0ea5e9' },
  { value: 'curious', label: '好奇', color: '#6366f1' },
  { value: 'anxious', label: '焦虑', color: '#ef4444' },
  { value: 'neutral', label: '中性', color: '#6b7280' },
] as const

export const COLOR_OPTIONS = [
  '#6366f1',
  '#f59e0b',
  '#ec4899',
  '#0ea5e9',
  '#10b981',
  '#8b5cf6',
  '#f97316',
  '#14b8a6',
] as const

export const SUPPLEMENT_TYPES = [
  { value: 'thought', label: '想法' },
  { value: 'link', label: '链接' },
  { value: 'progress', label: '进展' },
  { value: 'note', label: '笔记' },
] as const
