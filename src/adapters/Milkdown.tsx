import { useEffect, useRef } from 'react';
import { Crepe } from '@milkdown/crepe';
import '@milkdown/crepe/theme/common/style.css';
import '@milkdown/crepe/theme/frame.css';
import type { EditorProps } from '../protocol';

export default function Milkdown({ initialMarkdown, onChange, onError }: EditorProps) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let disposed = false;
    const editor = new Crepe({ root: root.current, defaultValue: initialMarkdown });
    editor.on((listener) => listener.markdownUpdated((_ctx, markdown) => {
      if (!disposed) onChange(markdown);
    }));
    const created = editor.create();
    void created.then(() => { if (!disposed) onChange(editor.getMarkdown()); })
      .catch((error: unknown) => { if (!disposed) onError(String(error)); });
    return () => {
      disposed = true;
      void created.then(() => editor.destroy()).catch(() => undefined);
    };
  }, [initialMarkdown, onChange, onError]);
  return <div ref={root} />;
}
