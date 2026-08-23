import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Layouts
import RootLayout    from '@/layouts/RootLayout'
import AuthLayout    from '@/layouts/AuthLayout'

// Guards
import ProtectedRoute  from '@/components/layout/ProtectedRoute'
import PublicOnlyRoute from '@/components/layout/PublicOnlyRoute'

// Pages
import LandingPage    from '@/pages/LandingPage'
import LoginPage      from '@/pages/auth/LoginPage'
import SignupPage     from '@/pages/auth/SignupPage'
import UploadPage     from '@/pages/UploadPage'
import AnalysisShell  from '@/pages/analysis/AnalysisShell'
import DashboardPage  from '@/pages/DashboardPage'
import ComparePage    from '@/pages/ComparePage'
import CompanyPage    from '@/pages/CompanyPage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Public routes with Navbar */}
          <Route element={<RootLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="analyze" element={<UploadPage />} />
            <Route path="company" element={<CompanyPage />} />

            {/* Auth pages — redirect to /dashboard if already logged in */}
            <Route element={<PublicOnlyRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="login"  element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
              </Route>
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="compare"   element={<ComparePage />} />
            </Route>
          </Route>

          {/* Analysis shell — full-height, no outer navbar (AnalysisLayout has its own sidebar/topbar) */}
          <Route path="analysis" element={<AnalysisShell />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
