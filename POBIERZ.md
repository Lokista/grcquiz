# Pobieranie na telefon

## Najprościej (zalecane)

1. Otwórz w telefonie (Chrome / Safari):  
   **https://lokista.github.io/grcquiz/**
2. **Android:** menu ⋮ → **Zainstaluj aplikację** lub **Dodaj do ekranu głównego**
3. **iPhone:** **Udostępnij** → **Do ekranu początkowego**

Gra działa jak aplikacja (PWA), postęp zapisuje się lokalnie w telefonie.

## Plik ZIP (offline)

Pobierz najnowszą wersję:

**https://github.com/Lokista/grcquiz/releases/latest/download/grcquiz-web.zip**

W środku jest folder `grcquiz/` + plik `INSTRUKCJA-TELEFON.txt`.

- **Android:** rozpakuj ZIP, zainstaluj aplikację *Static Server* z Play Store, wskaż folder `grcquiz` i otwórz podany adres w przeglądarce.
- **iPhone:** ZIP offline jest niewygodny — lepiej użyj linku GitHub Pages i dodaj do ekranu głównego.

## Własny build ZIP

```bash
npm install
npm run package
```

Plik: `release/grcquiz-web.zip`
