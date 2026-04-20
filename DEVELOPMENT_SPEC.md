# 「灵光」应用开发技术规范

## 🎯 项目概述

### 1.1 项目简介
「灵光」是一款跨平台的创意管理应用，专注于帮助用户捕捉、分析、管理和实现灵感。通过液态玻璃UI设计和AI辅助功能，为用户提供从灵感到落地的完整工作流。

### 1.2 技术栈
- **框架**：Flutter 3.24+
- **语言**：Dart
- **UI库**：Liquid Glass Widgets ^0.7.7
- **状态管理**：Riverpod ^2.3.0
- **路由**：GoRouter ^12.0.0
- **本地存储**：Isar ^3.1.0
- **AI集成**：OpenAI API / 其他AI服务

### 1.3 平台支持
- ✅ iOS
- ✅ Android
- ✅ Web
- ✅ Windows
- ✅ macOS
- ✅ Linux

## 📱 功能模块设计

### 2.1 核心功能

#### 2.1.1 灵感捕获
- **功能描述**：快速记录灵感，添加标签和情绪
- **UI组件**：
  - `GlassContainer`：主输入区域
  - `GlassTextField`：文本输入
  - `GlassChip`：情绪选择
  - `GlassButton`：保存按钮
- **实现细节**：
  - 全屏沉浸式界面
  - 自动保存草稿
  - 支持语音输入（可选）

#### 2.1.2 灵感集
- **功能描述**：浏览、搜索和管理所有灵感
- **UI组件**：
  - `GlassCard`：灵感卡片
  - `GlassSearchBar`：搜索框
  - `GlassSegmentedControl`：筛选器
- **实现细节**：
  - 网格布局展示
  - 支持按标签、情绪、时间筛选
  - 下拉刷新和上拉加载

#### 2.1.3 灵感详情
- **功能描述**：查看完整灵感，AI分析，添加补充记录
- **UI组件**：
  - `GlassPanel`：详情面板
  - `GlassButton`：操作按钮
  - `GlassTextField`：补充记录输入
- **实现细节**：
  - AI分析区域（自动生成）
  - 补充记录列表
  - 附件支持（图片、音频）
  - 生成思维导图按钮

#### 2.1.4 AI 思维导图
- **功能描述**：从灵感自动生成思维导图
- **UI组件**：
  - 自定义画布组件
  - `GlassButton`：导出按钮
- **实现细节**：
  - 基于AI生成的结构化数据
  - 支持手动编辑节点
  - 导出为图片/PDF
  - 节点可转为任务

#### 2.1.5 项目管理
- **功能描述**：将灵感转化为项目，管理任务
- **UI组件**：
  - `GlassPanel`：项目概览
  - `GlassCard`：任务卡片
  - `GlassSwitch`：任务状态切换
- **实现细节**：
  - 灵感转项目功能
  - 任务拆解和排序
  - 进度追踪和里程碑

#### 2.1.6 首页仪表盘
- **功能描述**：展示创意统计和快速操作
- **UI组件**：
  - `GlassAppBar`：应用栏
  - `GlassCard`：统计卡片
  - `GlassButton`：快速操作
- **实现细节**：
  - 创意统计数据
  - 进行中项目展示
  - 连续记录天数
  - 快速记录入口

#### 2.1.7 灵感拾遗
- **功能描述**：随机展示过往灵感
- **UI组件**：
  - `GlassCard`：随机灵感卡片
  - `GlassButton`：换一个按钮
- **实现细节**：
  - 随机算法
  - 动画效果
  - 直接跳转到详情

### 2.2 AI 功能

#### 2.2.1 创意评估
- **功能**：分析灵感的可行性、潜力、风险
- **实现**：调用AI API，解析返回结果
- **UI**：`GlassPanel` 展示分析结果

#### 2.2.2 行动计划生成
- **功能**：自动生成可执行的步骤
- **实现**：AI提示词工程，结构化输出
- **UI**：步骤列表，可直接转为任务

#### 2.2.3 AI 对话
- **功能**：与AI深入探讨想法
- **实现**：基于聊天模型的对话系统
- **UI**：聊天界面，区分用户和AI消息

## 🎨 UI 设计规范

### 3.1 设计风格
- **主色调**：紫色系 (#6366f1) + 橙色系 (#f59e0b)
- **辅助色**：粉色 (#ec4899)、蓝色 (#0ea5e9)、灰色 (#6b7280)
- **背景**：渐变色背景，增强玻璃效果
- **字体**：系统默认字体，标题使用粗体

### 3.2 布局规范
- **移动端**：单列布局，边距 20px
- **平板**：双列布局，边距 30px
- **桌面**：三列布局，边距 40px
- **响应式**：使用 `LayoutBuilder` 适配不同屏幕

### 3.3 玻璃效果参数
- **标准模式**：
  - `thickness`: 0.8
  - `blur`: 12.0
  - `glassColor`: Colors.white.withOpacity(0.1)
- **高级模式**：
  - `thickness`: 1.0
  - `blur`: 15.0
  - `glassColor`: 根据主题调整

### 3.4 动画效果
- **页面过渡**：淡入淡出 + 缩放
- **玻璃组件**：轻微的呼吸效果
- **按钮点击**：缩放 + 透明度变化
- **思维导图**：节点展开/折叠动画

## 🏗️ 代码结构

### 4.1 项目结构

```
lib/
├── core/
│   ├── constants/          # 常量定义
│   ├── theme/              # 主题配置
│   └── utils/              # 工具函数
├── data/
│   ├── models/             # 数据模型
│   ├── repositories/       # 仓库层
│   └── datasources/        # 数据源
├── domain/
│   ├── entities/           # 实体
│   ├── usecases/           # 用例
│   └── repositories/       # 仓库接口
├── presentation/
│   ├── providers/          # Riverpod 提供者
│   ├── pages/              # 页面
│   │   ├── home/           # 首页
│   │   ├── capture/        # 灵感捕获
│   │   ├── collection/     # 灵感集
│   │   ├── detail/         # 灵感详情
│   │   ├── project/        # 项目管理
│   │   ├── mindmap/        # 思维导图
│   │   └── serendipity/    # 灵感拾遗
│   ├── widgets/            # 通用组件
│   └── routes/             # 路由配置
├── services/
│   ├── ai/                 # AI 服务
│   ├── storage/            # 存储服务
│   └── notifications/      # 通知服务
└── main.dart               # 应用入口
```

### 4.2 核心文件

#### 4.2.1 数据模型 (`lib/data/models/`)
- `inspiration.dart`：灵感模型
- `project.dart`：项目模型
- `task.dart`：任务模型
- `ai_analysis.dart`：AI分析模型
- `mindmap.dart`：思维导图模型

#### 4.2.2 状态管理 (`lib/presentation/providers/`)
- `inspiration_provider.dart`：灵感状态
- `project_provider.dart`：项目状态
- `ai_provider.dart`：AI状态
- `user_provider.dart`：用户状态

#### 4.2.3 页面实现 (`lib/presentation/pages/`)
- `home_page.dart`：首页仪表盘
- `capture_page.dart`：灵感捕获
- `collection_page.dart`：灵感集
- `detail_page.dart`：灵感详情
- `project_page.dart`：项目管理
- `mindmap_page.dart`：思维导图
- `serendipity_page.dart`：灵感拾遗

## 📦 依赖管理

### 5.1 核心依赖

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # UI
  liquid_glass_widgets: ^0.7.7
  font_awesome_flutter: ^10.6.0
  
  # 状态管理
  flutter_riverpod: ^2.3.0
  hooks_riverpod: ^2.3.0
  flutter_hooks: ^0.20.0
  
  # 路由
  go_router: ^12.0.0
  
  # 存储
  isar: ^3.1.0
  isar_flutter_libs: ^3.1.0
  path_provider: ^2.1.0
  
  # 网络
  http: ^1.1.0
  
  # 工具
  uuid: ^4.2.0
  intl: ^0.18.1
  
  # 多媒体
  image_picker: ^1.0.0
  flutter_svg: ^2.0.0

dev_dependencies:
  build_runner: ^2.4.0
  isar_generator: ^3.1.0
  flutter_lints: ^3.0.0
```

## 🚀 开发流程

### 6.1 初始化步骤

1. **创建项目**：
   ```bash
   flutter create --template=app 灵光
   cd 灵光
   ```

2. **配置环境**：
   ```bash
   flutter config --enable-impeller
   ```

3. **添加依赖**：更新 `pubspec.yaml`

4. **初始化液态玻璃**：在 `main.dart` 中添加
   ```dart
   await LiquidGlassWidgets.initialize();
   ```

### 6.2 开发顺序

1. **基础架构**：
   - 项目结构搭建
   - 状态管理配置
   - 路由配置
   - 存储服务实现

2. **核心功能**：
   - 灵感捕获
   - 灵感集
   - 灵感详情
   - 项目管理
   - 首页仪表盘
   - 灵感拾遗

3. **AI 功能**：
   - AI 分析
   - 行动计划生成
   - 思维导图生成
   - AI 对话

4. **UI 优化**：
   - 液态玻璃效果调整
   - 动画效果
   - 响应式布局
   - 平台适配

5. **测试与部署**：
   - 单元测试
   - 集成测试
   - 性能测试
   - 多平台构建

## 🎯 关键实现细节

### 7.1 数据持久化

**Isar 数据库配置**：

```dart
// lib/data/datasources/isar_datasource.dart
import 'package:isar/isar.dart';
import 'package:path_provider/path_provider.dart';

class IsarDatasource {
  late Isar _isar;

  Future<void> initialize() async {
    final dir = await getApplicationDocumentsDirectory();
    _isar = await Isar.open(
      [
        InspirationSchema,
        ProjectSchema,
        TaskSchema,
        AIAnalysisSchema,
        MindMapSchema,
      ],
      directory: dir.path,
    );
  }

  Isar get isar => _isar;
}
```

### 7.2 状态管理

**灵感状态管理**：

```dart
// lib/presentation/providers/inspiration_provider.dart
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:灵光/domain/usecases/inspiration_usecase.dart';

final inspirationProvider = StateNotifierProvider<InspirationNotifier, List<Inspiration>>(
  (ref) => InspirationNotifier(ref.read(inspirationUsecaseProvider)),
);

class InspirationNotifier extends StateNotifier<List<Inspiration>> {
  final InspirationUsecase _usecase;

  InspirationNotifier(this._usecase) : super([]) {
    loadInspirations();
  }

  Future<void> loadInspirations() async {
    state = await _usecase.getInspirations();
  }

  Future<void> addInspiration(Inspiration inspiration) async {
    await _usecase.createInspiration(inspiration);
    await loadInspirations();
  }

  // 其他方法...
}
```

### 7.3 AI 集成

**AI 服务**：

```dart
// lib/services/ai/ai_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class AIService {
  final String apiKey;
  final String apiUrl;

  AIService(this.apiKey, this.apiUrl);

  Future<Map<String, dynamic>> generateMindMap(String content) async {
    final response = await http.post(
      Uri.parse(apiUrl),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $apiKey',
      },
      body: jsonEncode({
        'model': 'gpt-4',
        'messages': [
          {
            'role': 'system',
            'content': '你是一个思维导图专家，擅长将创意转化为结构化的思维导图。',
          },
          {
            'role': 'user',
            'content': '为以下创意生成一个结构化的思维导图：\n$content\n\n要求：\n1. 生成3级节点\n2. 第一级是核心主题\n3. 后续级别是分解的子任务/子想法\n4. 用JSON格式返回，包含nodes和edges\n5. 每个节点简洁明了',
          },
        ],
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return jsonDecode(data['choices'][0]['message']['content']);
    } else {
      throw Exception('AI 服务错误: ${response.statusCode}');
    }
  }

  // 其他AI方法...
}
```

### 7.4 思维导图实现

**思维导图组件**：

```dart
// lib/presentation/widgets/mindmap_canvas.dart
import 'package:flutter/material.dart';
import 'package:liquid_glass_widgets/liquid_glass_widgets.dart';

class MindMapCanvas extends StatelessWidget {
  final Map<String, dynamic> mindMapData;

  const MindMapCanvas({super.key, required this.mindMapData});

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // 绘制连接线
        CustomPaint(
          painter: MindMapPainter(mindMapData),
          size: Size.infinite,
        ),
        // 绘制节点
        _buildNodes(),
      ],
    );
  }

  Widget _buildNodes() {
    // 实现节点布局和交互
    return Container();
  }
}

class MindMapPainter extends CustomPainter {
  final Map<String, dynamic> mindMapData;

  MindMapPainter(this.mindMapData);

  @override
  void paint(Canvas canvas, Size size) {
    // 实现连接线绘制
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) {
    return true;
  }
}
```

## 📱 页面实现示例

### 8.1 首页仪表盘

```dart
// lib/presentation/pages/home/home_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:liquid_glass_widgets/liquid_glass_widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final inspirations = ref.watch(inspirationProvider);
    final projects = ref.watch(projectProvider);

    return Scaffold(
      body: Stack(
        children: [
          // 背景渐变
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
                colors: [
                  Colors.purple.shade100,
                  Colors.blue.shade100,
                  Colors.pink.shade100,
                ],
              ),
            ),
          ),
          
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  // 应用栏
                  GlassAppBar(
                    title: Text('灵光', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                    actions: [
                      GlassIconButton(
                        onPressed: () {
                          // 导航到设置
                        },
                        icon: FontAwesomeIcons.gear,
                      ),
                    ],
                  ),
                  
                  SizedBox(height: 30),
                  
                  // 快速记录按钮
                  GlassButton(
                    onPressed: () {
                      // 导航到捕获页面
                    },
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(FontAwesomeIcons.lightbulb, color: Colors.white),
                        SizedBox(width: 10),
                        Text('✨ 快速记录灵感', style: TextStyle(fontSize: 18)),
                      ],
                    ),
                    settings: LiquidGlassSettings(
                      thickness: 1.0,
                      blur: 15.0,
                      glassColor: Colors.purple.withOpacity(0.3),
                    ),
                  ),
                  
                  SizedBox(height: 30),
                  
                  // 统计卡片
                  GlassCard(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          Text('📊 创意统计', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          SizedBox(height: 15),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              _statItem('${inspirations.length}', '灵感数'),
                              _statItem('${projects.length}', '项目数'),
                              _statItem('7', '连续天数'),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  SizedBox(height: 30),
                  
                  // 进行中的项目
                  GlassPanel(
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        children: [
                          Text('🚀 进行中的项目', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          SizedBox(height: 15),
                          ...projects
                              .where((p) => p.status == 'in_progress')
                              .map((project) => _projectItem(project)),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomNavigationBar: GlassBottomBar(
        items: [
          BottomNavigationBarItem(
            icon: Icon(FontAwesomeIcons.home),
            label: '首页',
          ),
          BottomNavigationBarItem(
            icon: Icon(FontAwesomeIcons.lightbulb),
            label: '灵感',
          ),
          BottomNavigationBarItem(
            icon: Icon(FontAwesomeIcons.grid3X3),
            label: '项目',
          ),
          BottomNavigationBarItem(
            icon: Icon(FontAwesomeIcons.user),
            label: '我的',
          ),
        ],
        currentIndex: 0,
        onTap: (index) {
          // 导航到对应页面
        },
      ),
    );
  }

  Widget _statItem(String value, String label) {
    return Column(
      children: [
        Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
        Text(label, style: TextStyle(fontSize: 14, color: Colors.grey.shade600)),
      ],
    );
  }

  Widget _projectItem(Project project) {
    return GlassCard(
      margin: const EdgeInsets.only(bottom: 10),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(project.title, style: TextStyle(fontWeight: FontWeight.bold)),
            Text('${project.tasks.where((t) => t.status == 'completed').length}/${project.tasks.length}'),
          ],
        ),
      ),
    );
  }
}
```

### 8.2 灵感捕获页面

```dart
// lib/presentation/pages/capture/capture_page.dart
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:liquid_glass_widgets/liquid_glass_widgets.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class CapturePage extends ConsumerStatefulWidget {
  const CapturePage({super.key});

  @override
  _CapturePageState createState() => _CapturePageState();
}

class _CapturePageState extends ConsumerState<CapturePage> {
  final TextEditingController _contentController = TextEditingController();
  final List<String> _tags = [];
  String _emotion = 'excited';
  final TextEditingController _tagController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          // 背景
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
                colors: [
                  Colors.orange.shade100,
                  Colors.amber.shade50,
                ],
              ),
            ),
          ),
          
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                children: [
                  GlassAppBar(
                    title: Text('记录灵感', style: TextStyle(fontSize: 20)),
                    leading: GlassIconButton(
                      onPressed: () => Navigator.pop(context),
                      icon: FontAwesomeIcons.arrowLeft,
                    ),
                  ),
                  
                  SizedBox(height: 30),
                  
                  // 灵感输入
                  GlassContainer(
                    height: 200,
                    child: TextField(
                      controller: _contentController,
                      maxLines: null,
                      expands: true,
                      decoration: InputDecoration(
                        hintText: '记录你的灵感...',
                        border: InputBorder.none,
                        contentPadding: const EdgeInsets.all(16),
                      ),
                      style: TextStyle(fontSize: 16),
                    ),
                  ),
                  
                  SizedBox(height: 20),
                  
                  // 情绪选择
                  GlassCard(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('情绪', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          SizedBox(height: 10),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceAround,
                            children: [
                              _emotionButton('excited', '兴奋', Colors.orange),
                              _emotionButton('calm', '平静', Colors.blue),
                              _emotionButton('curious', '好奇', Colors.purple),
                              _emotionButton('anxious', '焦虑', Colors.red),
                              _emotionButton('neutral', '中性', Colors.grey),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  SizedBox(height: 20),
                  
                  // 标签输入
                  GlassCard(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('标签', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                          SizedBox(height: 10),
                          Wrap(
                            spacing: 8,
                            runSpacing: 8,
                            children: _tags.map((tag) => _tagChip(tag)).toList(),
                          ),
                          SizedBox(height: 10),
                          Row(
                            children: [
                              Expanded(
                                child: GlassTextField(
                                  controller: _tagController,
                                  decoration: InputDecoration(
                                    hintText: '添加标签...',
                                    border: InputBorder.none,
                                  ),
                                  onSubmitted: (value) {
                                    if (value.isNotEmpty && !_tags.contains(value)) {
                                      setState(() => _tags.add(value));
                                      _tagController.clear();
                                    }
                                  },
                                ),
                              ),
                              SizedBox(width: 10),
                              GlassIconButton(
                                onPressed: () {
                                  final value = _tagController.text.trim();
                                  if (value.isNotEmpty && !_tags.contains(value)) {
                                    setState(() => _tags.add(value));
                                    _tagController.clear();
                                  }
                                },
                                icon: FontAwesomeIcons.plus,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  
                  Spacer(),
                  
                  // 保存按钮
                  GlassButton(
                    onPressed: () {
                      final content = _contentController.text.trim();
                      if (content.isNotEmpty) {
                        ref.read(inspirationProvider.notifier).addInspiration(
                          Inspiration(
                            id: UUID().v4(),
                            content: content,
                            tags: _tags,
                            emotion: _emotion,
                            color: Colors.orange,
                            createdAt: DateTime.now(),
                            updatedAt: DateTime.now(),
                            supplements: [],
                            attachments: [],
                          ),
                        );
                        Navigator.pop(context);
                      }
                    },
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(FontAwesomeIcons.save, color: Colors.white),
                        SizedBox(width: 10),
                        Text('💾 保存灵感', style: TextStyle(fontSize: 16)),
                      ],
                    ),
                    settings: LiquidGlassSettings(
                      thickness: 1.0,
                      blur: 15.0,
                      glassColor: Colors.orange.withOpacity(0.3),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
  
  Widget _emotionButton(String value, String label, Color color) {
    return GlassChip(
      label: label,
      selected: _emotion == value,
      onSelected: () {
        setState(() => _emotion = value);
      },
      selectedColor: color,
    );
  }

  Widget _tagChip(String tag) {
    return GlassChip(
      label: '#$tag',
      onSelected: () {
        setState(() => _tags.remove(tag));
      },
    );
  }
}
```

## 🔧 开发工具和命令

### 9.1 开发命令

```bash
# 运行开发服务器
flutter run

# 构建 iOS
flutter build ios

# 构建 Android
flutter build apk

# 构建 Web
flutter build web

# 构建 Windows
flutter build windows

# 构建 macOS
flutter build macos

# 构建 Linux
flutter build linux
```

### 9.2 测试命令

```bash
# 运行单元测试
flutter test

# 运行集成测试
flutter test integration_test

# 性能分析
flutter run --profile
```

## 🎉 项目启动清单

### 10.1 前期准备
- [ ] 安装 Flutter 3.24+
- [ ] 配置开发环境
- [ ] 创建项目结构
- [ ] 添加依赖

### 10.2 核心功能
- [ ] 灵感捕获功能
- [ ] 灵感集功能
- [ ] 灵感详情功能
- [ ] 项目管理功能
- [ ] 首页仪表盘
- [ ] 灵感拾遗功能

### 10.3 AI 功能
- [ ] AI 分析功能
- [ ] 行动计划生成
- [ ] 思维导图生成
- [ ] AI 对话功能

### 10.4 UI 优化
- [ ] 液态玻璃效果调整
- [ ] 响应式布局
- [ ] 动画效果
- [ ] 多平台适配

### 10.5 测试部署
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能测试
- [ ] 多平台构建

## 📚 参考资源

- **Flutter 官方文档**：https://docs.flutter.dev/
- **Liquid Glass Widgets**：https://pub.dev/packages/liquid_glass_widgets
- **Riverpod 文档**：https://riverpod.dev/
- **Isar 文档**：https://isar.dev/
- **GoRouter 文档**：https://pub.dev/packages/go_router

---

## 🎯 开发目标

通过本技术规范，开发一个功能完整、界面美观、性能流畅的跨平台创意管理应用，帮助用户从灵感到落地的完整工作流。应用将采用现代的液态玻璃UI设计，结合AI辅助功能，为用户提供独特的创意管理体验。

---

**文档版本**：1.0.0
**最后更新**：2026-04-20
**适用范围**：全平台 Flutter 开发
