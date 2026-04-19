import { computed } from 'vue'
import type { Inspiration, Supplement, Attachment } from '../types'
import { generateId, getRandomItem } from '../utils/helpers'
import { COLOR_OPTIONS } from '../types'
import { useStorage } from './useStorage'
import { demoInspirations } from '../utils/demoData'

// 将 readonly 数组转换为 mutable 数组
const colorOptions = [...COLOR_OPTIONS]

function createAttachment(dataUrl: string, fileName: string, type: 'image' | 'audio'): Attachment {
  return {
    id: generateId(),
    type,
    dataUrl,
    fileName,
    createdAt: new Date(),
  }
}

export function useInspiration() {
  const { inspirations } = useStorage()

  const allTags = computed(() => {
    const tags = new Set<string>()
    inspirations.value.forEach((insp) => {
      insp.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  })

  function getInspirationById(id: string): Inspiration | undefined {
    return inspirations.value.find((insp) => insp.id === id)
  }

  function createInspiration(
    content: string,
    tags: string[] = [],
    emotion: Inspiration['emotion'] = 'neutral'
  ): Inspiration {
    const now = new Date()
    const inspiration: Inspiration = {
      id: generateId(),
      content,
      tags,
      emotion,
      color: getRandomItem(colorOptions),
      createdAt: now,
      updatedAt: now,
      supplements: [],
      attachments: [],
    }
    inspirations.value.unshift(inspiration)
    return inspiration
  }

  function updateInspiration(id: string, updates: Partial<Omit<Inspiration, 'id' | 'createdAt'>>) {
    const index = inspirations.value.findIndex((insp) => insp.id === id)
    if (index !== -1) {
      inspirations.value[index] = {
        ...inspirations.value[index],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  function deleteInspiration(id: string) {
    const index = inspirations.value.findIndex((insp) => insp.id === id)
    if (index !== -1) {
      inspirations.value.splice(index, 1)
    }
  }

  function addSupplement(inspirationId: string, content: string, type: Supplement['type'] = 'note') {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const supplement: Supplement = {
        id: generateId(),
        content,
        type,
        attachments: [],
        createdAt: new Date(),
      }
      inspiration.supplements.push(supplement)
      updateInspiration(inspirationId, { supplements: inspiration.supplements })
    }
  }

  function deleteSupplement(inspirationId: string, supplementId: string) {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const index = inspiration.supplements.findIndex((sup) => sup.id === supplementId)
      if (index !== -1) {
        inspiration.supplements.splice(index, 1)
        updateInspiration(inspirationId, { supplements: inspiration.supplements })
      }
    }
  }

  function addAttachmentToInspiration(inspirationId: string, dataUrl: string, fileName: string, type: 'image' | 'audio') {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const attachment = createAttachment(dataUrl, fileName, type)
      inspiration.attachments.push(attachment)
      updateInspiration(inspirationId, { attachments: inspiration.attachments })
    }
  }

  function deleteAttachmentFromInspiration(inspirationId: string, attachmentId: string) {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const index = inspiration.attachments.findIndex((att) => att.id === attachmentId)
      if (index !== -1) {
        inspiration.attachments.splice(index, 1)
        updateInspiration(inspirationId, { attachments: inspiration.attachments })
      }
    }
  }

  function addAttachmentToSupplement(inspirationId: string, supplementId: string, dataUrl: string, fileName: string, type: 'image' | 'audio') {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const supplement = inspiration.supplements.find((sup) => sup.id === supplementId)
      if (supplement) {
        const attachment = createAttachment(dataUrl, fileName, type)
        supplement.attachments.push(attachment)
        updateInspiration(inspirationId, { supplements: [...inspiration.supplements] })
      }
    }
  }

  function deleteAttachmentFromSupplement(inspirationId: string, supplementId: string, attachmentId: string) {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const supplement = inspiration.supplements.find((sup) => sup.id === supplementId)
      if (supplement) {
        const index = supplement.attachments.findIndex((att) => att.id === attachmentId)
        if (index !== -1) {
          supplement.attachments.splice(index, 1)
          updateInspiration(inspirationId, { supplements: [...inspiration.supplements] })
        }
      }
    }
  }

  function searchInspirations(query: string): Inspiration[] {
    if (!query.trim()) return inspirations.value
    const lowerQuery = query.toLowerCase()
    return inspirations.value.filter(
      (insp) =>
        insp.content.toLowerCase().includes(lowerQuery) ||
        insp.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  }

  function filterInspirationsByTag(tag: string): Inspiration[] {
    return inspirations.value.filter((insp) => insp.tags.includes(tag))
  }

  function loadDemoData() {
    // 检查是否已经加载过Demo数据
    const hasDemoData = inspirations.value.some((insp) => insp.id.startsWith('demo-'))
    if (hasDemoData) return false

    // 添加Demo数据到现有数据中
    demoInspirations.forEach((demoInspiration) => {
      if (!demoInspiration.attachments) {
        demoInspiration.attachments = []
      }
      demoInspiration.supplements.forEach((sup) => {
        if (!sup.attachments) {
          sup.attachments = []
        }
      })
      inspirations.value.unshift(demoInspiration)
    })

    return true
  }

  return {
    inspirations,
    allTags,
    getInspirationById,
    createInspiration,
    updateInspiration,
    deleteInspiration,
    addSupplement,
    deleteSupplement,
    addAttachmentToInspiration,
    deleteAttachmentFromInspiration,
    addAttachmentToSupplement,
    deleteAttachmentFromSupplement,
    searchInspirations,
    filterInspirationsByTag,
    loadDemoData,
  }
}
