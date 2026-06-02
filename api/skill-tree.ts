// Vercel Serverless Function
// GET /api/skill-tree?jobId=4054
// Busca skills de um job na Divine Pride e retorna lista normalizada

import type { VercelRequest, VercelResponse } from '@vercel/node'

const DP_API_KEY = process.env.DIVINE_PRIDE_API_KEY ?? ''
const DP_BASE    = 'https://www.divine-pride.net/api/database'

// Alterações do servidor TRUEMMO em relação ao kRO oficial
const TRUEMMO_OVERRIDES: Record<number, { maxLevel?: number; note?: string }> = {
  // Exemplos — preencher conforme wiki do servidor
  // 5018: { maxLevel: 5, note: 'Reduzido para 5 no TRUEMMO' },
}

interface DPSkill {
  id: number
  name: string
  maxLevel: number
  type: number
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
    return res.status(500).json({
      error: 'DIVINE_PRIDE_API_KEY não configurada',
      hint: 'Adicione a variável de ambiente no painel do Vercel e faça redeploy.'
    })
  }

  const url = `${DP_BASE}/Job/${jobId}?apiKey=${DP_API_KEY}`

  try {
    const dpRes = await fetch(url)
    const raw   = await dpRes.text()

    if (!dpRes.ok) {
      console.error(`[skill-tree] DP ${dpRes.status} for jobId=${jobId}:`, raw.slice(0, 300))
      return res.status(dpRes.status).json({
        error:   `Divine Pride retornou ${dpRes.status}`,
        jobId,
        dpStatus: dpRes.status,
        // Mostra até 300 chars da resposta para debug (nunca exibe a key)
        detail:  raw.slice(0, 300),
      })
    }

    let data: DPJobSkills
    try {
      data = JSON.parse(raw)
    } catch {
      console.error('[skill-tree] JSON inválido da DP:', raw.slice(0, 300))
      return res.status(502).json({
        error:  'Resposta inválida da Divine Pride (não é JSON)',
        detail: raw.slice(0, 300),
      })
    }

    const skills = (data.skills ?? []).map(entry => {
      const override = TRUEMMO_OVERRIDES[entry.skill.id]
      return {
        skillId:  entry.skill.id,
        name:     entry.skill.name,
        maxLevel: override?.maxLevel ?? entry.maxLevel ?? entry.skill.maxLevel,
        type:     entry.skill.type,
        deps:     (entry.requires ?? []).map(r => ({ skillId: r.skillId, minLevel: r.level })),
        changed:  !!override,
        note:     override?.note,
      }
    })

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate')
    return res.status(200).json({ jobId, skills })

  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[skill-tree] fetch error:', msg)
    return res.status(500).json({
      error:  'Erro interno ao buscar skills',
      detail: msg,
    })
  }
}
