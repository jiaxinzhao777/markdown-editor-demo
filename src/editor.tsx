import { Component, Suspense, lazy, useCallback, useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { CHANNEL, isLoadEvent, type EditorProps, type FrameEvent } from './protocol';
import type { EditorId } from './catalog';
import './editor.css';

const adapters = {
  uiw: lazy(() => import('./adapters/Uiw')),
  mdx: lazy(() => import('./adapters/Mdx')),
  milkdown: lazy(() => import('./adapters/Milkdown')),
  vditor: lazy(() => import('./adapters/Vditor')),
  toast: lazy(() => import('./adapters/Toast')),
  tiptap: lazy(() => import('./adapters/Tiptap')),
  blocknote: lazy(() => import('./adapters/Blocknote')),
  codemirror: lazy(() => import('./adapters/Codemirror')),
  mdrt: lazy(() => import('./adapters/Mdrt')),
  easymde: lazy(() => import('./adapters/Easymde')),
};

function send(event: FrameEvent) {
  window.parent.postMessage(event, window.location.origin);
}

class EditorBoundary extends Component<{ children: ReactNode }, { error: string }> {
  state = { error: '' };
  static getDerivedStateFromError(error: Error) { return { error: error.message }; }
  componentDidCatch(error: Error) { send({ channel: CHANNEL, type: 'error', message: error.message }); }
  render() {
    return this.state.error ? <p role="alert">编辑器加载失败：{this.state.error}</p> : this.props.children;
  }
}

function Frame() {
  const id = new URLSearchParams(location.search).get('editor') ?? 'uiw';
  const [document, setDocument] = useState<{ markdown: string; revision: number } | null>(null);
  const onChange = useCallback<EditorProps['onChange']>((markdown) => {
    send({ channel: CHANNEL, type: 'output', markdown });
  }, []);
  const onError = useCallback<EditorProps['onError']>((message) => {
    send({ channel: CHANNEL, type: 'error', message });
  }, []);
  useEffect(() => {
    function receive(event: MessageEvent<unknown>) {
      if (event.origin !== location.origin || event.source !== window.parent || !isLoadEvent(event.data)) return;
      const markdown = event.data.markdown;
      setDocument((previous) => ({ markdown, revision: (previous?.revision ?? 0) + 1 }));
    }
    window.addEventListener('message', receive);
    send({ channel: CHANNEL, type: 'ready' });
    return () => window.removeEventListener('message', receive);
  }, []);
  if (!(id in adapters)) return <p role="alert">未知编辑器。</p>;
  const Adapter = adapters[id as EditorId];
  return <EditorBoundary key={document?.revision}>
    <Suspense fallback={<div className="loading">正在加载真实编辑器…</div>}>
      {document && <Adapter initialMarkdown={document.markdown} onChange={onChange} onError={onError} />}
    </Suspense>
  </EditorBoundary>;
}

createRoot(document.getElementById('root')!).render(<Frame />);
