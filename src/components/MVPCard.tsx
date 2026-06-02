import { useState } from 'react'
import { Swords, Skull, MapPin, ChevronDown } from 'lucide-react'
import type { EnrichedMVP } from '@/types'
import { StatusBadge } from './StatusBadge'
import { MvpDetailsPanel } from './MvpDetailsPanel'
import { formatRemaining, formatDateTime } from '@/utils/timer'
import { getMapName } from '@/data/mapNames'

interface Props {
  item: EnrichedMVP
  now: number
  onKill: (item: EnrichedMVP) => void
  onEnemyKill: (item: EnrichedMVP, killedAt: string) => void
}

const DIFFICULTY_LABEL = {
  easy:   { label: 'Fácil',   className: 'text-green-400  border-green-700/40  bg-green-900/20'  },
  medium: { label: 'Médio',   className: 'text-yellow-400 border-yellow-700/40 bg-yellow-900/20' },
  hard:   { label: 'Difícil', className: 'text-red-400    border-red-700/40    bg-red-900/20'    },
}

const TAG_LABEL: Record<string, string> = {
  solo:        '👤 Solo',
  group:       '👥 Grupo',
  'high-drop': '💎 Drop',
  fast:        '⚡ Rápido',
  field:       '🌿 Field',
  disputed:    '🔥 Disputado',
}

function toLocalDatetimeInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

export function MVPCard({ item, now, onKill, onEnemyKill }: Props) {
  const minRemaining = item.minRespawnDate ? item.minRespawnDate.getTime() - now : 0
  const maxRemaining = item.maxRespawnDate ? item.maxRespawnDate.getTime() - now : 0
  const diff = DIFFICULTY_LABEL[item.difficulty]

  const [showEnemyForm, setShowEnemyForm] = useState(false)
  const [enemyTime,     setEnemyTime]     = useState(() => toLocalDatetimeInput(new Date()))
  const [showDPDetails, setShowDPDetails] = useState(false)

  function submitEnemyKill() {
    onEnemyKill(item, new Date(enemyTime).toISOString())
    setShowEnemyForm(false)
  }

  const noRecord = item.status === 'mvp'

  return (
    <>
      <article className="bg-rag-surface border border-rag-border rounded-xl overflow-hidden flex flex-col hover:border-rag-accent/50 transition-colors">

        {/* Banner imagem */}
        <div className="relative bg-rag-bg border-b border-rag-border flex items-center justify-center h-24 overflow-hidden">
          {item.image ? (
            <img
              src={item.image}
              alt={item.name}
              className="h-20 w-auto object-contain drop-shadow-lg"
              style={{ imageRendering: 'pixelated' }}
              loading="lazy"
              onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
            />
          ) : (
            <Skull size={40} className="text-rag-muted/30" />
          )}
          <div className="absolute top-2 right-2">
            <StatusBadge status={item.status} />
          </div>
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className="text-xs px-1.5 py-0.5 rounded bg-rag-surface/80 border border-rag-border text-rag-muted">
              P{item.priority}
            </span>
            <span className={`text-xs px-1.5 py-0.5 rounded border ${diff.className}`}>
              {diff.label}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <div>
            <h3 className="font-body font-semibold text-rag-text text-base leading-tight">{item.name}</h3>
            <span className="flex items-center gap-1 text-rag-blue text-xs font-medium mt-0.5">
              <MapPin size={11} className="shrink-0" />
              {getMapName(item.map)}
            </span>
            <span className="text-rag-muted text-xs">
              <span className="opacity-50">{item.map}</span>
              {' • '}
              {item.minRespawn}–{item.maxRespawn} min
            </span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1">
            {item.tags.map(tag => (
              <span key={tag} className="text-xs px-1.5 py-0.5 rounded-full border border-rag-border bg-rag-bg text-rag-muted">
                {TAG_LABEL[tag] ?? tag}
              </span>
            ))}
          </div>

          {/* Timers */}
          {!noRecord && (
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
          )}

          {noRecord && (
            <p className="text-rag-muted text-xs">
              ⚪ Nenhuma kill registrada — status desconhecido.
            </p>
          )}

          {/* Barra de progresso */}
          {!noRecord && (
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
          )}

          <p className="text-rag-muted text-xs">
            {item.latest
              ? <>{item.latest.killed_by_enemy
                  ? <span className="text-orange-400">⚡ Morto por inimigo</span>
                  : <span>Kill: {item.latest.killer}</span>
                } — {formatDateTime(item.latest.killed_at)}</>
              : 'Nenhuma kill registrada.'}
          </p>

          <p className="text-rag-muted/70 text-xs italic">{item.notes}</p>

          {/* Botão Divine Pride */}
          <button
            onClick={() => setShowDPDetails(true)}
            className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg border border-rag-border bg-rag-bg hover:border-rag-accent/40 hover:text-rag-text text-rag-muted text-xs transition-colors"
          >
            <ChevronDown size={12} />
            Ver drops e stats (Divine Pride)
          </button>

          {showEnemyForm && (
            <div className="flex flex-col gap-2 bg-rag-bg border border-rag-border rounded-lg p-3">
              <label className="text-rag-muted text-xs">Hora que o inimigo matou:</label>
              <input
                type="datetime-local"
                value={enemyTime}
                onChange={e => setEnemyTime(e.target.value)}
                className="w-full bg-rag-surface border border-rag-border rounded-lg px-2 py-1.5 text-rag-text text-xs outline-none focus:border-rag-accent [color-scheme:dark]"
              />
              <div className="flex gap-2">
                <button
                  onClick={submitEnemyKill}
                  className="flex-1 bg-orange-700 hover:bg-orange-600 text-white text-xs font-bold py-1.5 rounded-lg transition-colors"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => setShowEnemyForm(false)}
                  className="flex-1 bg-rag-surface2 border border-rag-border text-rag-muted text-xs py-1.5 rounded-lg transition-colors hover:text-rag-text"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => onKill(item)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-rag-accent hover:bg-red-700 text-white font-semibold text-sm transition-colors"
            >
              <Swords size={13} /> Nós matamos
            </button>
            <button
              onClick={() => { setShowEnemyForm(v => !v); setEnemyTime(toLocalDatetimeInput(new Date())) }}
              title="Registrar morte por inimigo"
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-orange-900/40 hover:bg-orange-800/60 border border-orange-700/40 text-orange-400 text-sm transition-colors"
            >
              <Skull size={13} /> Inimigo
            </button>
          </div>
        </div>
      </article>

      {showDPDetails && (
        <MvpDetailsPanel
          item={item}
          onClose={() => setShowDPDetails(false)}
        />
      )}
    </>
  )
}
