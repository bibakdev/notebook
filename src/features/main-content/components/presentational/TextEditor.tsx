'use client';

import { useState, useEffect, useRef } from 'react';
import MDEditor from '@uiw/react-md-editor';
import { usePromptStore } from '../../store/prompt-store';

interface TextEditorProps {
  boxId: string;
}

export function TextEditor({ boxId }: TextEditorProps) {
  const box = usePromptStore((s) => s.boxes[boxId]);
  const updateBoxContent = usePromptStore((s) => s.updateBoxContent);
  const ref = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (
        ref.current &&
        event.target &&
        ref.current.contains(event.target as Node)
      ) {
        return;
      }
      setEditing(false);
    };
    document.addEventListener('click', listener, { capture: true });
    return () => {
      document.removeEventListener('click', listener, { capture: true });
    };
  }, []);

  if (!box) return null;

  const direction = box.direction || 'ltr';

  if (editing) {
    return (
      <div className="text-editor" ref={ref} dir={direction}>
        <MDEditor
          value={box.content}
          onChange={(v) => updateBoxContent(boxId, v || '')}
        />
      </div>
    );
  }

  return (
    <div
      className="text-editor card"
      onDoubleClick={() => setEditing(true)}
      dir={direction}
    >
      <div className="card-content text-lg p-4 leading-relaxed border border-l-4 border-primary rounded-lg">
        <MDEditor.Markdown
          source={box.content || 'دابل کلیک کنید تا ویرایش شروع شود'}
        />
      </div>
    </div>
  );
}
