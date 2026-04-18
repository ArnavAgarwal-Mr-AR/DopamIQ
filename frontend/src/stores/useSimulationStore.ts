import { create } from "zustand";

type State = {
  result: any;
  setResult: (data: any) => void;
};

export const useSimulationStore = create<State>((set) => ({
  result: null,
  setResult: (data) => set({ result: data }),
}));