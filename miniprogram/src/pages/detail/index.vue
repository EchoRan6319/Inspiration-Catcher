<script setup>
import { ref, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useInspiration } from '@/composables/useInspiration'
import { useAI } from '@/composables/useAI'
import AttachmentUploader from '@/components/AttachmentUploader.vue'
import AttachmentDisplay from '@/components/AttachmentDisplay.vue'

import { formatDate } from '@/utils/helpers'
import { EMOTION_OPTIONS, SUPPLEMENT_TYPES } from '@/types'
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
const testResult = ref(null)

const showFeasibilityAnalysis = ref(false)
const isAnalyzingFeasibility = ref(false)
const feasibilityResult = ref(null)

const showChat = ref(false)
const isChatting = ref(false)
const chatInput = ref('')
const chatHistory = ref([])

const showSupplementAttachmentUploader = ref(null)
const supplementAttachments = ref({})

const routerParams = ref({})

const inspiration = computed(() => getInspirationById(routerParams.value.id))
const emotionInfo = computed(() => EMOTION_OPTIONS.find((e) => e.value === inspiration.value?.emotion))

const showAIConfig = ref(false)
const aiProvider = ref('wenxin')
const aiApiKey = ref('')
const aiModel = ref('')
const aiApiUrl = ref('')

const newSupplement = ref('')
const supplementType = ref('note')

function goBack() {
  Taro.navigateBack()
}

function goToCollection() {
  Taro.switchTab({
    url: '/pages/collection/index'
  })
}

function saveAIConfig() {
  const config = {
    provider: aiProvider.value,
    apiKey: aiApiKey.value,
    model: aiModel.value || undefined,
    apiUrl: aiApiUrl.value || undefined,
  }
  setConfig(config)
  showAIConfig.value = false
}

async function handleTestModel() {
  const config = {
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
    Taro.showToast({
      title: error instanceof Error ? error.message : '分析失败，请检查AI配置',
      icon: 'none'
    })
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
    Taro.showToast({
      title: error instanceof Error ? error.message : '对话失败，请检查AI配置',
      icon: 'none'
    })
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

function handleInspirationAttachmentUpload(dataUrl, fileName, type) {
  if (!inspiration.value) return
  addAttachmentToInspiration(inspiration.value.id, dataUrl, fileName, type)
}

function handleDeleteInspirationAttachment(attachmentId) {
  if (!inspiration.value) return
  deleteAttachmentFromInspiration(inspiration.value.id, attachmentId)
}

function handleSupplementAttachmentUpload(supplementId, dataUrl, fileName, type) {
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

function handleDeleteSupplementAttachment(supplementId, attachmentId) {
  if (supplementAttachments.value[supplementId]) {
    const index = supplementAttachments.value[supplementId].findIndex(a => a.id === attachmentId)
    if (index !== -1) {
      supplementAttachments.value[supplementId].splice(index, 1)
    }
  }
}

function handleDeleteSavedSupplementAttachment(supplementId, attachmentId) {
  if (!inspiration.value) return
  deleteAttachmentFromSupplement(inspiration.value.id, supplementId, attachmentId)
}

function confirmDelete() {
  Taro.showModal({
    title: '确认删除',
    content: '确定要删除这个灵感吗？',
    success: (res) => {
      if (res.confirm) {
        deleteInspiration(routerParams.value.id)
        Taro.switchTab({
          url: '/pages/collection/index'
        })
      }
    }
  })
}

onMounted(() => {
  const instance = Taro.getCurrentInstance()
  if (instance.router?.params) {
    routerParams.value = instance.router.params
  }
  if (aiConfig.value) {
    aiProvider.value = aiConfig.value.provider
    aiApiKey.value = aiConfig.value.apiKey
    aiModel.value = aiConfig.value.model || ''
    aiApiUrl.value = aiConfig.value.apiUrl || ''
  }
})
</script>

<template>
  <view class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
    <view v-if="inspiration" class="pt-8 pb-8 px-4">
      <view class="max-w-4xl mx-auto space-y-6">
        <view class="bg-white rounded-3xl shadow-xl p-8" :style="{ borderTop: `4px solid ${inspiration.color}` }">
          <view class="flex items-center gap-3 mb-4">
            <text
              v-if="emotionInfo"
              class="px-3 py-1 text-white text-sm rounded-full"
              :style="{ backgroundColor: emotionInfo.color }"
            >
              {{ emotionInfo.label }}
            </text>
            <text class="text-gray-400 text-sm">
              {{ formatDate(inspiration.createdAt) }}
            </text>
          </view>

          <text class="text-xl leading-relaxed text-gray-800 mb-6 block">
            {{ inspiration.content }}
          </text>

          <view class="flex flex-wrap gap-2">
            <text
              v-for="tag in inspiration.tags"
              :key="tag"
              class="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm rounded-full"
            >
              #{{ tag }}
            </text>
          </view>
          
          <view v-if="inspiration.attachments.length > 0" class="mt-6">
            <text class="text-sm font-medium text-gray-700 mb-3 block">📎 附件</text>
            <AttachmentDisplay 
              :attachments="inspiration.attachments" 
              :on-delete="handleDeleteInspirationAttachment"
            />
          </view>
          
          <view class="mt-4">
            <AttachmentUploader @upload="handleInspirationAttachmentUpload" />
          </view>
          
          <view class="flex gap-4 mt-6">
            <view
              @tap="goBack"
              class="flex-1 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all"
            >
              <text>返回</text>
            </view>
            <view
              @tap="confirmDelete"
              class="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-all"
            >
              <text>删除</text>
            </view>
          </view>
        </view>

        <view class="bg-white rounded-3xl shadow-xl p-8">
          <text class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            🤖 AI 智能分析
          </text>

          <view class="space-y-6">
            <view>
              <view
                @tap="showFeasibilityAnalysis = !showFeasibilityAnalysis"
                class="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all"
              >
                <text class="font-medium text-gray-800">分析想法可行性</text>
                <text>▼</text>
              </view>
              
              <view v-if="showFeasibilityAnalysis" class="mt-4 space-y-4">
                <view class="bg-gray-50 rounded-xl p-4">
                  <text class="text-sm text-gray-600 mb-4 block">
                    AI将从市场潜力、技术可行性、实施难度、竞争分析和潜在风险等方面评估您的想法。
                  </text>
                  <view
                    @tap="handleFeasibilityAnalysis"
                    class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <text>{{ isAnalyzingFeasibility ? '分析中...' : '开始分析' }}</text>
                  </view>
                </view>
                
                <view v-if="feasibilityResult" class="bg-gray-50 rounded-xl p-6">
                  <view class="flex items-center gap-2 mb-4">
                    <text class="px-3 py-1 text-white text-sm rounded-full" :class="{
                      'bg-green-500': feasibilityResult.feasibility === '高',
                      'bg-yellow-500': feasibilityResult.feasibility === '中',
                      'bg-red-500': feasibilityResult.feasibility === '低'
                    }">
                      可行性：{{ feasibilityResult.feasibility }}
                    </text>
                  </view>
                  <view class="mb-4">
                    <text class="font-medium text-gray-800 mb-2 block">详细分析</text>
                    <text class="text-gray-600">{{ feasibilityResult.analysis }}</text>
                  </view>
                  <view>
                    <text class="font-medium text-gray-800 mb-2 block">建议</text>
                    <view class="space-y-1">
                      <text v-for="(suggestion, index) in feasibilityResult.suggestions" :key="index" class="text-gray-600 block">
                        • {{ suggestion }}
                      </text>
                    </view>
                  </view>
                </view>
              </view>
            </view>

            <view>
              <view
                @tap="showChat = !showChat"
                class="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all"
              >
                <text class="font-medium text-gray-800">与AI对话</text>
                <text>▼</text>
              </view>
              
              <view v-if="showChat" class="mt-4">
                <view class="bg-gray-50 rounded-xl p-4 h-80 overflow-y-auto mb-4">
                  <view v-if="chatHistory.length === 0" class="text-center py-8 text-gray-500">
                    <text>开始与AI对话，基于您的想法获取更多见解</text>
                  </view>
                  <view v-else class="space-y-4">
                    <view v-for="(message, index) in chatHistory" :key="index" :class="[
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    ]">
                      <view :class="[
                        'max-w-[80%] p-3 rounded-lg',
                        message.role === 'user' 
                          ? 'bg-indigo-100 text-indigo-800 rounded-tr-none'
                          : 'bg-gray-200 text-gray-800 rounded-tl-none'
                      ]">
                        <text>{{ message.content }}</text>
                      </view>
                    </view>
                    <view v-if="isChatting" class="flex justify-start">
                      <view class="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-800 rounded-tl-none">
                        <text>...</text>
                      </view>
                    </view>
                  </view>
                </view>
                <view class="flex gap-2">
                  <input
                    v-model="chatInput"
                    type="text"
                    placeholder="输入您的问题..."
                    @confirm="handleChatSend"
                    class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <view class="flex gap-2">
                    <view
                      @tap="resetChat"
                      class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all"
                    >
                      <text>重置</text>
                    </view>
                    <view
                      @tap="handleChatSend"
                      class="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                    >
                      <text>发送</text>
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
        </view>

        <view class="bg-white rounded-3xl shadow-xl p-8">
          <text class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📝 补充记录
          </text>

          <view class="space-y-4 mb-6">
            <view
              v-for="supplement in inspiration.supplements"
              :key="supplement.id"
              class="bg-gray-50 rounded-xl p-4"
            >
              <view class="flex items-start justify-between">
                <view class="flex-1">
                  <view class="flex items-center gap-2 mb-2">
                    <text class="text-xs px-2 py-0.5 bg-white rounded-full text-gray-600">
                      {{ SUPPLEMENT_TYPES.find((t) => t.value === supplement.type)?.label }}
                    </text>
                    <text class="text-xs text-gray-400">
                      {{ formatDate(supplement.createdAt) }}
                    </text>
                  </view>
                  <text class="text-gray-700 block">{{ supplement.content }}</text>
                  
                  <view v-if="supplement.attachments.length > 0" class="mt-4">
                    <AttachmentDisplay 
                      :attachments="supplement.attachments" 
                      :on-delete="(id) => handleDeleteSavedSupplementAttachment(supplement.id, id)"
                    />
                  </view>
                </view>
                <view
                  @tap="deleteSupplement(inspiration.id, supplement.id)"
                  class="text-gray-400 hover:text-red-500 transition-all ml-4"
                >
                  <text>×</text>
                </view>
              </view>
            </view>

            <text v-if="inspiration.supplements.length === 0" class="text-gray-500 text-center py-4 block">
              还没有补充记录
            </text>
          </view>

          <view class="space-y-3">
            <view class="flex gap-2">
              <picker
                mode="selector"
                :range="SUPPLEMENT_TYPES"
                range-key="label"
                @change="(e) => supplementType = SUPPLEMENT_TYPES[e.detail.value].value"
              >
                <view class="px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <text>{{ SUPPLEMENT_TYPES.find(t => t.value === supplementType)?.label }}</text>
                </view>
              </picker>
            </view>
            <view class="flex gap-3">
              <input
                v-model="newSupplement"
                type="text"
                placeholder="添加补充记录..."
                @confirm="handleAddSupplement"
                class="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <view
                @tap="showSupplementAttachmentUploader = showSupplementAttachmentUploader === 'new' ? null : 'new'"
                class="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-all"
              >
                <text>📎</text>
              </view>
              <view
                @tap="handleAddSupplement"
                class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
              >
                <text>添加</text>
              </view>
            </view>
            
            <view v-if="showSupplementAttachmentUploader === 'new'" class="mt-3">
              <AttachmentUploader @upload="(dataUrl, fileName, type) => handleSupplementAttachmentUpload('new', dataUrl, fileName, type)" />
              <view v-if="supplementAttachments['new'] && supplementAttachments['new'].length > 0" class="mt-3">
                <AttachmentDisplay 
                  :attachments="supplementAttachments['new']" 
                  :on-delete="(id) => handleDeleteSupplementAttachment('new', id)"
                />
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="showAIConfig" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <view class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <text class="text-lg font-semibold text-gray-800 mb-4 block">AI 配置</text>
        <view class="space-y-4">
          <view>
            <text class="block text-sm font-medium text-gray-700 mb-1">AI 服务提供商</text>
            <picker
              mode="selector"
              :range="['wenxin', 'tongyi', 'zhipu', 'deepseek', 'openai', 'gemini', 'custom']"
              @change="(e) => aiProvider = ['wenxin', 'tongyi', 'zhipu', 'deepseek', 'openai', 'gemini', 'custom'][e.detail.value]"
            >
              <view class="w-full px-3 py-2 border border-gray-200 rounded-lg">
                <text>{{ aiProvider }}</text>
              </view>
            </picker>
          </view>
          <view>
            <text class="block text-sm font-medium text-gray-700 mb-1">API Key</text>
            <input
              v-model="aiApiKey"
              type="password"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </view>
          <view>
            <text class="block text-sm font-medium text-gray-700 mb-1">模型名称 (可选)</text>
            <input
              v-model="aiModel"
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </view>
          <view v-if="aiProvider === 'custom'">
            <text class="block text-sm font-medium text-gray-700 mb-1">API URL</text>
            <input
              v-model="aiApiUrl"
              type="text"
              class="w-full px-3 py-2 border border-gray-200 rounded-lg"
            />
          </view>
          
          <view v-if="testResult" class="mt-4 p-3 rounded-lg" :class="testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'">
            <text>{{ testResult.message }}</text>
          </view>
        </view>
        <view class="flex justify-end gap-3 mt-6">
          <view
            @tap="handleTestModel"
            class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all"
          >
            <text>{{ isTesting ? '测试中...' : '测试模型' }}</text>
          </view>
          <view
            @tap="showAIConfig = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-all"
          >
            <text>取消</text>
          </view>
          <view
            @tap="saveAIConfig"
            class="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            <text>保存</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>
