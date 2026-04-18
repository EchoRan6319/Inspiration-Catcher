<script setup lang="ts">
import { EMOTION_OPTIONS } from '../types'
import type { Inspiration } from '../types'

interface Props {
  modelValue: Inspiration['emotion']
}

interface Emits {
  (e: 'update:modelValue', value: Inspiration['emotion']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="flex gap-2 flex-wrap">
    <button
      v-for="option in EMOTION_OPTIONS"
      :key="option.value"
      @click="emit('update:modelValue', option.value)"
      :class="[
        'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
        modelValue === option.value
          ? 'text-white shadow-md scale-105'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
      ]"
      :style="{ backgroundColor: modelValue === option.value ? option.color : undefined }"
    >
      {{ option.label }}
    </button>
  </div>
</template>
