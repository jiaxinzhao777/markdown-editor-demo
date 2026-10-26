import { useEffect, useRef } from 'react';
import VditorEditor from 'vditor';
import 'vditor/dist/index.css';
import type { EditorProps } from '../protocol';

export default function Vditor({ initialMarkdown, onChange }: EditorProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    let disposed = false;
    const editor = new VditorEditor(root.current, {
      value: initialMarkdown, height: 520, mode: 'ir', lang: 'zh_CN',
      cdn: `${import.meta.env.BASE_URL}vendor/vditor`, cache: { enable: false },
      toolbar: ['headings', 'bold', 'italic', 'strike', '|', 'list', 'ordered-list',
        'check', 'quote', 'code', 'link', 'table', '|', 'undo', 'redo', 'edit-mode', 'preview'],
      preview: { hljs: { enable: false } },
      input: (markdown) => { if (!disposed) onChange(markdown); },
      after: () => { if (!disposed) onChange(editor.getValue()); },
    });
    return () => { disposed = true; editor.destroy(); };
  }, [initialMarkdown, onChange]);
  return <div ref={root} />;
}
