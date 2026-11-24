'use client';

import { useEffect } from 'react';
import { applyTheme, getThemePreference } from '@/lib/theme';

export function ThemeInitializer() {
  useEffect(() => {
    applyTheme(getThemePreference());
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const refresh = () => {
      if (getThemePreference() === 'system') applyTheme('system');
    };
    media.addEventListener('change', refresh);
    return () => media.removeEventListener('change', refresh);
  }, []);

  return null;
}
