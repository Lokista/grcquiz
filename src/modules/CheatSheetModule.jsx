import { useMemo, useState } from 'react';
import {
  ScrollText, ArrowLeft, Copy, Check, Printer,
} from 'lucide-react';
import { useNav } from '../state/NavContext.jsx';
import { Card, SectionHeader, Pill } from '../components/ui.jsx';
import { buildCheatSheetMarkdown, buildCheatSheetPlain } from '../data/cheatSheet.js';
import { sfx } from '../utils/juice.js';

export default function CheatSheetModule() {
  const { go } = useNav();
  const [format, setFormat] = useState('md');
  const [copied, setCopied] = useState(false);

  const text = useMemo(
    () => (format === 'md' ? buildCheatSheetMarkdown() : buildCheatSheetPlain()),
    [format],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      sfx.correct();
      setTimeout(() => setCopied(false), 2000);
    } catch {
      sfx.wrong();
    }
  };

  const printSheet = () => {
    const w = window.open('', '_blank');
    if (!w) return;
    const html = buildCheatSheetMarkdown()
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/^- (.*)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/\n/g, '<br/>');
    w.document.write(`<!DOCTYPE html><html><head><title>Ściąga GRC</title>
      <style>
        body{font-family:system-ui,sans-serif;max-width:800px;margin:24px auto;padding:0 16px;font-size:12px;line-height:1.45;color:#111}
        h1{font-size:18px;margin:0 0 12px} h2{font-size:14px;margin:16px 0 6px;border-bottom:1px solid #ddd;padding-bottom:2px}
        h3{font-size:12px;margin:10px 0 4px} ul{margin:4px 0 8px 18px} li{margin:2px 0}
        @media print{body{margin:0;max-width:none}}
      </style></head><body>${html}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 250);
  };

  return (
    <div className="space-y-5 animate-slidein">
      <button type="button" onClick={() => go('quest')} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200">
        <ArrowLeft className="h-4 w-4" /> Mapa
      </button>
      <SectionHeader
        icon={ScrollText}
        title="Cheat sheet (1-pager)"
        subtitle="Severity + frameworki + pro-słowa + skrót PBC — kopiuj lub drukuj przed rozmową."
      />

      <Card>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <button
            type="button"
            className={`chip border ${format === 'md' ? 'bg-accent/15 text-accent-soft border-accent/30' : 'border-ink-600/60'}`}
            onClick={() => setFormat('md')}
          >
            Markdown
          </button>
          <button
            type="button"
            className={`chip border ${format === 'plain' ? 'bg-accent/15 text-accent-soft border-accent/30' : 'border-ink-600/60'}`}
            onClick={() => setFormat('plain')}
          >
            Plain text
          </button>
          <Pill tone="neutral">1 strona A4 (przy druku zmniejsz marginesy)</Pill>
          <div className="ml-auto flex flex-wrap gap-2">
            <button type="button" className="btn-ghost" onClick={printSheet}>
              <Printer className="h-4 w-4" /> Drukuj / PDF
            </button>
            <button type="button" className="btn-primary" onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Skopiowano' : 'Kopiuj'}
            </button>
          </div>
        </div>
        <pre className="max-h-[28rem] overflow-auto rounded-lg border border-ink-600/60 bg-ink-950/60 p-3 text-[11px] text-slate-300 whitespace-pre-wrap font-mono">
          {text}
        </pre>
      </Card>
    </div>
  );
}
