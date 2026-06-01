import type { MVP } from '@/types'

// Respawn times based on classic Ragnarok Online database
// Format: minRespawn~maxRespawn in minutes.
export const MVP_LIST: MVP[] = [
  // ── 60~70 min ──────────────────────────────────────────────────────────────────────
  { id: 1,  mobId: 1087, name: 'Orc Hero',          map: 'gef_fild14',  minRespawn: 60,  maxRespawn: 70,  priority: 7,  notes: 'Spawn rápido, bom para rotação.' },
  { id: 2,  mobId: 1150, name: 'Moonlight Flower',  map: 'pay_dun04',   minRespawn: 60,  maxRespawn: 70,  priority: 8,  notes: 'Janela curta — atenção redobrada.' },
  { id: 3,  mobId: 1038, name: 'Osiris',            map: 'moc_pryd04',  minRespawn: 60,  maxRespawn: 70,  priority: 7,  notes: 'Respawn rápido, bom para manter atividade contínua.' },
  { id: 4,  mobId: 1086, name: 'Golden Thief Bug',  map: 'prt_sewb4',   minRespawn: 60,  maxRespawn: 70,  priority: 9,  notes: 'Alta disputa. Drop de GTB Card — um dos mais valiosos.' },
  { id: 5,  mobId: 1251, name: 'Stormy Knight',     map: 'xmas_dun02',  minRespawn: 60,  maxRespawn: 70,  priority: 6,  notes: 'Bom para equip. de gelo/raio.' },
  { id: 6,  mobId: 1312, name: 'Turtle General',    map: 'tur_dun04',   minRespawn: 60,  maxRespawn: 70,  priority: 8,  notes: 'Drop de equips relevantes.' },
  { id: 7,  mobId: 1272, name: 'Dark Lord',         map: 'gl_chyard',   minRespawn: 60,  maxRespawn: 70,  priority: 8,  notes: 'Glast Heim Churchyard. Drop de Dark Lord Card.' },
  { id: 8,  mobId: 1389, name: 'Dracula',           map: 'gef_dun02',   minRespawn: 60,  maxRespawn: 70,  priority: 7,  notes: 'Geffen Dungeon 2. Drop de Dracula Card.' },
  { id: 9,  mobId: 1157, name: 'Pharaoh',           map: 'in_sphinx5',  minRespawn: 60,  maxRespawn: 70,  priority: 6,  notes: 'Sphinx F5. Drop de Pharaoh Card — SP regen.' },
  { id: 10, mobId: 1511, name: 'Amon Ra',           map: 'moc_pryd06',  minRespawn: 60,  maxRespawn: 70,  priority: 7,  notes: 'Pyramid B2F. Drop de Amon Ra Card.' },

  // ── 95~105 min ─────────────────────────────────────────────────────────────────
  { id: 11, mobId: 1419, name: 'Evil Snake Lord',   map: 'gon_dun03',   minRespawn: 95,  maxRespawn: 105, priority: 6,  notes: 'Gonryun Dungeon 3. Drop de Evil Snake Lord Card.' },

  // ── 120~130 min ──────────────────────────────────────────────────────────────
  { id: 12, mobId: 1039, name: 'Baphomet',          map: 'prt_maze03',  minRespawn: 120, maxRespawn: 130, priority: 10, notes: 'Alta prioridade — vale mobilizar o grupo.' },
  { id: 13, mobId: 1115, name: 'Eddga',             map: 'pay_fild11',  minRespawn: 120, maxRespawn: 130, priority: 8,  notes: 'Drop de Eddga Card.' },
  { id: 14, mobId: 1112, name: 'Drake',             map: 'treasure01',  minRespawn: 120, maxRespawn: 130, priority: 8,  notes: 'Acesso pelo treasure map. Drop valioso.' },
  { id: 15, mobId: 1158, name: 'Phreeoni',          map: 'moc_fild17',  minRespawn: 120, maxRespawn: 130, priority: 6,  notes: 'Drop de Phreeoni Card (+HIT).' },
  { id: 16, mobId: 1059, name: 'Mistress',          map: 'mjolnir_04',  minRespawn: 120, maxRespawn: 130, priority: 8,  notes: 'Drop de Mistress Card — imune a SP drain.' },
  { id: 17, mobId: 1046, name: 'Doppelganger',      map: 'gef_dun02',   minRespawn: 120, maxRespawn: 130, priority: 7,  notes: 'Drop de Dopple Card (+ASPD).' },
  { id: 18, mobId: 1147, name: 'Maya',              map: 'anthell02',   minRespawn: 120, maxRespawn: 130, priority: 7,  notes: 'Ant Hell 2. Drop de Maya Card — reflect magic.' },
  { id: 19, mobId: 1190, name: 'Orc Lord',          map: 'gef_fild10',  minRespawn: 120, maxRespawn: 130, priority: 7,  notes: 'Geffen Field 10. Drop de Orc Lord Card.' },
  { id: 20, mobId: 1871, name: 'Fallen Bishop',     map: 'abbey03',     minRespawn: 120, maxRespawn: 130, priority: 9,  notes: 'Cursed Abbey 3. Drop de Fallen Bishop Card — altíssimo valor.' },

  // ── 123~133 min ──────────────────────────────────────────────────────────────
  { id: 21, mobId: 1583, name: 'Tao Gunka',         map: 'beach_dun',   minRespawn: 123, maxRespawn: 133, priority: 10, notes: 'Alvo premium — vale coordenação prévia.' },

  // ── 133~143 min ──────────────────────────────────────────────────────────────
  { id: 22, mobId: 1373, name: 'Lord of Death',     map: 'niflheim',    minRespawn: 133, maxRespawn: 143, priority: 9,  notes: 'Niflheim. Drop de Lord of Death Card.' },

  // ── 180~190 min ──────────────────────────────────────────────────────────────
  { id: 23, mobId: 1719, name: 'Detardeurus',       map: 'abyss_03',    minRespawn: 180, maxRespawn: 190, priority: 8,  notes: 'Abyss Lake 3. Drop de Detardeurus Card.' },

  // ── 240~250 min ──────────────────────────────────────────────────────────────
  { id: 24, mobId: 1785, name: 'Atroce',            map: 'ra_fild02',   minRespawn: 240, maxRespawn: 250, priority: 9,  notes: 'Rachel Field. Outros spawns: ra_fild03/04, ve_fild.' },
]
