import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { userService } from '../services/imageService'
import { User, Mail, Shield, Save, Camera } from 'lucide-react'

export default function Profile() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '' })
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await userService.updateProfile(form)
      toast.success('Profile updated!')
    } catch { toast.error('Failed to update profile') }
    finally { setSaving(false) }
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <User size={24} className="text-cyan-400" /> Profile
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your BOEW account details</p>
        </div>

        {/* Avatar */}
        <GlassCard className="mb-6 flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-3xl font-bold text-slate-900">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-cyan-500 rounded-lg flex items-center justify-center hover:bg-cyan-400 transition-colors">
              <Camera size={13} className="text-slate-900" />
            </button>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <p className="text-sm text-slate-400">{user?.email}</p>
            <span className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
              bg-cyan-500/15 text-cyan-400 border border-cyan-400/25">
              <Shield size={11} /> {user?.role || 'user'}
            </span>
          </div>
        </GlassCard>

        {/* Edit form */}
        <GlassCard>
          <h3 className="text-base font-semibold text-white mb-5">Edit Information</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="input-field pl-10" placeholder="Your name" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input-field pl-10" placeholder="your@email.com" />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <LoadingSpinner size="sm" /> : <Save size={16} />}
              Save Changes
            </button>
          </form>
        </GlassCard>

        {/* Security info */}
        <GlassCard className="mt-6">
          <h3 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
            <Shield size={16} className="text-green-400" /> Security Info
          </h3>
          <div className="space-y-3 text-sm">
            {[
              { label: 'Encryption Key Bound To', val: user?.email },
              { label: 'Account Role', val: user?.role || 'User' },
              { label: 'Data Encrypted', val: '100% — AES-256 simulation' },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                <span className="text-slate-400">{label}</span>
                <span className="text-slate-200 font-medium">{val}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>
    </div>
  )
}
