import { useEffect, useRef } from 'react';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import '@toast-ui/editor/dist/i18n/zh-cn';
import type { EditorProps } from '../protocol';

export default function Toast({ initialMarkdown, onChange }: EditorProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const editor = new Editor({
      el: root.current, initialValue: initialMarkdown, initialEditType: 'wysiwyg',
      previewStyle: 'vertical', height: '520px', language: 'zh-CN', usageStatistics: false,
      hooks: { addImageBlobHook: () => false },
      events: { change: () => onChange(editor.getMarkdown()) },
    });
    onChange(editor.getMarkdown());
    return () => editor.destroy();
  }, [initialMarkdown, onChange]);
  return <div ref={root} />;
}
