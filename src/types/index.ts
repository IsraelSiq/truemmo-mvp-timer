// ─── MVP Data Types ───────────────────────────────────────────────────────────

export type MvpStatus = 'alive' | 'window' | 'dead' | 'unknown'

export interface MvpDefinition {
  id: string
  name: string
  map: string
  mapLabel: string        // friendly map name
  minRespawn: number      // minutes
  maxRespawn: number      // minutes
  imageUrl?: string
  drops?: MvpDrop[]
  notes?: string
}

export interface MvpDrop {
  itemName: string
  rate: number            // percentage (0-100)
  isHighValue?: boolean
}

// ─── Active Timer Types ───────────────────────────────────────────────────────

export interface ActiveTimer {
  id: string              // uuid
  mvpId: string
  killedAt: string        // ISO timestamp
  killedBy: string        // user display name
  groupId: string
  windowStart: string     // ISO — killedAt + minRespawn
  windowEnd: string       // ISO — killedAt + maxRespawn
  notes?: string
}

export type TimerWithDef = ActiveTimer & { definition: MvpDefinition; status: MvpStatus }

// ─── Group / Auth Types ───────────────────────────────────────────────────────

export interface Group {
  id: string
  name: string
  inviteCode: string
  createdAt: string
}

export interface Profile {
  id: string              // = auth.users.id
  displayName: string
  groupId: string | null
  avatarUrl?: string
}

// ─── AI Types ─────────────────────────────────────────────────────────────────

export interface AiSuggestion {
  mvpId: string
  reason: string
  urgencyScore: number    // 1-10
  estimatedReward: string
  suggestedAt: string
}
