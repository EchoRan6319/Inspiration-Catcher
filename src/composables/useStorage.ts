
import { ref, watch } from 'vue'
import type { Inspiration, AIConfig, Project, Achievement } from '../types'
import { getInspirations, saveInspirations, getAIConfig, saveAIConfig, getProjects, saveProjects, getAchievements, saveAchievements } from '../utils/storage'

export function useStorage() {
  const inspirations = ref<Inspiration[]>([])
  const aiConfig = ref<AIConfig | null>(null)
  const projects = ref<Project[]>([])
  const achievements = ref<Achievement[]>([])
  const isLoaded = ref(false)

  function load() {
    inspirations.value = getInspirations()
    aiConfig.value = getAIConfig()
    projects.value = getProjects()
    achievements.value = getAchievements()
    isLoaded.value = true
  }

  function save() {
    saveInspirations(inspirations.value)
    saveProjects(projects.value)
    saveAchievements(achievements.value)
    if (aiConfig.value) {
      saveAIConfig(aiConfig.value)
    }
  }

  watch(inspirations, save, { deep: true })
  watch(projects, save, { deep: true })
  watch(achievements, save, { deep: true })
  watch(aiConfig, save, { deep: true })

  load()

  return {
    inspirations,
    aiConfig,
    projects,
    achievements,
    isLoaded,
    load,
    save,
  }
}
