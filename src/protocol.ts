export const CHANNEL = 'ropedia-markdown-lab';

export type FrameEvent =
  | { channel: typeof CHANNEL; type: 'ready' }
  | { channel: typeof CHANNEL; type: 'output'; markdown: string }
  | { channel: typeof CHANNEL; type: 'error'; message: string };

export function isFrameEvent(value: unknown): value is FrameEvent {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return item.channel === CHANNEL && (
    item.type === 'ready' ||
    (item.type === 'output' && typeof item.markdown === 'string') ||
    (item.type === 'error' && typeof item.message === 'string')
  );
}

export function isLoadEvent(value: unknown): value is { channel: typeof CHANNEL; type: 'load'; markdown: string } {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return item.channel === CHANNEL && item.type === 'load' && typeof item.markdown === 'string';
}

export type EditorProps = {
  initialMarkdown: string;
  onChange: (markdown: string) => void;
  onError: (message: string) => void;
};
