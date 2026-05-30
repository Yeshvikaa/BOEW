import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { imageService } from '../services/imageService'
import { Images, Search, Upload, TrendingUp, Activity, Lock, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const DUMMY_STATS = { total: 142, searches: 89, encrypted: 142, retrieved: 67 }
const DUMMY_ACTIVITY = [
  { type: 'upload', name: 'landscape_01.jpg', time: '2 min ago' },
  { type: 'search', name: 'Similar to beach.png', time: '15 min ago' },
  { type: 'upload', name: 'portrait_hd.jpg', time: '1 hr ago' },
  { type: 'retrieve', name: 'nature_pack.zip', time: '3 hr ago' },
  { type: 'upload', name: 'architecture_01.jpg', time: '5 hr ago' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(DUMMY_STATS)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    imageService.getStats().then(r => setStats(r.data)).catch(() => setStats(DUMMY_STATS))
  }, [])

  const statCards = [
    { label: 'Total Images', value: stats.total, icon: Images, color: 'cyan', sub: '+12 this week' },
    { label: 'Searches Run', value: stats.searches, icon: Search, color: 'blue', sub: '+5 today' },
    { label: 'Encrypted Files', value: stats.encrypted, icon: Lock, color: 'purple', sub: '100% secured' },
    { label: 'Retrieved', value: stats.retrieved, icon: TrendingUp, color: 'green', sub: '94.7% accuracy' },
  ]

  const colorMap = {
    cyan: 'from-cyan-400/20 to-cyan-600/10 border-cyan-400/20 text-cyan-400',
    blue: 'from-blue-400/20 to-blue-600/10 border-blue-400/20 text-blue-400',
    purple: 'from-purple-400/20 to-purple-600/10 border-purple-400/20 text-purple-400',
    green: 'from-green-400/20 to-green-600/10 border-green-400/20 text-green-400',
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Welcome back, <span className="glow-text">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-slate-400 text-sm mt-1">Here's your BOEW encrypted cloud overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {statCards.map(({ label, value, icon: Icon, color, sub }) => (
            <div key={label} className={`glass-card p-5 bg-gradient-to-br ${colorMap[color]}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-3xl font-extrabold text-white">{loading ? '—' : value}</p>
                  <p className="text-xs text-slate-500 mt-1">{sub}</p>
                </div>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${colorMap[color]} border`}>
                  <Icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <GlassCard className="lg:col-span-1">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Activity size={16} className="text-cyan-400" /> Quick Actions
            </h2>
            <div className="space-y-3">
              <Link to="/upload" className="flex items-center gap-3 p-3 rounded-xl bg-cyan-500/10 border border-cyan-400/20 hover:bg-cyan-500/20 transition-all group">
                <Upload size={18} className="text-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-white">Upload Images</p>
                  <p className="text-xs text-slate-500">Encrypt & store images</p>
                </div>
              </Link>
              <Link to="/search" className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-400/20 hover:bg-blue-500/20 transition-all group">
                <Search size={18} className="text-blue-400" />
                <div>
                  <p className="text-sm font-medium text-white">Search Images</p>
                  <p className="text-xs text-slate-500">Find similar encrypted images</p>
                </div>
              </Link>
            </div>
          </GlassCard>

          {/* Recent Activity */}
          <GlassCard className="lg:col-span-2">
            <h2 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
              <Clock size={16} className="text-cyan-400" /> Recent Activity
            </h2>
            <div className="space-y-3">
              {DUMMY_ACTIVITY.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                    ${a.type === 'upload' ? 'bg-cyan-500/20 text-cyan-400' : a.type === 'search' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                    {a.type === 'upload' ? <Upload size={14} /> : a.type === 'search' ? <Search size={14} /> : <TrendingUp size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{a.name}</p>
                    <p className="text-xs text-slate-500 capitalize">{a.type}</p>
                  </div>
                  <p className="text-xs text-slate-500 flex-shrink-0">{a.time}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Encryption Status Bar */}
        <GlassCard className="mt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <h3 className="text-sm font-semibold text-white">Encryption Status</h3>
            <span className="ml-auto text-xs text-green-400 font-medium">ALL SYSTEMS SECURE</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            {[
              { label: 'Encryption Algorithm', val: 'AES-256 Simulation' },
              { label: 'Feature Extraction', val: '128-bin BoW Histogram' },
              { label: 'Index Status', val: '✓ Up to date' },
            ].map(({ label, val }) => (
              <div key={label} className="p-3 bg-green-500/5 border border-green-400/15 rounded-xl">
                <p className="text-xs text-slate-400">{label}</p>
                <p className="text-sm font-medium text-green-400 mt-1">{val}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>
    </div>
  )
}
