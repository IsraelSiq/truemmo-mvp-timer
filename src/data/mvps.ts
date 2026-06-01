import type { MVP } from '@/types'

// Respawn times based on classic Ragnarok Online database (iRO Wiki Classic / gandi.wushuang.ws)
// Format: minRespawn~maxRespawn in minutes. The +10min variance is the standard RO server drift.
export const MVP_LIST: MVP[] = [
  // ── 60~70 min ──────────────────────────────────────────────────────────────
  { id: 1,  name: 'Orc Hero',          map: 'gef_fild14',  minRespawn: 60,  maxRespawn: 70,  priority: 7,  notes: 'Spawn rápido, bom para rotação. Evitar gef_fild02 (24h).' },
  { id: 2,  name: 'Moonlight Flower',  map: 'pay_dun04',   minRespawn: 60,  maxRespawn: 70,  priority: 8,  notes: 'Janela curta — atenção redobrada. Drop de Moonlight Flower Card.' },
  { id: 3,  name: 'Osiris',            map: 'moc_pryd04',  minRespawn: 60,  maxRespawn: 70,  priority: 7,  notes: 'Respawn rápido, bom para manter atividade contínua.' },
  { id: 4,  name: 'Golden Thief Bug',  map: 'prt_sewb4',   minRespawn: 60,  maxRespawn: 70,  priority: 9,  notes: 'Alta disputa. Drop de GTB Card — um dos mais valiosos do jogo.' },
  { id: 5,  name: 'Stormy Knight',     map: 'xmas_dun02',  minRespawn: 60,  maxRespawn: 70,  priority: 6,  notes: 'Bom para equip. de gelo/raio. Acesso pelo Toy Factory 2.' },
  { id: 6,  name: 'Turtle General',    map: 'tur_dun04',   minRespawn: 60,  maxRespawn: 70,  priority: 8,  notes: 'Drop de equips relevantes. Acesso pelo Island Dungeon.' },
  { id: 7,  name: 'Dark Lord',         map: 'gl_chyard',   minRespawn: 60,  maxRespawn: 70,  priority: 8,  notes: 'Glast Heim Churchyard. Drop de Dark Lord Card.' },
  { id: 8,  name: 'Dracula',           map: 'gef_dun02',   minRespawn: 60,  maxRespawn: 70,  priority: 7,  notes: 'Geffen Dungeon 2. Drop de Dracula Card.' },
  { id: 9,  name: 'Pharaoh',           map: 'in_sphinx5',  minRespawn: 60,  maxRespawn: 70,  priority: 6,  notes: 'Sphinx F5. Drop de Pharaoh Card — SP regen.' },
  { id: 10, name: 'Amon Ra',           map: 'moc_pryd06',  minRespawn: 60,  maxRespawn: 70,  priority: 7,  notes: 'Pyramid B2F. Drop de Amon Ra Card.' },

  // ── 95~105 min ─────────────────────────────────────────────────────────────
  { id: 11, name: 'Evil Snake Lord',   map: 'gon_dun03',   minRespawn: 95,  maxRespawn: 105, priority: 6,  notes: 'Gonryun Dungeon 3. Drop de Evil Snake Lord Card.' },

  // ── 120~130 min ────────────────────────────────────────────────────────────
  { id: 12, name: 'Baphomet',          map: 'prt_maze03',  minRespawn: 120, maxRespawn: 130, priority: 10, notes: 'Alta prioridade — vale mobilizar o grupo. Drop de Baphomet Card.' },
  { id: 13, name: 'Eddga',             map: 'pay_fild11',  minRespawn: 120, maxRespawn: 130, priority: 8,  notes: 'Drop de Eddga Card. Bom para rotação se o grupo estiver próximo.' },
  { id: 14, name: 'Drake',             map: 'treasure01',  minRespawn: 120, maxRespawn: 130, priority: 8,  notes: 'Acesso organizado pelo treasure map. Drop valioso.' },
  { id: 15, name: 'Phreeoni',          map: 'moc_fild17',  minRespawn: 120, maxRespawn: 130, priority: 6,  notes: 'Drop de Phreeoni Card (+HIT). Boa opção de rotação secundária.' },
  { id: 16, name: 'Mistress',          map: 'mjolnir_04',  minRespawn: 120, maxRespawn: 130, priority: 8,  notes: 'Drop de Mistress Card — imune a SP drain. Alvo relevante.' },
  { id: 17, name: 'Doppelganger',      map: 'gef_dun02',   minRespawn: 120, maxRespawn: 130, priority: 7,  notes: 'Drop de Dopple Card (+ASPD). Boa cobertura de rota secundária.' },
  { id: 18, name: 'Maya',             map: 'anthell02',   minRespawn: 120, maxRespawn: 130, priority: 7,  notes: 'Ant Hell 2. Drop de Maya Card — reflect magic.' },
  { id: 19, name: 'Orc Lord',          map: 'gef_fild10',  minRespawn: 120, maxRespawn: 130, priority: 7,  notes: 'Geffen Field 10. Drop de Orc Lord Card.' },
  { id: 20, name: 'Fallen Bishop',     map: 'abbey03',     minRespawn: 120, maxRespawn: 130, priority: 9,  notes: 'Cursed Abbey 3. Drop de Fallen Bishop Card — altíssimo valor.' },

  // ── 123~133 min ────────────────────────────────────────────────────────────
  { id: 21, name: 'Tao Gunka',         map: 'beach_dun',   minRespawn: 123, maxRespawn: 133, priority: 10, notes: 'Alvo premium — vale coordenação prévia. Drop de Tao Gunka Card.' },

  // ── 133 min (fixo +10 drift) ───────────────────────────────────────────────
  { id: 22, name: 'Lord of Death',     map: 'niflheim',    minRespawn: 133, maxRespawn: 143, priority: 9,  notes: 'Niflheim. Janela média, drop excelente. Lord of Death Card.' },

  // ── 180~190 min ────────────────────────────────────────────────────────────
  { id: 23, name: 'Detardeurus',       map: 'abyss_03',    minRespawn: 180, maxRespawn: 190, priority: 8,  notes: 'Abyss Lake 3. Drop de Detardeurus Card — anti-cast.' },

  // ── 240~250 min ────────────────────────────────────────────────────────────
  { id: 24, name: 'Atroce',            map: 'ra_fild02',   minRespawn: 240, maxRespawn: 250, priority: 9,  notes: 'Rachel Field 02. Outros spawns: ra_fild03 (180m), ra_fild04/ve_fild (300m).' },
]
