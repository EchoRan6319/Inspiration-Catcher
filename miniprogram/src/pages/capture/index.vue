<script setup>
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { useInspiration } from '@/composables/useInspiration'

const { createInspiration } = useInspiration()

const content = ref('')
const tags = ref([])
const emotion = ref('neutral')
const isSaving = ref(false)
const showSuccess = ref(false)
const newTag = ref('')

const emotionOptions = [
  { value: 'excited', label: '兴奋', color: '#f59e0b' },
  { value: 'calm', label: '平静', color: '#0ea5e9' },
  { value: 'curious', label: '好奇', color: '#6366f1' },
  { value: 'anxious', label: '焦虑', color: '#ef4444' },
  { value: 'neutral', label: '中性', color: '#6b7280' }
]

function saveInspiration() {
  if (!content.value.trim()) return

  isSaving.value = true
  createInspiration(content.value.trim(), tags.value, emotion.value)
  
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
    content.value = ''
    tags.value = []
    emotion.value = 'neutral'
  }, 1500)

  isSaving.value = false
}

function addTag() {
  if (newTag.value.trim() && !tags.value.includes(newTag.value.trim())) {
    tags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

function removeTag(tagToRemove) {
  tags.value = tags.value.filter(tag => tag !== tagToRemove)
}

function selectEmotion(emotionValue) {
  emotion.value = emotionValue
}

function getEmotionStyle(option) {
  const isActive = emotion.value === option.value
  return {
    backgroundColor: isActive ? option.color : 'white',
    color: isActive ? 'white' : option.color,
    border: `2rpx solid ${option.color}`
  }
}
</script>

<template>
  <view class="page-container">
    <view class="content-wrapper">
      <view class="header">
        <text class="title">捕捉那转瞬即逝的灵感 ✨</text>
        <text class="subtitle">把此刻的想法记录下来，让创意不再流失</text>
      </view>

      <view class="card">
        <view class="form-group">
          <text class="label">💭 你的灵感</text>
          <textarea
            v-model="content"
            placeholder="在这里记录你的灵感..."
            class="textarea"
          />
        </view>

        <view class="form-group">
          <text class="label">😊 此刻的心情</text>
          <view class="emotion-picker">
            <view
              v-for="option in emotionOptions"
              :key="option.value"
              @tap="selectEmotion(option.value)"
              :class="['emotion-tag', { active: emotion === option.value }]"
              :style="getEmotionStyle(option)"
            >
              {{ option.label }}
            </view>
          </view>
        </view>

        <view class="form-group">
          <text class="label">🏷️ 添加标签</text>
          <view class="tag-input-wrapper">
            <input
              v-model="newTag"
              placeholder="输入标签..."
              class="tag-input"
              @confirm="addTag"
            />
            <view @tap="addTag" class="add-tag-btn">添加</view>
          </view>
          <view class="tags-list">
            <view v-for="tag in tags" :key="tag" class="tag-item">
              {{ tag }}
              <text @tap="removeTag(tag)" class="tag-close">×</text>
            </view>
          </view>
        </view>

        <view class="save-btn-wrapper">
          <view
            @tap="saveInspiration"
            class="save-btn"
          >
            <text v-if="showSuccess">✓</text>
            <text>{{ showSuccess ? '已保存！' : '保存灵感' }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss">
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #e0e7ff, #ede9fe, #fce7f3);
}

.content-wrapper {
  padding: 64rpx 32rpx;
  max-width: 900rpx;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 64rpx;
}

.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #1f2937;
  display: block;
  margin-bottom: 16rpx;
}

.subtitle {
  font-size: 28rpx;
  color: #4b5563;
}

.card {
  background: white;
  border-radius: 48rpx;
  padding: 64rpx;
  box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 48rpx;
}

.label {
  display: block;
  font-size: 28rpx;
  font-weight: 500;
  color: #374151;
  margin-bottom: 16rpx;
}

.textarea {
  width: 100%;
  min-height: 384rpx;
  padding: 24rpx;
  border: 4rpx solid #e5e7eb;
  border-radius: 32rpx;
  font-size: 32rpx;
  background: white;
}

.emotion-picker {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
}

.emotion-tag {
  padding: 16rpx 32rpx;
  border-radius: 48rpx;
  font-size: 28rpx;
  font-weight: 500;
  transition: all 0.2s;
}

.emotion-tag.active {
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.tag-input-wrapper {
  display: flex;
  gap: 16rpx;
  align-items: center;
}

.tag-input {
  flex: 1;
  padding: 16rpx 24rpx;
  border: 2rpx solid #e5e7eb;
  border-radius: 16rpx;
  font-size: 28rpx;
}

.add-tag-btn {
  padding: 16rpx 32rpx;
  background: linear-gradient(to right, #6366f1, #7c3aed);
  color: white;
  border-radius: 16rpx;
  font-size: 28rpx;
  font-weight: 500;
}

.tags-list {
  display: flex;
  gap: 16rpx;
  flex-wrap: wrap;
  margin-top: 16rpx;
}

.tag-item {
  padding: 12rpx 24rpx;
  background: linear-gradient(to right, #6366f1, #7c3aed);
  color: white;
  border-radius: 48rpx;
  font-size: 24rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.tag-close {
  font-size: 32rpx;
  line-height: 1;
  cursor: pointer;
  margin-left: 8rpx;
}

.save-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  padding-top: 32rpx;
}

.save-btn {
  padding: 24rpx 64rpx;
  background: linear-gradient(to right, #6366f1, #7c3aed);
  color: white;
  border-radius: 48rpx;
  font-size: 32rpx;
  font-weight: 600;
  box-shadow: 0 8rpx 24rpx rgba(99, 102, 241, 0.3);
  display: flex;
  align-items: center;
  gap: 16rpx;
}

.save-btn text {
  color: white;
}
</style>
