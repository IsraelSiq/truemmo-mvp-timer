import type { KillStatus } from '@/types'

const MAP: Record<KillStatus, { label: string; className: string }> = {
  'mvp':         { label: '⚪ MVP',          className: 'bg-rag-surface2 text-rag-muted border border-rag-border' },
  'window-open': { label: '🟢 Janela Aberta', className: 'bg-green-900/30 text-green-400 border border-green-700/40 animate-pulse' },
  'soon':        { label: '🔵 Em Breve',      className: 'bg-blue-900/30 text-blue-400 border border-blue-700/40' },
  'far':         { label: '🔴 Longe',         className: 'bg-red-900/20 text-red-400 border border-red-700/30' },
}

export function StatusBadge({ status }: { status: KillStatus }) {
  const { label, className } = MAP[status]
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${className}`}>
      {label}
    </span>
  )
}
