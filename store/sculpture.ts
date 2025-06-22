import { Sculpture } from "@/types";
import { create } from "zustand";

interface SculptureStore {
  sculpture: Sculpture[];
  addSculpture: (user: Sculpture) => void;
  addAllSculptures: (sculpture: Sculpture[]) => void;
  removeSculpture: (userId: number) => void;
  updateSculpture: (updatedSculpture: Sculpture) => void;
  clearSculptures: () => void;
  getSculptureById: (userId: number) => Sculpture | undefined;
  getAllSculptures: () => Sculpture[];
}

const useSculptureStore = create<SculptureStore>((set) => ({
  sculpture: [],
  addSculpture: (user: Sculpture) =>
    set((state: any) => ({
      sculpture: [...state.sculpture, user],
    })),
  addAllSculptures: (sculpture: Sculpture[]) =>
    set(() => ({
      sculpture: sculpture,
    })),
  removeSculpture: (userId: number) =>
    set((state: any) => ({
      sculpture: state.sculpture.filter(
        (user: Sculpture) => user.id !== userId
      ),
    })),
  updateSculpture: (updatedSculpture: Sculpture) =>
    set((state: any) => ({
      sculpture: state.sculpture.map((user: Sculpture) =>
        user.id === updatedSculpture.id ? updatedSculpture : user
      ),
    })),
  clearSculptures: () =>
    set(() => ({
      sculpture: [],
    })),
  getSculptureById: (userId: number): Sculpture | undefined =>
    useSculptureStore
      .getState()
      .sculpture.find((user: Sculpture) => user.id === userId),
      
  getAllSculptures: (): Sculpture[] => useSculptureStore.getState().sculpture,
}));
export { useSculptureStore };
export type { SculptureStore };

