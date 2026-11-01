import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '@/store/admin/authStore';

export type LandingAudience = 'business' | 'personal';
const EVENT = 'btb:landing-audience-changed';
const keyFor = (userId?: string) => `btb.landing.audience.${userId ?? 'guest'}`;

function readAudience(userId?: string): LandingAudience {
  if (typeof window === 'undefined') return 'business';
  try {
    return window.sessionStorage.getItem(keyFor(userId)) === 'personal'
      ? 'personal' : 'business';
  } catch {
    return 'business';
  }
}

/** UI preference only. Not a verified customer type; never calls an API. */
export function useLandingAudience() {
  const userId = useAuthStore((state) => state.session?.user.id);
  const [audience, setAudienceState] = useState<LandingAudience>(() => readAudience(userId));

  useEffect(() => {
    const update = () => setAudienceState(readAudience(userId));
    update();
    window.addEventListener(EVENT, update);
    return () => window.removeEventListener(EVENT, update);
  }, [userId]);

  const setAudience = useCallback((next: LandingAudience) => {
    try { window.sessionStorage.setItem(keyFor(userId), next); } catch { /* disabled storage */ }
    setAudienceState(next);
    window.dispatchEvent(new Event(EVENT));
  }, [userId]);

  return { audience, setAudience };
}