import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import ImageCard from '../components/ImageCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useToast } from '../context/ToastContext'
import { imageService } from '../services/imageService'
import { Search as SearchIcon, Sliders, X } from 'lucide-react'

const DUMMY_RESULTS = [
  { _id: '1', name: 'landscape_001.jpg', size: '2.4 MB', similarity: 0.97, createdAt: new Date().toISOString(), url: '' },
  { _id: '2', name: 'mountain_view.jpg', size: '1.8 MB', similarity: 0.89, createdAt: new Date().toISOString(), url: '' },
  { _id: '3', name: 'sunset_beach.jpg', size: '3.1 MB', similarity: 0.82, createdAt: new Date().toISOString(), url: '' },
  { _id: '4', name: 'forest_trail.jpg', size: '2.0 MB', similarity: 0.75, createdAt: new Date().toISOString(), url: '' },
  { _id: '5', name: 'city_skyline.jpg', size: '1.5 MB', similarity: 0.68, createdAt: new Date().toISOString(), url: '' },
  { _id: '6', name: 'ocean_waves.jpg', size: '2.7 MB', similarity: 0.61, createdAt: new Date().toISOString(), url: '' },
]

export default function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [threshold, setThreshold] = useState(0.5)
  const { toast } = useToast()

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) { toast.error('Enter a search query'); return }
    setLoading(true); setSearched(false)
    try {
      const res = await imageService.search(query)
      setResults(res.data.results || DUMMY_RESULTS)
    } catch {
      // Use dummy data for demo
      setResults(DUMMY_RESULTS.filter(r => r.similarity >= threshold))
    }
    setSearched(true); setLoading(false)
  }

  const filtered = results.filter(r => r.similarity >= threshold)

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <SearchIcon size={24} className="text-cyan-400" /> Search Images
          </h1>
          <p className="text-slate-400 text-sm mt-1">Find visually similar encrypted images using BOW retrieval</p>
        </div>

        {/* Search bar */}
        <GlassCard className="mb-6">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <SearchIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                className="input-field pl-10" placeholder="Describe image content: 'sunset beach', 'mountain landscape'…" />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <X size={16} />
                </button>
              )}
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 px-6">
              {loading ? <LoadingSpinner size="sm" /> : <SearchIcon size={16} />}
              Search
            </button>
          </form>

          {/* Threshold slider */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Sliders size={14} /> Similarity Threshold:
              <span className="text-cyan-400 font-medium">{(threshold * 100).toFixed(0)}%</span>
            </div>
            <input type="range" min="0" max="1" step="0.05" value={threshold}
              onChange={e => setThreshold(parseFloat(e.target.value))}
              className="flex-1 accent-cyan-400" />
          </div>
        </GlassCard>

        {/* Results */}
        {loading && (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" text="Searching encrypted index…" />
          </div>
        )}

        {searched && !loading && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-400">
                Found <span className="text-cyan-400 font-medium">{filtered.length}</span> results for "{query}"
              </p>
              <span className="text-xs text-slate-500 px-3 py-1 glass rounded-full">Encrypted domain search</span>
            </div>
            {filtered.length === 0 ? (
              <GlassCard className="text-center py-16">
                <SearchIcon size={48} className="text-slate-600 mx-auto mb-4" />
                <p className="text-slate-400">No similar images found above {(threshold * 100).toFixed(0)}% threshold</p>
                <p className="text-slate-500 text-sm mt-1">Try lowering the similarity threshold</p>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(img => (
                  <ImageCard key={img._id} image={img}
                    onDelete={() => setResults(p => p.filter(r => r._id !== img._id))} />
                ))}
              </div>
            )}
          </>
        )}

        {!searched && !loading && (
          <GlassCard className="text-center py-20">
            <SearchIcon size={56} className="text-slate-700 mx-auto mb-4 animate-float" />
            <h3 className="text-white font-semibold mb-2">Content-Based Image Search</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">Enter a description or upload a query image to find visually similar encrypted images in your cloud storage.</p>
          </GlassCard>
        )}
      </main>
    </div>
  )
}
