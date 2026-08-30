import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  isDark: boolean
  toggle: () => void
  setDark: (dark: boolean) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () =>
        set((s) => {
          const next = !s.isDark
          applyTheme(next)
          return { isDark: next }
        }),
      setDark: (dark: boolean) => {
        applyTheme(dark)
        set({ isDark: dark })
      },
    }),
    {
      name: 'devresume-theme',
      onRehydrateStorage: () => (state) => {
        // Apply persisted theme immediately on hydration
        if (state) applyTheme(state.isDark)
      },
    }
  )
)

function applyTheme(dark: boolean) {
  const root = document.documentElement
  if (dark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
