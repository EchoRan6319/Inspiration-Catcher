# 「灵光」Flutter 全平台版本开发方案

## 🎯 为什么选择 Flutter

### 优势
1. **真正的全平台**
   - iOS / Android
   - Web
   - macOS / Windows / Linux
   - 一套代码，多端运行

2. **出色的 UI 能力**
   - 高度可定制的 Widget
   - 流畅的动画效果
   - Material Design 3 / Cupertino 支持

3. **性能优秀**
   - 原生编译
   - Skia 渲染引擎
   - 60fps+ 流畅度

4. **生态成熟**
   - 丰富的 pub.dev 包
   - 活跃的社区
   - Google 官方支持

---

## 📱 核心功能（全平台）

### 1. 灵感捕获
- 极简输入界面
- 情绪标记
- 标签管理
- 附件支持（图片、音频、文件）
- 语音输入（可选）

### 2. AI 创意伙伴
- **创意评估**
- **行动计划生成**
- **思维导图生成**（新功能！）
- **AI 对话**

### 3. 项目管理
- 灵感转项目
- 任务拆解
- 进度追踪
- 里程碑管理

### 4. 回顾成长
- 创意仪表盘
- 周/月/年回顾
- 成就系统
- 灵感拾遗+

### 5. AI 思维导图（核心亮点）
- 从灵感自动生成思维导图
- 支持手动编辑
- 导出为图片 / PDF / Markdown
- 思维导图节点可以直接转为任务
- 多级节点支持
- 美观的可视化

---

## 🏗️ 技术架构

### 状态管理
- **推荐：Riverpod**
  - 类型安全
  - 易于测试
  - 良好的 DevTools 支持
- **备选：Bloc**
  - 更结构化
  - 适合大型项目

### 本地存储
- **主要：Isar / Hive**
  - NoSQL 数据库
  - 高性能
  - 支持查询和索引
- **备选：sqflite**（SQLite）
  - 关系型数据
  - 适合复杂查询

### AI 集成
- **统一的 AI 接口**
  - 支持多个提供商（OpenAI、Claude、通义千问、文心一言等）
  - 抽象层，易于切换
  - API Key 本地加密存储

### 思维导图渲染
- **推荐：flutter_svg + 自定义绘制**
- **备选：使用成熟的库**
  - mindmap
  - 或基于 CustomPainter 自己实现

### 路由管理
- **go_router**
  - 声明式路由
  - 支持深度链接
  - 类型安全

---

## 🤖 AI 思维导图生成方案

### 功能设计
1. **输入**
   - 灵感内容
   - 用户可选的重点方向
   - 深度设置（2-5级）

2. **AI Prompt 设计**
```
你是一个思维导图专家。请为以下创意生成一个结构化的思维导图：

创意内容：{inspiration_content}

要求：
1. 生成 {depth} 级节点
2. 第一级是核心主题
3. 后续级别是分解的子任务/子想法
4. 用 Markdown 列表格式返回，使用 - 作为层级标记
5. 每个节点简洁明了，不超过 20 个字

示例格式：
- 核心主题
  - 子主题1
    - 子子主题1.1
    - 子子主题1.2
  - 子主题2
```

3. **输出格式**
   - Markdown 列表 → 解析为树形数据结构
   - 或者直接返回 JSON 格式

### 数据结构
```dart
class MindMapNode {
  final String id;
  final String title;
  final String? description;
  final List<MindMapNode> children;
  final bool isExpanded;
  final MindMapNode? parent;
  
  // 可以转为任务
  bool canConvertToTask;
}
```

### 交互功能
1. **节点操作**
   - 添加/删除节点
   - 编辑节点内容
   - 拖拽调整位置
   - 折叠/展开

2. **视觉效果**
   - 不同层级不同颜色
   - 连接线动画
   - 平滑的展开/折叠效果
   - 缩放和平移

3. **实用功能**
   - 节点直接转项目任务
   - 导出为图片/PDF
   - 导出为 Markdown/OPML
   - 分享思维导图

---

## 📁 项目结构（推荐）

```
lib/
├── core/
│   ├── constants/          # 常量
│   ├── errors/             # 错误处理
│   ├── extensions/         # 扩展方法
│   ├── theme/              # 主题配置
│   └── utils/              # 工具函数
├── data/
│   ├── datasources/        # 数据源（本地存储）
│   ├── models/             # 数据模型
│   └── repositories/       # 仓库层
├── domain/
│   ├── entities/           # 实体
│   ├── repositories/       # 仓库接口
│   └── usecases/           # 用例
├── presentation/
│   ├── providers/          # Riverpod providers
│   ├── pages/              # 页面
│   │   ├── capture/
│   │   ├── collection/
│   │   ├── detail/
│   │   ├── project/
│   │   ├── dashboard/
│   │   └── mindmap/
│   ├── widgets/            # 组件
│   └── routes/             # 路由
├── services/
│   ├── ai/                 # AI 服务
│   ├── storage/            # 存储服务
│   └── notifications/      # 通知服务
└── main.dart
```

---

## 🎨 UI 设计要点

### 设计理念
- **温暖且专业**
  - 柔和的渐变配色
  - 圆润的卡片设计
  - 流畅的微动画

- **平台适配**
  - Material Design 3（Android / Web / Desktop）
  - Cupertino（iOS / macOS）
  - 自动根据平台切换

- **响应式布局**
  - 移动端：单列
  - 平板：双列
  - 桌面：三列或更多

### 核心页面设计

#### 1. 仪表盘页面
- 顶部：今日灵感 + 快速记录按钮
- 中间：进行中的项目卡片
- 底部：统计数据（灵感数、完成项目数、连续天数）
- 成就徽章展示

#### 2. 灵感详情页
- 灵感内容卡片
- AI 分析区域
- "生成思维导图" 按钮
- 补充记录
- "转为项目" 按钮

#### 3. 思维导图页
- 全屏思维导图画布
- 工具栏（缩放、重置、导出、编辑模式）
- 节点操作菜单
- 侧边栏（节点列表、属性编辑）

#### 4. 项目管理页
- 项目概览
- 任务看板（待办/进行中/已完成）
- 进度条
- 里程碑

---

## 🚀 开发路线图

### Phase 1: MVP 核心功能（1-2个月）
- [ ] 项目搭建和基础架构
- [ ] 灵感捕获和管理
- [ ] 本地数据持久化
- [ ] 基础 AI 集成
- [ ] 首页仪表盘

### Phase 2: AI 思维导图（2-3周）
- [ ] 思维导图数据结构
- [ ] AI 生成思维导图功能
- [ ] 思维导图渲染和交互
- [ ] 导出功能

### Phase 3: 项目管理（2-3周）
- [ ] 灵感转项目
- [ ] 任务管理
- [ ] 进度追踪
- [ ] 成就系统

### Phase 4: 全平台优化（1-2周）
- [ ] 各平台适配和测试
- [ ] 性能优化
- [ ] 打包和发布准备

---

## 📦 核心依赖包（推荐）

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # 状态管理
  flutter_riverpod: ^2.3.0
  hooks_riverpod: ^2.3.0
  flutter_hooks: ^0.20.0
  
  # 路由
  go_router: ^12.0.0
  
  # 本地存储
  isar: ^3.1.0
  isar_flutter_libs: ^3.1.0
  path_provider: ^2.1.0
  
  # AI 相关
  http: ^1.1.0
  json_annotation: ^4.8.0
  
  # UI 组件
  flutter_svg: ^2.0.0
  font_awesome_flutter: ^10.6.0
  animations: ^2.0.0
  flex_color_scheme: ^7.3.0
  
  # 工具
  uuid: ^4.2.0
  intl: ^0.18.1
  share_plus: ^7.2.0
  file_picker: ^6.1.0
  
  # 图片/文件
  image_picker: ^1.0.0
  gallery_saver: ^2.3.0
  pdf: ^3.10.0
  printing: ^5.11.0

dev_dependencies:
  build_runner: ^2.4.0
  json_serializable: ^6.7.0
  isar_generator: ^3.1.0
  flutter_lints: ^3.0.0
```

---

## 🔐 隐私和安全

### 数据存储
- **全本地存储**，不上传任何用户数据
- 敏感信息（API Key）加密存储
- 支持数据导出和备份

### AI 数据处理
- 用户明确授权后才使用 AI 功能
- AI 请求只发送必要信息
- 提供离线模式（基础功能可用）

---

## 📈 发布策略

### 平台顺序
1. **优先：iOS / Android**（移动用户为主）
2. **其次：Web**（方便分享和快速使用）
3. **最后：Desktop**（深度用户）

### 发布渠道
- App Store
- Google Play
- Web 部署（Vercel / GitHub Pages）
- Microsoft Store / Apple Store

---

## 💡 差异化卖点总结

1. **✨ AI 思维导图** - 从灵感一键生成结构化思维导图
2. **📱 全平台支持** - Flutter 一套代码，处处运行
3. **🎯 完整工作流** - 灵感 → AI分析 → 思维导图 → 项目 → 落地
4. **🔒 隐私优先** - 全本地存储，数据安全可控
5. **🎮 游戏化设计** - 成就系统，让创意更有趣

---

## 🎉 下一步行动

1. 技术选型确认
2. Flutter 项目初始化
3. 设计稿完成（Figma）
4. 核心功能开发（按优先级）
5. 测试和迭代

准备好了吗？让我们开始吧！
