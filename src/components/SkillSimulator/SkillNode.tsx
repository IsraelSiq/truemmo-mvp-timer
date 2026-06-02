import { ChevronUp, ChevronDown, Lock } from 'lucide-react'

export interface SkillData {
  skillId: number
  name: string
  maxLevel: number
  type: number  // 0=passive
  deps: { skillId: number; minLevel: number }[]
  changed?: boolean
  note?: string
}

interface Props {
  skill: SkillData
  level: number
  locked: boolean // pré-requisito não satisfeito
  onChange: (delta: number) => void
}

export function SkillNode({ skill, level, locked, onChange }: Props) {
  const isPassive  = skill.type === 0
  const isMaxed    = level >= skill.maxLevel
  const hasPoints  = level > 0

  return (
    <div
      className={`relative rounded-lg border p-3 flex flex-col gap-2 transition-colors ${
        locked
          ? 'border-rag-border/50 bg-rag-bg opacity-50'
          : hasPoints
            ? 'border-rag-accent/40 bg-rag-accent/5'
            : 'border-rag-border bg-rag-surface hover:border-rag-accent/30'
      }`}
    >
      {/* Badge TRUEMMO */}
      {skill.changed && (
        <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 font-bold">
          TrueMmo
        </span>
      )}

      <div className="flex items-start gap-2 pr-10">
        {/* Ícone tipo */}
        <span className={`mt-0.5 text-xs px-1.5 py-0.5 rounded border font-mono ${
          isPassive
            ? 'border-gray-600 text-gray-400'
            : 'border-rag-accent/40 text-rag-accent'
        }`}>
          {isPassive ? 'P' : 'A'}
        </span>
        <span className="text-rag-text text-xs font-semibold leading-snug flex-1">
          {skill.name}
        </span>
      </div>

      {/* Nota do servidor */}
      {skill.note && (
        <p className="text-yellow-400/80 text-[10px] leading-snug">{skill.note}</p>
      )}

      {/* Pré-requisitos */}
      {skill.deps.length > 0 && (
        <div className="text-[10px] text-rag-muted">
          {locked && <Lock size={9} className="inline mr-1" />}
          Req: {skill.deps.map(d => `Skill ${d.skillId} Lv${d.minLevel}`).join(', ')}
        </div>
      )}

      {/* Controle de nível */}
      <div className="flex items-center gap-2 mt-auto">
        <button
          disabled={locked || level <= 0}
          onClick={() => onChange(-1)}
          className="w-6 h-6 flex items-center justify-center rounded border border-rag-border bg-rag-bg text-rag-muted hover:text-rag-text hover:border-rag-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronDown size={12} />
        </button>

        <span className={`tabular-nums text-sm font-bold flex-1 text-center ${
          isMaxed ? 'text-green-400' : hasPoints ? 'text-rag-accent' : 'text-rag-muted'
        }`}>
          {level} <span className="text-rag-muted font-normal text-xs">/ {skill.maxLevel}</span>
        </span>

        <button
          disabled={locked || isMaxed}
          onClick={() => onChange(+1)}
          className="w-6 h-6 flex items-center justify-center rounded border border-rag-border bg-rag-bg text-rag-muted hover:text-rag-text hover:border-rag-accent/40 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronUp size={12} />
        </button>
      </div>
    </div>
  )
}
