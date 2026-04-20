import { computed } from 'vue'
import type { Inspiration, Supplement, Attachment, Project, Task } from '../types'
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
  const { inspirations, projects } = useStorage()

  const allTags = computed(() => {
    const tags = new Set<string>()
    inspirations.value.forEach((insp) => {
      insp.tags.forEach((tag) => tags.add(tag))
    })
    return Array.from(tags)
  })

  const activeProjects = computed(() => 
    projects.value.filter(p => p.status !== 'completed' && p.status !== 'paused')
  )

  const completedProjects = computed(() => 
    projects.value.filter(p => p.status === 'completed')
  )

  function getInspirationById(id: string): Inspiration | undefined {
    return inspirations.value.find((insp) => insp.id === id)
  }

  function getProjectById(id: string): Project | undefined {
    return projects.value.find((p) => p.id === id)
  }

  function getProjectByInspirationId(inspirationId: string): Project | undefined {
    return projects.value.find((p) => p.inspirationId === inspirationId)
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
      aiAnalysis: undefined,
      aiConversation: [],
      isArchived: false,
    }
    inspirations.value.unshift(inspiration)
    return inspiration
  }

  function createProjectFromInspiration(
    inspirationId: string,
    title: string,
    description: string,
    successCriteria: string[] = []
  ): Project {
    const inspiration = getInspirationById(inspirationId)
    if (!inspiration) {
      throw new Error('Inspiration not found')
    }

    const now = new Date()
    const project: Project = {
      id: generateId(),
      inspirationId,
      title,
      description,
      status: 'planning',
      successCriteria,
      tasks: [],
      createdAt: now,
      updatedAt: now,
    }

    projects.value.unshift(project)
    
    // 更新灵感，关联项目
    updateInspiration(inspirationId, { projectId: project.id })

    return project
  }

  function addTaskToProject(
    projectId: string,
    title: string,
    description?: string,
    priority: Task['priority'] = 'medium',
    dueDate?: Date
  ): Task {
    const project = getProjectById(projectId)
    if (!project) {
      throw new Error('Project not found')
    }

    const now = new Date()
    const task: Task = {
      id: generateId(),
      projectId,
      title,
      description,
      status: 'todo',
      priority,
      dueDate,
      order: project.tasks.length,
      createdAt: now,
      updatedAt: now,
    }

    project.tasks.push(task)
    updateProject(projectId, { tasks: project.tasks })

    return task
  }

  function updateTask(
    projectId: string,
    taskId: string,
    updates: Partial<Omit<Task, 'id' | 'projectId' | 'createdAt'>>
  ) {
    const project = getProjectById(projectId)
    if (!project) return

    const taskIndex = project.tasks.findIndex(t => t.id === taskId)
    if (taskIndex !== -1) {
      project.tasks[taskIndex] = {
        ...project.tasks[taskIndex],
        ...updates,
        updatedAt: new Date(),
      }
      updateProject(projectId, { tasks: project.tasks })
    }
  }

  function updateProject(
    id: string,
    updates: Partial<Omit<Project, 'id' | 'inspirationId' | 'createdAt'>>
  ) {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      projects.value[index] = {
        ...projects.value[index],
        ...updates,
        updatedAt: new Date(),
      }
    }
  }

  function deleteProject(id: string) {
    const index = projects.value.findIndex((p) => p.id === id)
    if (index !== -1) {
      const project = projects.value[index]
      // 清除灵感的项目关联
      const inspiration = getInspirationById(project.inspirationId)
      if (inspiration) {
        updateInspiration(project.inspirationId, { projectId: undefined })
      }
      projects.value.splice(index, 1)
    }
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
      if (!demoInspiration.aiAnalysis) {
        demoInspiration.aiAnalysis = undefined
      }
      if (!demoInspiration.aiConversation) {
        demoInspiration.aiConversation = []
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
    projects,
    allTags,
    activeProjects,
    completedProjects,
    getInspirationById,
    getProjectById,
    getProjectByInspirationId,
    createInspiration,
    updateInspiration,
    deleteInspiration,
    createProjectFromInspiration,
    updateProject,
    deleteProject,
    addTaskToProject,
    updateTask,
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
