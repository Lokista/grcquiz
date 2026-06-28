// Minimalny renderer Markdown -> HTML (treść autorska, nie input użytkownika).
// Obsługa: **bold**, *italic*, `code`, listy (- oraz 1.), akapity, <br>.

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inline(s) {
  let out = escapeHtml(s);
  // inline code first (żeby nie sformatować zawartości kodu)
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>');
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  out = out.replace(/(^|[^*])\*([^*]+)\*/g, '$1<em>$2</em>');
  out = out.replace(/_([^_]+)_/g, '<em>$1</em>');
  return out;
}

export function mdToHtml(text) {
  if (!text) return '';
  const src = String(text).replace(/\r\n/g, '\n').trim();
  const blocks = src.split(/\n{2,}/);
  const html = [];
  for (const block of blocks) {
    const lines = block.split('\n').map((l) => l.trim());
    const allBullet = lines.every((l) => l === '' || /^[-*]\s+/.test(l));
    const allNumbered = lines.every((l) => l === '' || /^\d+\.\s+/.test(l));
    if (allBullet && lines.some((l) => /^[-*]\s+/.test(l))) {
      const items = lines
        .filter((l) => /^[-*]\s+/.test(l))
        .map((l) => `<li>${inline(l.replace(/^[-*]\s+/, ''))}</li>`)
        .join('');
      html.push(`<ul>${items}</ul>`);
    } else if (allNumbered && lines.some((l) => /^\d+\.\s+/.test(l))) {
      const items = lines
        .filter((l) => /^\d+\.\s+/.test(l))
        .map((l) => `<li>${inline(l.replace(/^\d+\.\s+/, ''))}</li>`)
        .join('');
      html.push(`<ol>${items}</ol>`);
    } else {
      const para = lines.filter((l) => l !== '').map(inline).join('<br/>');
      if (para) html.push(`<p>${para}</p>`);
    }
  }
  return html.join('');
}
