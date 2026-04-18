<script setup lang="ts">
import type { Attachment } from '../types'

interface Props {
  attachments: Attachment[]
  onDelete?: (attachmentId: string) => void
}

const props = defineProps<Props>()
const emit = defineEmits<{
  delete: [attachmentId: string]
}>()
</script>

<template>
  <div v-if="attachments.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
    <div
      v-for="attachment in attachments"
      :key="attachment.id"
      class="relative group"
    >
      <div v-if="attachment.type === 'image'" class="relative rounded-xl overflow-hidden bg-gray-100 aspect-square">
        <img
          :src="attachment.dataUrl"
          :alt="attachment.fileName"
          class="w-full h-full object-cover"
        />
        <button
          v-if="onDelete"
          @click.stop="emit('delete', attachment.id)"
          class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div v-else-if="attachment.type === 'audio'" class="relative bg-gray-100 rounded-xl p-4">
        <audio :src="attachment.dataUrl" controls class="w-full" />
        <p class="text-sm text-gray-500 mt-2 truncate">{{ attachment.fileName }}</p>
        <button
          v-if="onDelete"
          @click.stop="emit('delete', attachment.id)"
          class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
