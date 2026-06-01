import type { MvpDefinition } from '@/types'

/**
 * TRUEMMO MVP list — respawn times may differ from official RO.
 * Update minRespawn/maxRespawn based on confirmed server rates.
 *
 * Sources: TRUEMMO wiki / community spreadsheets
 */
export const MVP_LIST: MvpDefinition[] = [
  {
    id: 'baphomet',
    name: 'Baphomet',
    map: 'prt_maze03',
    mapLabel: 'Pyramid - Maze B3',
    minRespawn: 120,
    maxRespawn: 130,
    drops: [
      { itemName: 'Baphomet Card', rate: 0.01, isHighValue: true },
      { itemName: 'Baphomet Horns', rate: 5.5 },
      { itemName: 'Yggdrasil Berry', rate: 55 },
    ],
  },
  {
    id: 'eddga',
    name: 'Eddga',
    map: 'pay_fild04',
    mapLabel: 'Payon Field 4',
    minRespawn: 120,
    maxRespawn: 130,
    drops: [
      { itemName: 'Eddga Card', rate: 0.01, isHighValue: true },
      { itemName: 'Tiger Skin', rate: 75 },
    ],
  },
  {
    id: 'doppelganger',
    name: 'Doppelganger',
    map: 'gef_dun02',
    mapLabel: 'Geffen Dungeon 3',
    minRespawn: 120,
    maxRespawn: 130,
    drops: [
      { itemName: 'Doppelganger Card', rate: 0.01, isHighValue: true },
      { itemName: 'Zargon', rate: 42.5 },
    ],
  },
  {
    id: 'phreeoni',
    name: 'Phreeoni',
    map: 'moc_fild20',
    mapLabel: 'Morocc Field 20',
    minRespawn: 120,
    maxRespawn: 130,
    drops: [
      { itemName: 'Phreeoni Card', rate: 0.01, isHighValue: true },
      { itemName: 'Bill of Birds', rate: 88 },
    ],
  },
  {
    id: 'osiris',
    name: 'Osiris',
    map: 'moc_pryd06',
    mapLabel: 'Pyramid B6',
    minRespawn: 60,
    maxRespawn: 70,
    drops: [
      { itemName: 'Osiris Card', rate: 0.01, isHighValue: true },
      { itemName: 'Yggdrasil Berry', rate: 20 },
    ],
  },
  {
    id: 'maya',
    name: 'Maya',
    map: 'anthell02',
    mapLabel: 'Ant Hell 2',
    minRespawn: 120,
    maxRespawn: 130,
    drops: [
      { itemName: 'Maya Card', rate: 0.01, isHighValue: true },
      { itemName: 'Maya Purple', rate: 5 },
    ],
  },
  {
    id: 'orc_lord',
    name: 'Orc Lord',
    map: 'gef_fild02',
    mapLabel: 'Geffen Field 2',
    minRespawn: 120,
    maxRespawn: 130,
    drops: [
      { itemName: 'Orc Lord Card', rate: 0.01, isHighValue: true },
      { itemName: 'Slick Paper', rate: 22.8 },
    ],
  },
  {
    id: 'orc_hero',
    name: 'Orc Hero',
    map: 'gef_fild01',
    mapLabel: 'Geffen Field 1',
    minRespawn: 60,
    maxRespawn: 70,
    drops: [
      { itemName: 'Orc Hero Card', rate: 0.01, isHighValue: true },
      { itemName: 'Oridecon', rate: 27.8 },
    ],
  },
  {
    id: 'moonlight',
    name: 'Moonlight Flower',
    map: 'pay_dun04',
    mapLabel: 'Payon Cave 4',
    minRespawn: 60,
    maxRespawn: 70,
    drops: [
      { itemName: 'Moonlight Flower Card', rate: 0.01, isHighValue: true },
      { itemName: 'Gift Box', rate: 20 },
    ],
  },
  {
    id: 'dracula',
    name: 'Dracula',
    map: 'cas_pri01',
    mapLabel: 'Prontera Culvert 1',
    minRespawn: 60,
    maxRespawn: 70,
    drops: [
      { itemName: 'Dracula Card', rate: 0.01, isHighValue: true },
      { itemName: 'Bloody Rune', rate: 14.5 },
    ],
  },
]
