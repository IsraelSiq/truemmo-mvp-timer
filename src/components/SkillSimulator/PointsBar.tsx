import type { Tier } from '@/data/skillTrees'

const TIER_LABELS: Record<Tier, string> = {
  '1st':   '1ª Classe',
  '2nd':   '2ª Classe',
  'trans': 'Trans',
  '3rd':   '3ª Classe',
  '4th':   '4ª Classe',
}

const TIER_COLORS: Record<Tier, string> = {
  '1st':   'bg-gray-400',
  '2nd':   'bg-blue-400',
  'trans': 'bg-purple-400',
  '3rd':   'bg-yellow-400',
  '4th':   'bg-rag-accent',
}

interface Props {
  tier: Tier
  used: number
  max: number
  active: boolean
  onClick: () => void
}

export function PointsBar({ tier, used, max, active, onClick }: Props) {
  if (max === 0) return null
  const pct = Math.min(100, (used / max) * 100)
  const over = used > max

  return (
    <button
      onClick={onClick}
      className={`flex flex-col gap-1.5 rounded-lg border p-3 transition-colors text-left w-full ${
        active
          ? 'border-rag-accent bg-rag-accent/10'
          : 'border-rag-border bg-rag-surface hover:border-rag-accent/40'
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-rag-text">{TIER_LABELS[tier]}</span>
        <span className={`text-xs tabular-nums font-bold ${
          over ? 'text-red-400' : used === max ? 'text-green-400' : 'text-rag-muted'
        }`}>
          {used} / {max}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-rag-bg overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            over ? 'bg-red-400' : TIER_COLORS[tier]
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </button>
  )
}
