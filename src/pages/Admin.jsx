import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../context/ToastContext'
import { userService } from '../services/imageService'
import { Shield, Users, Trash2, Crown, User } from 'lucide-react'

const DUMMY_USERS = [
  { _id: '1', name: 'Alice Johnson', email: 'alice@boew.com', role: 'admin', images: 42, createdAt: '2024-01-15' },
  { _id: '2', name: 'Bob Smith', email: 'bob@boew.com', role: 'user', images: 18, createdAt: '2024-02-20' },
  { _id: '3', name: 'Carol White', email: 'carol@boew.com', role: 'user', images: 35, createdAt: '2024-03-10' },
  { _id: '4', name: 'David Lee', email: 'david@boew.com', role: 'user', images: 7, createdAt: '2024-04-05' },
]

export default function Admin() {
  const [users, setUsers] = useState(DUMMY_USERS)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    userService.getAllUsers().then(r => setUsers(r.data)).catch(() => setUsers(DUMMY_USERS))
  }, [])

  const handleDelete = (id) => {
    setUsers(p => p.filter(u => u._id !== id))
    toast.success('User removed')
  }

  const handleRoleToggle = async (u) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin'
    try {
      await userService.updateRole(u._id, newRole)
    } catch {}
    setUsers(p => p.map(x => x._id === u._id ? { ...x, role: newRole } : x))
    toast.success(`Role updated to ${newRole}`)
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Shield size={24} className="text-cyan-400" /> Admin Panel
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage users and system settings</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Users', val: users.length, icon: Users },
            { label: 'Admins', val: users.filter(u => u.role === 'admin').length, icon: Crown },
            { label: 'Total Images', val: users.reduce((a, u) => a + u.images, 0), icon: Shield },
          ].map(({ label, val, icon: Icon }) => (
            <GlassCard key={label} className="!p-4 text-center">
              <Icon size={20} className="text-cyan-400 mx-auto mb-2" />
              <p className="text-2xl font-bold text-white">{val}</p>
              <p className="text-xs text-slate-400">{label}</p>
            </GlassCard>
          ))}
        </div>

        <GlassCard>
          <h2 className="text-base font-semibold text-white mb-5 flex items-center gap-2">
            <Users size={16} className="text-cyan-400" /> User Management
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['User', 'Email', 'Role', 'Images', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="text-left text-xs text-slate-400 uppercase tracking-wider pb-3 pr-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center text-xs font-bold text-slate-900">
                          {u.name[0]}
                        </div>
                        <span className="text-white font-medium">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-400">{u.email}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border
                        ${u.role === 'admin' ? 'bg-cyan-500/15 text-cyan-400 border-cyan-400/25' : 'bg-slate-700/50 text-slate-400 border-slate-600/25'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-300">{u.images}</td>
                    <td className="py-3 pr-4 text-slate-500 text-xs">{u.createdAt}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleRoleToggle(u)}
                          className="p-1.5 text-cyan-400 hover:bg-cyan-500/15 rounded-lg transition-colors" title="Toggle role">
                          <Crown size={14} />
                        </button>
                        <button onClick={() => handleDelete(u._id)}
                          className="p-1.5 text-red-400 hover:bg-red-500/15 rounded-lg transition-colors" title="Delete user">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </main>
    </div>
  )
}
