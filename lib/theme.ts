export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_KEY = 'nexora:theme';

export function getThemePreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function applyTheme(preference: ThemePreference): void {
  const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  document.documentElement.dataset.theme =
    preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;
}

export function saveThemePreference(preference: ThemePreference): void {
  try { localStorage.setItem(THEME_KEY, preference); } catch { /* local storage may be disabled */ }
  applyTheme(preference);
}
