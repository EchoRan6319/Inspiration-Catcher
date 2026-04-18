
import { ref, watch } from 'vue'
import type { Inspiration, AIConfig } from '../types'
import { getInspirations, saveInspirations, getAIConfig, saveAIConfig } from '../utils/storage'

export function useStorage() {
  const inspirations = ref<Inspiration[]>([])
  const aiConfig = ref<AIConfig | null>(null)
  const isLoaded = ref(false)

  function load() {
    inspirations.value = getInspirations()
    aiConfig.value = getAIConfig()
    isLoaded.value = true
  }

  function save() {
    saveInspirations(inspirations.value)
    if (aiConfig.value) {
      saveAIConfig(aiConfig.value)
    }
  }

  watch(inspirations, save, { deep: true })
  watch(aiConfig, save, { deep: true })

  load()

  return {
    inspirations,
    aiConfig,
    isLoaded,
    load,
    save,
  }
}
