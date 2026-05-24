'use client';

import { Fragment } from 'react';
import { usePromptStore } from '../../store/prompt-store';
import { PromptBox } from '../presentational/PromptBox';
import { PromptGroup } from '../presentational/PromptGroup';
import { Separator } from '../presentational/Separator';

export function PromptContainer() {
  const rootOrder = usePromptStore((s) => s.rootOrder);
  const addBoxAfter = usePromptStore((s) => s.addBoxAfter);

  return (
    <div className="prompt-container flex flex-col gap-0 pb-10">
      {/* اگر هیچ آیتمی وجود نداشته باشد، یک جداکننده برای افزودن اولین باکس نمایش بده */}
      {rootOrder.length === 0 && (
        <Separator
          prevBoxId=""
          nextBoxId=""
          onAddClick={() => addBoxAfter(null)}
        />
      )}

      {rootOrder.length > 0 && (
        <>
          {/* جداکننده قبل از اولین آیتم (در صورت وجود) */}
          <Separator
            prevBoxId=""
            nextBoxId={rootOrder[0].id}
            onAddClick={() => addBoxAfter(null)} // درج در ابتدای rootOrder
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
                      onAddClick={() => addBoxAfter(item.id)} // بعد از این باکس
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
                      onAddClick={() => addBoxAfter(item.id)} // بعد از این گروه
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
