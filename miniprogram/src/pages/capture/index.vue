<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import EmotionPicker from '@/components/EmotionPicker.vue'
import TagSelector from '@/components/TagSelector.vue'
import AttachmentUploader from '@/components/AttachmentUploader.vue'
import AttachmentDisplay from '@/components/AttachmentDisplay.vue'
import { useInspiration } from '@/composables/useInspiration'

const { createInspiration, allTags } = useInspiration()

const content = ref('')
const tags = ref([])
const emotion = ref('neutral')
const isSaving = ref(false)
const showSuccess = ref(false)
const attachments = ref([])

function handleAttachmentUpload(dataUrl, fileName, type) {
  attachments.value.push({
    id: Date.now().toString(),
    type,
    dataUrl,
    fileName,
    createdAt: new Date(),
  })
}

function handleDeleteAttachment(attachmentId) {
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
  Taro.switchTab({
    url: '/pages/collection/index'
  })
}
</script>

<template>
  <view class="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
    <view class="pt-8 pb-8 px-4">
      <view class="max-w-3xl mx-auto">
        <view class="text-center mb-8">
          <text class="text-3xl font-bold text-gray-800 mb-2 block">
            捕捉那转瞬即逝的灵感 ✨
          </text>
          <text class="text-gray-600">
            把此刻的想法记录下来，让创意不再流失
          </text>
        </view>

        <view class="bg-white rounded-3xl shadow-xl p-8">
          <view class="space-y-6">
            <view>
              <text class="block text-sm font-medium text-gray-700 mb-2">
                💭 你的灵感
              </text>
              <textarea
                v-model="content"
                placeholder="在这里记录你的灵感..."
                class="w-full h-48 px-4 py-3 border-2 border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all text-lg"
              />
            </view>

            <view>
              <text class="block text-sm font-medium text-gray-700 mb-2">
                😊 此刻的心情
              </text>
              <EmotionPicker v-model="emotion" />
            </view>

            <view>
              <text class="block text-sm font-medium text-gray-700 mb-2">
                🏷️ 添加标签
              </text>
              <TagSelector v-model="tags" :available-tags="allTags" />
            </view>

            <view>
              <text class="block text-sm font-medium text-gray-700 mb-2">
                📎 添加附件
              </text>
              <AttachmentUploader @upload="handleAttachmentUpload" />
              <view v-if="attachments.length > 0" class="mt-4">
                <AttachmentDisplay 
                  :attachments="attachments" 
                  :on-delete="handleDeleteAttachment"
                />
              </view>
            </view>

            <view class="flex justify-end pt-4">
              <view
                @tap="saveInspiration"
                class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                <text v-if="showSuccess">✓</text>
                <text>{{ showSuccess ? '已保存！' : '保存灵感' }}</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
