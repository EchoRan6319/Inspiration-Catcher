<div align="center">
  <h1>✨ 灵感捕手</h1>
  <p>一个优雅、智能的创意灵感管理应用</p>
  <p>
    <a href="#features">功能特点</a> •
    <a href="#tech-stack">技术栈</a> •
    <a href="#quick-start">快速开始</a> •
    <a href="#usage">使用指南</a>
  </p>
</div>

## 简介

灵感捕手是一个基于Vue 3和TypeScript构建的创意灵感管理应用，帮助用户捕捉、整理和发展那些转瞬即逝的创意想法。通过AI赋能，让你的灵感得到更深入的分析和发展。

## 功能特点

### 🤖 智能AI分析
- **多模型支持**：集成百度文心一言、阿里云通义千问、智谱AI、DeepSeek、OpenAI、Google Gemini等多种AI模型
- **基础分析**：自动生成灵感摘要、关键词、分类标签和发展建议
- **可行性分析**：从市场潜力、技术可行性、实施难度、竞争分析、潜在风险等多维度评估想法
- **智能对话**：基于灵感内容进行交互式对话，获取更多见解和建议
- **灵活配置**：支持自定义AI模型和API配置

### 📎 多媒体附件支持
- **图片上传**：支持JPG、PNG等常见图片格式
- **音频上传**：支持MP3、WAV等常见音频格式
- **直观预览**：实时预览图片，内置音频播放器
- **便捷上传**：支持点击上传和拖拽上传
- **本地存储**：附件以DataURL格式安全存储在LocalStorage中

### 📝 高效灵感管理
- **标签系统**：通过标签对灵感进行分类管理
- **智能搜索**：支持关键词搜索和标签筛选
- **补充记录**：为灵感添加补充记录，跟踪灵感发展过程
- **Demo数据**：内置8条精选灵感示例，快速上手

### 🎨 优雅的用户体验
- **响应式设计**：完美适配桌面端、平板和移动设备
- **现代化UI**：渐变色彩、卡片式布局，视觉效果美观
- **流畅动画**：丰富的悬停效果、过渡动画等微交互
- **直观操作**：简化的操作流程，降低使用门槛

### 🛠️ 技术架构优势
- **Vue 3 + TypeScript**：类型安全的现代前端技术栈
- **Tailwind CSS**：快速、一致的样式开发
- **组件化设计**：代码结构清晰，易于维护和扩展
- **本地存储**：无需后端服务器，数据存储在浏览器本地

## 技术栈

- **前端框架**：Vue 3 (Composition API)
- **类型系统**：TypeScript
- **构建工具**：Vite
- **样式框架**：Tailwind CSS
- **状态管理**：Composables (Vue 3原生)
- **数据存储**：LocalStorage
- **路由管理**：Vue Router

## 快速开始

### 环境要求

- Node.js >= 16.x
- npm >= 8.x

### 安装

```bash
# 克隆项目
git clone <repository-url>
cd inspiration-tracker

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 开发服务器

开发服务器将在 `http://localhost:5173` 启动（如果端口被占用，会自动使用其他端口）。

## 使用指南

### 创建灵感

1. 点击首页的"记录灵感"按钮
2. 输入灵感内容
3. 选择当前情绪
4. 添加标签（可选）
5. 上传图片或音频附件（可选）
6. 点击保存

### 管理灵感

1. 进入"灵感集"页面
2. 查看所有灵感卡片
3. 使用搜索框搜索关键词
4. 点击标签进行筛选
5. 点击灵感卡片查看详情

### AI分析

1. 在灵感详情页面点击"AI设置"
2. 配置AI服务提供商和API Key
3. 点击"测试模型"验证配置
4. 使用"分析想法可行性"进行深度分析
5. 使用"与AI对话"进行交互式探讨

### 添加附件

1. 在创建灵感或查看详情时
2. 点击附件上传区域或拖拽文件
3. 预览上传的文件
4. 保存灵感后附件会自动存储

## 项目结构

```
/workspace
├── src/
│   ├── components/          # Vue组件
│   │   ├── AIAnalysisPanel.vue
│   │   ├── AttachmentDisplay.vue
│   │   ├── AttachmentUploader.vue
│   │   ├── EmotionPicker.vue
│   │   ├── Empty.vue
│   │   ├── InspirationCard.vue
│   │   └── TagSelector.vue
│   ├── composables/         # 组合式函数
│   │   ├── useAI.ts
│   │   ├── useInspiration.ts
│   │   └── useStorage.ts
│   ├── pages/               # 页面组件
│   │   ├── CapturePage.vue
│   │   ├── CollectionPage.vue
│   │   ├── DetailPage.vue
│   │   ├── HomePage.vue
│   │   └── SerendipityPage.vue
│   ├── types/               # TypeScript类型定义
│   │   └── index.ts
│   ├── utils/               # 工具函数
│   │   ├── ai.ts
│   │   ├── demoData.ts
│   │   ├── helpers.ts
│   │   └── storage.ts
│   ├── App.vue
│   └── main.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 使用场景

### 创意人士
- **设计师**：记录设计灵感、色彩搭配、布局构思
- **作家**：捕捉写作灵感、故事情节、人物设定
- **艺术家**：存储创作灵感、色彩方案、构图想法
- **音乐人**：记录旋律片段、歌词灵感、编曲思路

### 科技从业者
- **开发者**：记录项目创意、技术方案、代码灵感
- **产品经理**：捕捉产品创意、用户需求、功能设计
- **创业者**：记录商业想法、市场机会、商业模式
- **数据分析师**：存储分析思路、数据洞察、可视化创意

### 学生与教育工作者
- **学生**：记录学习灵感、研究思路、论文创意
- **教师**：捕捉教学创意、课程设计、活动方案
- **研究者**：存储研究灵感、实验思路、理论构想

### 日常生活
- **旅行者**：记录旅行灵感、目的地想法、行程规划
- **美食爱好者**：存储食谱创意、食材搭配、烹饪灵感
- **健身爱好者**：记录运动灵感、训练计划、饮食方案
- **生活规划**：捕捉生活创意、家庭活动、节日安排

## 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 致谢

- Vue.js 团队
- Tailwind CSS 团队
- 所有贡献者

---

<div align="center">
  <p>
    如果这个项目对你有帮助，请给它一个 ⭐️
  </p>
  <p>
    Made with ❤️ by Inspiration Tracker Team
  </p>
</div>
