import { useState, useCallback, useMemo } from 'react'
import type { JobTree, SkillEntry, SkillDep } from '@/data/skillTrees'

export type AllocMap = Record<number, number>

const TIER_POINTS: [number, number, number, number, number] = [49, 70, 7, 70, 70]

export function useSkillSimulator(job: JobTree | null) {
  const [alloc, setAlloc] = useState<AllocMap>({})

  const reset = useCallback(() => setAlloc({}), [])

  const skills: SkillEntry[] = job?.skills ?? []

  const spent = useMemo((): [number, number, number, number, number] => {
    if (!job) return [0, 0, 0, 0, 0]
    const tierOrder = ['1st', '2nd', 'trans', '3rd', '4th'] as const
    const result: [number, number, number, number, number] = [0, 0, 0, 0, 0]
    for (const skill of skills) {
      const idx = tierOrder.indexOf(skill.tier)
      if (idx !== -1) result[idx] += alloc[skill.skillId] ?? 0
    }
    return result
  }, [alloc, job, skills])

  const available = useMemo(
    () => TIER_POINTS.map((max, i) => max - spent[i]) as [number, number, number, number, number],
    [spent]
  )

  const isUnlocked = useCallback(
    (skill: SkillEntry): boolean => {
      return skill.deps.every((req: SkillDep) => (alloc[req.skillId] ?? 0) >= req.minLevel)
    },
    [alloc]
  )

  const calcMinPath = useCallback(
    (targetId: number): AllocMap => {
      if (!job) return {}
      const skillMap = Object.fromEntries(skills.map((s: SkillEntry) => [s.skillId, s]))
      const path: AllocMap = {}

      function resolve(id: number, minLevel: number) {
        const skill = skillMap[id]
        if (!skill) return
        const current = alloc[id] ?? 0
        const needed = Math.max(current, minLevel)
        if ((path[id] ?? 0) >= needed) return
        path[id] = needed
        for (const req of skill.deps as SkillDep[]) {
          resolve(req.skillId, req.minLevel)
        }
      }

      resolve(targetId, 1)
      return path
    },
    [alloc, job, skills]
  )

  const allocate = useCallback(
    (skillId: number, autoPath = false) => {
      if (!job) return
      const skill = skills.find((s: SkillEntry) => s.skillId === skillId)
      if (!skill) return

      const tierOrder = ['1st', '2nd', 'trans', '3rd', '4th'] as const
      const tierIdx = tierOrder.indexOf(skill.tier)

      if (autoPath || !isUnlocked(skill)) {
        const path = calcMinPath(skillId)
        setAlloc(prev => {
          const next = { ...prev }
          for (const [idStr, level] of Object.entries(path)) {
            const id = Number(idStr)
            next[id] = Math.max(next[id] ?? 0, level)
          }
          const targetCurrent = next[skillId] ?? 0
          if (targetCurrent < skill.maxLevel) next[skillId] = targetCurrent + 1
          return next
        })
      } else {
        const current = alloc[skillId] ?? 0
        if (current >= skill.maxLevel) return
        if (tierIdx !== -1 && available[tierIdx] <= 0) return
        setAlloc(prev => ({ ...prev, [skillId]: current + 1 }))
      }
    },
    [alloc, available, isUnlocked, calcMinPath, job, skills]
  )

  const deallocate = useCallback(
    (skillId: number) => {
      if (!job) return
      const current = alloc[skillId] ?? 0
      if (current <= 0) return
      const wouldBreak = skills.some((s: SkillEntry) =>
        s.deps.some((req: SkillDep) => req.skillId === skillId && req.minLevel >= current && (alloc[s.skillId] ?? 0) > 0)
      )
      if (wouldBreak) return
      setAlloc(prev => ({ ...prev, [skillId]: current - 1 }))
    },
    [alloc, job, skills]
  )

  return { alloc, spent, available, isUnlocked, allocate, deallocate, reset }
}
