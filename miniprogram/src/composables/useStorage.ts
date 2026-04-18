
import { ref, watch } from 'vue'
import { Inspiration, AIConfig } from '../types'
import { getInspirations, saveInspirations, getAIConfig, saveAIConfig } from '../utils/storage'

export function useStorage() {
  const inspirations = ref&lt;Inspiration[]&gt;([])
  const aiConfig = ref&lt;AIConfig | null&gt;(null)
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
