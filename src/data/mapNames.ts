/**
 * Caminho de teleporte no estilo warp do RO.
 * Formato: "Cidade > Região > Andar" ou "Cidade > Campo/Dungeon N"
 */
export const MAP_NAMES: Record<string, string> = {
  // ── Fields ──────────────────────────────────────────────────────────
  gef_fild14:  'Geffen > Campos de Geffen > Campo 14',
  gef_fild10:  'Geffen > Campos de Geffen > Campo 10',
  gef_fild02:  'Geffen > Campos de Geffen > Campo 02',
  pay_fild11:  'Payon > Campos de Payon > Campo 11',
  moc_fild17:  'Morroc > Campos de Morroc > Campo 17',
  mjolnir_04:  'Geffen > Mjolnir Dead Pit > Campo 04',
  ra_fild02:   'Rachel > Campos de Rachel > Campo 02',
  ra_fild03:   'Rachel > Campos de Rachel > Campo 03',
  ra_fild04:   'Rachel > Campos de Rachel > Campo 04',
  ve_fild:     'Veins > Campos de Veins',
  xmas_fild01: 'Lutie > Campos de Lutie > Campo 01',
  beach_dun:   'Alberta > Ilha Tartaruga > Praia',

  // ── Prontera ────────────────────────────────────────────────────────
  prt_maze03:  'Prontera > Culvert > Andar 3',
  prt_sewb4:   'Prontera > Esgoto > Andar 4',

  // ── Payon ───────────────────────────────────────────────────────────
  pay_dun04:   'Payon > Caverna de Payon > Andar 4',

  // ── Morroc ──────────────────────────────────────────────────────────
  moc_pryd04:  'Morroc > Pirâmide > Andar B1',
  moc_pryd06:  'Morroc > Pirâmide > Andar B2',

  // ── Geffen ──────────────────────────────────────────────────────────
  gef_dun02:   'Geffen > Torre de Geffen > Andar 2',

  // ── Alberta ─────────────────────────────────────────────────────────
  treasure01:  'Alberta > Navio Naufragado > Porão 1',

  // ── Lutie ───────────────────────────────────────────────────────────
  xmas_dun02:  'Lutie > Fábrica de Brinquedos > Andar 2',

  // ── Alberta / Turtle Island ─────────────────────────────────────────
  tur_dun04:   'Alberta > Ilha Tartaruga > Dungeon Andar 4',

  // ── Glast Heim ──────────────────────────────────────────────────────
  gl_chyard:   'Glast Heim > Cemitério da Igreja',

  // ── Morroc / Sphinx ─────────────────────────────────────────────────
  in_sphinx5:  'Morroc > Esfinge > Andar 5',

  // ── Moroc / Ant Hell ────────────────────────────────────────────────
  anthell02:   'Morroc > Formigueiro > Andar 2',

  // ── Niflheim ────────────────────────────────────────────────────────
  niflheim:    'Niflheim > Cidade dos Mortos',

  // ── Einbroch / Abbey ────────────────────────────────────────────────
  abbey03:     'Rael > Abadia Maldita > Andar 3',

  // ── Abyss Lake ──────────────────────────────────────────────────────
  abyss_03:    'Hugel > Lago Abyss > Andar 3',

  // ── Gonryun ─────────────────────────────────────────────────────────
  gon_dun03:   'Gonryun > Dungeon de Gonryun > Andar 3',

  // ── Louyang ─────────────────────────────────────────────────────────
  lou_dun03:   'Louyang > Dungeon de Louyang > Andar 3',

  // ── Amatsu ──────────────────────────────────────────────────────────
  ama_dun03:   'Amatsu > Dungeon de Amatsu > Andar 3',

  // ── Kiel Hyre ───────────────────────────────────────────────────────
  kh_dun02:    'Aldebaran > Laboratório Kiel Hyre > Andar 2',

  // ── Juperos ─────────────────────────────────────────────────────────
  jupe_core:   'Yuno > Juperos > Núcleo',

  // ── Ice Dungeon ─────────────────────────────────────────────────────
  ice_dun03:   'Lutie > Dungeon de Gelo > Andar 3',

  // ── Thanatos Tower ──────────────────────────────────────────────────
  tha_t10:     'Yuno > Torre de Thanatos > Andar 10',

  // ── Rachel Sanctuary ────────────────────────────────────────────────
  ra_san05:    'Rachel > Santuário de Freya > Andar 5',

  // ── Bio Labs ────────────────────────────────────────────────────────
  lhz_dun02:   'Lighthalzen > Bio Laboratório > Andar 2',

  // ── Einbroch Dungeon ────────────────────────────────────────────────
  ein_dun02:   'Einbroch > Mina de Einbroch > Andar 2',

  // ── Christmas / Xmas ────────────────────────────────────────────────
  // xmas_fild01 já listado acima

  // ── Ayothaya ────────────────────────────────────────────────────────
  ayo_dun02:   'Ayothaya > Templo de Ayothaya > Andar 2',

  // ── Odin Temple ─────────────────────────────────────────────────────
  odin_tem03:  'Hugel > Templo de Odin > Andar 3',

  // ── Thor Volcano ────────────────────────────────────────────────────
  thor_v03:    'Juno > Vulcão de Thor > Andar 3',
}

export function getMapName(mapId: string): string {
  return MAP_NAMES[mapId] ?? mapId
}
