import { useEffect, useMemo } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import { zh } from '@blocknote/core/locales';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import type { EditorProps } from '../protocol';

export default function Blocknote({ initialMarkdown, onChange }: EditorProps) {
  const editor = useMemo(() => {
    const current = BlockNoteEditor.create({ dictionary: zh });
    const blocks = current.tryParseMarkdownToBlocks(initialMarkdown);
    if (blocks.length) current.replaceBlocks(current.document, blocks);
    return current;
  }, [initialMarkdown]);
  useEffect(() => { onChange(editor.blocksToMarkdownLossy()); }, [editor, onChange]);
  return <BlockNoteView editor={editor} theme="light"
    onChange={() => onChange(editor.blocksToMarkdownLossy())} />;
}
