/** Maps internal RO map IDs to human-readable names. */
export const MAP_NAMES: Record<string, string> = {
  // Fields
  gef_fild14: 'Geffen Field 14',
  gef_fild10: 'Geffen Field 10',
  gef_fild02: 'Geffen Field 02',
  pay_fild11: 'Payon Field 11',
  moc_fild17: 'Morroc Field 17',
  mjolnir_04: 'Mjolnir Dead Pit 04',
  ra_fild02:  'Rachel Field 02',
  ra_fild03:  'Rachel Field 03',
  ra_fild04:  'Rachel Field 04',
  ve_fild:    'Veins Field',

  // Dungeons
  prt_maze03: 'Prontera Culvert F3',
  pay_dun04:  'Payon Dungeon F4',
  moc_pryd04: 'Pyramid B1F',
  moc_pryd06: 'Pyramid B2F',
  prt_sewb4:  'Prontera Sewer F4',
  gef_dun02:  'Geffen Dungeon F2',
  treasure01: 'Sunken Ship F1',
  xmas_dun02: 'Toy Factory F2',
  tur_dun04:  'Turtle Island Dungeon F4',
  gl_chyard:  'Glast Heim Churchyard',
  in_sphinx5: 'Sphinx Dungeon F5',
  anthell02:  'Ant Hell F2',
  beach_dun:  'Beach Dungeon',
  niflheim:   'Niflheim',
  abbey03:    'Cursed Abbey F3',
  abyss_03:   'Abyss Lake F3',
  gon_dun03:  'Gonryun Dungeon F3',
}

export function getMapName(mapId: string): string {
  return MAP_NAMES[mapId] ?? mapId
}
