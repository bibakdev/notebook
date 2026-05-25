// src/features/main-content/components/presentational/PromptBox.tsx
'use client';

import { cn } from '@/shared/lib/cn';
import { usePromptStore } from '../../store/prompt-store';
import { TextEditor } from './TextEditor';

interface PromptBoxProps {
  boxId: string;
  isStandalone?: boolean;
}

export function PromptBox({ boxId, isStandalone = true }: PromptBoxProps) {
  const box = usePromptStore((s) => s.boxes[boxId]);
  const selectedBoxIds = usePromptStore((s) => s.selectedBoxIds);
  const updateBoxTitle = usePromptStore((s) => s.updateBoxTitle);
  const toggleBoxDirection = usePromptStore((s) => s.toggleBoxDirection);
  const deleteBox = usePromptStore((s) => s.deleteBox);
  const moveBoxUp = usePromptStore((s) => s.moveBoxUp);
  const moveBoxDown = usePromptStore((s) => s.moveBoxDown);
  const toggleBoxSelection = usePromptStore((s) => s.toggleBoxSelection);

  const isSelected = selectedBoxIds.includes(boxId);

  if (!box) return null;

  const isRTL = box.direction === 'rtl';

  const handleTitleEdit = () => {
    const newTitle = prompt('عنوان جدید:', box.title);
    if (newTitle?.trim()) updateBoxTitle(boxId, newTitle.trim());
  };

  const handleDelete = () => {
    if (confirm('این کارت حذف شود؟')) {
      deleteBox(boxId);
    }
  };

  // کپی محتوای باکس در کلیپ‌بورد
  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(box.content);
      // می‌توانید یک نوتیفیکیشن کوچک موفقیت نشان دهید (اختیاری)
    } catch (error) {
      console.error('کپی محتوا ناموفق بود:', error);
    }
  };

  return (
    <div
      className={cn(
        'prompt-box bg-card rounded-xl border border-border border-r-4 border-r-primary/80 shadow-sm transition-all duration-200 relative',
        'hover:border-primary hover:shadow-md',
        isSelected && 'ring-2 ring-primary/50 shadow-primary/10'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-primary/5 border-b border-border text-sm font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'select-toggle cursor-pointer transition-colors text-base',
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
            title="کپی محتوا"
            onClick={handleCopyContent}
          >
            📋
          </button>
        </div>
      </div>

      {/* Body */}
      <div
        className={cn(
          'prompt-body px-5 py-4 text-foreground text-[15px] leading-relaxed min-h-[50px] relative'
        )}
      >
        <TextEditor boxId={boxId} />
      </div>
    </div>
  );
}
