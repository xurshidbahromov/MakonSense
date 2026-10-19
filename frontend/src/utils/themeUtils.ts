const THEME_STORAGE_KEY = 'makonsense_theme';

/**
 * Initializes the document theme from localStorage before or on mount.
 */
export function initThemeFromStorage(): boolean {
  if (typeof document === 'undefined') return false;
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === 'dark') {
      document.documentElement.classList.add('dark');
      return true;
    }
    if (saved === 'light') {
      document.documentElement.classList.remove('dark');
      return false;
    }
  } catch {
    // ignore storage errors
  }
  return document.documentElement.classList.contains('dark');
}

/**
 * Toggles dark/light mode while suppressing CSS transitions for 1 frame
 * so colors, borders, and backgrounds snap cleanly instead of smearing.
 */
export function toggleThemeWithoutSmear(nextDark?: boolean): boolean {
  if (typeof document === 'undefined') return false;

  const currentDark = document.documentElement.classList.contains('dark');
  const targetDark = typeof nextDark === 'boolean' ? nextDark : !currentDark;

  const styleEl = document.createElement('style');
  styleEl.setAttribute('data-theme-switch', 'true');
  styleEl.textContent = '*, *::before, *::after { transition: none !important; }';
  document.head.appendChild(styleEl);

  document.documentElement.classList.toggle('dark', targetDark);

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, targetDark ? 'dark' : 'light');
  } catch {
    // ignore storage errors
  }

  // Force synchronous reflow before re-enabling transitions
  void window.getComputedStyle(document.body).opacity;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      styleEl.remove();
    });
  });

  return targetDark;
}
