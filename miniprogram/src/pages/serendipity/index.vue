<script setup>
import { onMounted, computed } from 'vue'
import Taro from '@tarojs/taro'
import { useSerendipity } from '@/composables/useSerendipity'

const { currentInspiration, isAnimating, hasInspirations, showRandomInspiration, goBack } = useSerendipity()

const emotionOptions = [
  { value: 'excited', label: '兴奋', color: '#f59e0b' },
  { value: 'calm', label: '平静', color: '#0ea5e9' },
  { value: 'curious', label: '好奇', color: '#6366f1' },
  { value: 'anxious', label: '焦虑', color: '#ef4444' },
  { value: 'neutral', label: '中性', color: '#6b7280' }
]

const emotionInfo = computed(() => emotionOptions.find(opt => opt.value === currentInspiration.value?.emotion))

function goToDetail() {
  if (currentInspiration.value) {
    Taro.navigateTo({ url: `/pages/detail/index?id=${currentInspiration.value.id}` })
  }
}
</script>

<template>
  <view class="page-container">
    <view class="content-wrapper">
      <view v-if="hasInspirations" class="header text-center mb-8">
        <text class="title text-2xl font-semibold text-gray-800 mb-2">发现被遗忘的灵感 ✨</text>
        <text class="subtitle text-sm text-gray-600">随机展示一个您之前记录的灵感</text>
      </view>

      <view v-if="currentInspiration" class="inspiration-display">
        <view
          class="inspiration-card"
          :style="{ borderTopColor: currentInspiration.color }"
        >
          <view class="card-header flex justify-between items-center mb-4">
            <view class="header-left flex items-center gap-2">
              <view v-if="emotionInfo" class="emotion-badge" :style="{ backgroundColor: emotionInfo.color }">
                {{ emotionInfo.label }}
              </view>
              <text class="date-text text-sm text-gray-600">
                {{ new Date(currentInspiration.createdAt).toLocaleDateString('zh-CN') }}
              </text>
            </view>
          </view>

          <text class="content-text text-xl text-gray-800 mb-6">
            {{ currentInspiration.content }}
          </text>

          <view v-if="currentInspiration.tags.length > 0" class="tags-wrapper flex gap-2 flex-wrap mb-6">
            <view v-for="tag in currentInspiration.tags" :key="tag" class="tag-badge">
              #{{ tag }}
            </view>
          </view>

          <view @tap="goToDetail" class="view-detail-btn">
            <text>查看详情 →</text>
          </view>
        </view>

        <view class="card-actions flex justify-center gap-4 mt-8">
          <view @tap="showRandomInspiration" class="action-btn random-btn">
            <text>{{ isAnimating ? '随机中...' : '换一个 🎲' }}</text>
          </view>
        </view>
      </view>

      <view v-else class="empty-state text-center py-16">
        <text class="empty-icon text-6xl mb-4">📝</text>
        <text class="empty-title text-xl font-semibold text-gray-800 mb-2">还没有灵感记录</text>
        <text class="empty-desc text-gray-600 mb-6">先记录一些灵感，再来体验拾遗功能吧！</text>
        <view @tap="Taro.switchTab({ url: '/pages/capture/index' })" class="go-capture-btn">
          <text>记录第一个灵感</text>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fef3c7, #fdd6ba, #fce7f3);
}

.content-wrapper {
  padding: 64rpx 32rpx;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header {
  text-align: center;
  margin-bottom: 64rpx;
}

.title {
  font-size: 48rpx;
  font-weight: 600;
  color: #1f2937;
  display: block;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #6b7280;
}

.inspiration-display {
  width: 100%;
  max-width: 800rpx;
}

.inspiration-card {
  background: white;
  border-radius: 48rpx;
  padding: 64rpx;
  box-shadow: 0 12rpx 48rpx rgba(0, 0, 0, 0.12);
  border-top: 8rpx solid;
}

.card-header {
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
  background: linear-gradient(to right, #f59e0b, #f97316);
  color: white;
  border-radius: 48rpx;
  font-size: 24rpx;
}

.view-detail-btn {
  width: 100%;
  padding: 24rpx 0;
  background: linear-gradient(to right, #374151, #1f2937);
  color: white;
  border-radius: 24rpx;
  font-size: 28rpx;
  font-weight: 600;
  text-align: center;
}

.view-detail-btn text {
  color: white;
}

.card-actions {
  display: flex;
  justify-content: center;
  gap: 32rpx;
  margin-top: 64rpx;
}

.action-btn {
  padding: 24rpx 64rpx;
  border-radius: 48rpx;
  font-size: 28rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.random-btn {
  background: linear-gradient(to right, #f59e0b, #f97316);
  color: white;
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

.go-capture-btn {
  padding: 24rpx 48rpx;
  background: linear-gradient(to right, #f59e0b, #f97316);
  color: white;
  border-radius: 48rpx;
  font-size: 28rpx;
  font-weight: 600;
  display: inline-block;
  box-shadow: 0 8rpx 24rpx rgba(245, 158, 11, 0.3);
}

.go-capture-btn text {
  color: white;
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

.gap-4 {
  gap: 32rpx;
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

.mb-8 {
  margin-bottom: 64rpx;
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

.text-2xl {
  font-size: 48rpx;
}

.text-6xl {
  font-size: 96rpx;
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
