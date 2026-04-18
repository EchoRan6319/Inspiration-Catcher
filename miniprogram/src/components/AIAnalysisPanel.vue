<script setup lang="ts">
import { AIAnalysis } from '../types'

interface Props {
  analysis?: AIAnalysis
  isLoading?: boolean
  onAnalyze?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  isLoading: false,
})
</script>

<template>
  <view class="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6">
    <view class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
        <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        AI 智能分析
      </h3>
      <button
        v-if="onAnalyze"
        @tap="onAnalyze"
        :disabled="isLoading"
        class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {{ isLoading ? '分析中...' : '开始分析' }}
      </button>
    </view>

    <view v-if="isLoading" class="space-y-4">
      <view class="space-y-2">
        <view class="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></view>
        <view class="h-4 bg-gray-200 rounded w-full animate-pulse"></view>
      </view>
      <view class="space-y-2">
        <view class="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></view>
        <view class="flex gap-2">
          <view class="h-6 bg-gray-200 rounded-full w-16 animate-pulse"></view>
          <view class="h-6 bg-gray-200 rounded-full w-20 animate-pulse"></view>
        </view>
      </view>
    </view>

    <view v-else-if="analysis" class="space-y-4">
      <view>
        <h4 class="text-sm font-medium text-gray-600 mb-2">💡 总结</h4>
        <p class="text-gray-800 bg-white rounded-lg p-3">{{ analysis.summary }}</p>
      </view>

      <view>
        <h4 class="text-sm font-medium text-gray-600 mb-2">🏷️ 关键词</h4>
        <view class="flex flex-wrap gap-2">
          <text
            v-for="keyword in analysis.keywords"
            :key="keyword"
            class="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-sm rounded-full"
          >
            {{ keyword }}
          </text>
        </view>
      </view>

      <view>
        <h4 class="text-sm font-medium text-gray-600 mb-2">📂 分类</h4>
        <view class="flex flex-wrap gap-2">
          <text
            v-for="category in analysis.categories"
            :key="category"
            class="px-3 py-1 bg-gradient-to-r from-teal-400 to-cyan-400 text-white text-sm rounded-full"
          >
            {{ category }}
          </text>
        </view>
      </view>

      <view>
        <h4 class="text-sm font-medium text-gray-600 mb-2">🚀 发展建议</h4>
        <ul class="space-y-2">
          <li
            v-for="(suggestion, index) in analysis.suggestions"
            :key="index"
            class="flex items-start gap-2 text-gray-800 bg-white rounded-lg p-3"
          >
            <text class="text-indigo-600 font-semibold">{{ index + 1 }}.</text>
            <text>{{ suggestion }}</text>
          </li>
        </ul>
      </view>
    </view>

    <view v-else class="text-center py-8">
      <p class="text-gray-500 mb-4">还没有 AI 分析结果</p>
      <p class="text-sm text-gray-400">点击上方按钮开始分析您的灵感</p>
    </view>
  </view>
</template>
