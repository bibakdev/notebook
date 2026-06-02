// src/features/main-content/components/presentational/TextEditor.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import MDEditor, { commands, type ICommand } from '@uiw/react-md-editor';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { usePromptStore } from '../../store/prompt-store';

interface TextEditorProps {
  boxId: string;
}

export function TextEditor({ boxId }: TextEditorProps) {
  const box = usePromptStore((s) => {
    const fileId = s.currentFileId;
    if (!fileId) return undefined;
    return s.filesData[fileId]?.boxes[boxId];
  });
  const updateBoxContent = usePromptStore((s) => s.updateBoxContent);
  const ref = useRef<HTMLDivElement | null>(null);

  const [editing, setEditing] = useState(false);
  const [fontSize, setFontSize] = useState(16); // استیت برای کنترل سایز فونت

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      // بررسی اینکه آیا ادیتور در حالت تمام‌صفحه است؟
      const isFullscreen = document.querySelector('.w-md-editor-fullscreen');
      if (isFullscreen) {
        // اگر تمام‌صفحه بود، فقط بگذار خود کتابخانه از حالت تمام‌صفحه خارج بشه
        // و از ویرایشگر خارج نشو
        return;
      }
      setEditing(false);
    }
  }, []);

  useEffect(() => {
    if (editing) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [editing, handleKeyDown]);

  if (!box) return null;

  const direction = box.direction || 'ltr';

  // دکمه بزرگ‌نمایی متن
  const zoomInCmd: ICommand = {
    name: 'zoomIn',
    keyCommand: 'zoomIn',
    buttonProps: { 'aria-label': 'بزرگ‌نمایی', title: 'بزرگ‌نمایی متن' },
    icon: <ZoomIn size={14} />,
    execute: () => setFontSize((prev) => Math.min(prev + 2, 40)) // سقف فونت 40
  };

  // دکمه کوچک‌نمایی متن
  const zoomOutCmd: ICommand = {
    name: 'zoomOut',
    keyCommand: 'zoomOut',
    buttonProps: { 'aria-label': 'کوچک‌نمایی', title: 'کوچک‌نمایی متن' },
    icon: <ZoomOut size={14} />,
    execute: () => setFontSize((prev) => Math.max(prev - 2, 12)) // کف فونت 12
  };

  if (editing) {
    return (
      <div
        className="text-editor"
        ref={ref}
        dir={direction}
        style={{ '--editor-font-size': `${fontSize}px` } as React.CSSProperties}
      >
        <MDEditor
          value={box.content}
          onChange={(v) => updateBoxContent(boxId, v || '')}
          autoFocus
          extraCommands={[
            commands.codeEdit,
            commands.codeLive,
            commands.codePreview,
            commands.divider,
            commands.fullscreen, // دکمه تمام صفحه
            commands.divider,
            zoomInCmd, // دکمه بزرگ‌نمایی ما
            zoomOutCmd // دکمه کوچک‌نمایی ما
          ]}
        />
      </div>
    );
  }

  return (
    <div
      className="text-editor card"
      onDoubleClick={() => setEditing(true)}
      dir={direction}
      style={{ '--editor-font-size': `${fontSize}px` } as React.CSSProperties}
    >
      <div className="card-content p-4 leading-relaxed border border-l-4 border-primary rounded-lg">
        <MDEditor.Markdown
          source={box.content || 'دابل کلیک کنید تا ویرایش شروع شود'}
          style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
        />
      </div>
    </div>
  );
}
