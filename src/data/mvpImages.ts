/**
 * MVP images from divine-pride.net — allows hotlinking.
 * URL pattern: https://www.divine-pride.net/img/monsters/SEA/{ID}
 * IDs from iRO classic monster database.
 */
const BASE = 'https://www.divine-pride.net/img/monsters/SEA'

export const MVP_IMAGES: Record<string, string> = {
  'Orc Hero':         `${BASE}/1087`,
  'Moonlight Flower': `${BASE}/1150`,
  'Osiris':           `${BASE}/1038`,
  'Golden Thief Bug': `${BASE}/1086`,
  'Stormy Knight':    `${BASE}/1251`,
  'Turtle General':   `${BASE}/1312`,
  'Dark Lord':        `${BASE}/1272`,
  'Dracula':          `${BASE}/1389`,
  'Pharaoh':          `${BASE}/1157`,
  'Amon Ra':          `${BASE}/1511`,
  'Evil Snake Lord':  `${BASE}/1419`,
  'Baphomet':         `${BASE}/1039`,
  'Eddga':            `${BASE}/1115`,
  'Drake':            `${BASE}/1112`,
  'Phreeoni':         `${BASE}/1158`,
  'Mistress':         `${BASE}/1059`,
  'Doppelganger':     `${BASE}/1046`,
  'Maya':             `${BASE}/1147`,
  'Orc Lord':         `${BASE}/1190`,
  'Fallen Bishop':    `${BASE}/1871`,
  'Tao Gunka':        `${BASE}/1583`,
  'Lord of Death':    `${BASE}/1373`,
  'Detardeurus':      `${BASE}/1719`,
  'Atroce':           `${BASE}/1785`,
}

export function getMvpImage(name: string): string {
  return MVP_IMAGES[name] ?? ''
}
