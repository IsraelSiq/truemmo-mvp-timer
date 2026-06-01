import { Swords, MapPin } from 'lucide-react'
import type { EnrichedMVP } from '@/types'
import { StatusBadge } from './StatusBadge'
import { formatRemaining, formatDateTime } from '@/utils/timer'
import { getMapName } from '@/data/mapNames'

interface Props {
  item: EnrichedMVP
  now: number
  onKill: (item: EnrichedMVP) => void
}

export function MVPCard({ item, now, onKill }: Props) {
  const minRemaining = item.minRespawnDate ? item.minRespawnDate.getTime() - now : 0
  const maxRemaining = item.maxRespawnDate ? item.maxRespawnDate.getTime() - now : 0

  return (
    <article className="bg-rag-surface border border-rag-border rounded-xl p-4 flex flex-col gap-3 hover:border-rag-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3 className="font-body font-semibold text-rag-text text-base leading-tight">{item.name}</h3>

          {/* Readable map name with pin icon */}
          <span className="flex items-center gap-1 text-rag-blue text-xs font-medium">
            <MapPin size={11} className="shrink-0" />
            {getMapName(item.map)}
          </span>

          {/* Technical map ID + respawn range — secondary info */}
          <span className="text-rag-muted text-xs">
            <span className="opacity-50">{item.map}</span>
            {' • '}
            {item.minRespawn}–{item.maxRespawn} min
          </span>
        </div>
        <StatusBadge status={item.status} />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="bg-rag-bg rounded-lg p-2 border border-rag-border">
          <span className="block text-rag-muted text-xs uppercase tracking-wider mb-0.5">Janela mín.</span>
          <strong className="text-rag-text text-sm tabular-nums">
            {item.minRespawnDate ? formatRemaining(minRemaining) : '—'}
          </strong>
        </div>
        <div className="bg-rag-bg rounded-lg p-2 border border-rag-border">
          <span className="block text-rag-muted text-xs uppercase tracking-wider mb-0.5">Janela máx.</span>
          <strong className="text-rag-text text-sm tabular-nums">
            {item.maxRespawnDate ? formatRemaining(maxRemaining) : '—'}
          </strong>
        </div>
      </div>

      <div className="h-1.5 bg-rag-bg rounded-full overflow-hidden border border-rag-border">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${item.windowProgress}%`,
            background: item.status === 'window-open'
              ? 'linear-gradient(90deg, #27ae60, #f1c40f)'
              : 'linear-gradient(90deg, #2980b9, #c0392b)'
          }}
        />
      </div>

      <p className="text-rag-muted text-xs">
        {item.latest
          ? `Última kill: ${item.latest.killer} em ${formatDateTime(item.latest.killed_at)}`
          : 'Nenhuma kill registrada ainda.'}
      </p>

      <p className="text-rag-muted/70 text-xs italic">{item.notes}</p>

      <button
        onClick={() => onKill(item)}
        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-rag-accent hover:bg-red-700 text-white font-semibold text-sm transition-colors"
      >
        <Swords size={14} /> Morreu agora
      </button>
    </article>
  )
}
