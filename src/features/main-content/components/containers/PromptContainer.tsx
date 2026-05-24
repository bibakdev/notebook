'use client';

import { Fragment } from 'react';
import { usePromptStore } from '../../store/prompt-store';
import { PromptBox } from '../presentational/PromptBox';
import { PromptGroup } from '../presentational/PromptGroup';
import { Separator } from '../presentational/Separator';

export function PromptContainer() {
  const rootOrder = usePromptStore((s) => s.rootOrder);

  return (
    <div className="prompt-container flex flex-col gap-0 pb-10">
      {rootOrder.map((item, index) => {
        if (item.type === 'box') {
          // Check if next item is also a box → add separator
          const nextItem = rootOrder[index + 1];
          const showSeparator = nextItem?.type === 'box';

          return (
            <Fragment key={item.id}>
              <PromptBox boxId={item.id} isStandalone />
              {showSeparator && (
                <Separator prevBoxId={item.id} nextBoxId={nextItem!.id} />
              )}
            </Fragment>
          );
        }

        if (item.type === 'group') {
          return <PromptGroup key={item.id} groupId={item.id} />;
        }

        return null;
      })}
    </div>
  );
}
