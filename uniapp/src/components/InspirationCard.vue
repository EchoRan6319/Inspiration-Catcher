<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Inspiration } from '../types'
import { formatRelativeTime } from '../utils/helpers'
import { EMOTION_OPTIONS } from '../types'

interface Props {
  inspiration: Inspiration
}

const props = defineProps<Props>()
const router = useRouter()

const emotionInfo = EMOTION_OPTIONS.find((e) => e.value === props.inspiration.emotion)

function goToDetail() {
  router.push(`/inspiration/${props.inspiration.id}`)
}
</script>

<template>
  <div
    @click="goToDetail"
    class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    :style="{ borderLeft: `4px solid ${inspiration.color}` }"
  >
    <div class="p-6">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <span
            v-if="emotionInfo"
            class="text-xs px-2 py-0.5 rounded-full text-white"
            :style="{ backgroundColor: emotionInfo.color }"
          >
            {{ emotionInfo.label }}
          </span>
          <span class="text-xs text-gray-400">
            {{ formatRelativeTime(inspiration.createdAt) }}
          </span>
        </div>
      </div>

      <p class="text-gray-800 text-lg leading-relaxed mb-4 line-clamp-3">
        {{ inspiration.content }}
      </p>

      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in inspiration.tags.slice(0, 3)"
          :key="tag"
          class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
        >
          #{{ tag }}
        </span>
        <span v-if="inspiration.tags.length > 3" class="text-xs text-gray-400">
          +{{ inspiration.tags.length - 3 }}
        </span>
      </div>

      <div v-if="inspiration.supplements.length > 0" class="mt-4 pt-4 border-t border-gray-100">
        <div class="flex items-center gap-1 text-xs text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
          <span>{{ inspiration.supplements.length }} 条补充</span>
        </div>
      </div>
    </div>

    <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
</template>
