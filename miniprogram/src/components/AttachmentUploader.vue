<script setup>
import Taro from '@tarojs/taro'

const props = defineProps({
  onUpload: {
    type: Function,
    default: null
  },
  accept: {
    type: String,
    default: 'image/*,audio/*'
  }
})

function handleChooseImage() {
  Taro.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      // 转成 base64
      Taro.getFileSystemManager().readFile({
        filePath: tempFilePath,
        encoding: 'base64',
        success: (data) => {
          const dataUrl = `data:image/jpeg;base64,${data.data}`
          const fileName = tempFilePath.split('/').pop() || 'image.jpg'
          props.onUpload?.(dataUrl, fileName, 'image')
        }
      })
    }
  })
}

function handleChooseVideo() {
  Taro.chooseVideo({
    sourceType: ['album'],
    maxDuration: 60,
    camera: 'back',
    success: (res) => {
      const tempFilePath = res.tempFilePath
      Taro.getFileSystemManager().readFile({
        filePath: tempFilePath,
        encoding: 'base64',
        success: (data) => {
          const dataUrl = `data:audio/mp3;base64,${data.data}`
          const fileName = tempFilePath.split('/').pop() || 'audio.mp3'
          props.onUpload?.(dataUrl, fileName, 'audio')
        }
      })
    }
  })
}
</script>

<template>
  <view class="border-2 border-dashed rounded-xl p-8 text-center transition-all">
    <view class="space-y-4">
      <view class="flex justify-center">
        <text class="text-5xl">📎</text>
      </view>
      <view>
        <text class="text-gray-600 font-medium block mb-2">上传附件</text>
      </view>
      <view class="flex justify-center gap-4">
        <view
          @tap="handleChooseImage"
          class="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg">
          <text>上传图片</text>
        </view>
        <view
          @tap="handleChooseVideo"
          class="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg">
          <text>上传音频</text>
        </view>
      </view>
      <text class="text-gray-400 text-sm block">支持 JPG, PNG, MP3, WAV 等格式</text>
    </view>
  </view>
</template>
