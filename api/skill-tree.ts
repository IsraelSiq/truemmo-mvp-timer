// Vercel Serverless Function
// GET /api/skill-tree?jobId=4054
// Busca skills de um job na Divine Pride e retorna lista normalizada

import type { VercelRequest, VercelResponse } from '@vercel/node'

const DP_API_KEY = process.env.DIVINE_PRIDE_API_KEY ?? ''
const DP_BASE    = 'https://www.divine-pride.net/api/database'

// Alterações do servidor TRUEMMO em relação ao kRO oficial
// Formato: skillId → { maxLevel?, changed: true, note? }
const TRUEMMO_OVERRIDES: Record<number, { maxLevel?: number; note?: string }> = {
  // Exemplos — preencher conforme wiki do servidor
  // 5018: { maxLevel: 5, note: 'Reduzido para 5 no TRUEMMO' },
}

interface DPSkill {
  id: number
  name: string
  maxLevel: number
  type: number       // 0=passive, 1=active, etc.
  spCost?: number
  description?: string
}

interface DPJobSkills {
  skills: { skill: DPSkill; maxLevel: number; requires?: { skillId: number; level: number }[] }[]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const jobId = Number(req.query.jobId)
  if (!jobId || isNaN(jobId)) {
    return res.status(400).json({ error: 'jobId inválido' })
  }

  if (!DP_API_KEY) {
    return res.status(500).json({ error: 'DIVINE_PRIDE_API_KEY não configurada' })
  }

  try {
    const url = `${DP_BASE}/Job/${jobId}?apiKey=${DP_API_KEY}`
    const dpRes = await fetch(url)
    if (!dpRes.ok) {
      return res.status(dpRes.status).json({ error: `Divine Pride retornou ${dpRes.status}` })
    }

    const data: DPJobSkills = await dpRes.json()

    const skills = (data.skills ?? []).map(entry => {
      const override = TRUEMMO_OVERRIDES[entry.skill.id]
      return {
        skillId:   entry.skill.id,
        name:      entry.skill.name,
        maxLevel:  override?.maxLevel ?? entry.maxLevel ?? entry.skill.maxLevel,
        type:      entry.skill.type,
        deps:      (entry.requires ?? []).map(r => ({ skillId: r.skillId, minLevel: r.level })),
        changed:   !!override,
        note:      override?.note,
      }
    })

    // Cache 1 hora na CDN da Vercel
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).json({ jobId, skills })
  } catch (err) {
    console.error('[skill-tree]', err)
    return res.status(500).json({ error: 'Erro interno ao buscar skills' })
  }
}
