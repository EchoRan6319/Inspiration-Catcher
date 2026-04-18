import { ref, watch, onMounted, computed } from 'vue'
import Taro from '@tarojs/taro'

const THEME_KEY = 'theme'

export function useTheme() {
  const theme = ref('light')

  const getPreferredTheme = () => {
    try {
      const saved = Taro.getStorageSync(THEME_KEY)
      if (saved === 'light' || saved === 'dark') {
        return saved
      }
    } catch {
      // 默认使用 light 主题
    }
    return 'light'
  }

  const applyTheme = (t) => {
    try {
      Taro.setStorageSync(THEME_KEY, t)
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  onMounted(() => {
    theme.value = getPreferredTheme()
    applyTheme(theme.value)
  })

  watch(theme, (newTheme) => {
    applyTheme(newTheme)
  })

  return {
    theme,
    toggleTheme,
    isDark: computed(() => theme.value === 'dark'),
  }
}