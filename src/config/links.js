/** Public URLs — GitHub Pages + release download. */
export const APP_PAGES_URL = 'https://lokista.github.io/grcquiz/';
export const APP_DOWNLOAD_ZIP = 'https://github.com/Lokista/grcquiz/releases/latest/download/grcquiz-web.zip';
export const APP_REPO_URL = 'https://github.com/Lokista/grcquiz';

export function isStandaloneApp() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true;
}

export function isMobileBrowser() {
  if (typeof window === 'undefined') return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
