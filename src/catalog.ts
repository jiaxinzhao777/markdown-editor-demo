export const editors = [
  {
    id: 'uiw', name: 'uiw / React MD Editor', category: '源码编辑', tag: 'ego-web 轻量候选',
    package: '@uiw/react-md-editor', url: 'https://uiwjs.github.io/react-md-editor/',
    benefit: '受控字符串 API，工具栏和双栏预览开箱即用；最贴近现有 TextArea 表单。',
    tradeoff: '用户仍要理解 Markdown；图片上传、版本管理与复杂表格交互需要业务实现。',
    try: '输入中文、切换预览、使用加粗工具栏，再核对导出的 Markdown。',
  },
  {
    id: 'mdx', name: 'MDXEditor', category: '可视化 Markdown', tag: '标准文档首选 POC',
    package: '@mdxeditor/editor', url: 'https://mdxeditor.dev/',
    benefit: 'React 组件直接读写 Markdown；表格、链接、图片、源码 / 差异视图可组合。',
    tradeoff: '按插件配置语法；未支持的节点和序列化变化需要用历史文档验证。',
    try: '用表格工具修改标准，切换源码与 diff 模式；观察保存重开后的差异。',
  },
  {
    id: 'milkdown', name: 'Milkdown / Crepe', category: '可视化 Markdown', tag: '体验备选',
    package: '@milkdown/crepe', url: 'https://milkdown.dev/playground',
    benefit: 'Markdown 优先，提供斜杠菜单、块操作和表格 UI，适合连续写作。',
    tradeoff: 'ProseMirror 与 Milkdown 插件体系有学习成本；异步实例要管理销毁。',
    try: '输入 / 查看菜单，选中文字唤出工具栏；编辑表格后检查导出。',
  },
  {
    id: 'vditor', name: 'Vditor', category: '三模式 Markdown', tag: '无构建原型候选',
    package: 'vditor', url: 'https://b3log.org/vditor/demo/index.html',
    benefit: '所见即所得、即时渲染、分屏三种模式；中文工具栏和文档较完整。',
    tradeoff: '命令式实例；Lute / 图标 / 扩展资源要部署；和 React 表单需要适配。',
    try: '从工具栏切换编辑模式，比较同一表格和列表在三种模式下的体验。',
  },
  {
    id: 'toast', name: 'TOAST UI Editor', category: '双模式 Markdown', tag: '成熟备选',
    package: '@toast-ui/editor', url: 'https://ui.toast.com/tui-editor',
    benefit: 'Markdown / WYSIWYG 双模式、预览和表格 UI 齐全，原生 JS 可接原型。',
    tradeoff: '本 demo 使用原生核心封装；旧 React 包 peer 范围和维护节奏需单独评估。',
    try: '在底部切换 Markdown / WYSIWYG，编辑表格；使用统计已关闭。',
  },
  {
    id: 'tiptap', name: 'Tiptap + Markdown', category: '富文本框架', tag: '深度定制候选',
    package: '@tiptap/react', url: 'https://tiptap.dev/docs/editor/markdown',
    benefit: '扩展和自定义节点丰富，适合将来加入业务卡片、评论或协作。',
    tradeoff: '官方 Markdown 当前标为 Beta；需要自建工具栏、上传与转换边界。',
    try: '用本 demo 的简版工具栏编辑；表格与任务列表已配置扩展。',
  },
  {
    id: 'blocknote', name: 'BlockNote', category: '块编辑器', tag: '文档产品候选',
    package: '@blocknote/core', url: 'https://www.blocknotejs.org/examples',
    benefit: '块拖拽、斜杠菜单与浮动工具栏开箱即用，非技术人员容易开始。',
    tradeoff: 'Markdown 转换明确有损；主存储应使用块 JSON；高级 XL 功能许可另计。',
    try: '拖拽块、编辑表格；重点比较 Markdown 输出与原文，不能只看外观。',
  },
  {
    id: 'codemirror', name: 'CodeMirror 6', category: '源码编辑框架', tag: '源码保真候选',
    package: 'codemirror', url: 'https://codemirror.net/',
    benefit: '直接编辑原始文本，语法高亮、撤销与搜索成熟；语法不支持也不会被转换丢弃。',
    tradeoff: '需要自行搭建工具栏、预览、图片上传和同步滚动；不是可视化文档编辑器。',
    try: '测试多行编辑和查找；扩展语法会原样留存，预览另看共享渲染器。',
  },
  {
    id: 'mdrt', name: 'md-editor-rt', category: '源码编辑', tag: '中文功能型候选',
    package: 'md-editor-rt', url: 'https://imzbf.github.io/md-editor-rt/',
    benefit: 'React / TypeScript、中文工具栏、目录与预览；图片上传可用回调接入。',
    tradeoff: '默认 UI 较完整，嵌入小弹窗偏重；可选绘图 / 公式等依赖要单独配置。',
    try: '对照 uiw 的源码工作流；本演示关闭公式 / 绘图等额外资源加载。',
  },
  {
    id: 'easymde', name: 'EasyMDE', category: '源码编辑', tag: '传统 JS 方案',
    package: 'easymde', url: 'https://easy-markdown-editor.tk/',
    benefit: '原生 JS 接入简单，传统 Markdown 工具栏和预览比较完整。',
    tradeoff: '基于 CodeMirror 5；React 生命周期要封装；复杂内容扩展不如现代框架灵活。',
    try: '尝试工具栏插入语法与预览；演示关闭自动下载字体和拼写检查。',
  },
] as const;

export type EditorId = (typeof editors)[number]['id'];

export const samples = {
  steps: {
    name: '任务执行步骤',
    context: 'ego-web · 未来 Markdown 场景样例；当前 executionSteps 仍是纯文本。',
    markdown: '## 台面清洁\n\n1. 移开台面物品，保持相机视野完整。\n2. 使用清洁布擦拭台面。\n3. 将物品归位并结束采集。\n\n> 注意：手部与操作对象不能长时间离开画面。\n\n参考 [采集说明](https://example.com/collection/guide)。\n',
  },
  standard: {
    name: '采集标准文档',
    context: 'data-platform-2.0-demo · 标题、列表、表格、引用和版本文档。',
    markdown: '# 厨房场景采集标准\n\n> **采集标准 · 示例 v1.2**\n\n## 1. 采集范围\n\n适用于台面清洁与餐具整理。每段数据须保持**动作连续**，不要包含无关人员。\n\n## 2. 执行流程\n\n1. 检查设备时间与存储空间。\n2. 确认任务名称和场景。\n3. 完成动作后检查回放。\n\n## 3. 判定规则\n\n| 检查项 | 合格条件 | 不合格示例 |\n| --- | --- | --- |\n| 视野 | 手部与目标清晰可见 | 操作对象持续离开画面 |\n| 连续性 | 动作完整且自然 | 中途停止录制 |\n| 标签 | 与任务名称一致 | 将清洁标为整理 |\n\n## 4. 交付检查\n\n- [x] 设备已校验\n- [ ] 回放已检查\n- [ ] 标签已复核\n\n使用字段 `task_id` 关联任务。详细规范见 [参考文档](https://example.com/standards)。\n',
  },
  edge: {
    name: '格式边界样例',
    context: '核对嵌套列表、图片、代码、HTML、脚注和公式；未启用的扩展不应默默丢失。',
    markdown: '# 格式往返检查\n\n1. 第一层\n   - 第二层 **加粗**\n   - 链接含路径：[说明](https://example.com/a/b?q=1)\n2. 第二项\n\n| 场景 | 备注 |\n| --- | --- |\n| 台面 | 左侧 \\| 右侧 |\n\n![采集视野示意](/sample-scene.svg)\n\n```json\n{ "task_id": "kitchen-clean", "valid": true }\n```\n\n```mermaid\ngraph LR\n  A[采集] --> B[审核]\n```\n\n保留公式源码：$x^2 + y^2$。\n\n脚注引用[^note]。\n\n[^note]: 这段文字不应在保存时丢失。\n\n<details>\n<summary>补充说明</summary>\n只读端未启用原始 HTML。\n</details>\n',
  },
  empty: { name: '空白文档', context: '从空白开始，测试输入、撤销、粘贴与重开。', markdown: '' },
};

export type SampleId = keyof typeof samples;

export function compareText(source: string, output: string) {
  const same = source === output;
  const sourceLines = source.split('\n');
  const outputLines = output.split('\n');
  const firstChangedLine = same ? null :
    Array.from({ length: Math.max(sourceLines.length, outputLines.length) }, (_, i) => i)
      .find((i) => sourceLines[i] !== outputLines[i])! + 1;
  return { same, firstChangedLine, sourceLength: source.length, outputLength: output.length };
}
