
# 灵感捕手 Taro 迁移 - Product Requirement Document

## Overview
- **Summary**: 将现有的 Vue 3 网页应用「灵感捕手」迁移到 Taro 框架，实现微信小程序版本，最大程度复用现有代码。
- **Purpose**: 降低用户使用门槛，通过微信小程序提供即点即用的灵感记录体验，同时保持现有功能完整性。
- **Target Users**: 创意工作者、设计师、开发者、学生等需要快速记录灵感的人群。

## Goals
- 完整迁移现有 4 大功能模块（灵感捕捉、灵感集、详情页、拾遗）
- 复用 80%+ 的现有业务逻辑代码（types、composables、utils）
- 适配微信小程序平台特性（存储、路由、组件等）
- 保持与原网页应用一致的用户体验和视觉风格

## Non-Goals (Out of Scope)
- 不添加新功能（仅迁移现有功能）
- 不重构核心业务逻辑
- 不改造其他小程序平台（仅专注微信小程序）
- 不添加后端服务（继续使用本地存储）

## Background & Context
现有项目是一个基于 Vue 3 + TypeScript + Tailwind CSS 构建的单页应用，使用 LocalStorage 存储数据，集成了多个 AI 服务 API。项目架构清晰，代码组织良好，适合迁移到 Taro。

## Functional Requirements
- **FR-1**: 灵感捕捉功能 - 用户可以快速记录灵感，添加标签、情绪，上传附件
- **FR-2**: 灵感集管理 - 浏览所有灵感，支持搜索、标签筛选
- **FR-3**: 灵感详情与 AI 分析 - 查看灵感详情，AI 分析，添加补充记录
- **FR-4**: 拾遗功能 - 随机展示过往灵感
- **FR-5**: 数据持久化 - 使用微信小程序本地存储保存用户数据

## Non-Functional Requirements
- **NFR-1**: 代码复用率达到 80% 以上（业务逻辑层）
- **NFR-2**: 页面加载时间 &lt; 2s
- **NFR-3**: 与原网页应用视觉风格保持一致
- **NFR-4**: 支持离线使用（本地存储）

## Constraints
- **Technical**: 必须使用 Taro 3.x + Vue 3 + TypeScript
- **Business**: 保持现有功能不变，仅做平台适配
- **Dependencies**: 微信小程序网络请求域名白名单限制

## Assumptions
- 用户的微信版本支持基础库 2.0+
- AI 服务 API 域名可以配置到微信小程序白名单
- 现有 LocalStorage 数据结构可以迁移到小程序 storage

## Acceptance Criteria

### AC-1: 项目初始化成功
- **Given**: 空目录
- **When**: 执行 Taro 项目初始化并配置好依赖
- **Then**: 项目可以正常运行微信小程序开发模式
- **Verification**: `programmatic`

### AC-2: 类型定义迁移完成
- **Given**: 现有项目的 types/index.ts
- **When**: 迁移类型定义到 Taro 项目
- **Then**: 所有 TypeScript 类型可用且无编译错误
- **Verification**: `programmatic`

### AC-3: 存储层适配完成
- **Given**: 现有 utils/storage.ts
- **When**: 替换 localStorage API 为 Taro storage API
- **Then**: 数据可以正常读写到小程序本地存储
- **Verification**: `programmatic`

### AC-4: Composables 迁移完成
- **Given**: 现有 composables 目录
- **When**: 迁移并适配所有 composables
- **Then**: 业务逻辑可以正常工作，无 Vue 3 特性问题
- **Verification**: `programmatic`

### AC-5: 工具函数迁移完成
- **Given**: 现有 utils 目录
- **When**: 迁移并适配所有工具函数（特别是 ai.ts）
- **Then**: 工具函数正常工作，AI API 调用正常
- **Verification**: `programmatic`

### AC-6: 页面组件迁移完成
- **Given**: 现有 4 个页面组件
- **When**: 迁移并适配所有页面到 Taro
- **Then**: 所有页面可以正常渲染和交互
- **Verification**: `human-judgment`

### AC-7: 路由系统适配完成
- **Given**: 现有 Vue Router 配置
- **When**: 配置 Taro 页面路由和 TabBar（包含「灵感捕手记录」和「灵感集」两个标签）
- **Then**: 页面跳转正常，TabBar 工作正常
- **Verification**: `human-judgment`

### AC-8: 样式系统适配完成
- **Given**: 现有 Tailwind CSS 配置
- **When**: 配置 Tailwind CSS 在 Taro 中正常工作
- **Then**: 视觉风格与原应用一致
- **Verification**: `human-judgment`

### AC-9: 端到端功能验证
- **Given**: 完整迁移的 Taro 项目
- **When**: 测试所有主要用户流程
- **Then**: 所有功能正常工作，数据持久化正常
- **Verification**: `human-judgment`

## Open Questions
- [ ] 是否需要保留原网页项目，还是在同一仓库管理？
- [ ] AI 服务 API 域名是否已准备好配置小程序白名单？
- [ ] 附件上传功能在小程序中是否需要调整大小限制？
