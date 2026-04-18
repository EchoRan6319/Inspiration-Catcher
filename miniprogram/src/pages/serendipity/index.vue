<script setup>
import { onMounted, computed } from 'vue'
import Taro from '@tarojs/taro'
import { useSerendipity } from '@/composables/useSerendipity'
import { formatRelativeTime } from '@/utils/helpers'
import { EMOTION_OPTIONS } from '@/types'

const { currentInspiration, isAnimating, hasInspirations, canGoBack, showRandomInspiration, goBack } = useSerendipity()

const emotionInfo = computed(() => EMOTION_OPTIONS.find((e) => e.value === currentInspiration.value?.emotion))

function goToDetail() {
  if (currentInspiration.value) {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${currentInspiration.value.id}`
    })
  }
}

function goToCollection() {
  Taro.switchTab({
    url: '/pages/collection/index'
  })
}

onMounted(() => {
  if (hasInspirations.value) {
    showRandomInspiration()
  }
})
</script>

<template>
  <view class="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-pink-50">
    <view class="pt-8 pb-8 px-4 min-h-screen flex items-center justify-center">
      <view class="max-w-2xl w-full">
        <view v-if="hasInspirations" class="text-center mb-8">
          <text class="text-2xl font-bold text-gray-800 mb-2 block">
            发现被遗忘的灵感 ✨
          </text>
          <text class="text-gray-600">
            随机展示一个您之前记录的灵感
          </text>
        </view>

        <view v-if="currentInspiration" class="relative">
          <view
            :class="[
              'bg-white rounded-3xl shadow-2xl p-8 transition-all duration-500 transform',
              isAnimating ? 'opacity-0 scale-95 rotate-3' : 'opacity-100 scale-100 rotate-0'
            ]"
            :style="{ borderTop: `6px solid ${currentInspiration.color}` }"
          >
            <view class="flex items-center gap-3 mb-4">
              <text
                v-if="emotionInfo"
                class="px-3 py-1 text-white text-sm rounded-full"
                :style="{ backgroundColor: emotionInfo.color }"
              >
                {{ emotionInfo.label }}
              </text>
              <text class="text-gray-400 text-sm">
                {{ formatRelativeTime(currentInspiration.createdAt) }}
              </text>
            </view>

            <text class="text-xl leading-relaxed text-gray-800 mb-6 block">
              {{ currentInspiration.content }}
            </text>

            <view class="flex flex-wrap gap-2 mb-6">
              <text
                v-for="tag in currentInspiration.tags"
                :key="tag"
                class="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm rounded-full"
              >
                #{{ tag }}
              </text>
            </view>

            <view
              @tap="goToDetail"
              class="w-full py-3 bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-xl font-semibold hover:from-gray-900 hover:to-black transition-all"
            >
              <text>查看详情 →</text>
            </view>
          </view>

          <view class="flex justify-center gap-4 mt-8">
            <view
              v-if="canGoBack"
              @tap="goBack"
              class="px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <text>← 上一个</text>
            </view>
            <view
              @tap="showRandomInspiration"
              class="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <text>{{ isAnimating ? '随机中...' : '换一个 🎲' }}</text>
            </view>
          </view>
        </view>

        <view v-else class="text-center py-16">
          <text class="text-6xl mb-4 block">📝</text>
          <text class="text-xl font-semibold text-gray-800 mb-2 block">
            还没有灵感记录
          </text>
          <text class="text-gray-500 mb-6 block">
            先记录一些灵感，再来体验拾遗功能吧！
          </text>
          <view
            @tap="Taro.switchTab({ url: '/pages/capture/index' })"
            class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg inline-block"
          >
            <text>记录第一个灵感</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
