<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSerendipity } from '@/composables/useSerendipity'
import { formatRelativeTime } from '@/utils/helpers'
import { EMOTION_OPTIONS } from '@/types'

const router = useRouter()
const { currentInspiration, isAnimating, hasInspirations, canGoBack, showRandomInspiration, goBack } = useSerendipity()

const emotionInfo = computed(() => EMOTION_OPTIONS.find((e) => e.value === currentInspiration.value?.emotion))

function goToDetail() {
  if (currentInspiration.value) {
    router.push(`/inspiration/${currentInspiration.value.id}`)
  }
}

function goToCollection() {
  router.push('/collection')
}

onMounted(() => {
  if (hasInspirations.value) {
    showRandomInspiration()
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
          🎲 灵感拾遗
        </h1>
        <div class="flex gap-3">
          <button
            @click="goToCollection"
            class="px-4 py-2 text-gray-600 hover:text-orange-600 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            灵感集
          </button>
        </div>
      </div>
    </nav>

    <main class="pt-24 pb-8 px-4 min-h-screen flex items-center justify-center">
      <div class="max-w-2xl w-full">
        <div v-if="hasInspirations" class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">
            发现被遗忘的灵感 ✨
          </h2>
          <p class="text-gray-600">
            随机展示一个您之前记录的灵感
          </p>
        </div>

        <div v-if="currentInspiration" class="relative">
          <div
            :class="[
              'bg-white rounded-3xl shadow-2xl p-8 transition-all duration-500 transform',
              isAnimating ? 'opacity-0 scale-95 rotate-3' : 'opacity-100 scale-100 rotate-0',
            ]"
            :style="{ borderTop: `6px solid ${currentInspiration.color}` }"
          >
            <div class="flex items-center gap-3 mb-4">
              <span
                v-if="emotionInfo"
                class="px-3 py-1 text-white text-sm rounded-full"
                :style="{ backgroundColor: emotionInfo.color }"
              >
                {{ emotionInfo.label }}
              </span>
              <span class="text-gray-400 text-sm">
                {{ formatRelativeTime(currentInspiration.createdAt) }}
              </span>
            </div>

            <p class="text-xl leading-relaxed text-gray-800 mb-6">
              {{ currentInspiration.content }}
            </p>

            <div class="flex flex-wrap gap-2 mb-6">
              <span
                v-for="tag in currentInspiration.tags"
                :key="tag"
                class="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm rounded-full"
              >
                #{{ tag }}
              </span>
            </div>

            <button
              @click="goToDetail"
              class="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-900 hover:to-black transition-all"
            >
              查看详情 →
            </button>
          </div>

          <div class="flex justify-center gap-4 mt-8">
            <button
              v-if="canGoBack"
              @click="goBack"
              class="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              上一个
            </button>
            <button
              @click="showRandomInspiration"
              :disabled="isAnimating"
              class="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <svg
                v-if="isAnimating"
                class="w-5 h-5 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isAnimating ? '随机中...' : '换一个 🎲' }}
            </button>
          </div>
        </div>

        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">📝</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            还没有灵感记录
          </h3>
          <p class="text-gray-500 mb-6">
            先记录一些灵感，再来体验拾遗功能吧！
          </p>
          <button
            @click="router.push('/')"
            class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
          >
            记录第一个灵感
          </button>
        </div>
      </div>
    </main>
  </div>
</template>
