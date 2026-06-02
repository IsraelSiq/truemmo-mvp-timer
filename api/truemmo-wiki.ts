// Vercel Serverless Function — busca e parseia alterações de habilidades da wiki TrueMmo
// Acessa wiki.truemmo.com.br via servidor (sem CORS) e retorna JSON limpo por classe
import type { VercelRequest, VercelResponse } from '@vercel/node'

const WIKI_API = 'https://wiki.truemmo.com.br/api.php'
const PAGE_TITLE = 'Alterações_RagnaTrue'

export interface SkillChange {
  skill: string
  iconId: string | null
  changes: string[]
}

export interface ClassSkillChanges {
  className: string
  skills: SkillChange[]
}

// Extrai o id do ícone do wikitext: [[Arquivo:S5330.png|...]] → "5330"
function extractIconId(wikitextCell: string): string | null {
  const match = wikitextCell.match(/\[\[Arquivo:S(\d+)\.png/)
  return match ? match[1] : null
}

// Extrai o nome da skill do wikitext, removendo markup
function extractSkillName(wikitextCell: string): string {
  return wikitextCell
    .replace(/\[\[Arquivo:[^\]]+\]\]\s*/g, '')  // remove [[Arquivo:...]]
    .replace(/\{\{[^}]+\}\}/g, '')               // remove {{templates}}
    .replace(/<[^>]+>/g, '')                      // remove tags HTML
    .replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g, '$1') // [[link|texto]] → texto
    .replace(/\[\[([^\]]+)\]\]/g, '$1')           // [[link]] → link
    .trim()
}

// Extrai as alterações do wikitext, convertendo markup em texto legível
function extractChanges(wikitextCell: string): string[] {
  const cleaned = wikitextCell
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<s>([^<]*)<\/s>/gi, '[$1]')        // <s>texto</s> → [texto] (valor antigo)
    .replace(/<b>([^<]*)<\/b>/gi, '$1')           // remove bold
    .replace(/<[^>]+>/g, '')                       // remove demais tags
    .replace(/'''([^']+)'''/g, '$1')              // remove '''bold''' do wikitext
    .trim()

  return cleaned
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
}

// Parseia o wikitext e extrai todas as classes + skills
function parseSkillsWikitext(wikitext: string): ClassSkillChanges[] {
  const result: ClassSkillChanges[] = []

  // Encontra cada bloco de classe pelo padrão data-badge="NomeDaClasse"
  const classBlockRegex = /data-badge="([^"]+)"[\s\S]*?mw-collapsible-content\s*>([\s\S]*?)(?=<div[^>]*data-badge=|$)/g
  let classMatch: RegExpExecArray | null

  while ((classMatch = classBlockRegex.exec(wikitext)) !== null) {
    const className = classMatch[1].trim()
    const classContent = classMatch[2]

    // Extrai tabela wikitable dentro do bloco
    const tableMatch = classContent.match(/\{\|[\s\S]*?\|\}/)
    if (!tableMatch) continue

    const tableWikitext = tableMatch[0]
    const skills: SkillChange[] = []

    // Divide em linhas de tabela (começam com |- )
    const rows = tableWikitext.split(/^\s*\|-/m).slice(1) // remove cabeçalho

    for (const row of rows) {
      // Extrai células: linhas que começam com "| " (não "! " que são headers)
      const cellLines = row.split('\n').filter(l => /^\s*\|[^!|]/.test(l))
      if (cellLines.length < 2) continue

      const skillCell = cellLines[0].replace(/^\s*\|\s*[^|]*\|\s*/, '').trim()
      const changeCell = cellLines[1].replace(/^\s*\|\s*[^|]*\|\s*/, '').trim()

      const skillName = extractSkillName(skillCell)
      if (!skillName) continue

      skills.push({
        skill: skillName,
        iconId: extractIconId(skillCell),
        changes: extractChanges(changeCell),
      })
    }

    if (skills.length > 0) {
      result.push({ className, skills })
    }
  }

  return result
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const url = new URL(WIKI_API)
    url.searchParams.set('action', 'parse')
    url.searchParams.set('page', PAGE_TITLE)
    url.searchParams.set('prop', 'wikitext')
    url.searchParams.set('format', 'json')
    url.searchParams.set('formatversion', '2')

    const upstream = await fetch(url.toString(), {
      headers: { Accept: 'application/json', 'User-Agent': 'TrueMmoApp/1.0' },
    })

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: `Wiki retornou ${upstream.status}` })
    }

    const json = await upstream.json()

    if (json.error) {
      return res.status(404).json({ error: `Wiki error: ${json.error.info}` })
    }

    const wikitext: string = json.parse?.wikitext ?? ''
    if (!wikitext) {
      return res.status(500).json({ error: 'Wikitext vazio ou estrutura inesperada' })
    }

    const skillChanges = parseSkillsWikitext(wikitext)

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=600')
    res.setHeader('Access-Control-Allow-Origin', '*')
    return res.status(200).json({
      updatedAt: new Date().toISOString(),
      classes: skillChanges,
    })
  } catch (err) {
    console.error('[truemmo-wiki] Erro:', err)
    return res.status(502).json({ error: 'Erro ao contatar a wiki TrueMmo' })
  }
}
