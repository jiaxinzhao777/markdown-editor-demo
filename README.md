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

## 发布到 GitHub Pages

仓库已包含 `.github/workflows/deploy.yml`，推送 `main` 后自动构建、检查 10 个编辑器并发布。使用 GitHub 官方 Pages 工作流，无需配置个人访问令牌。

1. 打开仓库 **Settings → Pages**，将 **Build and deployment → Source** 设置为 **GitHub Actions**。
2. 提交并推送本次修改：

   ```sh
   git add .github/workflows/deploy.yml .gitignore README.md package.json vite.config.ts playwright.config.ts tests src
   git commit -m "feat: 支持 GitHub Pages 在线试用与自动部署"
   git push -u origin main
   ```

3. 在 **Actions → Deploy to GitHub Pages** 查看结果。成功后通过以下地址分享：

   https://jiaxinzhao777.github.io/markdown-editor-demo/

若推送时尚未启用 Pages，完成第 1 步后在 Actions 中重新运行工作流。GitHub Free 账号需要公开仓库；私有仓库的 Pages 支持取决于账号套餐。工作流会读取 Pages 的部署路径，适配项目子目录和自定义域名；本地开发默认仍使用 `/`。

参考：[Vite 部署指南](https://vite.dev/guide/static-deploy#github-pages)、[GitHub Pages 自定义工作流](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 发布前验证

在 macOS / Linux 下模拟 GitHub Pages 的子目录部署：

```sh
DEPLOY_BASE_PATH=/markdown-editor-demo/ npm run build
npx playwright install chromium
npm run test:e2e
DEPLOY_BASE_PATH=/markdown-editor-demo/ npm run preview
```

预览地址为 http://127.0.0.1:4317/markdown-editor-demo/ 。测试使用独立的 4319 端口和构建产物，覆盖 10 个编辑器加载、子目录资源、样例图片、重新加载、保存重开、Markdown 下载及对比报告。编辑器初始加载测试会阻止并记录站点外的资源请求，避免演示意外依赖第三方 CDN。

已有 Chrome 时，可用 `PLAYWRIGHT_CHANNEL=chrome npm run test:e2e`；CI 自动安装并使用 Playwright Chromium。更换部署路径时，构建和测试需使用相同的 `DEPLOY_BASE_PATH`。

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
- `.github/workflows/deploy.yml`：构建、浏览器验证和 GitHub Pages 自动发布。
- `tests/deployment.spec.ts`：发布产物的浏览器回归检查。
- `docs/editor-comparison.md`：对比矩阵、场景建议、限制和验收步骤。
- `docs/dependency-snapshot.json`：已安装主包的版本与许可元数据。

这是前端 POC，没有业务后端。保存按钮只保存内存快照，刷新后清除；需要保留内容请下载 Markdown。字符串变化不等于内容丢失，最终选择需要人工核对语义及真实历史文档。

## 本次验证（2026-10-26）

以 `/markdown-editor-demo/` 为基础路径的生产构建通过；使用本机 Chrome 运行的 12 项 Playwright 检查全部通过。GitHub 托管环境中的构建与部署结果需在首次推送后的 Actions 页面确认。

构建包含 TypeScript 检查。Vditor 和样例图片跟随部署基础路径；md-editor-rt 关闭未接后端的图片上传功能，避免加载外部 Cropper 资源。编辑器按需加载，网络异常时可点击“重新加载编辑器”，保留最近收到的 Markdown 输出。

浏览器测试覆盖标准样例和关键试用流程，尚未覆盖全部边界语法、输入法和完整编辑交互。构建仍有大于 500 kB 的编辑器分包提示；首次打开较重的编辑器需要下载对应资源。
