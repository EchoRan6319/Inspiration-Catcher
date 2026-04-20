<script setup>
import { ref, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useInspiration } from '@/composables/useInspiration'

const { getInspirationById, deleteInspiration, addSupplement: addSupplementToInspiration } = useInspiration()
const routerParams = ref({})
const newSupplement = ref('')
const aiAnalysis = ref('')
const aiConversation = ref([])
const newAiMessage = ref('')

const emotionOptions = [
  { value: 'excited', label: '兴奋', color: '#f59e0b' },
  { value: 'calm', label: '平静', color: '#0ea5e9' },
  { value: 'curious', label: '好奇', color: '#6366f1' },
  { value: 'anxious', label: '焦虑', color: '#ef4444' },
  { value: 'neutral', label: '中性', color: '#6b7280' }
]

const inspiration = computed(() => getInspirationById(routerParams.value.id))
const emotionInfo = computed(() => emotionOptions.find(opt => opt.value === inspiration.value?.emotion))

onMounted(() => {
  // 获取路由参数
  const params = Taro.getCurrentInstance().router.params
  if (params && params.id) {
    routerParams.value = params
    // 加载已有数据
    loadExistingData()
  }
})

function loadExistingData() {
  const insp = inspiration.value
  if (insp) {
    // 加载 AI 分析数据
    if (insp.aiAnalysis) {
      aiAnalysis.value = insp.aiAnalysis
    }
    // 加载 AI 对话数据
    if (insp.aiConversation) {
      aiConversation.value = insp.aiConversation
    }
  }
}

function saveAiAnalysis() {
  const insp = inspiration.value
  if (insp && aiAnalysis.value) {
    // 保存 AI 分析数据到灵感对象
    insp.aiAnalysis = aiAnalysis.value
  }
}

function saveAiConversation() {
  const insp = inspiration.value
  if (insp && aiConversation.value.length > 0) {
    // 保存 AI 对话数据到灵感对象
    insp.aiConversation = aiConversation.value
  }
}

function sendAiMessage() {
  if (!newAiMessage.value.trim()) return
  
  // 添加用户消息
  aiConversation.value.push({
    id: Date.now().toString(),
    type: 'user',
    content: newAiMessage.value.trim(),
    timestamp: new Date()
  })
  
  // 模拟 AI 回复
  setTimeout(() => {
    aiConversation.value.push({
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: '这是一个模拟的 AI 回复，实际应用中会调用真实的 AI API',
      timestamp: new Date()
    })
    // 保存对话
    saveAiConversation()
  }, 1000)
  
  newAiMessage.value = ''
  // 保存对话
  saveAiConversation()
}

function goBack() {
  Taro.navigateBack()
}

function confirmDelete() {
  Taro.showModal({
    title: '确认删除',
    content: '确定要删除这个灵感吗？',
    success: (res) => {
      if (res.confirm) {
        deleteInspiration(routerParams.value.id)
        Taro.switchTab({ url: '/pages/collection/index' })
      }
    }
  })
}

function addSupplement() {
  if (!inspiration.value || !newSupplement.value.trim()) return
  
  // 添加补充记录
  addSupplementToInspiration(inspiration.value.id, newSupplement.value.trim())
  
  // 清空输入框
  newSupplement.value = ''
  
  // 显示成功提示
  Taro.showToast({
    title: '补充记录已保存',
    icon: 'success'
  })
}
</script>

<template>
  <view class="page-container">
    <view v-if="inspiration" class="content-wrapper">
      <view class="inspiration-detail" :style="{ borderTopColor: inspiration.color }">
        <view class="detail-header flex justify-between items-center mb-4">
          <view class="header-left flex items-center gap-2">
            <view v-if="emotionInfo" class="emotion-badge" :style="{ backgroundColor: emotionInfo.color }">
              {{ emotionInfo.label }}
            </view>
            <text class="date-text text-sm text-gray-600">
              {{ new Date(inspiration.createdAt).toLocaleDateString('zh-CN') }}
            </text>
          </view>
        </view>

        <text class="content-text text-xl text-gray-800 mb-6">
          {{ inspiration.content }}
        </text>

        <view v-if="inspiration.tags.length > 0" class="tags-wrapper flex gap-2 flex-wrap mb-6">
          <view v-for="tag in inspiration.tags" :key="tag" class="tag-badge">
            #{{ tag }}
          </view>
        </view>

        <!-- 补充记录 -->
        <view class="supplements-section">
          <text class="section-title text-lg font-semibold text-gray-800 mb-4">📝 补充记录</text>
          <view class="supplement-list space-y-4">
            <view v-for="(supplement, index) in inspiration.supplements" :key="supplement.id" class="supplement-card">
              <text class="supplement-content text-gray-700">{{ supplement.content }}</text>
            </view>
          </view>
          <view class="add-supplement">
            <textarea
              v-model="newSupplement"
              placeholder="添加补充记录..."
              class="supplement-input"
            />
            <view @tap="addSupplement" class="add-btn">添加</view>
          </view>
        </view>

        <!-- AI 分析 -->
        <view class="ai-analysis-section">
          <text class="section-title text-lg font-semibold text-gray-800 mb-4">🤖 AI 分析</text>
          <textarea
            v-model="aiAnalysis"
            placeholder="AI 分析结果将显示在这里..."
            class="ai-analysis-input"
            @blur="saveAiAnalysis"
          />
        </view>

        <!-- AI 对话 -->
        <view class="ai-conversation-section">
          <text class="section-title text-lg font-semibold text-gray-800 mb-4">💬 AI 对话</text>
          <view class="conversation-list">
            <view v-for="message in aiConversation" :key="message.id" :class="['message', message.type]">
              <text class="message-content">{{ message.content }}</text>
            </view>
          </view>
          <view class="message-input-wrapper">
            <input
              v-model="newAiMessage"
              placeholder="输入消息..."
              class="message-input"
              @confirm="sendAiMessage"
            />
            <view @tap="sendAiMessage" class="send-btn">发送</view>
          </view>
        </view>

        <view class="action-buttons flex gap-4 mt-8">
          <view @tap="goBack" class="action-btn back-btn">
            <text>返回</text>
          </view>
          <view @tap="confirmDelete" class="action-btn delete-btn">
            <text>删除</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f3f4f6, #e0e7ff);
}

.content-wrapper {
  padding: 32rpx 24rpx;
  max-width: 900rpx;
  margin: 0 auto;
  box-sizing: border-box;
}

.inspiration-detail {
  background: white;
  border-radius: 48rpx;
  padding: 48rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);
  border-top: 8rpx solid;
  box-sizing: border-box;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.emotion-badge {
  padding: 12rpx 32rpx;
  border-radius: 32rpx;
  color: white;
  font-size: 24rpx;
  font-weight: 500;
}

.date-text {
  font-size: 24rpx;
  color: #9ca3af;
}

.content-text {
  font-size: 36rpx;
  color: #1f2937;
  line-height: 1.6;
  margin-bottom: 48rpx;
  display: block;
}

.tags-wrapper {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
  margin-bottom: 48rpx;
}

.tag-badge {
  padding: 12rpx 32rpx;
  background: linear-gradient(to right, #6366f1, #7c3aed);
  color: white;
  border-radius: 48rpx;
  font-size: 24rpx;
}

.supplements-section {
  margin-top: 48rpx;
  padding-top: 48rpx;
  border-top: 2rpx solid #f3f4f6;
}

.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 32rpx;
  display: block;
}

.supplement-list {
  display: flex;
  flex-direction: column;
  gap: 32rpx;
}

.supplement-card {
  background: #f9fafb;
  border-radius: 24rpx;
  padding: 32rpx;
}

.supplement-content {
  font-size: 28rpx;
  color: #374151;
  display: block;
}

.add-supplement {
  display: flex;
  gap: 16rpx;
  margin-top: 32rpx;
  align-items: flex-end;
}

.supplement-input {
  flex: 1;
  min-height: 120rpx;
  padding: 16rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.add-btn {
  padding: 16rpx 32rpx;
  background: linear-gradient(to right, #6366f1, #7c3aed);
  color: white;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.ai-analysis-section {
  margin-top: 48rpx;
  padding-top: 48rpx;
  border-top: 2rpx solid #f3f4f6;
}

.ai-analysis-input {
  width: 100%;
  min-height: 160rpx;
  padding: 24rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.ai-conversation-section {
  margin-top: 48rpx;
  padding-top: 48rpx;
  border-top: 2rpx solid #f3f4f6;
}

.conversation-list {
  min-height: 200rpx;
  margin-bottom: 32rpx;
}

.message {
  margin-bottom: 16rpx;
  max-width: 80%;
  padding: 16rpx 24rpx;
  border-radius: 24rpx;
  box-sizing: border-box;
}

.message.user {
  background: #e0e7ff;
  color: #374151;
  align-self: flex-end;
  margin-left: auto;
  border-bottom-right-radius: 8rpx;
}

.message.ai {
  background: #f3f4f6;
  color: #374151;
  align-self: flex-start;
  border-bottom-left-radius: 8rpx;
}

.message-content {
  font-size: 28rpx;
  line-height: 1.4;
}

.message-input-wrapper {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 16rpx 24rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 32rpx;
  font-size: 28rpx;
  box-sizing: border-box;
}

.send-btn {
  padding: 16rpx 32rpx;
  background: linear-gradient(to right, #6366f1, #7c3aed);
  color: white;
  border-radius: 32rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 32rpx;
  margin-top: 64rpx;
}

.action-btn {
  flex: 1;
  padding: 24rpx 0;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
}

.back-btn {
  background: #e5e7eb;
  color: #374151;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 16rpx;
}

.gap-4 {
  gap: 32rpx;
}

.flex-wrap {
  flex-wrap: wrap;
}

.mb-4 {
  margin-bottom: 32rpx;
}

.mb-6 {
  margin-bottom: 48rpx;
}

.mt-8 {
  margin-top: 64rpx;
}

.text-sm {
  font-size: 24rpx;
}

.text-lg {
  font-size: 32rpx;
}

.text-xl {
  font-size: 36rpx;
}

.text-gray-600 {
  color: #4b5563;
}

.text-gray-700 {
  color: #374151;
}

.text-gray-800 {
  color: #1f2937;
}

.font-semibold {
  font-weight: 600;
}
</style>
