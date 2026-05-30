import Sidebar from '../components/Sidebar'
import GlassCard from '../components/GlassCard'
import { Info, Shield, Layers, Key, Database, Cpu } from 'lucide-react'

export default function About() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8 max-w-4xl overflow-y-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Info size={24} className="text-cyan-400" /> About Project
          </h1>
          <p className="text-slate-400 text-sm mt-1">Technical specification of BOEW framework</p>
        </div>

        <GlassCard className="mb-6">
          <h2 className="text-xl font-bold text-white mb-3">Project Overview</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            <strong>BOEW</strong> (Bag-of-Encrypted-Words) is a novel privacy-preserving content-based image retrieval (CBIR) scheme designed for cloud computing environments.
            In conventional cloud storage, users must either trust the cloud provider with unencrypted images or lose the ability to perform content-based search over encrypted data.
            BOEW solves this by extracting visual descriptors, quantizing them into a visual dictionary (Bag of Words), encrypting the resulting histograms, and enabling the cloud server to perform secure similarity calculations without ever learning the actual content of the images.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2"><Key size={16} /> Privacy-Preserving Encryption</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Images are encrypted using standard symmetric encryption (like AES-256). The features are encrypted using secure distance-preserving or homomorphic encryption mappings, ensuring visual word frequencies can be compared securely.
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <h3 className="font-semibold text-cyan-400 mb-2 flex items-center gap-2"><Layers size={16} /> Bag-of-Visual-Words (BoW)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visual features are clustered into a predefined codebook of "visual words". An image is represented as a histogram of word occurrences, which acts as a compact, retrieval-friendly signature.
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard>
          <h2 className="text-base font-bold text-white mb-4">System Architecture</h2>
          <div className="space-y-4">
            {[
              { step: '1. Feature Extraction', desc: 'The client-side browser or local agent analyzes the image and generates a local feature vector (histogram representation).' },
              { step: '2. Local Encryption', desc: 'The vector is encrypted with the user\'s secret key, and the original image is encrypted using AES before transit.' },
              { step: '3. Indexing & Storage', desc: 'The server receives the encrypted image and the encrypted vector, storing them in MongoDB and the cloud file simulator.' },
              { step: '4. Similarity Search', desc: 'When searching, a query image\'s encrypted vector is compared with the database using encrypted-domain Cosine similarity calculations.' },
            ].map(({ step, desc }) => (
              <div key={step} className="flex gap-4 items-start pb-3 border-b border-white/5 last:border-0 last:pb-0">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center flex-shrink-0 text-cyan-400 font-bold text-sm">
                  {step[0]}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">{step}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </main>
    </div>
  )
}
