
# 灵感捕手 Taro 迁移 - The Implementation Plan (Decomposed and Prioritized Task List)

## [x] Task 1: 初始化 Taro 项目并配置基础环境
- **Priority**: P0
- **Depends On**: None
- **Description**: 
  - 创建 `miniprogram/` 目录作为小程序项目根目录
  - 使用 Taro CLI 初始化 Vue 3 + TypeScript 项目
  - 安装并配置 Tailwind CSS
  - 配置项目基础结构
- **Acceptance Criteria Addressed**: [AC-1, AC-8]
- **Test Requirements**:
  - `programmatic` TR-1.1: Taro 项目初始化成功，依赖安装完成
  - `programmatic` TR-1.2: `npm run dev:weapp` 可以正常启动
  - `human-judgement` TR-1.3: 项目目录结构清晰合理
- **Notes**: 建议在根目录下创建 `miniprogram/` 文件夹与原有 `src/` 平级

## [x] Task 2: 迁移类型定义
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**: 
  - 复制 `src/types/index.ts` 到 `miniprogram/src/types/`
  - 确保类型与 Taro 兼容（无 DOM 相关类型）
- **Acceptance Criteria Addressed**: [AC-2]
- **Test Requirements**:
  - `programmatic` TR-2.1: TypeScript 编译无类型错误
  - `programmatic` TR-2.2: 所有类型定义完整保留
- **Notes**: 类型定义几乎可以 100% 复用

## [x] Task 3: 迁移并适配存储层
- **Priority**: P0
- **Depends On**: [Task 2]
- **Description**: 
  - 复制 `src/utils/storage.ts` 到 `miniprogram/src/utils/`
  - 将 `localStorage` API 替换为 `Taro.getStorageSync` / `Taro.setStorageSync`
  - 保持数据结构不变
- **Acceptance Criteria Addressed**: [AC-3]
- **Test Requirements**:
  - `programmatic` TR-3.1: storageGet / storageSet 函数正常工作
  - `programmatic` TR-3.2: 日期对象的序列化/反序列化正常
- **Notes**: 注意小程序 storage 大小限制（10MB）

## [x] Task 4: 迁移工具函数
- **Priority**: P0
- **Depends On**: [Task 3]
- **Description**: 
  - 复制 `src/utils/helpers.ts`、`src/utils/demoData.ts`
  - 复制并适配 `src/utils/ai.ts`（网络请求使用 Taro.request）
  - 确保 AI API 调用正常工作
- **Acceptance Criteria Addressed**: [AC-5]
- **Test Requirements**:
  - `programmatic` TR-4.1: 所有工具函数可正常导入和调用
  - `programmatic` TR-4.2: AI API 调用使用 Taro.request 替代 fetch
- **Notes**: 小程序网络请求需要合法域名配置

## [x] Task 5: 迁移 Composables
- **Priority**: P0
- **Depends On**: [Task 4]
- **Description**: 
  - 复制所有 `src/composables/` 下的文件
  - 适配 `useStorage.ts` 使用新的存储层
  - 确保其他 composables 无 DOM 依赖
- **Acceptance Criteria Addressed**: [AC-4]
- **Test Requirements**:
  - `programmatic` TR-5.1: 所有 composables 可正常导入
  - `programmatic` TR-5.2: useInspiration 的 CRUD 操作正常
- **Notes**: 这是核心业务逻辑，复用率应该很高

## [x] Task 6: 配置路由和 TabBar
- **Priority**: P0
- **Depends On**: [Task 1]
- **Description**: 
  - 创建 4 个页面目录结构
  - 配置 `app.config.ts` 的 pages
  - 配置 tabBar 包含两个标签：「灵感捕手记录」（默认页）和「灵感集」
  - 配置页面基础样式
- **Acceptance Criteria Addressed**: [AC-7]
- **Test Requirements**:
  - `human-judgement` TR-6.1: TabBar 正常显示和切换
  - `human-judgement` TR-6.2: 页面跳转正常工作
- **Notes**: TabBar 包含 2 个标签：灵感捕手记录、灵感集

## [x] Task 7: 迁移组件
- **Priority**: P1
- **Depends On**: [Task 5]
- **Description**: 
  - 复制 `src/components/` 下的所有组件
  - 将 HTML 标签替换为小程序组件（div→view, span→text, img→image 等）
  - 适配事件绑定（click→tap 等）
- **Acceptance Criteria Addressed**: [AC-6]
- **Test Requirements**:
  - `human-judgement` TR-7.1: 组件可以正常渲染
  - `human-judgement` TR-7.2: 组件交互正常
- **Notes**: 这部分改动较大，需要逐个组件适配

## [x] Task 8: 迁移页面组件
- **Priority**: P1
- **Depends On**: [Task 7]
- **Description**: 
  - 迁移 CapturePage（灵感捕捉页）
  - 迁移 CollectionPage（灵感集页）
  - 迁移 DetailPage（详情页）
  - 迁移 SerendipityPage（拾遗页）
- **Acceptance Criteria Addressed**: [AC-6, AC-7]
- **Test Requirements**:
  - `human-judgement` TR-8.1: 每个页面可以正常渲染
  - `human-judgement` TR-8.2: 页面功能完整可用
- **Notes**: 逐个页面迁移和测试

## [/] Task 9: 端到端完整测试
- **Priority**: P1
- **Depends On**: [Task 8]
- **Description**: 
  - 测试完整用户流程
  - 验证数据持久化
  - 验证 AI 功能
  - 检查视觉一致性
- **Acceptance Criteria Addressed**: [AC-9]
- **Test Requirements**:
  - `human-judgement` TR-9.1: 完整用户流程可顺利完成
  - `human-judgement` TR-9.2: 数据在重启小程序后仍然保留
  - `human-judgement` TR-9.3: 视觉风格与原应用一致
