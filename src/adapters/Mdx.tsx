import { useEffect, useRef } from 'react';
import {
  MDXEditor, type MDXEditorMethods, headingsPlugin, listsPlugin, quotePlugin,
  thematicBreakPlugin, linkPlugin, linkDialogPlugin, tablePlugin, imagePlugin,
  codeBlockPlugin, codeMirrorPlugin, markdownShortcutPlugin, diffSourcePlugin,
  toolbarPlugin, UndoRedo, BoldItalicUnderlineToggles, BlockTypeSelect,
  ListsToggle, CreateLink, InsertTable, InsertImage, InsertCodeBlock,
  DiffSourceToggleWrapper, Separator,
} from '@mdxeditor/editor';
import '@mdxeditor/editor/style.css';
import type { EditorProps } from '../protocol';

export default function Mdx({ initialMarkdown, onChange, onError }: EditorProps) {
  const ref = useRef<MDXEditorMethods>(null);
  useEffect(() => { if (ref.current) onChange(ref.current.getMarkdown()); }, [onChange]);
  return <MDXEditor ref={ref} markdown={initialMarkdown} onChange={onChange}
    onError={(error) => onError(error.error)} contentEditableClassName="document-body"
    plugins={[
      headingsPlugin(), listsPlugin(), quotePlugin(), thematicBreakPlugin(),
      linkPlugin(), linkDialogPlugin(), tablePlugin(), imagePlugin(),
      codeBlockPlugin({ defaultCodeBlockLanguage: 'text' }),
      codeMirrorPlugin({ codeBlockLanguages: { text: 'Text', json: 'JSON', javascript: 'JavaScript', mermaid: 'Mermaid（源码）' } }),
      markdownShortcutPlugin(), diffSourcePlugin({ diffMarkdown: initialMarkdown }),
      toolbarPlugin({ toolbarContents: () => <DiffSourceToggleWrapper>
        <UndoRedo /><Separator /><BlockTypeSelect /><BoldItalicUnderlineToggles />
        <ListsToggle /><CreateLink /><InsertTable /><InsertImage /><InsertCodeBlock />
      </DiffSourceToggleWrapper> }),
    ]} />;
}
