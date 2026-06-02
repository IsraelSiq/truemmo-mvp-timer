// Vercel Serverless Function — proxy para Divine Pride API
// Evita CORS e mantém a API key segura no servidor
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Só aceita GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { mobId } = req.query
  if (!mobId || typeof mobId !== 'string') {
    return res.status(400).json({ error: 'mobId é obrigatório' })
  }

  const apiKey = process.env.VITE_DIVINE_PRIDE_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'VITE_DIVINE_PRIDE_KEY não configurada no servidor' })
  }

  try {
    const upstream = await fetch(
      `https://www.divine-pride.net/api/database/Monster/${mobId}?apiKey=${apiKey}`,
      { headers: { Accept: 'application/json' } }
    )

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Divine Pride retornou ${upstream.status}` })
    }

    const data = await upstream.json()

    // Cache por 10 minutos (dados estáticos de mob não mudam)
    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate')
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(200).json(data)
  } catch (err) {
    return res.status(502).json({ error: 'Erro ao contatar Divine Pride API' })
  }
}
