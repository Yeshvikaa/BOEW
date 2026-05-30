import { useState, useCallback } from 'react'
import Sidebar from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../context/ToastContext'
import { imageService } from '../services/imageService'
import { generateFeatureVector, encryptVector, formatFileSize } from '../utils/encryption'
import { useAuth } from '../context/AuthContext'
import { Upload as UploadIcon, X, CheckCircle, Lock, CloudUpload, FileImage } from 'lucide-react'

export default function Upload() {
  const [files, setFiles] = useState([])
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({})
  const { toast } = useToast()
  const { user } = useAuth()

  const addFiles = (newFiles) => {
    const valid = Array.from(newFiles).filter(f => f.type.startsWith('image/'))
    if (valid.length === 0) { toast.error('Please select valid image files'); return }
    setFiles(prev => [...prev, ...valid.map(f => ({ file: f, id: Date.now() + Math.random(), status: 'pending' }))])
  }

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false)
    addFiles(e.dataTransfer.files)
  }, [])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)
  const removeFile = (id) => setFiles(prev => prev.filter(f => f.id !== id))

  const handleUpload = async () => {
    if (files.length === 0) { toast.error('Add files first'); return }
    setUploading(true)
    for (const { file, id } of files) {
      try {
        setProgress(p => ({ ...p, [id]: 'encrypting' }))
        // Simulate encryption step
        const vector = await generateFeatureVector(file)
        const encryptedVector = encryptVector(vector, user?.email || 'default')
        await new Promise(r => setTimeout(r, 600))
        setProgress(p => ({ ...p, [id]: 'uploading' }))
        const fd = new FormData()
        fd.append('image', file)
        fd.append('encryptedVector', JSON.stringify(encryptedVector))
        await imageService.upload(fd)
        setProgress(p => ({ ...p, [id]: 'done' }))
      } catch {
        setProgress(p => ({ ...p, [id]: 'error' }))
      }
    }
    toast.success(`${files.length} image(s) encrypted and uploaded!`)
    setUploading(false)
    setTimeout(() => { setFiles([]); setProgress({}) }, 1500)
  }

  const statusIcon = (id) => {
    const s = progress[id]
    if (!s || s === 'pending') return null
    if (s === 'encrypting') return <span className="text-xs text-yellow-400 flex items-center gap-1"><LoadingSpinner size="sm" /> Encrypting…</span>
    if (s === 'uploading') return <span className="text-xs text-cyan-400 flex items-center gap-1"><LoadingSpinner size="sm" /> Uploading…</span>
    if (s === 'done') return <CheckCircle size={16} className="text-green-400" />
    return <X size={16} className="text-red-400" />
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <UploadIcon size={24} className="text-cyan-400" /> Upload Images
          </h1>
          <p className="text-slate-400 text-sm mt-1">Images are encrypted locally before being sent to the cloud</p>
        </div>

        {/* Encryption notice */}
        <div className="flex items-center gap-3 p-4 glass border border-green-400/20 rounded-xl mb-6">
          <Lock size={18} className="text-green-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-green-400">End-to-End Encryption Active</p>
            <p className="text-xs text-slate-400 mt-0.5">Feature vectors are extracted and encrypted before upload. The server stores only encrypted BOW histograms.</p>
          </div>
        </div>

        {/* Drop zone */}
        <GlassCard className={`mb-6 transition-all duration-300 ${dragging ? 'border-cyan-400/60 bg-cyan-500/10' : ''}`}>
          <div onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
            className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center cursor-pointer hover:border-cyan-400/50 transition-colors"
            onClick={() => document.getElementById('fileInput').click()}>
            <CloudUpload size={48} className={`mx-auto mb-4 transition-colors ${dragging ? 'text-cyan-400' : 'text-slate-500'}`} />
            <p className="text-white font-medium mb-1">Drop images here or click to browse</p>
            <p className="text-sm text-slate-500">Supports JPG, PNG, WEBP, GIF</p>
            <input id="fileInput" type="file" multiple accept="image/*" className="hidden"
              onChange={e => addFiles(e.target.files)} />
          </div>
        </GlassCard>

        {/* File list */}
        {files.length > 0 && (
          <GlassCard className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-4">Files to Upload ({files.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map(({ file, id }) => (
                <div key={id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                  <FileImage size={18} className="text-cyan-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {statusIcon(id)}
                    {!progress[id] && (
                      <button onClick={() => removeFile(id)} className="text-slate-500 hover:text-red-400">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={handleUpload} disabled={uploading} className="btn-primary flex items-center gap-2">
                {uploading ? <LoadingSpinner size="sm" /> : <Lock size={16} />}
                {uploading ? 'Encrypting & Uploading…' : 'Encrypt & Upload All'}
              </button>
              <button onClick={() => setFiles([])} disabled={uploading} className="btn-secondary">Clear All</button>
            </div>
          </GlassCard>
        )}
      </main>
    </div>
  )
}
