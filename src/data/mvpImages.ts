/**
 * MVP images via Vercel proxy /api/monster-img/:id
 * O vercel.json faz rewrite server-side para divine-pride.net,
 * bypassando o hotlink protection que bloqueia requests do browser.
 */
export const MVP_IMAGES: Record<string, string> = {
  'Orc Hero':         '/api/monster-img/1087',
  'Moonlight Flower': '/api/monster-img/1150',
  'Osiris':           '/api/monster-img/1038',
  'Golden Thief Bug': '/api/monster-img/1086',
  'Stormy Knight':    '/api/monster-img/1251',
  'Turtle General':   '/api/monster-img/1312',
  'Dark Lord':        '/api/monster-img/1272',
  'Dracula':          '/api/monster-img/1389',
  'Pharaoh':          '/api/monster-img/1157',
  'Amon Ra':          '/api/monster-img/1511',
  'Evil Snake Lord':  '/api/monster-img/1419',
  'Baphomet':         '/api/monster-img/1039',
  'Eddga':            '/api/monster-img/1115',
  'Drake':            '/api/monster-img/1112',
  'Phreeoni':         '/api/monster-img/1158',
  'Mistress':         '/api/monster-img/1059',
  'Doppelganger':     '/api/monster-img/1046',
  'Maya':             '/api/monster-img/1147',
  'Orc Lord':         '/api/monster-img/1190',
  'Fallen Bishop':    '/api/monster-img/1871',
  'Tao Gunka':        '/api/monster-img/1583',
  'Lord of Death':    '/api/monster-img/1373',
  'Detardeurus':      '/api/monster-img/1719',
  'Atroce':           '/api/monster-img/1785',
}

export function getMvpImage(name: string): string {
  return MVP_IMAGES[name] ?? ''
}
