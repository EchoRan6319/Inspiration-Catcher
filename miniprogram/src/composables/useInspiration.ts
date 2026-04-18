
import { computed } from 'vue'
import { Inspiration, Supplement, Attachment } from '../types'
import { generateId, getRandomItem } from '../utils/helpers'
import { COLOR_OPTIONS } from '../types'
import { useStorage } from './useStorage'
import { demoInspirations } from '../utils/demoData'

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

  const allTags = computed(() =&gt; {
    const tags = new Set&lt;string&gt;()
    inspirations.value.forEach((insp) =&gt; {
      insp.tags.forEach((tag) =&gt; tags.add(tag))
    })
    return Array.from(tags)
  })

  function getInspirationById(id: string): Inspiration | undefined {
    return inspirations.value.find((insp) =&gt; insp.id === id)
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

  function updateInspiration(id: string, updates: Partial&lt;Omit&lt;Inspiration, 'id' | 'createdAt'&gt;&gt;) {
    const index = inspirations.value.findIndex((insp) =&gt; insp.id === id)
    if (index !== -1) {
      inspirations.value[index] = {
        ...inspirations.value[index],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  function deleteInspiration(id: string) {
    const index = inspirations.value.findIndex((insp) =&gt; insp.id === id)
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
      const index = inspiration.supplements.findIndex((sup) =&gt; sup.id === supplementId)
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
      const index = inspiration.attachments.findIndex((att) =&gt; att.id === attachmentId)
      if (index !== -1) {
        inspiration.attachments.splice(index, 1)
        updateInspiration(inspirationId, { attachments: inspiration.attachments })
      }
    }
  }

  function addAttachmentToSupplement(inspirationId: string, supplementId: string, dataUrl: string, fileName: string, type: 'image' | 'audio') {
    const inspiration = getInspirationById(inspirationId)
    if (inspiration) {
      const supplement = inspiration.supplements.find((sup) =&gt; sup.id === supplementId)
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
      const supplement = inspiration.supplements.find((sup) =&gt; sup.id === supplementId)
      if (supplement) {
        const index = supplement.attachments.findIndex((att) =&gt; att.id === attachmentId)
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
      (insp) =&gt;
        insp.content.toLowerCase().includes(lowerQuery) ||
        insp.tags.some((tag) =&gt; tag.toLowerCase().includes(lowerQuery))
    )
  }

  function filterInspirationsByTag(tag: string): Inspiration[] {
    return inspirations.value.filter((insp) =&gt; insp.tags.includes(tag))
  }

  function loadDemoData() {
    const hasDemoData = inspirations.value.some((insp) =&gt; insp.id.startsWith('demo-'))
    if (hasDemoData) return false

    demoInspirations.forEach((demoInspiration) =&gt; {
      if (!demoInspiration.attachments) {
        demoInspiration.attachments = []
      }
      demoInspiration.supplements.forEach((sup) =&gt; {
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
