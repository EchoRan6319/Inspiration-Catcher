<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import EmotionPicker from '@/components/EmotionPicker.vue'
import TagSelector from '@/components/TagSelector.vue'
import AttachmentUploader from '@/components/AttachmentUploader.vue'
import AttachmentDisplay from '@/components/AttachmentDisplay.vue'
import { useInspiration } from '@/composables/useInspiration'
import type { Inspiration, Attachment } from '@/types'

const router = useRouter()
const { createInspiration, allTags } = useInspiration()

const content = ref('')
const tags = ref<string[]>([])
const emotion = ref<Inspiration['emotion']>('neutral')
const isSaving = ref(false)
const showSuccess = ref(false)
const attachments = ref<Attachment[]>([])

function handleAttachmentUpload(dataUrl: string, fileName: string, type: 'image' | 'audio') {
  attachments.value.push({
    id: Date.now().toString(),
    type,
    dataUrl,
    fileName,
    createdAt: new Date(),
  })
}

function handleDeleteAttachment(attachmentId: string) {
  const index = attachments.value.findIndex(a => a.id === attachmentId)
  if (index !== -1) {
    attachments.value.splice(index, 1)
  }
}

function saveInspiration() {
  if (!content.value.trim()) return

  isSaving.value = true
  const inspiration = createInspiration(content.value.trim(), tags.value, emotion.value)
  
  attachments.value.forEach(att => {
    inspiration.attachments.push(att)
  })

  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    content.value = ''
    tags.value = []
    emotion.value = 'neutral'
    attachments.value = []
  }, 1500)

  isSaving.value = false
}

function goToCollection() {
  router.push('/collection')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          ✨ 灵感捕手
        </h1>
        <div class="flex gap-3">
          <button
            @click="goToCollection"
            class="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            灵感集
          </button>
        </div>
      </div>
    </nav>

    <main class="pt-24 pb-8 px-4">
      <div class="max-w-3xl mx-auto">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-800 mb-2">
            捕捉那转瞬即逝的灵感 ✨
          </h2>
          <p class="text-gray-600">
            把此刻的想法记录下来，让创意不再流失
          </p>
        </div>

        <div class="bg-white rounded-3xl shadow-xl p-8">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                💭 你的灵感
              </label>
              <textarea
                v-model="content"
                placeholder="在这里记录你的灵感..."
                class="w-full h-48 px-4 py-3 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-lg"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                😊 此刻的心情
              </label>
              <EmotionPicker v-model="emotion" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                🏷️ 添加标签
              </label>
              <TagSelector v-model="tags" :available-tags="allTags" />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                📎 添加附件
              </label>
              <AttachmentUploader @upload="handleAttachmentUpload" />
              <div v-if="attachments.length > 0" class="mt-4">
                <AttachmentDisplay 
                  :attachments="attachments" 
                  :on-delete="handleDeleteAttachment"
                />
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <button
                @click="saveInspiration"
                :disabled="!content.trim() || isSaving"
                class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <svg v-if="showSuccess" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ showSuccess ? '已保存！' : '保存灵感' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
