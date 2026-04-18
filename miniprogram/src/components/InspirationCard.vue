<script setup>
import Taro from '@tarojs/taro'
import { formatRelativeTime } from '../utils/helpers'
import { EMOTION_OPTIONS } from '../types'

const props = defineProps({
  inspiration: Object
})

const emotionInfo = EMOTION_OPTIONS.find((e) => e.value === props.inspiration.emotion)

function goToDetail() {
  Taro.navigateTo({ url: `/pages/detail/index?id=${props.inspiration.id}` })
}
</script>

<template>
  <view
    @tap="goToDetail"
    class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    :style="{ borderLeft: `4px solid ${inspiration.color}` }"
  >
    <view class="p-6">
      <view class="flex items-start justify-between mb-3">
        <view class="flex items-center gap-2">
          <text
            v-if="emotionInfo"
            class="text-xs px-2 py-0.5 rounded-full text-white"
            :style="{ backgroundColor: emotionInfo.color }"
          >
            {{ emotionInfo.label }}
          </text>
          <text class="text-xs text-gray-400">
            {{ formatRelativeTime(inspiration.createdAt) }}
          </text>
        </view>
      </view>

      <p class="text-gray-800 text-lg leading-relaxed mb-4 line-clamp-3">
        {{ inspiration.content }}
      </p>

      <view class="flex flex-wrap gap-2">
        <text
          v-for="tag in inspiration.tags.slice(0, 3)"
          :key="tag"
          class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
        >
          #{{ tag }}
        </text>
        <text v-if="inspiration.tags.length > 3" class="text-xs text-gray-400">
          +{{ inspiration.tags.length - 3 }}
        </text>
      </view>

      <view v-if="inspiration.supplements.length > 0" class="mt-4 pt-4 border-t border-gray-100">
        <view class="flex items-center gap-1 text-xs text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <text>{{ inspiration.supplements.length }} 条补充</text>
        </view>
      </view>
    </view>

    <view class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </view>
</template>