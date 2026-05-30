import { Link } from 'react-router-dom'
import { Cloud, Lock, Search, Zap, Shield, BarChart2, ArrowRight, ChevronRight } from 'lucide-react'

const features = [
  { icon: Lock, title: 'AES Encryption', desc: 'Images are encrypted before upload. Your data stays private even on the cloud server.' },
  { icon: Search, title: 'Content-Based Retrieval', desc: 'Search by visual similarity using Bag-of-Encrypted-Words histograms.' },
  { icon: Zap, title: 'Fast Indexing', desc: 'Real-time feature extraction and encrypted index building for lightning-fast searches.' },
  { icon: Shield, title: 'Secure Cloud', desc: 'All operations happen on encrypted data — the server never decrypts your images.' },
  { icon: BarChart2, title: 'Analytics Dashboard', desc: 'Track uploads, searches, and retrieval accuracy with live charts.' },
  { icon: Cloud, title: 'Cloud Storage', desc: 'Scalable encrypted image storage with redundant cloud architecture.' },
]

const stats = [
  { label: 'Images Indexed', value: '50K+' },
  { label: 'Retrieval Accuracy', value: '94.7%' },
  { label: 'Encryption Strength', value: 'AES-256' },
  { label: 'Active Users', value: '1.2K' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <Cloud size={18} className="text-slate-900" />
            </div>
            <span className="text-lg font-bold glow-text">BOEW Cloud</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#stats" className="hover:text-cyan-400 transition-colors">Stats</a>
            <Link to="/about" className="hover:text-cyan-400 transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 glass border border-cyan-400/20 rounded-full text-xs text-cyan-400 font-medium mb-8">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Research Project · Content-Based Image Retrieval
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="glow-text">Encrypted</span>
            <br />
            <span className="text-white">Image Retrieval</span>
            <br />
            <span className="text-slate-400">in the Cloud</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            BOEW implements a novel Bag-of-Encrypted-Words scheme for privacy-preserving
            content-based image retrieval. Your images remain encrypted throughout — from
            upload to search to retrieval.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-primary flex items-center gap-2 justify-center text-base py-3 px-8">
              Start Uploading <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn-secondary flex items-center gap-2 justify-center text-base py-3 px-8">
              Learn More <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section id="stats" className="py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="glass-card p-6 text-center">
              <div className="text-3xl font-extrabold glow-text mb-1">{s.value}</div>
              <div className="text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose BOEW?</h2>
            <p className="text-slate-400 max-w-xl mx-auto">A complete privacy-first image retrieval ecosystem built for research and production.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="glass-card p-6 group">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/20 flex items-center justify-center mb-4 group-hover:border-cyan-400/50 transition-colors">
                  <Icon size={22} className="text-cyan-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto glass-card p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to secure your images?</h2>
          <p className="text-slate-400 mb-8">Join researchers and developers using BOEW for privacy-preserving image storage.</p>
          <Link to="/register" className="btn-primary text-base py-3 px-10 inline-flex items-center gap-2">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 text-center text-slate-500 text-sm">
        <p>© 2024 BOEW Cloud · A Content-Based Image Retrieval Scheme Using Bag-of-Encrypted-Words</p>
      </footer>
    </div>
  )
}
