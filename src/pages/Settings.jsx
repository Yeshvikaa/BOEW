import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import { useToast } from '../context/ToastContext'
import { Settings as SettingsIcon, Bell, Shield, Palette, Globe, Save } from 'lucide-react'

export default function Settings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    notifications: true, emailAlerts: false, twoFactor: false,
    theme: 'dark', language: 'en', encryptionStrength: 'high'
  })

  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }))

  const Toggle = ({ k }) => (
    <button onClick={() => toggle(k)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 ${settings[k] ? 'bg-cyan-500' : 'bg-slate-700'}`}>
      <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 ${settings[k] ? 'translate-x-5' : ''}`} />
    </button>
  )

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <SettingsIcon size={24} className="text-cyan-400" /> Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Customize your BOEW experience</p>
        </div>

        <div className="space-y-5">
          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Bell size={15} className="text-cyan-400" /> Notifications</h3>
            {[
              { k: 'notifications', label: 'In-app notifications', desc: 'Get alerts for uploads and searches' },
              { k: 'emailAlerts', label: 'Email alerts', desc: 'Receive email for important events' },
            ].map(({ k, label, desc }) => (
              <div key={k} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div><p className="text-sm text-white">{label}</p><p className="text-xs text-slate-500 mt-0.5">{desc}</p></div>
                <Toggle k={k} />
              </div>
            ))}
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Shield size={15} className="text-cyan-400" /> Security</h3>
            <div className="flex items-center justify-between py-3">
              <div><p className="text-sm text-white">Two-Factor Authentication</p><p className="text-xs text-slate-500 mt-0.5">Extra layer of account security</p></div>
              <Toggle k="twoFactor" />
            </div>
            <div className="mt-3">
              <label className="text-xs text-slate-400 block mb-1.5">Encryption Strength</label>
              <select value={settings.encryptionStrength} onChange={e => setSettings(p => ({ ...p, encryptionStrength: e.target.value }))}
                className="input-field">
                <option value="standard">Standard (AES-128)</option>
                <option value="high">High (AES-256) — Recommended</option>
              </select>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2"><Globe size={15} className="text-cyan-400" /> Language & Region</h3>
            <select value={settings.language} onChange={e => setSettings(p => ({ ...p, language: e.target.value }))} className="input-field">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </GlassCard>

          <button onClick={() => toast.success('Settings saved!')} className="btn-primary flex items-center gap-2">
            <Save size={16} /> Save All Settings
          </button>
        </div>
      </main>
    </div>
  )
}
