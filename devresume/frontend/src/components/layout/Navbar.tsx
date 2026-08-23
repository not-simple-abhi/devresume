import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X, Sparkles, LayoutDashboard, Upload, Building2, GitCompare, LogOut, User } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { cn } from '@/lib/utils'

// Smooth-scroll helper for same-page anchors
function scrollTo(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const isLanding = location.pathname === '/'

  const [mobileOpen, setMobileOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setUserMenuOpen(false)
  }

  // Landing-page scroll links
  const landingLinks = [
    { label: 'Home',          action: () => scrollTo('hero') },
    { label: 'How it works',  action: () => scrollTo('pipeline') },
    { label: 'Capabilities',  action: () => scrollTo('capabilities') },
  ]

  const authLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/analyze',   label: 'New Analysis', icon: Upload },
    { to: '/company',   label: 'Company Fit',  icon: Building2 },
    { to: '/compare',   label: 'Compare',      icon: GitCompare },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-violet-100/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-gray-900">
          <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center">
            <Sparkles size={14} className="text-white" />
          </div>
          <span className="text-sm tracking-wide font-bold">DevResume</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {isLanding && !isAuthenticated ? (
            // Landing-page anchor links
            landingLinks.map((l) => (
              <button
                key={l.label}
                onClick={l.action}
                className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors"
              >
                {l.label}
              </button>
            ))
          ) : isAuthenticated ? (
            authLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'text-violet-600 bg-violet-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  )
                }
              >
                {l.label}
              </NavLink>
            ))
          ) : (
            // Guest on non-landing pages
            <>
              <Link to="/analyze" className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                Analyze Resume
              </Link>
              <Link to="/company" className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                Company Fit
              </Link>
            </>
          )}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((o) => !o)}
                className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold uppercase hover:bg-violet-700 transition-colors"
              >
                {user?.name?.[0] ?? 'U'}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-gray-50">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User size={14} /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 text-sm font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors shadow-sm shadow-violet-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 text-gray-600"
          onClick={() => setMobileOpen((o) => !o)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 animate-fade-in">
          {isLanding && !isAuthenticated
            ? landingLinks.map((l) => (
                <button
                  key={l.label}
                  onClick={() => { l.action(); setMobileOpen(false) }}
                  className="block w-full text-left px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  {l.label}
                </button>
              ))
            : isAuthenticated
            ? authLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn('block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive ? 'text-violet-600 bg-violet-50' : 'text-gray-700 hover:bg-gray-50')
                  }
                >
                  {l.label}
                </NavLink>
              ))
            : null}

          <div className="pt-2 border-t border-gray-100 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-sm text-white bg-violet-600 rounded-md text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
