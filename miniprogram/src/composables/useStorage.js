import { ref, watch } from 'vue'
import { getInspirations, saveInspirations, getAIConfig, saveAIConfig } from '../utils/storage'

export function useStorage() {
  const inspirations = ref([])
  const aiConfig = ref(null)
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