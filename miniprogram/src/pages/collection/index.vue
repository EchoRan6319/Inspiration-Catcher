<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import InspirationCard from '@/components/InspirationCard.vue'
import { useInspiration } from '@/composables/useInspiration'

const { inspirations, allTags, searchInspirations, filterInspirationsByTag, loadDemoData } = useInspiration()

const showDemoToast = ref(false)

function handleLoadDemo() {
  const success = loadDemoData()
  if (success) {
    showDemoToast.value = true
    setTimeout(() => {
      showDemoToast.value = false
    }, 3000)
  }
}

const searchQuery = ref('')
const selectedTag = ref(null as string | null)

const filteredInspirations = computed(() => {
  let result = inspirations.value

  if (searchQuery.value) {
    result = searchInspirations(searchQuery.value)
  }

  if (selectedTag.value) {
    result = result.filter((insp) => insp.tags.includes(selectedTag.value!))
  }

  return result
})

function goToCapture() {
  Taro.switchTab({
    url: '/pages/capture/index'
  })
}

function goToSerendipity() {
  Taro.navigateTo({
    url: '/pages/serendipity/index'
  })
}

function clearFilters() {
  searchQuery.value = ''
  selectedTag.value = null
}
</script>

<template>
  <view class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
    <view class="pt-8 pb-8 px-4">
      <view class="max-w-6xl mx-auto">
        <view class="mb-8">
          <view class="relative max-w-xl mb-6">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索灵感..."
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <view
              v-if="searchQuery || selectedTag"
              @tap="clearFilters"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-800"
            >
              <text>×</text>
            </view>
          </view>

          <view v-if="allTags.length > 0" class="flex flex-wrap gap-2">
            <text class="text-sm text-gray-500 self-center">标签筛选：</text>
            <view
              v-for="tag in allTags"
              :key="tag"
              @tap="selectedTag = selectedTag === tag ? null : tag"
              :class="[
                'px-3 py-1.5 text-sm rounded-full transition-all',
                selectedTag === tag
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
              ]"
            >
              <text>#{{ tag }}</text>
            </view>
          </view>
        </view>

        <view v-if="filteredInspirations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InspirationCard
            v-for="inspiration in filteredInspirations"
            :key="inspiration.id"
            :inspiration="inspiration"
          />
        </view>

        <view v-else class="text-center py-16">
          <text class="text-6xl mb-4 block">✨</text>
          <text class="text-xl font-semibold text-gray-800 mb-2 block">
            {{ inspirations.length === 0 ? '还没有灵感记录' : '没有找到匹配的灵感' }}
          </text>
          <text class="text-gray-500 mb-6 block">
            {{ inspirations.length === 0 ? '开始记录您的第一个灵感吧！' : '尝试调整搜索条件或筛选标签' }}
          </text>
          <view class="flex flex-col sm:flex-row gap-3 justify-center">
            <view
              @tap="goToCapture"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              <text>记录灵感</text>
            </view>
            <view
              v-if="inspirations.length === 0"
              @tap="handleLoadDemo"
              class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
            >
              <text>加载Demo数据</text>
            </view>
          </view>
        </view>

        <view v-if="showDemoToast" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          <text>Demo数据加载成功！</text>
        </view>
      </view>
    </view>
  </view>
</template>
