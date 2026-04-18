import { create } from "zustand";

type State = {
  insights: any;
  setInsights: (data: any) => void;
};

export const useInsightStore = create<State>((set) => ({
  insights: null,
  setInsights: (data) => set({ insights: data }),
}));