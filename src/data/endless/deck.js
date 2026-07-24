/** Talia pytań — pełna pula bez powtórki aż do wyczerpania decku. */
export function shuffleIds(ids) {
  const a = [...ids];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function createEndlessSession() {
  return { deck: [], deckIndex: 0, lastId: null, round: 1 };
}

export function refillDeck(session, poolIds) {
  session.deck = shuffleIds(poolIds);
  session.deckIndex = 0;
  session.round += 1;
  if (session.lastId && session.deck.length > 1 && session.deck[0] === session.lastId) {
    [session.deck[0], session.deck[1]] = [session.deck[1], session.deck[0]];
  }
}

export function pickFromDeck(session, poolById) {
  const poolIds = Object.keys(poolById);
  if (session.deckIndex >= session.deck.length) {
    refillDeck(session, poolIds);
  }
  const id = session.deck[session.deckIndex];
  session.deckIndex += 1;
  session.lastId = id;
  return poolById[id] || poolById[poolIds[0]];
}

export function deckProgress(session) {
  const left = Math.max(0, session.deck.length - session.deckIndex);
  return { left, total: session.deck.length, round: session.round };
}
