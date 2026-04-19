<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import InspirationCard from '@/components/InspirationCard.vue'
import { useInspiration } from '@/composables/useInspiration'

const router = useRouter()
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
const selectedTag = ref<string | null>(null)

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
  router.push('/')
}

function goToSerendipity() {
  router.push('/serendipity')
}

function clearFilters() {
  searchQuery.value = ''
  selectedTag.value = null
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
    <nav class="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          ✨ 灵感集
        </h1>
        <div class="flex gap-3">
          <button
            @click="goToCapture"
            class="px-4 py-2 text-gray-600 hover:text-indigo-600 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            记录灵感
          </button>
          <button
            @click="goToSerendipity"
            class="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all flex items-center gap-2"
          >
            🎲 拾遗
          </button>
        </div>
      </div>
    </nav>

    <main class="pt-24 pb-8 px-4">
      <div class="max-w-6xl mx-auto">
        <div class="mb-8">
          <div class="relative max-w-xl mb-6">
            <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索灵感..."
              class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
            <button
              v-if="searchQuery || selectedTag"
              @click="clearFilters"
              class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              &times;
            </button>
          </div>

          <div v-if="allTags.length > 0" class="flex flex-wrap gap-2">
            <span class="text-sm text-gray-500 self-center">标签筛选：</span>
            <button
              v-for="tag in allTags"
              :key="tag"
              @click="selectedTag = selectedTag === tag ? null : tag"
              :class="[
                'px-3 py-1.5 text-sm rounded-full transition-all',
                selectedTag === tag
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200',
              ]"
            >
              #{{ tag }}
            </button>
          </div>
        </div>

        <div v-if="filteredInspirations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InspirationCard
            v-for="inspiration in filteredInspirations"
            :key="inspiration.id"
            :inspiration="inspiration"
          />
        </div>

        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">✨</div>
          <h3 class="text-xl font-semibold text-gray-800 mb-2">
            {{ inspirations.length === 0 ? '还没有灵感记录' : '没有找到匹配的灵感' }}
          </h3>
          <p class="text-gray-500 mb-6">
            {{ inspirations.length === 0 ? '开始记录您的第一个灵感吧！' : '尝试调整搜索条件或筛选标签' }}
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              @click="goToCapture"
              class="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg"
            >
              记录灵感
            </button>
            <button
              v-if="inspirations.length === 0"
              @click="handleLoadDemo"
              class="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full font-semibold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
            >
              加载Demo数据
            </button>
          </div>
        </div>

        <div v-if="showDemoToast" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          Demo数据加载成功！
        </div>
      </div>
    </main>
  </div>
</template>
