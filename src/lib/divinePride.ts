// Cliente Divine Pride — chama nosso proxy /api/divine-pride

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
  size:         number
  race:         number
  drops:        DPDrop[]
  mvpDrops:     DPDrop[]
  imageUrl:     string | null
}

// ── Normaliza resposta crua da API ───────────────────────────
// A Divine Pride retorna drops como objeto indexado { "0":{...}, "1":{...} }
// e usa nomes de campo diferentes (hp, mvpexp, etc.)

function toArray<T>(val: T[] | Record<string, T> | null | undefined): T[] {
  if (!val) return []
  if (Array.isArray(val)) return val
  return Object.values(val)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(raw: any): DPMonster {
  return {
    id:           raw.id           ?? raw.Id           ?? 0,
    name:         raw.name         ?? raw.Name         ?? '',
    level:        raw.level        ?? raw.Level        ?? 0,
    health:       raw.health       ?? raw.hp           ?? raw.Hp ?? 0,
    baseExp:      raw.baseExp      ?? raw.base_exp     ?? 0,
    jobExp:       raw.jobExp       ?? raw.job_exp      ?? 0,
    mvpExp:       raw.mvpExp       ?? raw.mvp_exp      ?? raw.mvpexp ?? 0,
    attack:       raw.attack       ?? raw.atk          ?? 0,
    attack2:      raw.attack2      ?? raw.atk2         ?? 0,
    defense:      raw.defense      ?? raw.def          ?? 0,
    magicDefense: raw.magicDefense ?? raw.mdef         ?? 0,
    str:          raw.str          ?? raw.Str          ?? 0,
    agi:          raw.agi          ?? raw.Agi          ?? 0,
    vit:          raw.vit          ?? raw.Vit          ?? 0,
    int:          raw.int          ?? raw.Int          ?? 0,
    dex:          raw.dex          ?? raw.Dex          ?? 0,
    luk:          raw.luk          ?? raw.Luk          ?? 0,
    element:      raw.element      ?? raw.Element      ?? 0,
    size:         raw.size         ?? raw.Size         ?? 0,
    race:         raw.race         ?? raw.Race         ?? 0,
    imageUrl:     raw.imageUrl     ?? raw.image        ?? null,
    drops:    toArray(raw.drops    ?? raw.Drops   ).filter((d: DPDrop) => d?.item),
    mvpDrops: toArray(raw.mvpDrops ?? raw.mvpdrops ?? raw.MvpDrops).filter((d: DPDrop) => d?.item),
  }
}

// ── Cache em memória ─────────────────────────────────────────

const cache = new Map<number, DPMonster>()

export async function fetchMonster(mobId: number): Promise<DPMonster | null> {
  if (cache.has(mobId)) return cache.get(mobId)!

  try {
    const res = await fetch(`/api/divine-pride?mobId=${mobId}`)
    if (!res.ok) return null
    const raw = await res.json()
    const data = normalize(raw)
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
