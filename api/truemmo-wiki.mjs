// GET /api/truemmo-wiki
// Scraping HTML da pagina Pontos_de_MvP da wiki TrueMmo
// Cache 10 min no Vercel Edge

const WIKI_URL = 'https://wiki.truemmo.com.br/index.php/Pontos_de_MvP'

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#[0-9]+;/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function parseRespawn(raw) {
  const nums = raw.match(/\d+/g)?.map(Number) ?? []
  if (nums.length === 0) return { min: 0, max: 0 }
  if (nums.length === 1) return { min: nums[0], max: nums[0] }
  return { min: Math.min(nums[0], nums[1]), max: Math.max(nums[0], nums[1]) }
}

function parseTables(html) {
  const mvps = []
  const tableRe = /<table[^>]*>([\/\S\s]*?)<\/table>/gi
  let tableMatch

  while ((tableMatch = tableRe.exec(html)) !== null) {
    const tableHtml = tableMatch[0]
    const rows = []
    const rowRe = /<tr[^>]*>([\/\S\s]*?)<\/tr>/gi
    let rowMatch

    while ((rowMatch = rowRe.exec(tableHtml)) !== null) {
      const cells = []
      const cellRe = /<t[dh][^>]*>([\/\S\s]*?)<\/t[dh]>/gi
      let cellMatch
      while ((cellMatch = cellRe.exec(rowMatch[1])) !== null) {
        cells.push(stripTags(cellMatch[1]))
      }
      if (cells.length > 0) rows.push(cells)
    }

    if (rows.length < 2) continue

    const headers = rows[0].map(h => h.toLowerCase())
    const iName    = headers.findIndex(h => h.includes('nome') || h.includes('mvp'))
    const iMap     = headers.findIndex(h => h.includes('mapa') || h.includes('map'))
    const iRespawn = headers.findIndex(h => h.includes('respawn') || h.includes('tempo'))
    const iPoints  = headers.findIndex(h => h.includes('ponto') || h.includes('point'))

    if (iName < 0 || iPoints < 0) continue

    for (const cells of rows.slice(1)) {
      const name     = cells[iName]    ?? ''
      const mapRaw   = iMap >= 0     ? (cells[iMap]     ?? '') : ''
      const respRaw  = iRespawn >= 0 ? (cells[iRespawn] ?? '') : ''
      const pointRaw = cells[iPoints] ?? ''
      const points   = parseInt(pointRaw.replace(/[^0-9]/g, ''), 10)
      if (!name || isNaN(points)) continue
      const { min, max } = parseRespawn(respRaw)
      mvps.push({
        name,
        map:        mapRaw.toLowerCase().replace(/\s+/g, '_') || 'unknown',
        minRespawn: min,
        maxRespawn: max,
        mvpPoints:  points,
      })
    }
  }

  return mvps
}

export default async function handler(_req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=300')

  try {
    const response = await fetch(WIKI_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'pt-BR,pt;q=0.9',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return res.status(502).json({ error: `Wiki respondeu ${response.status}` })
    }

    const html = await response.text()
    const mvps = parseTables(html)

    return res.status(200).json({
      url:      WIKI_URL,
      count:    mvps.length,
      mvps,
      _fetched: new Date().toISOString(),
    })
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : String(err) })
  }
}
