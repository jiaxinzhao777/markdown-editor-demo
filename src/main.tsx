import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowTopRightIcon, DownloadIcon, ReaderIcon, ReloadIcon } from '@radix-ui/react-icons';
import { compareText, editors, samples, type EditorId, type SampleId } from './catalog';
import { CHANNEL, isFrameEvent } from './protocol';
import packageJson from '../package.json';
import comparison from '../docs/editor-comparison.md?raw';
import './main.css';

function Markdown({ text }: { text: string }) {
  return <div className="prose-document"><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml>{text}</ReactMarkdown></div>;
}

function download(text: string, name: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/markdown;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function Workspace({ id, sample }: { id: EditorId; sample: SampleId }) {
  const frame = useRef<HTMLIFrameElement>(null);
  const initial = samples[sample].markdown;
  const [source, setSource] = useState<string>(initial);
  const [baseline, setBaseline] = useState<string>(initial);
  const [output, setOutput] = useState('');
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [status, setStatus] = useState('正在加载编辑器…');
  const [error, setError] = useState('');
  const [received, setReceived] = useState(false);
  const [preview, setPreview] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const current = editors.find((editor) => editor.id === id)!;
  const diff = compareText(baseline, output);

  const load = (markdown: string) => {
    setError(''); setReceived(false); setStatus('正在载入文档…'); setBaseline(markdown);
    frame.current?.contentWindow?.postMessage({ channel: CHANNEL, type: 'load', markdown }, location.origin);
  };

  useEffect(() => {
    function receive(event: MessageEvent<unknown>) {
      if (event.origin !== location.origin || event.source !== frame.current?.contentWindow || !isFrameEvent(event.data)) return;
      if (event.data.type === 'ready') {
        frame.current?.contentWindow?.postMessage({ channel: CHANNEL, type: 'load', markdown: initial }, location.origin);
      } else if (event.data.type === 'output') {
        setOutput(event.data.markdown); setReceived(true); setStatus('已读取编辑器输出');
      } else {
        setError(event.data.message); setStatus('当前文档加载异常');
      }
    }
    window.addEventListener('message', receive);
    return () => window.removeEventListener('message', receive);
  }, [initial]);

  useEffect(() => {
    if (received || error) return;
    const timer = setTimeout(() => setStatus('加载较慢，请检查网络或点击重新加载。'), 25000);
    return () => clearTimeout(timer);
  }, [received, error]);

  return <>
    <div className="grid gap-5 border-y border-stone-200 py-5 lg:grid-cols-[1fr_1fr_1.1fr]">
      <div><span className="eyebrow">优势</span><p className="mt-2 text-sm leading-6">{current.benefit}</p></div>
      <div><span className="eyebrow">取舍</span><p className="mt-2 text-sm leading-6">{current.tradeoff}</p></div>
      <div><span className="eyebrow">试用提示</span><p className="mt-2 text-sm leading-6">{current.try}</p></div>
    </div>
    <div className="my-5 flex flex-wrap items-center justify-between gap-3">
      <div><strong className="text-sm">{samples[sample].name}</strong><p className="mt-1 text-xs text-stone-500">{samples[sample].context}</p></div>
      <div className="flex flex-wrap gap-2">
        <button className="button" aria-pressed={narrow} onClick={() => setNarrow(!narrow)}>{narrow ? '展开编辑区' : '模拟 520px 弹窗'}</button>
        <button className="button" onClick={() => { setSource(initial); load(initial); }}><ReloadIcon />重置样例</button>
      </div>
    </div>
    <section className="overflow-hidden rounded-xl border border-stone-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 px-5 py-3">
        <span className="text-sm font-semibold">真实编辑器 <span className="ml-2 font-mono text-xs font-normal text-stone-400">React 19.2.3</span></span>
        <span role="status" className="text-xs text-stone-500">{status}</span>
      </div>
      {error && <div role="alert" className="border-b border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">{error}。可以修改下方输入源码后重新载入，或切换样例。</div>}
      <div className={narrow ? 'mx-auto max-w-[520px] border-x border-stone-200' : ''}>
        <iframe ref={frame} src={`./editor.html?editor=${id}`} title={`${current.name} 编辑器`} className="block h-[560px] w-full border-0" />
      </div>
    </section>
    <div className="my-5 flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-stone-500">切换编辑器或样例会重新载入；需保留内容请先下载。图片上传、发布与多人协作未接后端。</p>
      <a className="inline-flex items-center gap-1 text-sm text-emerald-800" href={current.url} target="_blank" rel="noreferrer">官方体验与文档<ArrowTopRightIcon /></a>
    </div>
    <section className="grid gap-5 xl:grid-cols-2">
      <div className="min-w-0">
        <div className="mb-3 flex items-center justify-between gap-2"><label htmlFor="source" className="text-sm font-semibold">输入源码</label><button className="button" onClick={() => load(source)}>载入这段 Markdown</button></div>
        <textarea id="source" value={source} onChange={(event) => setSource(event.target.value)} spellCheck={false} className="source-area" />
      </div>
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><label htmlFor="output" className="text-sm font-semibold">编辑器实际输出</label><div className="flex gap-2"><button className="button" aria-pressed={preview} onClick={() => setPreview(!preview)}>{preview ? '查看源码' : '统一只读预览'}</button><button className="button" disabled={!received || !!error} onClick={() => download(output, `${id}-${sample}.md`)}><DownloadIcon />下载</button></div></div>
        {preview ? <div className="h-[300px] overflow-auto rounded-lg border border-stone-200 bg-white p-5"><Markdown text={output} /></div> : <textarea id="output" value={output} readOnly className="source-area" />}
      </div>
    </section>
    <section className="mt-5 rounded-xl border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h3 className="text-sm font-semibold">保存 → 重开 → 核对</h3><p className="mt-1 text-xs text-stone-500">仅检查字符串差异；格式归一化不等于内容丢失，仍需人工核对结构和语义。</p></div>
        <div className="flex flex-wrap gap-2">
          <button className="button" disabled={!received || !!error} onClick={() => { setSnapshot(output); setStatus('已保存内存快照；刷新页面后清除'); }}>1. 保存内存快照</button>
          <button className="button primary" disabled={snapshot === null} onClick={() => { if (snapshot !== null) load(snapshot); }}>2. 重开快照</button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-5 border-t border-stone-100 pt-4 font-mono text-xs" data-testid="comparison">
        <span>{!received ? '等待编辑器输出' : diff.same ? '与本轮输入完全一致' : `与本轮输入不同 · 首处变化 L${diff.firstChangedLine}`}</span>
        <span>输入 {diff.sourceLength} 字符</span><span>输出 {diff.outputLength} 字符</span>
      </div>
    </section>
  </>;
}

function App() {
  const [id, setId] = useState<EditorId>('mdx');
  const [sample, setSample] = useState<SampleId>('standard');
  const [page, setPage] = useState<'lab' | 'report'>('lab');
  const current = editors.find((editor) => editor.id === id)!;
  return <div className="min-h-[100dvh] bg-[#f6f7f4] text-[#26382f]">
    <aside className="border-b border-stone-200 bg-white lg:fixed lg:inset-y-0 lg:w-[258px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="px-6 pb-6 pt-8"><span className="eyebrow">ROPEDIA / RESEARCH</span><h1 className="mt-3 text-xl font-semibold tracking-tight">Markdown 编辑器</h1><p className="mt-1 text-xs text-stone-500">选型实验室 · 2026.10.26</p></div>
      <nav aria-label="编辑器选择" className="grid grid-cols-2 gap-1 px-3 pb-4 md:grid-cols-3 lg:grid-cols-1">
        {editors.map((editor, index) => <button key={editor.id} aria-current={page === 'lab' && editor.id === id ? 'page' : undefined}
          onClick={() => { setId(editor.id); setPage('lab'); }}
          className={`rounded-lg px-3 py-3 text-left transition-colors ${page === 'lab' && editor.id === id ? 'bg-[#e8f0e9] text-emerald-900' : 'hover:bg-stone-50'}`}>
          <span className="mr-2 font-mono text-xs text-stone-400">{String(index + 1).padStart(2, '0')}</span><span className="text-sm font-medium">{editor.name}</span>
          <span className="ml-6 mt-1 block text-[11px] text-stone-500">{editor.category}</span>
        </button>)}
      </nav>
      <div className="border-t border-stone-200 p-5"><button className={`button w-full justify-center ${page === 'report' ? 'primary' : ''}`} onClick={() => setPage('report')}><ReaderIcon />对比文档与选型建议</button><p className="mt-4 text-xs leading-5 text-stone-400">10 个真实库 · 统一业务样例<br />独立加载，避免编辑器样式互相干扰。</p></div>
    </aside>
    <main className="mx-auto max-w-[1800px] px-5 py-8 md:px-9 lg:ml-[258px] lg:px-10">
      {page === 'report' ? <>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><span className="eyebrow">RESEARCH NOTES</span><h2 className="mt-3 text-3xl font-semibold tracking-tight">对比文档与选型建议</h2></div><button className="button" onClick={() => download(comparison, 'markdown-editor-comparison.md')}><DownloadIcon />下载文档</button></div>
        <article className="rounded-xl border border-stone-200 bg-white p-6 md:p-10"><Markdown text={comparison} /></article>
      </> : <>
        <header className="mb-7 flex flex-wrap items-end justify-between gap-5">
          <div><span className="eyebrow">EDITOR / {current.category}</span><h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">{current.name}</h2><p className="mt-3 text-xs text-stone-500"><span className="mr-3 rounded-full bg-[#e5eee6] px-3 py-1 text-emerald-900">{current.tag}</span><span className="font-mono">v{packageJson.dependencies[current.package]}</span></p></div>
          <label className="flex flex-col gap-2 text-xs text-stone-500">测试样例<select value={sample} onChange={(event) => setSample(event.target.value as SampleId)} className="rounded-lg border border-stone-300 bg-white px-4 py-2.5 text-sm text-stone-800">
            {Object.entries(samples).map(([key, item]) => <option key={key} value={key}>{item.name}</option>)}
          </select></label>
        </header>
        <Workspace key={`${id}-${sample}`} id={id} sample={sample} />
      </>}
      <footer className="mt-8 border-t border-stone-200 py-4 text-xs text-stone-400">结论基于现有项目代码、官方资料及本地 POC。版本快照见文档；这里不连接业务数据。</footer>
    </main>
  </div>;
}

createRoot(document.getElementById('root')!).render(<App />);
