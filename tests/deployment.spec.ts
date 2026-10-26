import { expect, test } from '@playwright/test';

const editorNames = [
  'uiw / React MD Editor', 'MDXEditor', 'Milkdown / Crepe', 'Vditor',
  'TOAST UI Editor', 'Tiptap + Markdown', 'BlockNote', 'CodeMirror 6',
  'md-editor-rt', 'EasyMDE',
];

for (const name of editorNames) {
  test(`${name} loads without external runtime dependencies`, async ({ page, baseURL }) => {
    const failures: string[] = [];
    page.on('pageerror', (error) => failures.push(error.message));
    page.on('response', (response) => {
      if (response.status() >= 400) failures.push(`${response.status()} ${response.url()}`);
    });
    await page.route('**/*', async (route) => {
      const url = route.request().url();
      if (url.startsWith('http') && !url.startsWith(baseURL!)) {
        failures.push(`Resource outside deployment path: ${url}`);
        await route.abort();
      } else {
        await route.continue();
      }
    });
    await page.goto('./');
    await page.getByRole('navigation', { name: '编辑器选择' }).getByRole('button', { name, exact: false }).click();
    await expect(page.getByRole('status')).toHaveText('已读取编辑器输出');
    await expect(page.getByLabel('编辑器实际输出')).toHaveValue(/厨房场景采集标准/);
    await expect(page.getByRole('button', { name: '下载', exact: true })).toBeEnabled();
    await expect(page.frameLocator('iframe').locator('body')).toContainText('厨房场景采集标准');
    await page.waitForLoadState('networkidle');
    expect(failures).toEqual([]);
  });
}

test('sample image, reload, snapshot, and Markdown download work in a subdirectory', async ({ page, baseURL }) => {
  await page.goto('./');
  await page.getByRole('button', { name: /CodeMirror 6/ }).click();
  await expect(page.getByRole('status')).toHaveText('已读取编辑器输出');
  await page.getByLabel('测试样例').selectOption('edge');
  await expect(page.getByLabel('编辑器实际输出')).toHaveValue(/格式往返检查/);
  await page.getByRole('button', { name: '统一只读预览' }).click();
  const image = page.getByRole('img', { name: '采集视野示意' });
  await expect(image).toHaveJSProperty('src', `${baseURL}sample-scene.svg`);
  await expect(image).toHaveJSProperty('complete', true);
  await expect(image).not.toHaveJSProperty('naturalWidth', 0);

  const markdown = '# 在线试用\n\n保留我的编辑内容。\n';
  await page.getByLabel('输入源码').fill(markdown);
  await page.getByRole('button', { name: '载入这段 Markdown' }).click();
  await page.getByRole('button', { name: '查看源码', exact: true }).click();
  await expect(page.getByLabel('编辑器实际输出')).toHaveValue(markdown);
  await page.getByRole('button', { name: '重新加载编辑器' }).click();
  await expect(page.getByRole('status')).toHaveText('已读取编辑器输出');
  await expect(page.getByLabel('编辑器实际输出')).toHaveValue(markdown);
  await page.getByRole('button', { name: '1. 保存内存快照' }).click();
  await page.getByRole('button', { name: '重置样例' }).click();
  await expect(page.getByLabel('编辑器实际输出')).toHaveValue(/格式往返检查/);
  await page.getByRole('button', { name: '2. 重开快照' }).click();
  await expect(page.getByLabel('编辑器实际输出')).toHaveValue(markdown);
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载', exact: true }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe('codemirror-edge.md');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream!) chunks.push(Buffer.from(chunk));
  expect(Buffer.concat(chunks).toString()).toBe(markdown);
});

test('comparison report is available in the production build', async ({ page }) => {
  await page.goto('./');
  await page.getByRole('button', { name: '对比文档与选型建议' }).click();
  await expect(page.locator('article')).toContainText('Markdown');
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载文档' }).click();
  expect((await downloadEvent).suggestedFilename()).toBe('markdown-editor-comparison.md');
});
