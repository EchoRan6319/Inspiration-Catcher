
import { ref, computed } from 'vue'
import type { Inspiration } from '../types'
import { getRandomItem, shuffleArray } from '../utils/helpers'
import { useInspiration } from './useInspiration'

export function useSerendipity() {
  const { inspirations } = useInspiration()
  const currentInspiration = ref<Inspiration | null>(null)
  const history = ref<Inspiration[]>([])
  const isAnimating = ref(false)

  const hasInspirations = computed(() => inspirations.value.length > 0)
  const canGoBack = computed(() => history.value.length > 0)

  function getRandomInspiration(): Inspiration | null {
    if (inspirations.value.length === 0) return null

    const availableInspirations = inspirations.value.filter(
      (insp) => !currentInspiration.value || insp.id !== currentInspiration.value.id
    )

    if (availableInspirations.length === 0) {
      return getRandomItem(inspirations.value)
    }

    return getRandomItem(availableInspirations)
  }

  function showRandomInspiration() {
    if (inspirations.value.length === 0) return

    isAnimating.value = true

    if (currentInspiration.value) {
      history.value.push(currentInspiration.value)
    }

    setTimeout(() => {
      currentInspiration.value = getRandomInspiration()
      isAnimating.value = false
    }, 300)
  }

  function goBack() {
    if (history.value.length === 0) return

    isAnimating.value = true

    setTimeout(() => {
      if (currentInspiration.value) {
        inspirations.value.unshift(currentInspiration.value)
      }
      currentInspiration.value = history.value.pop() || null
      isAnimating.value = false
    }, 300)
  }

  function getShuffledInspirations(count: number = 5): Inspiration[] {
    return shuffleArray(inspirations.value).slice(0, count)
  }

  function reset() {
    currentInspiration.value = null
    history.value = []
  }

  return {
    currentInspiration,
    history,
    isAnimating,
    hasInspirations,
    canGoBack,
    showRandomInspiration,
    goBack,
    getShuffledInspirations,
    reset,
  }
}
