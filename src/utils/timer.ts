import type { KillLog, KillStatus, EnrichedMVP, MVP } from '@/types'

const SOON_WINDOW_MS  = 5 * 60_000  // 5 min: limiar "em breve"
const STALE_AFTER_MS  = 5 * 60_000  // 5 min após janela máxima → dado obsoleto

/**
 * Regras de status (4 estados):
 *
 * Sem registro                              → 'mvp'
 * Passou >5 min da janela máxima            → 'mvp'  (dado obsoleto)
 * Dentro da janela OU nasceu < 5 min atrás  → 'window-open'
 * Falta 0–5 min para janela mínima          → 'soon'
 * Falta >5 min para janela mínima           → 'far'
 */
export function getStatus(
  killAt: string | null,
  min: number,
  max: number,
  now: number,
): KillStatus {
  if (!killAt) return 'mvp'

  const killedAt = new Date(killAt).getTime()
  const minTime  = killedAt + min * 60_000
  const maxTime  = killedAt + max * 60_000

  // Dado obsoleto: passou mais de 5 min além da janela máxima
  if (now > maxTime + STALE_AFTER_MS) return 'mvp'

  // Dentro da janela de respawn (entre min e max) OU acabou de nascer (até 5 min após max)
  if (now >= minTime) return 'window-open'

  // Ainda não chegou na janela mínima
  const timeUntilMin = minTime - now
  return timeUntilMin <= SOON_WINDOW_MS ? 'soon' : 'far'
}

export function formatRemaining(ms: number): string {
  if (ms <= 0) return 'agora'
  const total = Math.floor(ms / 1000)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return [h ? `${h}h` : null, m ? `${m}m` : null, `${s}s`].filter(Boolean).join(' ')
}

export function formatDateTime(date: string | Date): string {
  return new Date(date).toLocaleString('pt-BR')
}

export function enrichMVP(mvp: MVP, logs: KillLog[], now: number): EnrichedMVP {
  const latest = logs.find(l => l.mvp_id === mvp.id) ?? null
  const status = getStatus(latest?.killed_at ?? null, mvp.minRespawn, mvp.maxRespawn, now)

  const minRespawnDate = latest
    ? new Date(new Date(latest.killed_at).getTime() + mvp.minRespawn * 60_000)
    : null
  const maxRespawnDate = latest
    ? new Date(new Date(latest.killed_at).getTime() + mvp.maxRespawn * 60_000)
    : null

  const totalWindowMs   = Math.max(1, (mvp.maxRespawn - mvp.minRespawn) * 60_000)
  const elapsedSinceMin = latest
    ? now - (new Date(latest.killed_at).getTime() + mvp.minRespawn * 60_000)
    : 0
  const windowProgress = latest
    ? Math.min(100, Math.max(0, (elapsedSinceMin / totalWindowMs) * 100))
    : 0

  const score = (() => {
    if (status === 'window-open') return 100 + mvp.priority * 10
    if (status === 'soon')        return  70 + mvp.priority * 8
    if (status === 'far')         return  25 + mvp.priority * 5
    return mvp.priority * 3  // 'mvp' — sem dados
  })()

  return { ...mvp, latest, status, minRespawnDate, maxRespawnDate, windowProgress, score }
}
