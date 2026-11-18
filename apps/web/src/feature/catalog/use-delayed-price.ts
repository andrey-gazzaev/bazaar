'use client';

import { useEffect, useEffectEvent, useState } from 'react';

const pauseMs = 300;

/** Price the slider shows now. The address receives it after the user pauses. */
export function useDelayedPrice(committed: number, commit: (value: number) => void) {
  const [draft, setDraft] = useState<number | null>(null);
  const commitPrice = useEffectEvent(commit);

  useEffect(() => {
    if (draft === null) return;

    if (draft === committed) {
      setDraft(null);

      return;
    }

    const timer = window.setTimeout(() => commitPrice(draft), pauseMs);

    return () => window.clearTimeout(timer);
  }, [draft, committed]);

  const price = draft ?? committed;

  function change(next: number) {
    setDraft(next);
  }

  return { price, change };
}
