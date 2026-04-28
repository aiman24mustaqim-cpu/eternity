import { create } from 'zustand'

export interface InvitationData {
  brideName: string
  groomName: string
  date: string
  time: string
  venueName: string
  venueAddress: string
  background: string
  accentColor: string
  fontStyle: string
  musicUrl?: string
  galleryImages: string[]
}

interface StudioState {
  data: InvitationData
  templateId: number
  isDirty: boolean
  isSaving: boolean
  update: (partial: Partial<InvitationData>) => void
  setTemplate: (id: number) => void
  reset: () => void
}

const defaultData: InvitationData = {
  brideName: 'Bride',
  groomName: 'Groom',
  date: '2025-09-20',
  time: '10:00',
  venueName: 'Grand Ballroom',
  venueAddress: 'Kuala Lumpur',
  background: 'warm',
  accentColor: '#C9A96E',
  fontStyle: "'Great Vibes', cursive",
  galleryImages: [],
}

export const useStudioStore = create<StudioState>((set) => ({
  data: defaultData,
  templateId: 1,
  isDirty: false,
  isSaving: false,

  update: (partial) =>
    set((s) => ({ data: { ...s.data, ...partial }, isDirty: true })),

  setTemplate: (id) => set({ templateId: id }),

  reset: () => set({ data: defaultData, isDirty: false }),
}))