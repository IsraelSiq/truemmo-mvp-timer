import { useState } from 'react'
import { X, LogIn, UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  onClose: () => void
}

export function AuthModal({ onClose }: Props) {
  const { signInWithEmail, signUpWithEmail } = useAuth()
  const [mode,     setMode]     = useState<'login' | 'signup'>('login')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmail(email, password)
        onClose()
      } else {
        await signUpWithEmail(email, password)
        setSuccess('Conta criada! Verifique seu e-mail para confirmar.')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-rag-surface border border-rag-border rounded-2xl w-full max-w-sm shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-rag-border">
          <div className="flex items-center gap-2">
            {mode === 'login'
              ? <LogIn size={16} className="text-rag-accent" />
              : <UserPlus size={16} className="text-rag-accent" />}
            <h2 className="font-body font-bold text-rag-text text-base">
              {mode === 'login' ? 'Entrar' : 'Criar conta'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-rag-surface2 text-rag-muted hover:text-rag-text transition-colors"
            aria-label="Fechar"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="auth-email" className="text-xs text-rag-muted">E-mail</label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="bg-rag-bg border border-rag-border rounded-lg px-3 py-2 text-rag-text text-sm outline-none focus:border-rag-accent"
              placeholder="seu@email.com"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="auth-password" className="text-xs text-rag-muted">Senha</label>
            <input
              id="auth-password"
              type="password"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-rag-bg border border-rag-border rounded-lg px-3 py-2 text-rag-text text-sm outline-none focus:border-rag-accent"
              placeholder="Mínimo 6 caracteres"
              minLength={6}
            />
          </div>

          {error   && <p className="text-red-400 text-xs bg-red-900/20 border border-red-700/30 rounded-lg px-3 py-2">{error}</p>}
          {success && <p className="text-green-400 text-xs bg-green-900/20 border border-green-700/30 rounded-lg px-3 py-2">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-rag-accent hover:bg-red-700 text-white font-semibold text-sm transition-colors disabled:opacity-50"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {mode === 'login' ? 'Entrar' : 'Criar conta'}
          </button>

          <p className="text-center text-xs text-rag-muted">
            {mode === 'login' ? 'Novo por aqui?' : 'Já tem conta?'}{' '}
            <button
              type="button"
              onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError(''); setSuccess('') }}
              className="text-rag-accent hover:underline"
            >
              {mode === 'login' ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
