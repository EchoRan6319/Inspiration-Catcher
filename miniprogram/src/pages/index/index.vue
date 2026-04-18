<template>
  <view class="container">
    <view class="content">
      <text class="hello">Hello Taro!</text>
      <view class="card">
        <text>This is a Taro 3 + Vue 3 + TypeScript + Tailwind CSS project</text>
      </view>
      <view class="buttons">
        <view class="button green">
          <text>Button 1</text>
        </view>
        <view class="button purple">
          <text>Button 2</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'Index',
  mounted() {
    console.log('Index page mounted')
  }
}
</script>

<style lang="scss">
.container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content {
  text-align: center;
}

.hello {
  font-size: 32px;
  font-weight: bold;
  color: #1f2937;
}

.card {
  margin-top: 16px;
  padding: 16px;
  background-color: #dbeafe;
  border-radius: 8px;
}

.card text {
  color: #1e40af;
}

.buttons {
  margin-top: 16px;
  display: flex;
  gap: 8px;
}

.button {
  padding: 8px 16px;
  border-radius: 8px;
}

.button text {
  color: white;
}

.green {
  background-color: #22c55e;
}

.purple {
  background-color: #a855f7;
}
</style>