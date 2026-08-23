import { create } from 'zustand'
import type { ReviewReport } from '@/types/review.types'

interface ReviewState {
  // Current active report (from upload or loaded from history)
  activeReport: ReviewReport | null
  activeFileName: string | null
  activeTab: 'overview' | 'ats' | 'skills' | 'projects' | 'insights'
  setActiveReport: (report: ReviewReport, fileName: string) => void
  setActiveTab: (tab: ReviewState['activeTab']) => void
  clearReport: () => void
}

export const useReviewStore = create<ReviewState>()((set) => ({
  activeReport: null,
  activeFileName: null,
  activeTab: 'overview',

  setActiveReport: (report, fileName) =>
    set({ activeReport: report, activeFileName: fileName, activeTab: 'overview' }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  clearReport: () =>
    set({ activeReport: null, activeFileName: null, activeTab: 'overview' }),
}))
