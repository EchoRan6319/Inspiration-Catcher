<script setup>
import { EMOTION_OPTIONS } from '../types'

const props = defineProps({
  modelValue: {
    type: String,
    default: 'neutral'
  }
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <view class="flex gap-2 flex-wrap">
    <button
      v-for="option in EMOTION_OPTIONS"
      :key="option.value"
      @tap="emit('update:modelValue', option.value)"
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
  </view>
</template>
