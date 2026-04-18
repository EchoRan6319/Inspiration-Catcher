
import { ref, watch, onMounted, computed } from 'vue'
import Taro from '@tarojs/taro'

type Theme = 'light' | 'dark'
const THEME_KEY = 'theme'

export function useTheme() {
  const theme = ref&lt;Theme&gt;('light')

  const getPreferredTheme = (): Theme =&gt; {
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

  const applyTheme = (t: Theme) =&gt; {
    try {
      Taro.setStorageSync(THEME_KEY, t)
    } catch (error) {
      console.error('Failed to save theme:', error)
    }
  }

  const toggleTheme = () =&gt; {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  onMounted(() =&gt; {
    theme.value = getPreferredTheme()
    applyTheme(theme.value)
  })

  watch(theme, (newTheme) =&gt; {
    applyTheme(newTheme)
  })

  return {
    theme,
    toggleTheme,
    isDark: computed(() =&gt; theme.value === 'dark'),
  }
}
