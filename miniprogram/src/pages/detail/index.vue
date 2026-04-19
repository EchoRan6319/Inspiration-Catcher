<script setup>
import { ref, computed, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { useInspiration } from '@/composables/useInspiration'

const { getInspirationById, deleteInspiration } = useInspiration()
const routerParams = ref({})
const newSupplement = ref('')

const emotionOptions = [
  { value: 'excited', label: '兴奋', color: '#f59e0b' },
  { value: 'calm', label: '平静', color: '#0ea5e9' },
  { value: 'curious', label: '好奇', color: '#6366f1' },
  { value: 'anxious', label: '焦虑', color: '#ef4444' },
  { value: 'neutral', label: '中性', color: '#6b7280' }
]

const inspiration = computed(() => getInspirationById(routerParams.value.id))
const emotionInfo = computed(() => emotionOptions.find(opt => opt.value === inspiration.value?.emotion))

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
  Taro.showToast({
    title: '功能开发中',
    icon: 'none'
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

        <view v-if="inspiration.supplements.length > 0" class="supplements-section">
          <text class="section-title text-lg font-semibold text-gray-800 mb-4">📝 补充记录</text>
          <view class="supplement-list space-y-4">
            <view v-for="(supplement, index) in inspiration.supplements" :key="supplement.id" class="supplement-card">
              <text class="supplement-content text-gray-700">{{ supplement.content }}</text>
            </view>
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
  padding: 64rpx 32rpx;
  max-width: 900rpx;
  margin: 0 auto;
}

.inspiration-detail {
  background: white;
  border-radius: 48rpx;
  padding: 64rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);
  border-top: 8rpx solid;
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
