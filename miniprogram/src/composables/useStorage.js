import { ref, watch } from 'vue'
import { getInspirations, saveInspirations, getAIConfig, saveAIConfig } from '../utils/storage'

// 防抖函数
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export function useStorage() {
  const inspirations = ref([])
  const aiConfig = ref(null)
  const isLoaded = ref(false)

  function load() {
    inspirations.value = getInspirations()
    aiConfig.value = getAIConfig()
    isLoaded.value = true
  }

  // 使用防抖包装 save 函数，避免频繁存储
  const save = debounce(() => {
    saveInspirations(inspirations.value)
    if (aiConfig.value) {
      saveAIConfig(aiConfig.value)
    }
  }, 500) // 500ms 防抖延迟

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