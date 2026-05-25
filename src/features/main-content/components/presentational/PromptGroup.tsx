'use client';

import { cn } from '@/shared/lib/cn';
import { usePromptStore } from '../../store/prompt-store';
import { PromptBox } from './PromptBox';
import { Separator } from './Separator';
import { Fragment } from 'react';

interface PromptGroupProps {
  groupId: string;
}

export function PromptGroup({ groupId }: PromptGroupProps) {
  const group = usePromptStore((s) => s.groups[groupId]);
  const boxes = usePromptStore((s) => s.boxes);
  const updateGroupTitle = usePromptStore((s) => s.updateGroupTitle);
  const moveGroupUp = usePromptStore((s) => s.moveGroupUp);
  const moveGroupDown = usePromptStore((s) => s.moveGroupDown);
  const toggleGroupCollapse = usePromptStore((s) => s.toggleGroupCollapse);
  const addBoxToGroup = usePromptStore((s) => s.addBoxToGroup);
  const requestDeleteGroup = usePromptStore((s) => s.requestDeleteGroup);

  if (!group) return null;

  const handleTitleEdit = () => {
    const newTitle = prompt('نام زون:', group.title);
    if (newTitle?.trim()) updateGroupTitle(groupId, newTitle.trim());
  };

  const handleDelete = () => {
    requestDeleteGroup(groupId); // درخواست حذف (مودال را باز می‌کند)
  };

  return (
    <div
      className={cn(
        'prompt-group bg-primary/5 border-2 border-dashed border-border rounded-2xl my-5 overflow-hidden backdrop-blur-sm shadow-sm transition-all',
        'hover:border-primary hover:shadow-md',
        group.collapsed && 'collapsed'
      )}
    >
      {/* Group Header */}
      <div className="flex items-center justify-between px-5 py-3 bg-primary/5 border-b border-border text-sm font-mono text-muted-foreground">
        <div className="flex items-center gap-2">
          <span
            className="group-toggle cursor-pointer text-primary transition-transform hover:scale-125"
            onClick={() => toggleGroupCollapse(groupId)}
          >
            {group.collapsed ? '▶' : '▼'}
          </span>
          <span className="header-title font-semibold text-foreground">
            {group.title}
          </span>
          <span
            className="header-edit cursor-pointer opacity-50 hover:opacity-100 hover:text-primary transition"
            title="ویرایش نام"
            onClick={handleTitleEdit}
          >
            ✏️
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="icon-btn bg-transparent border border-transparent cursor-pointer text-sm px-1.5 py-1 rounded-md text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition"
            title="بالا"
            onClick={() => moveGroupUp(groupId)}
          >
            ⬆️
          </button>
          <button
            className="icon-btn bg-transparent border border-transparent cursor-pointer text-sm px-1.5 py-1 rounded-md text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition"
            title="پایین"
            onClick={() => moveGroupDown(groupId)}
          >
            ⬇️
          </button>
          <button
            className="icon-btn bg-transparent border border-transparent cursor-pointer text-sm px-1.5 py-1 rounded-md text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition"
            title="افزودن کارت"
            onClick={() => addBoxToGroup(groupId)}
          >
            ➕
          </button>
          <button
            className="icon-btn bg-transparent border border-transparent cursor-pointer text-sm px-1.5 py-1 rounded-md text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-primary transition"
            title="حذف زون"
            onClick={handleDelete}
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Group Body */}
      {!group.collapsed && (
        <div className="group-body px-5 py-4 flex flex-col gap-0">
          {group.boxIds.map((boxId, index) => (
            <Fragment key={boxId}>
              <PromptBox boxId={boxId} isStandalone={false} />
              {index < group.boxIds.length - 1 && (
                <Separator
                  prevBoxId={boxId}
                  nextBoxId={group.boxIds[index + 1]}
                />
              )}
            </Fragment>
          ))}
          {group.boxIds.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              بدون کارت — دکمه ➕ را بزنید
            </p>
          )}
        </div>
      )}
    </div>
  );
}
