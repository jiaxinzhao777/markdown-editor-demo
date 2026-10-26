import { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from 'rehype-sanitize';
import type { EditorProps } from '../protocol';

export default function Uiw({ initialMarkdown, onChange }: EditorProps) {
  const [value, setValue] = useState(initialMarkdown);
  useEffect(() => onChange(value), [value, onChange]);
  return <div data-color-mode="light"><MDEditor value={value}
    onChange={(next) => setValue(next ?? '')} height={520}
    previewOptions={{ rehypePlugins: [rehypeSanitize] }}
    textareaProps={{ 'aria-label': 'Markdown 编辑内容' }} /></div>;
}
