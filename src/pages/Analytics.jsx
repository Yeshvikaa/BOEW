import Sidebar from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import { BarChart2, TrendingUp, Activity, PieChart } from 'lucide-react'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const uploads = [12, 19, 8, 25, 34, 28, 42, 38, 55, 47, 61, 72]
const searches = [5, 10, 6, 18, 22, 19, 30, 25, 38, 33, 45, 58]
const maxVal = Math.max(...uploads)

export default function Analytics() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <BarChart2 size={24} className="text-cyan-400" /> Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">Your BOEW usage insights and retrieval performance</p>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Avg Retrieval Accuracy', val: '94.7%', change: '+2.3%', color: 'green' },
            { label: 'Total Storage Used', val: '4.2 GB', change: '+340 MB', color: 'blue' },
            { label: 'Avg Search Time', val: '0.34s', change: '-12ms', color: 'cyan' },
            { label: 'Encryption Rate', val: '100%', change: 'All files', color: 'purple' },
          ].map(({ label, val, change, color }) => (
            <GlassCard key={label} className="!p-4">
              <p className="text-xs text-slate-400 mb-1">{label}</p>
              <p className="text-2xl font-bold text-white">{val}</p>
              <p className={`text-xs font-medium mt-1 text-${color}-400`}>{change}</p>
            </GlassCard>
          ))}
        </div>

        {/* Bar chart - uploads */}
        <GlassCard className="mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp size={16} className="text-cyan-400" /> Monthly Uploads & Searches
            </h2>
            <span className="text-xs text-slate-500">Last 12 months</span>
          </div>
          <div className="flex items-end gap-2 h-48">
            {months.map((m, i) => (
              <div key={m} className="flex-1 flex flex-col items-center gap-1">
                <div className="flex items-end gap-0.5 w-full" style={{ height: 160 }}>
                  <div className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-t-sm opacity-80 transition-all duration-500"
                    style={{ height: `${(uploads[i] / maxVal) * 100}%` }} />
                  <div className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t-sm opacity-60 transition-all duration-500"
                    style={{ height: `${(searches[i] / maxVal) * 100}%` }} />
                </div>
                <span className="text-xs text-slate-500">{m}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-3 h-3 bg-cyan-400 rounded-sm" /> Uploads
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-3 h-3 bg-blue-400 rounded-sm" /> Searches
            </div>
          </div>
        </GlassCard>

        {/* Retrieval accuracy */}
        <GlassCard>
          <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity size={16} className="text-cyan-400" /> Retrieval Accuracy by Category
          </h2>
          <div className="space-y-4">
            {[
              { cat: 'Nature & Landscapes', acc: 97, count: 312 },
              { cat: 'Architecture & Buildings', acc: 93, count: 187 },
              { cat: 'People & Portraits', acc: 91, count: 254 },
              { cat: 'Abstract & Art', acc: 88, count: 98 },
              { cat: 'Animals & Wildlife', acc: 95, count: 143 },
            ].map(({ cat, acc, count }) => (
              <div key={cat}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="text-slate-300">{cat}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-slate-500 text-xs">{count} imgs</span>
                    <span className="text-cyan-400 font-medium">{acc}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-700"
                    style={{ width: `${acc}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>
    </div>
  )
}
