
import { ref, computed } from 'vue'
import { Inspiration } from '../types'
import { getRandomItem, shuffleArray } from '../utils/helpers'
import { useInspiration } from './useInspiration'

export function useSerendipity() {
  const { inspirations } = useInspiration()
  const currentInspiration = ref&lt;Inspiration | null&gt;(null)
  const history = ref&lt;Inspiration[]&gt;([])
  const isAnimating = ref(false)

  const hasInspirations = computed(() =&gt; inspirations.value.length &gt; 0)
  const canGoBack = computed(() =&gt; history.value.length &gt; 0)

  function getRandomInspiration(): Inspiration | null {
    if (inspirations.value.length === 0) return null

    const availableInspirations = inspirations.value.filter(
      (insp) =&gt; !currentInspiration.value || insp.id !== currentInspiration.value.id
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

    setTimeout(() =&gt; {
      currentInspiration.value = getRandomInspiration()
      isAnimating.value = false
    }, 300)
  }

  function goBack() {
    if (history.value.length === 0) return

    isAnimating.value = true

    setTimeout(() =&gt; {
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
