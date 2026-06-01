/**
 * MVP images from trackeur.vercel.app — URLs diretas com hash correto.
 * Mapeado por mobId (código do mob no RO).
 */
export const MVP_IMAGES_BY_ID: Record<number, string> = {
  1038: 'https://trackeur.vercel.app/assets/1038-bmnAU7JK.webp',   // Osiris
  1039: 'https://trackeur.vercel.app/assets/1039-N416eG65.webp',   // Baphomet
  1046: 'https://trackeur.vercel.app/assets/1046-zNzTdY_S.webp',   // Doppelganger
  1059: 'https://trackeur.vercel.app/assets/1059-IgnV0BMT.webp',   // Mistress
  1086: 'https://trackeur.vercel.app/assets/1086-BK3VSgzz.webp',   // Golden Thief Bug
  1087: 'https://trackeur.vercel.app/assets/1087-u2bT2cQr.webp',   // Orc Hero
  1112: 'https://trackeur.vercel.app/assets/1112-Td2PVAp3.webp',   // Drake
  1115: 'https://trackeur.vercel.app/assets/1115-1U1uhdoy.webp',   // Eddga
  1147: 'https://trackeur.vercel.app/assets/1147-SJ07ZgtZ.webp',   // Maya
  1150: 'https://trackeur.vercel.app/assets/1150-2ClG3fhn.webp',   // Moonlight Flower
  1157: 'https://trackeur.vercel.app/assets/1157-CEw0rAZ3.webp',   // Pharaoh
  1158: 'https://trackeur.vercel.app/assets/1159-eOJWwi9g.webp',   // Phreeoni
  1190: 'https://trackeur.vercel.app/assets/1190-xuuqDrUh.webp',   // Orc Lord
  1251: 'https://trackeur.vercel.app/assets/1251-2LO5Jvxt.webp',   // Stormy Knight
  1272: 'https://trackeur.vercel.app/assets/1272-ZkeHbN4b.webp',   // Dark Lord
  1312: 'https://trackeur.vercel.app/assets/1312-UTr41dUr.webp',   // Turtle General
  1373: 'https://trackeur.vercel.app/assets/1373-OiCGn2dX.webp',   // Lord of Death
  1389: 'https://trackeur.vercel.app/assets/1389-oWdoA7OS.webp',   // Dracula
  1419: 'https://trackeur.vercel.app/assets/1418-Wo56zRa7.webp',   // Evil Snake Lord
  1511: 'https://trackeur.vercel.app/assets/1511-8ORkz3I-.webp',   // Amon Ra
  1583: 'https://trackeur.vercel.app/assets/1583-QWAN5a9Y.webp',   // Tao Gunka
  1719: 'https://trackeur.vercel.app/assets/1719-7ywvWaRb.webp',   // Detardeurus
  1785: 'https://trackeur.vercel.app/assets/1785-fY22PBPa.webp',   // Atroce
  1871: 'https://trackeur.vercel.app/assets/1871-0Td6eyEw.webp',   // Fallen Bishop
}

/** Mapa por nome para compatibilidade com código legado */
export const MVP_IMAGES: Record<string, string> = {
  'Osiris':           MVP_IMAGES_BY_ID[1038],
  'Baphomet':         MVP_IMAGES_BY_ID[1039],
  'Doppelganger':     MVP_IMAGES_BY_ID[1046],
  'Mistress':         MVP_IMAGES_BY_ID[1059],
  'Golden Thief Bug': MVP_IMAGES_BY_ID[1086],
  'Orc Hero':         MVP_IMAGES_BY_ID[1087],
  'Drake':            MVP_IMAGES_BY_ID[1112],
  'Eddga':            MVP_IMAGES_BY_ID[1115],
  'Maya':             MVP_IMAGES_BY_ID[1147],
  'Moonlight Flower': MVP_IMAGES_BY_ID[1150],
  'Pharaoh':          MVP_IMAGES_BY_ID[1157],
  'Phreeoni':         MVP_IMAGES_BY_ID[1158],
  'Orc Lord':         MVP_IMAGES_BY_ID[1190],
  'Stormy Knight':    MVP_IMAGES_BY_ID[1251],
  'Dark Lord':        MVP_IMAGES_BY_ID[1272],
  'Turtle General':   MVP_IMAGES_BY_ID[1312],
  'Lord of Death':    MVP_IMAGES_BY_ID[1373],
  'Dracula':          MVP_IMAGES_BY_ID[1389],
  'Evil Snake Lord':  MVP_IMAGES_BY_ID[1419],
  'Amon Ra':          MVP_IMAGES_BY_ID[1511],
  'Tao Gunka':        MVP_IMAGES_BY_ID[1583],
  'Detardeurus':      MVP_IMAGES_BY_ID[1719],
  'Atroce':           MVP_IMAGES_BY_ID[1785],
  'Fallen Bishop':    MVP_IMAGES_BY_ID[1871],
}

export function getMvpImage(name: string): string {
  return MVP_IMAGES[name] ?? ''
}

export function getMvpImageById(mobId: number): string {
  return MVP_IMAGES_BY_ID[mobId] ?? ''
}
