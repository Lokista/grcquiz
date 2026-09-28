import { createContext, useContext, useMemo, useState } from 'react';

// Ścieżki nauki. Każda ma własne menu, tryby i postęp.
export const TRACKS = {
  audit: {
    id: 'audit',
    label: 'IT Audyt i GRC',
    short: 'IT Audyt / GRC',
    desc: 'Junior IT Auditor / GRC Analyst: ITGC, kontrole, evidence, ryzyko, ISO 27001, rozmowa w stylu Big4.',
    home: 'quest',
  },
  secops: {
    id: 'secops',
    label: 'Bezpieczeństwo IT — sektor publiczny',
    short: 'Bezpieczeństwo IT',
    desc: 'Specjalista ds. bezpieczeństwa IT: incydenty, EDR, podatności, logi, KSC/NIS2 i CSIRT, SZBI, OWASP, polityki.',
    home: 'sec',
  },
};

const TRACK_KEY = 'grcquiz-track';
const TrackContext = createContext(null);

function readTrack() {
  try {
    const v = window.localStorage.getItem(TRACK_KEY);
    return TRACKS[v] ? v : null;
  } catch {
    return null;
  }
}

export function TrackProvider({ children }) {
  const [track, setTrackState] = useState(readTrack);

  const api = useMemo(() => ({
    track,
    info: track ? TRACKS[track] : null,
    setTrack: (id) => {
      setTrackState(id);
      try { window.localStorage.setItem(TRACK_KEY, id); } catch { /* ignore */ }
    },
  }), [track]);

  return <TrackContext.Provider value={api}>{children}</TrackContext.Provider>;
}

export function useTrack() {
  const ctx = useContext(TrackContext);
  if (!ctx) throw new Error('useTrack musi być wewnątrz TrackProvider');
  return ctx;
}
