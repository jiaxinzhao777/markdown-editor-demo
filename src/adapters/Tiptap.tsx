import { useEffect } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Markdown } from '@tiptap/markdown';
import { TableKit } from '@tiptap/extension-table';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import type { EditorProps } from '../protocol';

export default function Tiptap({ initialMarkdown, onChange }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Markdown, TableKit, Image, TaskList, TaskItem.configure({ nested: true })],
    content: initialMarkdown, contentType: 'markdown',
    editorProps: { attributes: { class: 'document-body', 'aria-label': 'Markdown 编辑内容' } },
    onUpdate: ({ editor: current }) => onChange(current.getMarkdown()),
  });
  useEffect(() => { if (editor) onChange(editor.getMarkdown()); }, [editor, onChange]);
  if (!editor) return <p>正在载入 Tiptap…</p>;
  return <>
    <div className="simple-toolbar" role="toolbar" aria-label="文档格式">
      <button onClick={() => editor.chain().focus().toggleBold().run()}>加粗</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()}>斜体</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>二级标题</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>列表</button>
      <button onClick={() => editor.chain().focus().toggleTaskList().run()}>待办</button>
      <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>表格</button>
      <button onClick={() => editor.chain().focus().undo().run()}>撤销</button>
      <button onClick={() => editor.chain().focus().redo().run()}>重做</button>
    </div>
    <EditorContent editor={editor} />
  </>;
}
