import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  LayoutDashboard, Upload, Search, BarChart2, User,
  Shield, Settings, Info, LogOut, Menu, X, Cloud
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload', path: '/upload', icon: Upload },
  { label: 'Search', path: '/search', icon: Search },
  { label: 'Analytics', path: '/analytics', icon: BarChart2 },
  { label: 'Profile', path: '/profile', icon: User },
  { label: 'Settings', path: '/settings', icon: Settings },
  { label: 'About', path: '/about', icon: Info },
]

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.info('Logged out successfully')
    navigate('/')
  }

  const items = user?.role === 'admin'
    ? [...navItems, { label: 'Admin Panel', path: '/admin', icon: Shield }]
    : navItems

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
          <Cloud size={18} className="text-slate-900" />
        </div>
        {!collapsed && (
          <div>
            <h1 className="text-base font-bold glow-text">BOEW</h1>
            <p className="text-xs text-slate-500">Cloud Retrieval</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-500 hover:text-cyan-400 transition-colors hidden lg:block">
          {collapsed ? <Menu size={18} /> : <X size={18} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {items.map(({ label, path, icon: Icon }) => {
          const active = location.pathname === path
          return (
            <Link key={path} to={path} onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${active
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-400/30 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
              <Icon size={18} className={`flex-shrink-0 ${active ? 'text-cyan-400' : 'text-slate-500 group-hover:text-white'}`} />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* User */}
      <div className="p-3 border-t border-white/10">
        {user && (
          <div className={`flex items-center gap-3 px-2 py-2 rounded-xl ${!collapsed ? 'mb-2' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-slate-900 flex-shrink-0">
              {user.name?.[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.role}</p>
              </div>
            )}
          </div>
        )}
        <button onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200`}>
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile toggle */}
      <button onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 glass p-2 rounded-xl">
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60" onClick={() => setMobileOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`lg:hidden fixed left-0 top-0 h-full z-40 glass border-r border-white/10 transition-transform duration-300 w-64
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:flex flex-col glass border-r border-white/10 h-screen sticky top-0 transition-all duration-300
        ${collapsed ? 'w-16' : 'w-60'}`}>
        <SidebarContent />
      </aside>
    </>
  )
}
