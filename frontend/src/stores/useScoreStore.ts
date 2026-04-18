import { create } from "zustand";

type State = {
  scores: any;
  setScores: (data: any) => void;
};

export const useScoreStore = create<State>((set) => ({
  scores: null,
  setScores: (data) => set({ scores: data }),
}));