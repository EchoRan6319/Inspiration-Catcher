import { computed } from 'vue'
import { generateId, getRandomItem } from '../utils/helpers'
import { COLOR_OPTIONS } from '../types'
import { useStorage } from './useStorage'
import { demoInspirations } from '../utils/demoData'

const colorOptions = [...COLOR_OPTIONS]

function createAttachment(dataUrl, fileName, type) {
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
    const tags = new Set()
    inspirations.value.forEach((insp) => {
      insp.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  })

  function getInspirationById(id) {
    return inspirations.value.find((insp) => insp.id === id)
  }

  function createInspiration(
    content,
    tags = [],
    emotion = 'neutral'
  ) {
    const now = new Date()
    const inspiration = {
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

  function updateInspiration(id, updates) {
    const index = inspirations.value.findIndex((insp) => insp.id === id)
    if (index !== -1) {
      inspirations.value[index] = {
        ...inspirations.value[index],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  function deleteInspiration(id) {
    const index = inspirations.value.findIndex((insp) => insp.id === id)
    if (index !== -1) {
      inspirations.value.splice(index, 1)
    }
  }

  function addSupplement(inspirationId, content, type = 'note') {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const supplement = {
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

  function deleteSupplement(inspirationId, supplementId) {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const index = inspiration.supplements.findIndex((sup) => sup.id === supplementId)
      if (index !== -1) {
        inspiration.supplements.splice(index, 1)
        updateInspiration(inspirationId, { supplements: inspiration.supplements })
      }
    }
  }

  function addAttachmentToInspiration(inspirationId, dataUrl, fileName, type) {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const attachment = createAttachment(dataUrl, fileName, type)
      inspiration.attachments.push(attachment)
      updateInspiration(inspirationId, { attachments: inspiration.attachments })
    }
  }

  function deleteAttachmentFromInspiration(inspirationId, attachmentId) {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const index = inspiration.attachments.findIndex((att) => att.id === attachmentId)
      if (index !== -1) {
        inspiration.attachments.splice(index, 1)
        updateInspiration(inspirationId, { attachments: inspiration.attachments })
      }
    }
  }

  function addAttachmentToSupplement(inspirationId, supplementId, dataUrl, fileName, type) {
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

  function deleteAttachmentFromSupplement(inspirationId, supplementId, attachmentId) {
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

  function searchInspirations(query) {
    if (!query.trim()) return inspirations.value
    const lowerQuery = query.toLowerCase()
    return inspirations.value.filter(
      (insp) =>
        insp.content.toLowerCase().includes(lowerQuery) ||
        insp.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  }

  function filterInspirationsByTag(tag) {
    return inspirations.value.filter((insp) => insp.tags.includes(tag))
  }

  function loadDemoData() {
    const hasDemoData = inspirations.value.some((insp) => insp.id.startsWith('demo-'))
    if (hasDemoData) return false

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

  function cleanOldInspirations(daysOld = 30) {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - daysOld)
    
    const initialLength = inspirations.value.length
    inspirations.value = inspirations.value.filter(insp => {
      const inspDate = new Date(insp.createdAt)
      return inspDate >= cutoffDate
    })
    
    return initialLength - inspirations.value.length
  }

  function getStorageUsage() {
    try {
      const inspirationsData = JSON.stringify(inspirations.value)
      const usageKB = Math.round((inspirationsData.length / 1024) * 100) / 100
      return {
        size: usageKB,
        count: inspirations.value.length,
        maxSize: 10240 // 10MB in KB
      }
    } catch (error) {
      console.error('Failed to calculate storage usage:', error)
      return { size: 0, count: 0, maxSize: 10240 }
    }
  }

  function optimizeAttachments() {
    // 简单的附件优化：检查并清理空附件
    inspirations.value.forEach(inspiration => {
      // 清理灵感的空附件
      inspiration.attachments = (inspiration.attachments || []).filter(att => 
        att.dataUrl && att.dataUrl.length > 0
      )
      
      // 清理补充的空附件
      inspiration.supplements.forEach(sup => {
        sup.attachments = (sup.attachments || []).filter(att => 
          att.dataUrl && att.dataUrl.length > 0
        )
      })
    })
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
    cleanOldInspirations,
    getStorageUsage,
    optimizeAttachments,
  }
}