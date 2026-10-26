import { useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { basicSetup } from 'codemirror';
import type { EditorProps } from '../protocol';

export default function Codemirror({ initialMarkdown, onChange }: EditorProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const editor = new EditorView({ parent: root.current, state: EditorState.create({
      doc: initialMarkdown,
      extensions: [basicSetup, markdown(), EditorView.lineWrapping,
        EditorView.contentAttributes.of({ 'aria-label': 'Markdown 编辑内容' }),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) onChange(update.state.doc.toString());
        }),
        EditorView.theme({ '&': { minHeight: '510px' }, '.cm-content': { padding: '24px 12px' } }),
      ],
    }) });
    onChange(editor.state.doc.toString());
    return () => editor.destroy();
  }, [initialMarkdown, onChange]);
  return <div ref={root} />;
}
