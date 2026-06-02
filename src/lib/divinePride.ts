// Cliente Divine Pride — chama nosso proxy /api/divine-pride
// A chave fica no servidor, sem exposição no bundle do browser.

// ── Tipos ───────────────────────────────────────────────────

export interface DPDrop {
  itemId: number
  chance: number   // 0–10000  (10000 = 100%)
  item: {
    id:       number
    name:     string
    imageUrl: string | null
    slots:    number
    type:     number
    subType:  number
  }
}

export interface DPMonster {
  id:           number
  name:         string
  level:        number
  health:       number
  baseExp:      number
  jobExp:       number
  mvpExp:       number
  attack:       number
  attack2:      number
  defense:      number
  magicDefense: number
  str: number; agi: number; vit: number
  int: number; dex: number; luk: number
  element:      number
  size:         number   // 0=small 1=medium 2=large
  race:         number
  drops:        DPDrop[]
  mvpDrops:     DPDrop[]
  imageUrl:     string | null
}

// ── Cache em memória (evita re-fetch na sessão) ────────────────

const cache = new Map<number, DPMonster>()

export async function fetchMonster(mobId: number): Promise<DPMonster | null> {
  if (cache.has(mobId)) return cache.get(mobId)!

  try {
    const res = await fetch(`/api/divine-pride?mobId=${mobId}`)
    if (!res.ok) return null
    const data: DPMonster = await res.json()
    cache.set(mobId, data)
    return data
  } catch {
    return null
  }
}

// ── Helpers de exibição ─────────────────────────────────────

export function formatDropChance(chance: number): string {
  const pct = chance / 100
  if (pct >= 100) return '100%'
  if (pct >= 1)   return `${pct.toFixed(2)}%`
  return `${pct.toFixed(4)}%`
}

const ELEMENT_NAMES: Record<number, string> = {
  0: 'Neutro', 1: 'Agua', 2: 'Terra', 3: 'Fogo', 4: 'Vento',
  5: 'Veneno', 6: 'Sagrado', 7: 'Sombra', 8: 'Fantasma', 9: 'Morto-vivo',
}
const RACE_NAMES: Record<number, string> = {
  0: 'Formless', 1: 'Morto-vivo', 2: 'Animal', 3: 'Planta',
  4: 'Inseto', 5: 'Peixe', 6: 'Demônio', 7: 'Humano', 8: 'Anjo', 9: 'Dragão',
}
const SIZE_NAMES: Record<number, string> = { 0: 'Pequeno', 1: 'Médio', 2: 'Grande' }

export function getElementName(e: number): string { return ELEMENT_NAMES[e % 10] ?? String(e) }
export function getRaceName(r: number):    string { return RACE_NAMES[r]           ?? String(r) }
export function getSizeName(s: number):    string { return SIZE_NAMES[s]            ?? String(s) }
