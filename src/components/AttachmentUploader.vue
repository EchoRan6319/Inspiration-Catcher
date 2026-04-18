<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  onUpload?: (dataUrl: string, fileName: string, type: 'image' | 'audio') => void
  accept?: string
}

const props = withDefaults(defineProps<Props>(), {
  accept: 'image/*,audio/*',
})

const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}

function processFile(file: File) {
  const reader = new FileReader()
  reader.onload = (e) => {
    const dataUrl = e.target?.result as string
    let type: 'image' | 'audio' = 'image'
    
    if (file.type.startsWith('image/')) {
      type = 'image'
    } else if (file.type.startsWith('audio/')) {
      type = 'audio'
    }
    
    props.onUpload?.(dataUrl, file.name, type)
  }
  reader.readAsDataURL(file)
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  
  const files = event.dataTransfer?.files
  if (files && files.length > 0) {
    processFile(files[0])
  }
}
</script>

<template>
  <div
    class="border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
    :class="[
      isDragging 
        ? 'border-indigo-500 bg-indigo-50' 
        : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
    ]"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <input
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleFileSelect"
      ref="fileInput"
    />
    <div class="space-y-3" @click="fileInput?.click()">
      <div class="flex justify-center">
        <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      <div>
        <p class="text-gray-600 font-medium">点击或拖拽上传图片/音频</p>
        <p class="text-gray-400 text-sm mt-1">支持 JPG, PNG, MP3, WAV 等格式</p>
      </div>
    </div>
  </div>
</template>
