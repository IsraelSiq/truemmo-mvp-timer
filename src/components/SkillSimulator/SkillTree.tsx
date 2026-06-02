import { useEffect, useState } from 'react'
import type { JobTree, Tier } from '@/data/skillTrees'
import type { AllocatedSkills } from './index'
import type { SkillData } from './SkillNode'
import { SkillNode } from './SkillNode'
import { PointsBar } from './PointsBar'
import { Loader2 } from 'lucide-react'

interface Props {
  tree: JobTree
  allocated: AllocatedSkills
  activeTier: Tier
  onTierChange: (t: Tier) => void
  onSetLevel: (skillId: number, level: number) => void
  usedPoints: (tier: Tier, skillIds: number[], maxLevels: Record<number, number>) => number
}

type SkillsByTier = Record<Tier, SkillData[]>

export function SkillTree({ tree, allocated, activeTier, onTierChange, onSetLevel, usedPoints }: Props) {
  const [skillsByTier, setSkillsByTier] = useState<SkillsByTier>({ '1st': [], '2nd': [], 'trans': [], '3rd': [], '4th': [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Busca skills de todos os jobIds da cadeia
  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const result: SkillsByTier = { '1st': [], '2nd': [], 'trans': [], '3rd': [], '4th': [] }
        await Promise.all(
          tree.chain.map(async (node) => {
            const res = await fetch(`/api/skill-tree?jobId=${node.jobId}`)
            if (!res.ok) throw new Error(`HTTP ${res.status} para job ${node.jobId}`)
            const data = await res.json()
            if (!cancelled) {
              result[node.tier] = (data.skills ?? []) as SkillData[]
            }
          })
        )
        if (!cancelled) setSkillsByTier(result)
      } catch (e: unknown) {
        if (!cancelled) setError((e as Error).message ?? 'Erro ao carregar skills')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [tree])

  const TIERS: Tier[] = ['1st', '2nd', 'trans', '3rd', '4th']

  // Mapa skillId → maxLevel para cálculo de pontos
  function maxLevelsFor(tier: Tier) {
    return Object.fromEntries(skillsByTier[tier].map(s => [s.skillId, s.maxLevel]))
  }

  // Verifica se pré-requisitos estão satisfeitos
  function isLocked(skill: SkillData): boolean {
    return skill.deps.some(dep => (allocated[dep.skillId] ?? 0) < dep.minLevel)
  }

  const activeSkills = skillsByTier[activeTier]

  return (
    <div className="flex flex-col gap-4">
      {/* Barras de pontos por tier */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {TIERS.map(tier => {
          const ids = skillsByTier[tier].map(s => s.skillId)
          const ml  = maxLevelsFor(tier)
          return (
            <PointsBar
              key={tier}
              tier={tier}
              used={usedPoints(tier, ids, ml)}
              max={tree.maxPoints[tier]}
              active={activeTier === tier}
              onClick={() => onTierChange(tier)}
            />
          )
        })}
      </div>

      {/* Grade de skills do tier ativo */}
      <div className="bg-rag-surface border border-rag-border rounded-xl p-4">
        {loading && (
          <div className="flex items-center justify-center gap-2 py-12 text-rag-muted">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">Carregando skills...</span>
          </div>
        )}

        {!loading && error && (
          <div className="py-8 text-center text-red-400 text-sm">
            {error}
            <p className="text-rag-muted text-xs mt-1">Verifique a DIVINE_PRIDE_API_KEY no .env</p>
          </div>
        )}

        {!loading && !error && activeSkills.length === 0 && (
          <div className="py-8 text-center text-rag-muted text-sm">
            Nenhuma skill encontrada para este tier.
          </div>
        )}

        {!loading && !error && activeSkills.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {activeSkills.map(skill => (
              <SkillNode
                key={skill.skillId}
                skill={skill}
                level={allocated[skill.skillId] ?? 0}
                locked={isLocked(skill)}
                onChange={delta => onSetLevel(skill.skillId, (allocated[skill.skillId] ?? 0) + delta)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
