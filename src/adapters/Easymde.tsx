import { useEffect, useRef } from 'react';
import EasyMDE from 'easymde';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import 'easymde/dist/easymde.min.css';
import type { EditorProps } from '../protocol';

export default function Easymde({ initialMarkdown, onChange }: EditorProps) {
  const root = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const editor = new EasyMDE({
      element: root.current, initialValue: initialMarkdown, spellChecker: false,
      autoDownloadFontAwesome: false, minHeight: '440px', status: false,
      previewRender: (text) => DOMPurify.sanitize(marked.parse(text, { async: false })),
      toolbar: [
        { name: 'bold', action: EasyMDE.toggleBold, className: 'lab-bold', title: '加粗' },
        { name: 'italic', action: EasyMDE.toggleItalic, className: 'lab-italic', title: '斜体' },
        { name: 'heading', action: EasyMDE.toggleHeadingSmaller, className: 'lab-heading', title: '标题' },
        '|',
        { name: 'unordered-list', action: EasyMDE.toggleUnorderedList, className: 'lab-list', title: '列表' },
        { name: 'link', action: EasyMDE.drawLink, className: 'lab-link', title: '链接' },
        { name: 'table', action: EasyMDE.drawTable, className: 'lab-table', title: '表格' },
        '|',
        { name: 'preview', action: EasyMDE.togglePreview, className: 'lab-preview', title: '预览' },
      ],
    });
    editor.codemirror.on('change', () => onChange(editor.value()));
    onChange(editor.value());
    return () => { editor.toTextArea(); editor.cleanup(); };
  }, [initialMarkdown, onChange]);
  return <textarea ref={root} aria-label="Markdown 编辑内容" />;
}
