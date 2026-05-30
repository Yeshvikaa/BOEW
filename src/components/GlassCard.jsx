export default function GlassCard({ children, className = '', hover = true, glow = false }) {
  return (
    <div className={`glass-card p-6 ${hover ? '' : '!transform-none'} ${glow ? 'animate-pulse-glow' : ''} ${className}`}>
      {children}
    </div>
  )
}
