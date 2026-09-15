import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/layout/Navbar'
import { cn } from '@/lib/utils'

export default function RootLayout() {
  const { pathname } = useLocation()
  const isLanding = pathname === '/'

  return (
    <div className={cn('min-h-screen flex flex-col', isLanding ? '' : 'page-bg')}>
      <Navbar />
      <main key={pathname} className="flex-1 animate-page-in">
        <Outlet />
      </main>
    </div>
  )
}
