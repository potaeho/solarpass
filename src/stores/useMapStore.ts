import { create } from 'zustand';
import type { Region } from '../types/region';

type MapStore = {
  selectedRegion: Region | null;
  isBottomSheetOpen: boolean;
  mapLayer: 'standard' | 'satellite';
  setSelectedRegion: (region: Region | null) => void;
  setBottomSheetOpen: (open: boolean) => void;
  setMapLayer: (layer: 'standard' | 'satellite') => void;
};

export const useMapStore = create<MapStore>(set => ({
  selectedRegion: null,
  isBottomSheetOpen: false,
  mapLayer: 'standard',
  setSelectedRegion: region =>
    set({ selectedRegion: region, isBottomSheetOpen: region !== null }),
  setBottomSheetOpen: open => set({ isBottomSheetOpen: open }),
  setMapLayer: layer => set({ mapLayer: layer }),
}));
