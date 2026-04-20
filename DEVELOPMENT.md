# 灵感捕手 - 开发文档

## 1. 项目概述

### 1.1 项目简介
灵感捕手是一个独特的灵感记录应用，专注于捕捉那些转瞬即逝的创意火花，提供AI智能分析和惊喜的"拾遗"体验。该项目同时支持 Web 和微信小程序双平台。

### 1.2 项目结构
```
workspace/
├── miniprogram/          # 微信小程序版本
│   ├── src/
│   │   ├── pages/
│   │   │   ├── capture/      # 灵感捕捉页
│   │   │   ├── collection/   # 灵感集页
│   │   │   ├── detail/       # 灵感详情页
│   │   │   ├── index/        # 首页
│   │   │   └── serendipity/  # 拾遗页
│   │   ├── components/       # 组件
│   │   ├── composables/      # 组合式函数
│   │   ├── utils/            # 工具函数
│   │   ├── types/            # 类型定义
│   │   └── app.*             # 应用入口
│   └── package.json
└── src/                  # Web 版本
    ├── pages/
    │   ├── CapturePage.vue    # 灵感捕捉页
    │   ├── CollectionPage.vue # 灵感集页
    │   ├── DetailPage.vue     # 灵感详情页
    │   ├── HomePage.vue       # 首页
    │   └── SerendipityPage.vue # 拾遗页
    ├── components/        # 组件
    ├── composables/       # 组合式函数
    ├── utils/             # 工具函数
    ├── types/             # 类型定义
    └── App.vue            # 应用入口
```

### 1.3 技术栈

#### Web 版本
- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **样式框架**: Tailwind CSS
- **路由**: Vue Router
- **存储**: LocalStorage

#### 微信小程序版本
- **框架**: Taro 4.2.0
- **前端框架**: Vue 3
- **样式**: SCSS
- **存储**: Taro 存储 API

## 2. UI 设计要求

### 2.1 设计风格
- **主色调**: 深邃紫 (#6366f1) 搭配温暖橙 (#f59e0b)
- **辅助色**: 柔和粉 (#ec4899)、清新蓝 (#0ea5e9)、中性灰 (#6b7280)
- **按钮风格**: 圆角矩形，带有微妙的阴影和悬停效果
- **字体**: Noto Sans SC 中文显示
- **布局风格**: 卡片式网格布局，强调层次和呼吸感
- **图标/emoji**: 使用圆润的线性图标，适当加入创意emoji

### 2.2 色彩系统
| 颜色名称 | 颜色值 | 用途 |
|---------|--------|------|
| 主紫 | #6366f1 | 主按钮、重要操作、高亮 |
| 辅紫 | #7c3aed | 渐变背景、次要按钮 |
| 温暖橙 | #f59e0b | 情感标记、强调 |
| 清新蓝 | #0ea5e9 | 情感标记、强调 |
| 柔和粉 | #ec4899 | 情感标记、强调 |
| 焦虑红 | #ef4444 | 情感标记、删除操作 |
| 中性灰 | #6b7280 | 普通文本、边框 |

### 2.3 字体和间距
- **标题字号**: 48rpx (3xl)
- **正文字号**: 32rpx (lg)
- **辅助字号**: 28rpx (sm)
- **卡片内边距**: 48rpx
- **内容区域内边距**: 32rpx 24rpx
- **元素间距**: 16rpx, 32rpx, 48rpx

### 2.4 响应式设计
- **移动端优先**: 完美适配手机屏幕
- **触摸优化**: 大点击区域，流畅的滑动手势
- **Web 端适配**: 在平板和桌面设备上提供更好的体验

## 3. 功能要求

### 3.1 功能模块总览
| 功能模块 | 页面 | 功能描述 |
|---------|------|---------|
| 灵感捕捉 | capture | 快速记录灵感，添加标签和情感色彩 |
| 灵感集 | collection | 浏览所有灵感，支持筛选、搜索和排序 |
| 灵感详情 | detail | 查看完整灵感，AI分析总结，添加补充记录 |
| 拾遗发现 | serendipity | 随机展示过往灵感，带来意外发现的惊喜 |

### 3.2 灵感捕捉页面功能要求

#### UI 要求
- 全屏沉浸式体验，动态背景
- 大文本输入框，流畅的打字体验
- 情感选择器（5种选项）
- 标签添加和管理
- 保存按钮

#### 功能要求
1. **灵感记录**
   - 支持文本输入，自动保存
   - 自动记录创建时间
   - 支持添加多个标签
   - 支持情感标记

2. **情感选择**
   - 兴奋 (excited): #f59e0b
   - 平静 (calm): #0ea5e9
   - 好奇 (curious): #6366f1
   - 焦虑 (anxious): #ef4444
   - 中性 (neutral): #6b7280

3. **标签管理**
   - 支持添加标签
   - 支持删除标签
   - 标签样式：圆角矩形，渐变背景

4. **保存逻辑**
   - 保存按钮点击触发保存
   - 保存成功后显示确认动画
   - 清空表单，准备下次记录

### 3.3 灵感集页面功能要求

#### UI 要求
- 顶部搜索框，居中显示
- 灵感卡片网格布局
- 卡片左侧有颜色边框
- 显示情感标签、日期和内容
- 空状态显示

#### 功能要求
1. **搜索功能**
   - 支持全文搜索灵感内容和标签
   - 实时搜索反馈
   - 搜索框带有放大镜图标

2. **灵感卡片**
   - 显示灵感摘要（内容过长时截断）
   - 显示情感标签
   - 显示创建日期
   - 显示标签
   - 左侧边框颜色根据情感/颜色字段显示
   - 点击卡片进入详情页

3. **空状态处理**
   - 无灵感时显示引导文本
   - 提供"记录灵感"按钮
   - 提供"加载Demo数据"按钮

4. **Demo数据加载**
   - 一键加载示例数据
   - 仅在无数据时显示
   - 防止重复加载

### 3.4 灵感详情页面功能要求

#### UI 要求
- 顶部导航栏，返回按钮和删除按钮
- 灵感内容区域，突出显示
- AI 分析区域，带渐变背景
- 补充记录列表
- 添加补充记录表单
- 附件上传和显示

#### 功能要求
1. **灵感详情展示**
   - 完整显示灵感内容
   - 显示情感标签和创建日期
   - 显示所有标签
   - 显示所有补充记录

2. **AI 分析功能**
   - 支持AI配置（多个国内主流AI服务）
   - 支持测试AI配置
   - 支持对灵感进行可行性分析
   - AI分析结果持久化存储

3. **AI 对话功能**
   - 支持与AI进行对话
   - 对话历史持久化存储
   - 用户消息和AI消息有不同的样式

4. **补充记录**
   - 支持添加补充记录（多种类型）
   - 支持删除补充记录
   - 补充记录支持添加附件

5. **附件功能**
   - 支持图片/音频附件
   - 支持删除附件
   - 附件持久化存储

6. **编辑和删除**
   - 支持删除灵感
   - 删除前确认提示

### 3.5 拾遗页面功能要求

#### UI 要求
- 全屏展示，随机灵感卡片
- "换一个"按钮
- "查看详情"按钮
- 空状态处理

#### 功能要求
1. **随机灵感展示**
   - 从所有灵感中随机选择一个
   - 支持"换一个"功能
   - 有加载动画效果

2. **详情跳转**
   - 点击"查看详情"进入灵感详情页
   - 支持从详情页返回

3. **空状态处理**
   - 无灵感时显示引导文本
   - 提供"记录灵感"按钮

## 4. 数据结构要求

### 4.1 核心数据类型

```typescript
// 灵感数据
interface Inspiration {
  id: string
  content: string
  tags: string[]
  emotion: 'excited' | 'calm' | 'curious' | 'anxious' | 'neutral'
  color: string
  createdAt: Date
  updatedAt: Date
  supplements: Supplement[]
  attachments: Attachment[]
  aiAnalysis?: AIAnalysis
  aiConversation?: { role: 'user' | 'assistant'; content: string }[]
}

// 补充记录
interface Supplement {
  id: string
  content: string
  type: 'thought' | 'link' | 'progress' | 'note'
  attachments: Attachment[]
  createdAt: Date
}

// 附件
interface Attachment {
  id: string
  type: 'image' | 'audio'
  dataUrl: string
  fileName: string
  createdAt: Date
}

// AI 分析结果
interface AIAnalysis {
  summary: string
  keywords: string[]
  categories: string[]
  suggestions: string[]
}

// AI 配置
interface AIConfig {
  provider: 'wenxin' | 'tongyi' | 'zhipu' | 'deepseek' | 'openai' | 'gemini' | 'custom'
  apiKey: string
  model?: string
  apiUrl?: string
}
```

### 4.2 存储要求

#### Web 版本
- 使用 LocalStorage 存储所有数据
- 数据格式：JSON 字符串
- 存储键名：`inspiration_tracker_inspirations`、`inspiration_tracker_ai_config`

#### 微信小程序版本
- 使用 Taro 存储 API (wx.getStorageSync/wx.setStorageSync)
- 存储要求同 Web 版本

### 4.3 数据持久化要求
- 所有灵感数据自动持久化
- AI 分析结果持久化
- AI 对话历史持久化
- 附件数据持久化
- 数据变更实时保存

## 5. 开发指南

### 5.1 项目初始化

#### Web 版本
```bash
cd /workspace
npm install
npm run dev
```

#### 微信小程序版本
```bash
cd /workspace/miniprogram
npm install
npm run dev:weapp
```

### 5.2 关键文件说明

#### Composables
| 文件 | 用途 |
|------|------|
| useInspiration.ts/js | 灵感的 CRUD 操作 |
| useStorage.ts/js | 本地存储封装 |
| useAI.ts/js | AI 分析功能 |
| useSerendipity.ts/js | 随机灵感逻辑 |
| useTheme.ts/js | 主题和配色管理 |

#### 工具函数
| 文件 | 用途 |
|------|------|
| helpers.ts/js | 通用辅助函数 |
| storage.ts/js | 存储操作封装 |
| ai.ts/js | AI API 调用封装 |
| demoData.ts/js | 示例数据 |

#### 组件
| 组件名 | 用途 |
|--------|------|
| EmotionPicker.vue | 情感选择器 |
| TagSelector.vue | 标签选择器 |
| InspirationCard.vue | 灵感卡片 |
| AIAnalysisPanel.vue | AI 分析面板 |
| AttachmentUploader.vue | 附件上传 |
| AttachmentDisplay.vue | 附件展示 |
| Empty.vue | 空状态组件 |

## 6. 构建和部署

### 6.1 Web 版本
```bash
# 开发模式
npm run dev

# 生产构建
npm run build
```

### 6.2 微信小程序版本
```bash
# 开发模式
npm run dev:weapp

# 生产构建
npm run build:weapp
```

## 7. 代码规范

### 7.1 命名规范
- 组件：PascalCase (InspirationCard)
- 文件：kebab-case (inspiration-card.vue) 或 PascalCase (InspirationCard.vue)
- 变量：camelCase (inspirationList)
- 常量：UPPER_SNAKE_CASE (STORAGE_KEY)

### 7.2 注释规范
- 公共 API 添加 JSDoc 注释
- 复杂逻辑添加行内注释
- 组件 props 添加类型注解和说明

## 8. 版本兼容性

### 8.1 平台差异处理
| 功能 | Web 版本 | 微信小程序 |
|------|---------|-----------|
| 路由 | Vue Router | Taro 页面跳转 |
| 存储 | LocalStorage | Taro 存储 API |
| 文件上传 | 标准 File API | Taro 选择文件 API |
| 样式 | Tailwind CSS | SCSS + 小程序兼容样式 |

### 8.2 数据格式统一
两个版本使用相同的数据结构，确保数据可以互通。
