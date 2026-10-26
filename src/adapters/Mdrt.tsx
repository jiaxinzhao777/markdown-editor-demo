import { useEffect, useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import DOMPurify from 'dompurify';
import 'md-editor-rt/lib/style.css';
import type { EditorProps } from '../protocol';

export default function Mdrt({ initialMarkdown, onChange }: EditorProps) {
  const [value, setValue] = useState(initialMarkdown);
  useEffect(() => onChange(value), [value, onChange]);
  return <MdEditor value={value} onChange={setValue} language="zh-CN" style={{ height: 520 }}
    noMermaid noKatex noHighlight noEcharts noPrettier noImgZoomIn
    sanitize={(html) => DOMPurify.sanitize(html)}
    toolbars={['bold', 'italic', 'strikeThrough', '-', 'title', 'quote', 'unorderedList', 'orderedList', 'task', '-', 'code', 'link', 'table', '-', 'revoke', 'next', 'preview', 'catalog']} />;
}
