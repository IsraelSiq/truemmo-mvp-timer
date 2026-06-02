import { useState } from 'react'
import { JOB_TREES } from '@/data/skillTrees'
import { ClassPicker } from './ClassPicker'
import { SkillTree } from './SkillTree'
import type { Tier } from '@/data/skillTrees'

export interface AllocatedSkills {
  [skillId: number]: number // skillId → level alocado
}

export function SkillSimulator() {
  const [jobIndex,   setJobIndex]   = useState(0)
  const [allocated,  setAllocated]  = useState<AllocatedSkills>({})
  const [activeTier, setActiveTier] = useState<Tier>('4th')

  const tree = JOB_TREES[jobIndex]

  function handleJobChange(idx: number) {
    setJobIndex(idx)
    setAllocated({})
    setActiveTier('4th')
  }

  function setSkillLevel(skillId: number, level: number) {
    setAllocated(prev => ({
      ...prev,
      [skillId]: Math.max(0, level),
    }))
  }

  // Pontos usados por tier (calculado sobre as skills carregadas pelo SkillTree)
  function usedPoints(tier: Tier, skillIds: number[], maxLevels: Record<number, number>) {
    return skillIds.reduce((sum, id) => {
      const lvl = allocated[id] ?? 0
      return sum + Math.min(lvl, maxLevels[id] ?? lvl)
    }, 0)
  }

  return (
    <div className="flex flex-col gap-6">
      <ClassPicker
        trees={JOB_TREES}
        selected={jobIndex}
        onChange={handleJobChange}
      />

      <SkillTree
        tree={tree}
        allocated={allocated}
        activeTier={activeTier}
        onTierChange={setActiveTier}
        onSetLevel={setSkillLevel}
        usedPoints={usedPoints}
      />
    </div>
  )
}
