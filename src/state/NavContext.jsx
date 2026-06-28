import { createContext, useContext, useMemo, useState } from 'react';

const NavContext = createContext(null);

export function NavProvider({ children }) {
  // view: 'quest' | 'chapter' | 'daily' | 'achievements' | 'stats' | 'learn' | 'interview' | 'cases' | 'flashcards' | 'think'
  // params: opcjonalne, np. { topicKey, lessonId, caseId, questionId, scenarioId, mode, missionId, rerun, daily }
  const [view, setView] = useState('quest');
  const [params, setParams] = useState({});

  const nav = useMemo(() => ({
    view,
    params,
    go: (nextView, nextParams = {}) => {
      setView(nextView);
      setParams(nextParams);
      // scroll content to top on navigation
      if (typeof window !== 'undefined') {
        const el = document.getElementById('main-scroll');
        if (el) el.scrollTo({ top: 0 });
      }
    },
  }), [view, params]);

  return <NavContext.Provider value={nav}>{children}</NavContext.Provider>;
}

export function useNav() {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav musi być wewnątrz NavProvider');
  return ctx;
}
