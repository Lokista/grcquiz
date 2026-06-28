import { createWriteStream } from 'fs';
import { mkdir, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { ZipArchive } from 'archiver';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const distDir = path.join(root, 'dist');
const releaseDir = path.join(root, 'release');
const zipPath = path.join(releaseDir, 'grcquiz-web.zip');

const PHONE_INSTRUCTIONS = `GRC Quiz — instalacja na telefonie
================================

NAJŁATWIEJ (zalecane — bez tego ZIP-a):
1. Otwórz w Chrome (Android) lub Safari (iPhone):
   https://lokista.github.io/grcquiz/
2. Android: menu ⋮ → „Zainstaluj aplikację” lub „Dodaj do ekranu głównego”
3. iPhone: ikona Udostępnij → „Do ekranu początkowego”
4. Gra działa jak aplikacja, postęp zapisuje się w telefonie.

POBIERANIE AKTUALIZACJI:
https://github.com/Lokista/grcquiz/releases/latest

OFFLINE (ten plik ZIP):
1. Rozpakuj folder „grcquiz” na telefonie.
2. Android: zainstaluj „Static Server” (Play Store), wskaż folder grcquiz, otwórz podany adres.
3. iPhone: offline z ZIP jest trudniejsze — lepiej użyj linku powyżej i dodaj do ekranu głównego.

Wymaga nowoczesnej przeglądarki. Brak internetu po pierwszym załadowaniu (PWA cache).
`;

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

if (!(await exists(distDir))) {
  console.error('Brak folderu dist/ — najpierw uruchom: npm run build');
  process.exit(1);
}

await mkdir(releaseDir, { recursive: true });

await new Promise((resolve, reject) => {
  const output = createWriteStream(zipPath);
  const archive = new ZipArchive({ zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`Utworzono: ${zipPath} (${(archive.pointer() / 1024 / 1024).toFixed(2)} MB)`);
    resolve();
  });
  archive.on('error', reject);

  archive.pipe(output);
  archive.directory(distDir, 'grcquiz');
  archive.append(PHONE_INSTRUCTIONS, { name: 'INSTRUKCJA-TELEFON.txt' });
  archive.finalize();
});
