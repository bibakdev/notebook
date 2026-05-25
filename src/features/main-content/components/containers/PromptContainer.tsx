// src/features/main-content/components/containers/PromptContainer.tsx
'use client';

import { Fragment } from 'react';
import { usePromptStore } from '../../store/prompt-store';
import { PromptBox } from '../presentational/PromptBox';
import { PromptGroup } from '../presentational/PromptGroup';
import { Separator } from '../presentational/Separator';

export function PromptContainer() {
  const currentFileId = usePromptStore((s) => s.currentFileId);
  const file = usePromptStore((s) =>
    currentFileId ? s.filesData[currentFileId] : undefined
  );
  const addBoxAfter = usePromptStore((s) => s.addBoxAfter);

  if (!file) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <p className="text-lg">یک فایل از سایدبار انتخاب کنید</p>
      </div>
    );
  }

  const rootOrder = file.rootOrder;

  return (
    <div className="prompt-container flex flex-col gap-0 pb-10">
      {rootOrder.length === 0 && (
        <Separator
          prevBoxId=""
          nextBoxId=""
          onAddClick={() => addBoxAfter(null)}
        />
      )}
      {rootOrder.length > 0 && (
        <>
          <Separator
            prevBoxId=""
            nextBoxId={rootOrder[0].id}
            onAddClick={() => addBoxAfter(null)}
          />
          {rootOrder.map((item, index) => {
            const isLast = index === rootOrder.length - 1;

            if (item.type === 'box') {
              return (
                <Fragment key={item.id}>
                  <PromptBox boxId={item.id} isStandalone />
                  {!isLast && (
                    <Separator
                      prevBoxId={item.id}
                      nextBoxId={rootOrder[index + 1].id}
                      onAddClick={() => addBoxAfter(item.id)}
                    />
                  )}
                </Fragment>
              );
            }

            if (item.type === 'group') {
              return (
                <Fragment key={item.id}>
                  <PromptGroup groupId={item.id} />
                  {!isLast && (
                    <Separator
                      prevBoxId={item.id}
                      nextBoxId={rootOrder[index + 1].id}
                      onAddClick={() => addBoxAfter(item.id)}
                    />
                  )}
                </Fragment>
              );
            }

            return null;
          })}
        </>
      )}
    </div>
  );
}
