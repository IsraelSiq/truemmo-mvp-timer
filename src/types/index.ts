export interface MVP {
  id: number
  mobId: number      // mob ID no banco do RO (usado para imagem e referencia)
  name: string
  map: string
  minRespawn: number // minutes
  maxRespawn: number // minutes
  priority: number   // 1-10
  notes: string
  difficulty: 'easy' | 'medium' | 'hard'
  tags: MvpTag[]
  mvpPoints?: number  // pontos concedidos ao matar no TrueMmo
  image?: string      // URL da imagem do mob (divine-pride.net CDN ou custom)
}

export type MvpTag =
  | 'solo'
  | 'group'
  | 'high-drop'
  | 'fast'
  | 'field'
  | 'disputed'
  | 'truemmo-exclusive'  // MVP exclusivo do servidor, nao existe no oficial

/**
 * 4 estados possiveis:
 *
 * 'mvp'          - sem registro de morte (desconhecido)
 * 'window-open'  - morte registrada + nasceu ha menos de 5 min
 * 'soon'         - morte registrada + nasce em 0-5 min
 * 'far'          - morte registrada + falta > 5 min
 *
 * Se passou mais de 5 min apos a janela maxima => volta a 'mvp' (dado obsoleto)
 */
export type KillStatus = 'mvp' | 'window-open' | 'soon' | 'far'

export interface KillLog {
  id?: string
  mvp_id: number
  mvp_name: string
  killer: string
  killed_at: string  // ISO string
  note: string
  group_name: string
  created_at?: string
  killed_by_enemy?: boolean
}

export interface EnrichedMVP extends MVP {
  latest: KillLog | null
  status: KillStatus
  minRespawnDate: Date | null
  maxRespawnDate: Date | null
  windowProgress: number // 0-100
  score: number
}

// ─ Objetivo / Modo de jogo ────────────────────────────────────────────
export type GoalMode =
  | 'default'
  | 'mvp-points'
  | 'best-drops'
  | 'fast-rotation'
  | 'group-hunt'

export interface GoalConfig {
  mode: GoalMode
  label: string
  description: string
  emoji: string
}

export const GOAL_CONFIGS: GoalConfig[] = [
  { mode: 'default',        label: 'Padrao',             description: 'Prioridade geral — janelas abertas primeiro.',                  emoji: '⚔️' },
  { mode: 'mvp-points',     label: 'Farmar MVP Points',  description: 'Mais faceis e rapidos primeiro — maximize kills por hora.',    emoji: '🎯' },
  { mode: 'best-drops',     label: 'Melhores Drops',     description: 'Foca nos MVPs com cards de alto valor.',                       emoji: '💎' },
  { mode: 'fast-rotation',  label: 'Rotacao Rapida',     description: 'Respawn curto em primeiro — grupo sempre em movimento.',       emoji: '⚡️' },
  { mode: 'group-hunt',     label: 'Cacada em Grupo',    description: 'MVPs que valem mobilizar o grupo inteiro.',                    emoji: '🤝' },
]
