'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { cn } from '@/shared/lib/cn';
import { usePromptStore } from '../../store/prompt-store';
import MDEditor from '@uiw/react-md-editor';

interface PromptBoxProps {
  boxId: string;
  isStandalone?: boolean;
}

export function PromptBox({ boxId, isStandalone = true }: PromptBoxProps) {
  const box = usePromptStore((s) => s.boxes[boxId]);
  const selectedBoxIds = usePromptStore((s) => s.selectedBoxIds);
  const updateBoxTitle = usePromptStore((s) => s.updateBoxTitle);
  const updateBoxContent = usePromptStore((s) => s.updateBoxContent);
  const toggleBoxDirection = usePromptStore((s) => s.toggleBoxDirection);
  const deleteBox = usePromptStore((s) => s.deleteBox);
  const copyBox = usePromptStore((s) => s.copyBox);
  const moveBoxUp = usePromptStore((s) => s.moveBoxUp);
  const moveBoxDown = usePromptStore((s) => s.moveBoxDown);
  const toggleBoxSelection = usePromptStore((s) => s.toggleBoxSelection);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const isSelected = selectedBoxIds.includes(boxId);

  if (!box) return null;

  const isRTL = box.direction === 'rtl';
  const hasMode = box.mode === 'text' || box.mode === 'code';

  const handleDoubleClick = useCallback(() => {
    if (isEditing) return;
    setEditContent(box.content);
    setIsEditing(true);
  }, [box.content, isEditing]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    if (isEditing) {
      updateBoxContent(boxId, editContent);
      setIsEditing(false);
    }
  }, [isEditing, editContent, boxId, updateBoxContent]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSave();
      }
    },
    [handleSave]
  );

  useEffect(() => {
    if (!isEditing) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (bodyRef.current && !bodyRef.current.contains(e.target as Node)) {
        handleSave();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isEditing, handleSave]);

  const handleTitleEdit = () => {
    const newTitle = prompt('عنوان جدید:', box.title);
    if (newTitle?.trim()) updateBoxTitle(boxId, newTitle.trim());
  };

  const handleDelete = () => {
    if (isEditing) handleSave();
    if (confirm('این کارت حذف شود؟')) {
      deleteBox(boxId);
    }
  };

  return (
    <div
      className={cn(
        // ↓ border از accent به primary تغییر کرد
        'prompt-box bg-card rounded-xl border border-border border-r-4 border-r-primary/80 shadow-sm transition-all duration-200 relative',
        // ↓ hover:border-accent → hover:border-primary
        'hover:border-primary hover:shadow-md',
        // ↓ ring-accent/50 → ring-primary/50
        isSelected && 'ring-2 ring-primary/50 shadow-primary/10'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-border text-sm font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'select-toggle cursor-pointer transition-colors text-base',
              // ↓ text-accent → text-primary
              isSelected && 'text-primary'
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleBoxSelection(boxId);
            }}
          >
            {isSelected ? '☑' : '☐'}
          </span>
          <span className="header-title font-semibold text-foreground">
            {box.title}
          </span>
          <span
            className="header-edit cursor-pointer opacity-50 hover:opacity-100 hover:text-primary transition"
            title="ویرایش عنوان"
            onClick={handleTitleEdit}
          >
            ✏️
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="icon-btn bg-transparent border border-transparent cursor-pointer text-sm px-1.5 py-1 rounded-md text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition"
            title={`تغییر جهت متن (فعلی: ${isRTL ? 'راست به چپ' : 'چپ به راست'})`}
            onClick={() => toggleBoxDirection(boxId)}
          >
            {isRTL ? 'LTR' : 'RTL'}
          </button>
          <button
            className="icon-btn bg-transparent border border-transparent cursor-pointer text-sm px-1.5 py-1 rounded-md text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition"
            title="بالا"
            onClick={() => moveBoxUp(boxId)}
          >
            ⬆️
          </button>
          <button
            className="icon-btn bg-transparent border border-transparent cursor-pointer text-sm px-1.5 py-1 rounded-md text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition"
            title="پایین"
            onClick={() => moveBoxDown(boxId)}
          >
            ⬇️
          </button>
          <button
            className="icon-btn bg-transparent border border-transparent cursor-pointer text-sm px-1.5 py-1 rounded-md text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition"
            title="حذف"
            onClick={handleDelete}
          >
            🗑️
          </button>
          <button
            className="icon-btn bg-transparent border border-transparent cursor-pointer text-sm px-1.5 py-1 rounded-md text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition"
            title="کپی"
            onClick={() => copyBox(boxId)}
          >
            📋
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className={cn(
          'prompt-body px-5 py-4 text-foreground text-[15px] leading-relaxed min-h-[50px] cursor-text relative transition-colors duration-150',
          'hover:bg-primary/[0.02]',
          isRTL && 'rtl text-right',
          box.mode === 'text' && 'font-sans text-[15px] whitespace-pre-wrap',
          box.mode === 'code' && 'font-mono text-[14px] whitespace-pre',
          isEditing && 'bg-primary/[0.02]'
        )}
        onDoubleClick={handleDoubleClick}
      >
        {isEditing ? (
          <textarea
            ref={textareaRef}
            className={cn(
              'w-full min-h-[220px] p-4 bg-background text-foreground border-2 border-border rounded-lg font-mono text-sm leading-relaxed resize-y outline-none transition-all',
              'focus:border-primary focus:ring-2 focus:ring-primary/20',
              isRTL && 'text-right'
            )}
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => handleSave()}
            placeholder="Markdown را اینجا بنویسید..."
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        ) : hasMode ? (
          <pre
            className={cn(
              'font-sans text-[15px] whitespace-pre-wrap m-0',
              box.mode === 'code' && 'font-mono text-[14px] whitespace-pre'
            )}
          >
            {box.content}
          </pre>
        ) : (
          <div data-color-mode="dark" className="markdown-preview">
            <MDEditor.Markdown
              source={box.content || '*(محتوای خالی)*'}
              style={{
                backgroundColor: 'transparent',
                color: 'inherit'
              }}
            />
          </div>
        )}
        {/* {!isEditing && (
          <span className="absolute bottom-1.5 right-3 text-[10px] text-muted-foreground opacity-30 pointer-events-none font-mono transition-opacity group-hover:opacity-70">
            ⏎ دابل‌کلیک برای ویرایش
          </span>
        )} */}
      </div>
    </div>
  );
}
