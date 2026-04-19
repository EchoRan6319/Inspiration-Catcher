<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useInspiration } from '@/composables/useInspiration'
import { useAI } from '@/composables/useAI'
import AttachmentUploader from '@/components/AttachmentUploader.vue'
import AttachmentDisplay from '@/components/AttachmentDisplay.vue'

import { formatDate } from '@/utils/helpers'
import { EMOTION_OPTIONS, SUPPLEMENT_TYPES } from '@/types'

import type { Supplement, AIConfig, Attachment } from '@/types'

const router = useRouter()
const route = useRoute()
const { 
  getInspirationById, 
  deleteInspiration, 
  addSupplement, 
  deleteSupplement,
  addAttachmentToInspiration,
  deleteAttachmentFromInspiration,
  addAttachmentToSupplement,
  deleteAttachmentFromSupplement
} = useInspiration()
const { aiConfig, setConfig, testModel, analyzeFeasibility, chatWithAI } = useAI()

const isTesting = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

// AI功能状态
const showFeasibilityAnalysis = ref(false)
const isAnalyzingFeasibility = ref(false)
const feasibilityResult = ref<{ feasibility: string; analysis: string; suggestions: string[] } | null>(null)

const showChat = ref(false)
const isChatting = ref(false)
const chatInput = ref('')
const chatHistory = ref<{ role: 'user' | 'assistant'; content: string }[]>([])

// 补充记录附件状态
const showSupplementAttachmentUploader = ref<string | null>(null)
const supplementAttachments = ref<Record<string, Attachment[]>>({})

const inspiration = computed(() => getInspirationById(route.params.id as string))
const emotionInfo = computed(() => EMOTION_OPTIONS.find((e) => e.value === inspiration.value?.emotion))

const showAIConfig = ref(false)
const aiProvider = ref<AIConfig['provider']>('wenxin')
const aiApiKey = ref('')
const aiModel = ref('')
const aiApiUrl = ref('')

const newSupplement = ref('')
const supplementType = ref<Supplement['type']>('note')

function goBack() {
  router.back()
}

function goToCollection() {
  router.push('/collection')
}

function saveAIConfig() {
  const config: AIConfig = {
    provider: aiProvider.value,
    apiKey: aiApiKey.value,
    model: aiModel.value || undefined,
    apiUrl: aiApiUrl.value || undefined,
  }
  setConfig(config)
  showAIConfig.value = false
}

async function handleTestModel() {
  const config: AIConfig = {
    provider: aiProvider.value,
    apiKey: aiApiKey.value,
    model: aiModel.value || undefined,
    apiUrl: aiApiUrl.value || undefined,
  }
  
  isTesting.value = true
  testResult.value = null
  
  try {
    const result = await testModel(config)
    testResult.value = result
  } catch (error) {
    testResult.value = {
      success: false,
      message: error instanceof Error ? error.message : '测试失败'
    }
  } finally {
    isTesting.value = false
  }
}

async function handleFeasibilityAnalysis() {
  if (!inspiration.value) return
  
  isAnalyzingFeasibility.value = true
  feasibilityResult.value = null
  
  try {
    const result = await analyzeFeasibility(inspiration.value.content)
    feasibilityResult.value = result
  } catch (error) {
    alert(error instanceof Error ? error.message : '分析失败，请检查AI配置')
  } finally {
    isAnalyzingFeasibility.value = false
  }
}

async function handleChatSend() {
  if (!inspiration.value || !chatInput.value.trim()) return
  
  const userMessage = chatInput.value.trim()
  chatHistory.value.push({ role: 'user', content: userMessage })
  chatInput.value = ''
  
  isChatting.value = true
  
  try {
    const response = await chatWithAI(inspiration.value.content, chatHistory.value)
    chatHistory.value.push({ role: 'assistant', content: response })
  } catch (error) {
    alert(error instanceof Error ? error.message : '对话失败，请检查AI配置')
  } finally {
    isChatting.value = false
  }
}

function resetChat() {
  chatHistory.value = []
  chatInput.value = ''
}

function handleAddSupplement() {
  if (!inspiration.value || !newSupplement.value.trim()) return
  
  addSupplement(inspiration.value.id, newSupplement.value.trim(), supplementType.value)
  
  if (supplementAttachments.value['new']) {
    const supplements = inspiration.value.supplements
    if (supplements.length > 0) {
      const lastSupplement = supplements[supplements.length - 1]
      supplementAttachments.value['new'].forEach(att => {
        addAttachmentToSupplement(inspiration.value.id, lastSupplement.id, att.dataUrl, att.fileName, att.type)
      })
    }
    delete supplementAttachments.value['new']
  }
  
  newSupplement.value = ''
  showSupplementAttachmentUploader.value = null
}

function handleInspirationAttachmentUpload(dataUrl: string, fileName: string, type: 'image' | 'audio') {
  if (!inspiration.value) return
  addAttachmentToInspiration(inspiration.value.id, dataUrl, fileName, type)
}

function handleDeleteInspirationAttachment(attachmentId: string) {
  if (!inspiration.value) return
  deleteAttachmentFromInspiration(inspiration.value.id, attachmentId)
}

function handleSupplementAttachmentUpload(supplementId: string, dataUrl: string, fileName: string, type: 'image' | 'audio') {
  if (!supplementAttachments.value[supplementId]) {
    supplementAttachments.value[supplementId] = []
  }
  supplementAttachments.value[supplementId].push({
    id: Date.now().toString(),
    type,
    dataUrl,
    fileName,
    createdAt: new Date(),
  })
}

function handleDeleteSupplementAttachment(supplementId: string, attachmentId: string) {
  if (supplementAttachments.value[supplementId]) {
    const index = supplementAttachments.value[supplementId].findIndex(a => a.id === attachmentId)
    if (index !== -1) {
      supplementAttachments.value[supplementId].splice(index, 1)
    }
  }
}

function handleDeleteSavedSupplementAttachment(supplementId: string, attachmentId: string) {
  if (!inspiration.value) return
  deleteAttachmentFromSupplement(inspiration.value.id, supplementId, attachmentId)
}

function confirmDelete() {
  if (confirm('确定要删除这个灵感吗？')) {
    deleteInspiration(route.params.id as string)
    router.push('/collection')
  }
}

onMounted(() => {
  if (aiConfig.value) {
    aiProvider.value = aiConfig.value.provider
    aiApiKey.value = aiConfig.value.apiKey
    aiModel.value = aiConfig.value.model || ''
    aiApiUrl.value = aiConfig.value.apiUrl || ''
  }
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <button @click="goBack" class="flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>
        <div class="flex gap-3">
          <button
            @click="showAIConfig = true"
            class="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            AI 设置
          </button>
          <button
            @click="confirmDelete"
            class="px-4 py-2 text-red-600 hover:text-red-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            删除
          </button>
        </div>
      </div>
    </nav>

    <main v-if="inspiration" class="pt-24 pb-8 px-4">
      <div class="max-w-4xl mx-auto space-y-6">
        <div class="bg-white rounded-3xl shadow-xl p-8" :style="{ borderTop: `4px solid ${inspiration.color}` }">
          <div class="flex items-center gap-3 mb-4">
            <span
              v-if="emotionInfo"
              class="px-3 py-1 text-white text-sm rounded-full"
              :style="{ backgroundColor: emotionInfo.color }"
            >
              {{ emotionInfo.label }}
            </span>
            <span class="text-gray-400 text-sm">
              {{ formatDate(inspiration.createdAt) }}
            </span>
          </div>

          <p class="text-xl leading-relaxed text-gray-800 mb-6">
            {{ inspiration.content }}
          </p>

          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in inspiration.tags"
              :key="tag"
              class="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-full"
            >
              #{{ tag }}
            </span>
          </div>
          
          <div v-if="inspiration.attachments.length > 0" class="mt-6">
            <h4 class="text-sm font-medium text-gray-700 mb-3">📎 附件</h4>
            <AttachmentDisplay 
              :attachments="inspiration.attachments" 
              :on-delete="handleDeleteInspirationAttachment"
            />
          </div>
          
          <div class="mt-4">
            <AttachmentUploader @upload="handleInspirationAttachmentUpload" />
          </div>
        </div>

        <!-- AI功能扩展 -->
        <div class="bg-white rounded-3xl shadow-xl p-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            AI 智能分析
          </h3>

          <div class="space-y-6">
            <!-- 可行性分析 -->
            <div>
              <button
                @click="showFeasibilityAnalysis = !showFeasibilityAnalysis"
                class="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-colors"
              >
                <span class="font-medium text-gray-800">分析想法可行性</span>
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="showFeasibilityAnalysis" class="mt-4 space-y-4">
                <div class="bg-gray-50 rounded-xl p-4">
                  <p class="text-sm text-gray-600 mb-4">
                    AI将从市场潜力、技术可行性、实施难度、竞争分析和潜在风险等方面评估您的想法。
                  </p>
                  <button
                    @click="handleFeasibilityAnalysis"
                    :disabled="isAnalyzingFeasibility || !aiConfig"
                    class="w-full py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <svg v-if="isAnalyzingFeasibility" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {{ isAnalyzingFeasibility ? '分析中...' : '开始分析' }}
                  </button>
                </div>
                
                <div v-if="feasibilityResult" class="bg-gray-50 rounded-xl p-6">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="px-3 py-1 text-white text-sm rounded-full" :class="{
                      'bg-green-500': feasibilityResult.feasibility === '高',
                      'bg-yellow-500': feasibilityResult.feasibility === '中',
                      'bg-red-500': feasibilityResult.feasibility === '低'
                    }">
                      可行性：{{ feasibilityResult.feasibility }}
                    </span>
                  </div>
                  <div class="mb-4">
                    <h4 class="font-medium text-gray-800 mb-2">详细分析</h4>
                    <p class="text-gray-600">{{ feasibilityResult.analysis }}</p>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-800 mb-2">建议</h4>
                    <ul class="list-disc list-inside space-y-1 text-gray-600">
                      <li v-for="(suggestion, index) in feasibilityResult.suggestions" :key="index">
                        {{ suggestion }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- 与AI对话 -->
            <div>
              <button
                @click="showChat = !showChat"
                class="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-colors"
              >
                <span class="font-medium text-gray-800">与AI对话</span>
                <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div v-if="showChat" class="mt-4">
                <div class="bg-gray-50 rounded-xl p-4 h-80 overflow-y-auto mb-4">
                  <div v-if="chatHistory.length === 0" class="text-center py-8 text-gray-500">
                    开始与AI对话，基于您的想法获取更多见解
                  </div>
                  <div v-else class="space-y-4">
                    <div v-for="(message, index) in chatHistory" :key="index" :class="[
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    ]">
                      <div :class="[
                        'max-w-[80%] p-3 rounded-lg',
                        message.role === 'user' 
                          ? 'bg-indigo-100 text-indigo-800 rounded-tr-none'
                          : 'bg-gray-200 text-gray-800 rounded-tl-none'
                      ]">
                        {{ message.content }}
                      </div>
                    </div>
                    <div v-if="isChatting" class="flex justify-start">
                      <div class="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-800 rounded-tl-none">
                        <div class="flex space-x-1">
                          <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
                          <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
                          <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-2">
                  <input
                    v-model="chatInput"
                    type="text"
                    placeholder="输入您的问题..."
                    @keydown.enter="handleChatSend"
                    class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <div class="flex gap-2">
                    <button
                      @click="resetChat"
                      class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      重置
                    </button>
                    <button
                      @click="handleChatSend"
                      :disabled="isChatting || !chatInput.trim() || !aiConfig"
                      class="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      发送
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-3xl shadow-xl p-8">
          <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            补充记录
          </h3>

          <div class="space-y-4 mb-6">
            <div
              v-for="supplement in inspiration.supplements"
              :key="supplement.id"
              class="bg-gray-50 rounded-xl p-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-2">
                    <span class="text-xs px-2 py-0.5 bg-white rounded-full text-gray-600">
                      {{ SUPPLEMENT_TYPES.find((t) => t.value === supplement.type)?.label }}
                    </span>
                    <span class="text-xs text-gray-400">
                      {{ formatDate(supplement.createdAt) }}
                    </span>
                  </div>
                  <p class="text-gray-700">{{ supplement.content }}</p>
                  
                  <div v-if="supplement.attachments.length > 0" class="mt-4">
                    <AttachmentDisplay 
                      :attachments="supplement.attachments" 
                      :on-delete="(id) => handleDeleteSavedSupplementAttachment(supplement.id, id)"
                    />
                  </div>
                </div>
                <button
                  @click="deleteSupplement(inspiration.id, supplement.id)"
                  class="text-gray-400 hover:text-red-500 transition-colors ml-4"
                >
                  &times;
                </button>
              </div>
            </div>

            <p v-if="inspiration.supplements.length === 0" class="text-gray-500 text-center py-4">
              还没有补充记录
            </p>
          </div>

          <div class="space-y-3">
            <div class="flex gap-2">
              <select
                v-model="supplementType"
                class="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option
                  v-for="type in SUPPLEMENT_TYPES"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.label }}
                </option>
              </select>
            </div>
            <div class="flex gap-3">
              <input
                v-model="newSupplement"
                type="text"
                placeholder="添加补充记录..."
                @keydown.enter="handleAddSupplement"
                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                @click="showSupplementAttachmentUploader = showSupplementAttachmentUploader === 'new' ? null : 'new'"
                class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                📎
              </button>
              <button
                @click="handleAddSupplement"
                :disabled="!newSupplement.trim()"
                class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                添加
              </button>
            </div>
            
            <div v-if="showSupplementAttachmentUploader === 'new'" class="mt-3">
              <AttachmentUploader @upload="(dataUrl, fileName, type) => handleSupplementAttachmentUpload('new', dataUrl, fileName, type)" />
              <div v-if="supplementAttachments['new'] && supplementAttachments['new'].length > 0" class="mt-3">
                <AttachmentDisplay 
                  :attachments="supplementAttachments['new']" 
                  :on-delete="(id) => handleDeleteSupplementAttachment('new', id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <div v-if="showAIConfig" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">AI 配置</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">AI 服务提供商</label>
            <select
              v-model="aiProvider"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="wenxin">百度文心一言</option>
              <option value="tongyi">阿里云通义千问</option>
              <option value="zhipu">智谱AI</option>
              <option value="deepseek">DeepSeek</option>
              <option value="openai">ChatGPT (OpenAI)</option>
              <option value="gemini">Google Gemini</option>
              <option value="custom">自定义</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              v-model="aiApiKey"
              type="password"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">模型名称 (可选)</label>
            <input
              v-model="aiModel"
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div v-if="aiProvider === 'custom'">
            <label class="block text-sm font-medium text-gray-700 mb-1">API URL</label>
            <input
              v-model="aiApiUrl"
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <div v-if="testResult" class="mt-4 p-3 rounded-lg" :class="testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
            {{ testResult.message }}
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="handleTestModel"
            :disabled="isTesting"
            class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <svg v-if="isTesting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isTesting ? '测试中...' : '测试模型' }}
          </button>
          <button
            @click="showAIConfig = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            取消
          </button>
          <button
            @click="saveAIConfig"
            class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>