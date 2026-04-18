import { create } from "zustand";

type State = {
  meta: any;
  setMeta: (data: any) => void;
};

export const useMetaStore = create<State>((set) => ({
  meta: null,
  setMeta: (data) => set({ meta: data }),
}));