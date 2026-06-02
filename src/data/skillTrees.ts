// Estrutura estática das árvores de skill por classe
// jobId = ID do job na Divine Pride API

export type Tier = '1st' | '2nd' | 'trans' | '3rd' | '4th'

export interface SkillDep {
  skillId: number
  minLevel: number
}

export interface SkillEntry {
  skillId: number
  maxLevel: number
  tier: Tier
  deps: SkillDep[]
}

export interface ClassNode {
  jobId: number
  name: string
  tier: Tier
  parent?: number // jobId do parent
}

export interface JobTree {
  /** Classe 4th (folha da árvore) */
  label: string
  /** Cadeia completa jobId 1st → 2nd → trans → 3rd → 4th */
  chain: ClassNode[]
  /** Pontos máximos por tier */
  maxPoints: Record<Tier, number>
  /** Skills da árvore (preenchidas em runtime pelo endpoint) */
  skills?: SkillEntry[]
}

// Pontos de skill por tier (padrão iRO/kRO)
const STD_POINTS: Record<Tier, number> = {
  '1st':   49,
  '2nd':   70,
  'trans':  7,
  '3rd':   70,
  '4th':   70,
}

export const JOB_TREES: JobTree[] = [
  // ── Swordsman line ──────────────────────────────────────────────
  {
    label: 'Arch Mage',
    chain: [
      { jobId: 1,  name: 'Swordsman',    tier: '1st'   },
      { jobId: 7,  name: 'Knight',       tier: '2nd'   },
      { jobId: 14, name: 'Lord Knight',  tier: 'trans' },
      { jobId: 20, name: 'Rune Knight',  tier: '3rd'   },
      { jobId: 4054, name: 'Dragon Knight', tier: '4th' },
    ],
    maxPoints: STD_POINTS,
  },
  {
    label: 'Imperial Guard',
    chain: [
      { jobId: 1,  name: 'Swordsman',    tier: '1st'   },
      { jobId: 14, name: 'Crusader',     tier: '2nd'   },
      { jobId: 21, name: 'Paladin',      tier: 'trans' },
      { jobId: 27, name: 'Royal Guard',  tier: '3rd'   },
      { jobId: 4055, name: 'Imperial Guard', tier: '4th' },
    ],
    maxPoints: STD_POINTS,
  },
  // ── Mage line ───────────────────────────────────────────────────
  {
    label: 'Arch Mage (Wizard)',
    chain: [
      { jobId: 2,  name: 'Mage',         tier: '1st'   },
      { jobId: 8,  name: 'Wizard',       tier: '2nd'   },
      { jobId: 15, name: 'High Wizard',  tier: 'trans' },
      { jobId: 22, name: 'Warlock',      tier: '3rd'   },
      { jobId: 4056, name: 'Arch Mage',  tier: '4th'   },
    ],
    maxPoints: STD_POINTS,
  },
  {
    label: 'Elemental Master',
    chain: [
      { jobId: 2,  name: 'Mage',           tier: '1st'   },
      { jobId: 9,  name: 'Sage',           tier: '2nd'   },
      { jobId: 16, name: 'Professor',      tier: 'trans' },
      { jobId: 23, name: 'Sorcerer',       tier: '3rd'   },
      { jobId: 4057, name: 'Elemental Master', tier: '4th' },
    ],
    maxPoints: STD_POINTS,
  },
  // ── Archer line ─────────────────────────────────────────────────
  {
    label: 'Windhawk',
    chain: [
      { jobId: 3,  name: 'Archer',         tier: '1st'   },
      { jobId: 10, name: 'Hunter',         tier: '2nd'   },
      { jobId: 17, name: 'Sniper',         tier: 'trans' },
      { jobId: 24, name: 'Ranger',         tier: '3rd'   },
      { jobId: 4058, name: 'Windhawk',     tier: '4th'   },
    ],
    maxPoints: STD_POINTS,
  },
  {
    label: 'Troubadour / Trouvere',
    chain: [
      { jobId: 3,  name: 'Archer',            tier: '1st'   },
      { jobId: 19, name: 'Bard / Dancer',     tier: '2nd'   },
      { jobId: 26, name: 'Clown / Gypsy',    tier: 'trans' },
      { jobId: 30, name: 'Minstrel / Wanderer', tier: '3rd' },
      { jobId: 4066, name: 'Troubadour / Trouvere', tier: '4th' },
    ],
    maxPoints: STD_POINTS,
  },
  // ── Merchant line ───────────────────────────────────────────────
  {
    label: 'Meister',
    chain: [
      { jobId: 4,  name: 'Merchant',       tier: '1st'   },
      { jobId: 11, name: 'Blacksmith',     tier: '2nd'   },
      { jobId: 18, name: 'Whitesmith',     tier: 'trans' },
      { jobId: 25, name: 'Mechanic',       tier: '3rd'   },
      { jobId: 4059, name: 'Meister',      tier: '4th'   },
    ],
    maxPoints: STD_POINTS,
  },
  {
    label: 'Cardinal',
    chain: [
      { jobId: 4,  name: 'Merchant',       tier: '1st'   },
      { jobId: 18, name: 'Alchemist',      tier: '2nd'   },
      { jobId: 24, name: 'Creator',        tier: 'trans' },
      { jobId: 29, name: 'Genetic',        tier: '3rd'   },
      { jobId: 4065, name: 'Biolo',        tier: '4th'   },
    ],
    maxPoints: STD_POINTS,
  },
  // ── Thief line ──────────────────────────────────────────────────
  {
    label: 'Reaper',
    chain: [
      { jobId: 5,  name: 'Thief',          tier: '1st'   },
      { jobId: 12, name: 'Assassin',       tier: '2nd'   },
      { jobId: 19, name: 'Assassin Cross', tier: 'trans' },
      { jobId: 26, name: 'Guillotine Cross', tier: '3rd' },
      { jobId: 4060, name: 'Reaper',       tier: '4th'   },
    ],
    maxPoints: STD_POINTS,
  },
  {
    label: 'Shadow Cross',
    chain: [
      { jobId: 5,  name: 'Thief',          tier: '1st'   },
      { jobId: 13, name: 'Rogue',          tier: '2nd'   },
      { jobId: 20, name: 'Stalker',        tier: 'trans' },
      { jobId: 27, name: 'Shadow Chaser',  tier: '3rd'   },
      { jobId: 4061, name: 'Shadow Cross', tier: '4th'   },
    ],
    maxPoints: STD_POINTS,
  },
  // ── Acolyte line ────────────────────────────────────────────────
  {
    label: 'Cardinal',
    chain: [
      { jobId: 6,  name: 'Acolyte',        tier: '1st'   },
      { jobId: 15, name: 'Priest',         tier: '2nd'   },
      { jobId: 22, name: 'High Priest',    tier: 'trans' },
      { jobId: 28, name: 'Archbishop',     tier: '3rd'   },
      { jobId: 4062, name: 'Cardinal',     tier: '4th'   },
    ],
    maxPoints: STD_POINTS,
  },
  {
    label: 'Inquisitor',
    chain: [
      { jobId: 6,  name: 'Acolyte',        tier: '1st'   },
      { jobId: 16, name: 'Monk',           tier: '2nd'   },
      { jobId: 23, name: 'Champion',       tier: 'trans' },
      { jobId: 29, name: 'Sura',           tier: '3rd'   },
      { jobId: 4063, name: 'Inquisitor',   tier: '4th'   },
    ],
    maxPoints: STD_POINTS,
  },
  // ── Ninja / Taekwon lines ────────────────────────────────────────
  {
    label: 'Kunai Kadachi',
    chain: [
      { jobId: 23, name: 'Ninja',          tier: '1st'   },
      { jobId: 43, name: 'Kagerou / Oboro', tier: '2nd'  },
      { jobId: 4064, name: 'Kunai Kadachi', tier: '4th'  },
    ],
    maxPoints: { '1st': 49, '2nd': 70, 'trans': 0, '3rd': 0, '4th': 70 },
  },
  {
    label: 'Sky Emperor',
    chain: [
      { jobId: 24, name: 'Taekwon',        tier: '1st'   },
      { jobId: 25, name: 'Star Gladiator', tier: '2nd'   },
      { jobId: 4067, name: 'Sky Emperor',  tier: '4th'   },
    ],
    maxPoints: { '1st': 49, '2nd': 70, 'trans': 0, '3rd': 0, '4th': 70 },
  },
  {
    label: 'Soul Reaper',
    chain: [
      { jobId: 24, name: 'Taekwon',        tier: '1st'   },
      { jobId: 26, name: 'Soul Linker',    tier: '2nd'   },
      { jobId: 4068, name: 'Soul Reaper',  tier: '4th'   },
    ],
    maxPoints: { '1st': 49, '2nd': 70, 'trans': 0, '3rd': 0, '4th': 70 },
  },
]
