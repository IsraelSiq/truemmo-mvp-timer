import { useState } from 'react'
import { X, LogIn, UserPlus, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  onClose: () => void
}

// SVG logo do Google (oficial)
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

export function AuthModal({ onClose }: Props) {
  const { signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth()
  const [mode,       setMode]       = useState<'login' | 'signup'>('login')
  const [email,      setEmail]      = useState('')
  const [password,   setPassword]   = useState('')
  const [loading,    setLoading]    = useState(false)
  const [loadingG,   setLoadingG]   = useState(false)
  const [error,      setError]      = useState('')
  const [success,    setSuccess]    = useState('')

  async function handleGoogle() {
    setError('')
    setLoadingG(true)
    try {
      await signInWithGoogle()
      // O redirect acontece automaticamente — não precisa fechar o modal
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar com Google')
      setLoadingG(false)
    }
  }

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

        <div className="p-5 flex flex-col gap-4">

          {/* Botão Google — destaque principal */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={loadingG}
            className="flex items-center justify-center gap-3 w-full py-2.5 rounded-lg bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm border border-gray-300 transition-colors disabled:opacity-60 shadow-sm"
          >
            {loadingG
              ? <Loader2 size={16} className="animate-spin text-gray-500" />
              : <GoogleIcon />}
            Entrar com Google
          </button>

          {/* Divisor */}
          <div className="flex items-center gap-3">
            <hr className="flex-1 border-rag-border" />
            <span className="text-rag-muted text-xs">ou</span>
            <hr className="flex-1 border-rag-border" />
          </div>

          {/* Formulário email/senha */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
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
    </div>
  )
}
