<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string[]
  availableTags?: string[]
  placeholder?: string
}

interface Emits {
  (e: 'update:modelValue', value: string[]): void
}

const props = withDefaults(defineProps<Props>(), {
  availableTags: () => [],
  placeholder: '添加标签...',
})
const emit = defineEmits<Emits>()

const inputValue = ref('')

function addTag(tag: string) {
  const trimmed = tag.trim()
  if (trimmed && !props.modelValue.includes(trimmed)) {
    emit('update:modelValue', [...props.modelValue, trimmed])
  }
  inputValue.value = ''
}

function removeTag(tag: string) {
  emit('update:modelValue', props.modelValue.filter((t) => t !== tag))
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ',') {
    event.preventDefault()
    addTag(inputValue.value)
  }
}
</script>

<template>
  <view class="space-y-2">
    <view class="flex flex-wrap gap-2">
      <text
        v-for="tag in modelValue"
        :key="tag"
        class="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-full"
      >
        {{ tag }}
        <button @tap="removeTag(tag)" class="hover:bg-white/20 rounded-full p-0.5 transition-colors">
          &times;
        </button>
      </text>
      <input
        v-model="inputValue"
        type="text"
        :placeholder="placeholder"
        @keydown="handleKeydown"
        @blur="addTag(inputValue)"
        class="flex-1 min-w-[120px] px-3 py-1.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
    </view>
    <view v-if="availableTags.length > 0" class="flex flex-wrap gap-2">
      <text class="text-xs text-gray-500 self-center">推荐标签：</text>
      <button
        v-for="tag in availableTags.filter((t) => !modelValue.includes(t))"
        :key="tag"
        @tap="addTag(tag)"
        class="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
      >
        {{ tag }}
      </button>
    </view>
  </view>
</template>
