import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration)
  }, [])

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    info: (msg) => addToast(msg, 'info'),
    warning: (msg) => addToast(msg, 'warning'),
  }

  const typeStyles = {
    success: 'border-green-400/50 bg-green-900/30 text-green-300',
    error: 'border-red-400/50 bg-red-900/30 text-red-300',
    info: 'border-cyan-400/50 bg-cyan-900/30 text-cyan-300',
    warning: 'border-yellow-400/50 bg-yellow-900/30 text-yellow-300',
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-md text-sm font-medium shadow-xl animate-fadeInUp ${typeStyles[t.type]}`}
            style={{ minWidth: 260 }}>
            <span className="text-lg">{icons[t.type]}</span>
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
