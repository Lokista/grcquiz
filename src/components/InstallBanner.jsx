import { useState } from 'react';
import { Smartphone, Download, X, ExternalLink } from 'lucide-react';
import { APP_DOWNLOAD_ZIP, APP_PAGES_URL, isMobileBrowser, isStandaloneApp } from '../config/links.js';

export default function InstallBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem('grcquiz_install_dismiss') === '1';
    } catch {
      return false;
    }
  });

  if (dismissed || isStandaloneApp()) return null;
  if (!isMobileBrowser()) return null;

  const dismiss = () => {
    try {
      localStorage.setItem('grcquiz_install_dismiss', '1');
    } catch { /* ignore */ }
    setDismissed(true);
  };

  return (
    <div className="card card-pad border-accent/25 bg-accent/5 relative">
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-2 right-2 p-1 text-slate-500 hover:text-slate-300"
        aria-label="Zamknij"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pr-6">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-accent/15 text-accent-soft shrink-0">
          <Smartphone className="h-5 w-5" />
        </div>
        <div className="min-w-0 space-y-2">
          <div className="font-semibold text-slate-100">Graj na telefonie</div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Otwórz link poniżej w Chrome/Safari, potem <strong className="text-slate-300">Dodaj do ekranu głównego</strong>
            {' '}(Android: Zainstaluj aplikację). Albo pobierz ZIP offline.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={APP_PAGES_URL}
              className="btn-primary text-xs py-2 px-3 inline-flex items-center gap-1.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              Otwórz grę <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <a
              href={APP_DOWNLOAD_ZIP}
              className="btn-ghost text-xs py-2 px-3 inline-flex items-center gap-1.5 border border-ink-700/60"
              download="grcquiz-web.zip"
            >
              <Download className="h-3.5 w-3.5" /> Pobierz ZIP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
