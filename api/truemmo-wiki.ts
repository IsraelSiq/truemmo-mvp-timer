import type { VercelRequest, VercelResponse } from '@vercel/node'

// Endpoint: GET /api/truemmo-wiki?page=Pontos_de_MvP
// Faz proxy da MediaWiki API do TrueMmo para evitar CORS no frontend.
// Parseia a resposta e extrai a lista de MVPs com mapa, respawn e pontos.

const WIKI_API = 'https://wiki.truemmo.com.br/api.php'

interface WikiMvpRow {
  name: string
  map: string
  minRespawn: number
  maxRespawn: number
  mvpPoints: number
}

function parseMinutes(raw: string): number {
  const n = parseInt(raw.replace(/[^0-9]/g, ''), 10)
  return isNaN(n) ? 0 : n
}

/**
 * Extrai linhas de uma wikitable MediaWiki no formato:
 * |- \n | Nome || Mapa || Respawn || Pontos
 * Funciona para as tabelas da pagina Pontos_de_MvP.
 */
function parseWikiTable(wikitext: string): WikiMvpRow[] {
  const rows: WikiMvpRow[] = []

  // Divide em linhas de tabela
  const lines = wikitext.split('|-')

  for (const block of lines) {
    // Pega celulas separadas por || ou por linhas com |
    const cells = block
      .split('\n')
      .map(l => l.replace(/^\|\|?/, '').trim())
      .filter(Boolean)
      .flatMap(l => l.split('||').map(c => c.trim()))

    // Remove markup wiki: [[link|texto]] => texto, '''bold''' => texto
    const clean = (s: string) =>
      s
        .replace(/\[\[[^\]]*\|([^\]]+)\]\]/g, '$1')
        .replace(/\[\[([^\]]+)\]\]/g, '$1')
        .replace(/'{2,3}/g, '')
        .replace(/<[^>]+>/g, '')
        .trim()

    // Esperamos ao menos 4 campos: nome, mapa, respawn (min-max), pontos
    const cleaned = cells.map(clean).filter(Boolean)
    if (cleaned.length < 4) continue

    const [nameRaw, mapRaw, respawnRaw, pointsRaw] = cleaned

    // Ignora linhas de cabecalho
    if (!nameRaw || nameRaw.startsWith('!') || nameRaw.toLowerCase() === 'nome') continue

    // Respawn pode ser "120" ou "120-130" ou "120 ~ 130"
    const respawnMatch = respawnRaw.match(/(\d+)\D*(\d*)/)
    const minRespawn = respawnMatch ? parseMinutes(respawnMatch[1]) : 0
    const maxRespawn = respawnMatch?.[2] ? parseMinutes(respawnMatch[2]) : minRespawn

    rows.push({
      name:        nameRaw,
      map:         mapRaw.toLowerCase().replace(/\s+/g, '_'),
      minRespawn,
      maxRespawn,
      mvpPoints:   parseMinutes(pointsRaw),
    })
  }

  return rows
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300') // cache 10 min

  const page = (req.query.page as string) || 'Pontos_de_MvP'

  try {
    const url = new URL(WIKI_API)
    url.searchParams.set('action',      'query')
    url.searchParams.set('prop',        'revisions')
    url.searchParams.set('titles',      page)
    url.searchParams.set('rvprop',      'content')
    url.searchParams.set('rvslots',     'main')
    url.searchParams.set('format',      'json')
    url.searchParams.set('formatversion', '2')

    const response = await fetch(url.toString(), {
      headers: { 'User-Agent': 'TrueMmo-MVP-Timer/1.0' },
      signal:  AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      return res.status(502).json({ error: `Wiki respondeu ${response.status}` })
    }

    const data = await response.json()
    const pages = data?.query?.pages
    if (!pages?.length) {
      return res.status(404).json({ error: 'Pagina nao encontrada na wiki' })
    }

    const wikitext: string = pages[0]?.revisions?.[0]?.slots?.main?.content ?? ''
    if (!wikitext) {
      return res.status(404).json({ error: 'Wikitext vazio' })
    }

    const mvps = parseWikiTable(wikitext)

    return res.status(200).json({
      page,
      count:    mvps.length,
      mvps,
      _fetched: new Date().toISOString(),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    return res.status(500).json({ error: message })
  }
}
