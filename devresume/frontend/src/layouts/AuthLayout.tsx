import { Outlet, Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function AuthLayout() {
  return (
    <div className="min-h-screen page-bg flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <Sparkles size={16} className="text-white" />
        </div>
        <span className="text-lg font-semibold text-gray-900 dark:text-white">DevResume</span>
      </Link>

      {/* Card */}
      <div className="w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg shadow-gray-200/50 dark:shadow-black/40 p-8">
        <Outlet />
      </div>

      <p className="mt-6 text-xs text-gray-400 dark:text-gray-600">
        © {new Date().getFullYear()} DevResume. Built for engineers.
      </p>
    </div>
  )
}
