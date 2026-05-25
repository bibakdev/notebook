// src/features/app-shell/components/containers/DatabaseSync.tsx
'use client';

import { useEffect, useRef } from 'react';
import { loadDataFromDB, subscribeStoresToDB } from '@/shared/db/sync';

export function DatabaseSync() {
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    const init = async () => {
      await loadDataFromDB();
      subscribeStoresToDB();
    };
    init();
  }, []);

  return null;
}
