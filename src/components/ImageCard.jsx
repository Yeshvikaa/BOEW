import { useState } from 'react'
import { Eye, Trash2, Search, Download } from 'lucide-react'

export default function ImageCard({ image, onDelete, onSearch }) {
  const [preview, setPreview] = useState(false)

  return (
    <>
      <div className="glass-card overflow-hidden group">
        <div className="relative h-44 bg-slate-800/50 overflow-hidden">
          {image.url ? (
            <img src={image.url} alt={image.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-5xl opacity-20">🖼️</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3 gap-2">
            <button onClick={() => setPreview(true)}
              className="p-2 bg-cyan-500/80 rounded-lg hover:bg-cyan-400 transition-colors">
              <Eye size={14} className="text-slate-900" />
            </button>
            <button onClick={() => onSearch?.(image._id)}
              className="p-2 bg-blue-500/80 rounded-lg hover:bg-blue-400 transition-colors">
              <Search size={14} className="text-white" />
            </button>
            <button onClick={() => onDelete?.(image._id)}
              className="p-2 bg-red-500/80 rounded-lg hover:bg-red-400 transition-colors ml-auto">
              <Trash2 size={14} className="text-white" />
            </button>
          </div>
          {/* Encrypted badge */}
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-green-500/20 border border-green-400/40 rounded-full text-xs text-green-400 font-medium">
            🔒 Encrypted
          </div>
        </div>
        <div className="p-3">
          <p className="text-sm font-medium text-white truncate">{image.name}</p>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-slate-500">{image.size}</p>
            <p className="text-xs text-slate-500">{new Date(image.createdAt).toLocaleDateString()}</p>
          </div>
          {image.similarity !== undefined && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-400">Similarity</span>
                <span className="text-cyan-400 font-medium">{(image.similarity * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-1.5">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full"
                  style={{ width: `${image.similarity * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {preview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setPreview(false)}>
          <div className="glass-card max-w-2xl w-full p-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-white">{image.name}</h3>
              <button onClick={() => setPreview(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <img src={image.url || '/placeholder.jpg'} alt={image.name} className="w-full rounded-lg max-h-[60vh] object-contain" />
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-green-500/15 text-green-400 text-xs rounded-full border border-green-400/30">🔒 AES Encrypted</span>
              <span className="px-3 py-1 bg-cyan-500/15 text-cyan-400 text-xs rounded-full border border-cyan-400/30">BoW Indexed</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
