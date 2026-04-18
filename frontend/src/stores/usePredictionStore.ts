import { create } from "zustand";

type State = {
  predictions: any;
  setPredictions: (data: any) => void;
};

export const usePredictionStore = create<State>((set) => ({
  predictions: null,
  setPredictions: (data) => set({ predictions: data }),
}));