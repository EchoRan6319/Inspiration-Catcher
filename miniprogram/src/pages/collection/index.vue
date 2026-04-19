<script setup>
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import { useInspiration } from '@/composables/useInspiration'

const { inspirations, allTags, loadDemoData } = useInspiration()
const showDemoToast = ref(false)
const searchQuery = ref('')

const emotionOptions = [
  { value: 'excited', label: '兴奋', color: '#f59e0b' },
  { value: 'calm', label: '平静', color: '#0ea5e9' },
  { value: 'curious', label: '好奇', color: '#6366f1' },
  { value: 'anxious', label: '焦虑', color: '#ef4444' },
  { value: 'neutral', label: '中性', color: '#6b7280' }
]

const filteredInspirations = computed(() => {
  if (!searchQuery.value) return inspirations.value
  const query = searchQuery.value.toLowerCase()
  return inspirations.value.filter(
    insp => 
      insp.content.toLowerCase().includes(query) ||
      insp.tags.some(tag => tag.toLowerCase().includes(query))
  )
})

function goToDetail(inspirationId) {
  Taro.navigateTo({ url: `/pages/detail/index?id=${inspirationId}` })
}

function goToCapture() {
  Taro.switchTab({ url: '/pages/capture/index' })
}

function handleLoadDemo() {
  const success = loadDemoData()
  if (success) {
    showDemoToast.value = true
    setTimeout(() => {
      showDemoToast.value = false
    }, 3000)
  }
}

function getEmotionInfo(emotionValue) {
  return emotionOptions.find(opt => opt.value === emotionValue)
}
</script>

<template>
  <view class="page-container">
    <view class="content-wrapper">
      <view class="header">
        <view class="search-wrapper">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索灵感..."
            class="search-input"
          />
        </view>
      </view>

      <view v-if="filteredInspirations.length > 0" class="inspiration-list">
        <view
          v-for="inspiration in filteredInspirations"
          :key="inspiration.id"
          @tap="goToDetail(inspiration.id)"
          class="inspiration-card"
          :style="{ borderLeftColor: inspiration.color }"
        >
          <view class="card-header flex justify-between items-center mb-2">
            <view class="header-left flex items-center gap-2">
              <view
                v-if="getEmotionInfo(inspiration.emotion)"
                class="emotion-badge"
                :style="{ backgroundColor: getEmotionInfo(inspiration.emotion)?.color }"
              >
                {{ getEmotionInfo(inspiration.emotion)?.label }}
              </view>
              <text class="date-text text-sm text-gray-600">
                {{ new Date(inspiration.createdAt).toLocaleDateString('zh-CN') }}
              </text>
            </view>
          </view>

          <text class="content-text text-lg text-gray-800 mb-4">
            {{ inspiration.content.length > 100 ? inspiration.content.slice(0, 100) + '...' : inspiration.content }}
          </text>

          <view v-if="inspiration.tags.length > 0" class="tags-wrapper flex gap-2 flex-wrap">
            <view
              v-for="tag in inspiration.tags.slice(0, 3)"
              :key="tag"
              class="tag-badge"
            >
              #{{ tag }}
            </view>
            <text v-if="inspiration.tags.length > 3" class="more-tags text-sm text-gray-600">
              +{{ inspiration.tags.length - 3 }}
            </text>
          </view>

          <view v-if="inspiration.supplements.length > 0" class="supplement-info mt-4 pt-4 border-t border-gray-100">
            <view class="flex items-center gap-1 text-sm text-gray-600">
              <text>📝</text>
              <text>{{ inspiration.supplements.length }} 条补充</text>
            </view>
          </view>
        </view>
      </view>

      <view v-else class="empty-state text-center py-16">
        <text class="empty-icon text-6xl mb-4">✨</text>
        <text class="empty-title text-xl font-semibold text-gray-800 mb-2">
          {{ inspirations.length === 0 ? '还没有灵感记录' : '没有找到匹配的灵感' }}
        </text>
        <text class="empty-desc text-gray-600 mb-6">
          {{ inspirations.length === 0 ? '开始记录您的第一个灵感吧！' : '尝试调整搜索条件' }}
        </text>
        <view class="empty-actions flex flex-col sm:flex-row gap-3 justify-center">
          <view @tap="goToCapture" class="action-btn primary">
            <text>记录灵感</text>
          </view>
          <view
            v-if="inspirations.length === 0"
            @tap="handleLoadDemo"
            class="action-btn secondary"
          >
            <text>加载Demo数据</text>
          </view>
        </view>
      </view>
    </view>

    <view v-if="showDemoToast" class="demo-toast">
      <text>Demo数据加载成功！</text>
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
  max-width: 1200rpx;
  margin: 0 auto;
}

.header {
  margin-bottom: 48rpx;
}

.search-wrapper {
  max-width: 800rpx;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 24rpx 32rpx;
  padding-left: 80rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 32rpx;
  font-size: 28rpx;
  background: white;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="%239ca3af"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>');
  background-repeat: no-repeat;
  background-position: 24rpx center;
  background-size: 32rpx 32rpx;
}

.inspiration-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32rpx;
}

.inspiration-card {
  background: white;
  border-radius: 48rpx;
  padding: 48rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.08);
  border-left: 8rpx solid;
  cursor: pointer;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.emotion-badge {
  padding: 8rpx 24rpx;
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
  font-size: 32rpx;
  color: #1f2937;
  line-height: 1.6;
  margin-bottom: 32rpx;
  display: block;
}

.tags-wrapper {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}

.tag-badge {
  padding: 8rpx 24rpx;
  background: linear-gradient(to right, #6366f1, #7c3aed);
  color: white;
  border-radius: 32rpx;
  font-size: 24rpx;
}

.more-tags {
  font-size: 24rpx;
  color: #9ca3af;
  align-self: center;
}

.supplement-info {
  margin-top: 32rpx;
  padding-top: 32rpx;
  border-top: 2rpx solid #f3f4f6;
}

.supplement-info view {
  display: flex;
  align-items: center;
  gap: 8rpx;
  font-size: 24rpx;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 128rpx 0;
}

.empty-icon {
  font-size: 96rpx;
  display: block;
  margin-bottom: 32rpx;
}

.empty-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1f2937;
  display: block;
  margin-bottom: 16rpx;
}

.empty-desc {
  font-size: 28rpx;
  color: #6b7280;
  display: block;
  margin-bottom: 48rpx;
}

.empty-actions {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  justify-content: center;
}

.action-btn {
  padding: 24rpx 48rpx;
  border-radius: 48rpx;
  font-size: 28rpx;
  font-weight: 600;
  display: inline-block;
}

.action-btn.primary {
  background: linear-gradient(to right, #6366f1, #7c3aed);
  color: white;
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.3);
}

.action-btn.secondary {
  background: linear-gradient(to right, #f59e0b, #f97316);
  color: white;
  box-shadow: 0 8rpx 24rpx rgba(245, 158, 11, 0.3);
}

.action-btn text {
  color: white;
}

.demo-toast {
  position: fixed;
  bottom: 32rpx;
  right: 32rpx;
  padding: 16rpx 32rpx;
  background: #10b981;
  color: white;
  border-radius: 16rpx;
  font-size: 28rpx;
  z-index: 9999;
  box-shadow: 0 8rpx 24rpx rgba(16, 185, 129, 0.3);
}

.flex {
  display: flex;
}

.justify-between {
  justify-content: space-between;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 16rpx;
}

.gap-3 {
  gap: 24rpx;
}

.flex-wrap {
  flex-wrap: wrap;
}

.text-center {
  text-align: center;
}

.mb-2 {
  margin-bottom: 16rpx;
}

.mb-4 {
  margin-bottom: 32rpx;
}

.mb-6 {
  margin-bottom: 48rpx;
}

.mt-4 {
  margin-top: 32rpx;
}

.pt-4 {
  padding-top: 32rpx;
}

.border-t {
  border-top-width: 2rpx;
}

.border-gray-100 {
  border-color: #f3f4f6;
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

.text-gray-800 {
  color: #1f2937;
}

.font-semibold {
  font-weight: 600;
}

.py-16 {
  padding-top: 128rpx;
  padding-bottom: 128rpx;
}
</style>
