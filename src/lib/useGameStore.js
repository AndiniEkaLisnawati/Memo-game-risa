
import {create} from "zustand";

export const useGameStore = create((set, get) => ({
  points: 0,
  moves: 0,
  time: 0,
  matchedCards: [],
  gameOver: false,
  results: null, // final results object

  // setters for live updates (optional usage)
  setPoints: (p) => set({ points: p }),
  setMoves: (m) => set({ moves: m }),
  setTime: (t) => set({ time: t }),
  addMatched: (id) => set((s) => ({ matchedCards: [...s.matchedCards, id] })),

  resetGame: () =>
    set({
      points: 0,
      moves: 0,
      time: 30,
      matchedCards: [],
      gameOver: false,
      results: null,
    }),

  // save final results into store + localStorage
  setResults: (payload = {}) => {
    const final = {
      points: payload.points ?? get().points,
      moves: payload.moves ?? get().moves,
      time: payload.time ?? get().time,
      matchedCount: payload.matchedCount ?? get().matchedCards.length,
      totalPairs: payload.totalPairs ?? 0,
      answers: payload.answers ?? [], // optional detailed answers
      timestamp: new Date().toISOString(),
    };
    set({ results: final, gameOver: true });
    try {
      localStorage.setItem("memoryResult", JSON.stringify(final));
    } catch (e) {
      console.warn("localStorage blocked:", e);
    }
    return final;
  },

  getResultsFromStorage: () => {
    try {
      const raw = localStorage.getItem("memoryResult");
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },
}));
