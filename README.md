# Markdown 编辑器选型实验室

10 个真实编辑器，共用 Markdown 样例、输出检查和保存重开流程。

## 启动

使用 Node.js 22.12+（本次验证环境为 24.14.1）和 npm：

```sh
npm ci
npm run dev
```

打开 http://127.0.0.1:4317 。左侧“对比文档与选型建议”可以阅读和下载完整报告，也可以直接阅读 [方案对比文档](docs/editor-comparison.md)。

```sh
npm run typecheck
npm run build
npm run preview
```

`dev` / `build` 会自动准备 Vditor 本地资源。部署整个 `dist` 目录，包含首页和 iframe 使用的 `editor.html`。

## 常见报错

- `Failed to resolve import "../docs/editor-comparison.md?raw"`：报告是首页的构建输入，不能遗漏。文件应存在于 `docs/editor-comparison.md`。
- `@vitejs/plugin-react/dist/index.d.ts` 出现 `TS1003` / `TS1128`：旧 TypeScript 5.5 无法解析插件声明中的字符串导出名。本项目使用兼容该语法的 TypeScript 5.9.3；更新后运行 `npm ci`，不要直接修改 node_modules。
- `Port 4317 is already in use`：已有服务占用了默认端口。若本项目已经运行，直接访问它；否则使用 `npm run dev -- --port 4318`。预览默认也使用 4317，可以运行 `npm run preview -- --port 4318`。
- 更新依赖后出现 `Failed to fetch dynamically imported module`：停止旧开发服务并重新运行 `npm run dev`，刷新浏览器；必要时加 `-- --force` 重新预构建依赖。
- 编辑器长时间加载或资源 404：确认通过 npm 脚本启动，且部署包含准备好的 `vendor/vditor` 资源。

## 项目结构与边界

- `src/catalog.ts`：候选库说明和统一样例。
- `src/adapters/`：10 个编辑器的真实接入。
- `src/main.tsx`：选型界面、报告和输出比较。
- `src/editor.tsx`：隔离样式的编辑器 iframe。
- `docs/editor-comparison.md`：对比矩阵、场景建议、限制和验收步骤。
- `docs/dependency-snapshot.json`：已安装主包的版本与许可元数据。

这是前端 POC，没有业务后端。保存按钮只保存内存快照，刷新后清除；需要保留内容请下载 Markdown。字符串变化不等于内容丢失，最终选择需要人工核对语义及真实历史文档。

## 本次验证（2026-10-26）

`npm run build` 通过（包含 TypeScript 检查）。在新启动的开发服务中，Chromium 验证了 10 个编辑器载入“采集标准文档”并返回非空 Markdown，未出现页面异常；对比文档可以显示和下载。尚未覆盖全部边界样例、输入法和完整编辑交互。构建仍有大于 500 kB 的分包提示；md-editor-rt 会尝试加载外部 Cropper 资源，离线部署时还需处理。
