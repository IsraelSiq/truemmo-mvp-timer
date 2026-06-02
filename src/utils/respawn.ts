import { addMinutes, isAfter } from 'date-fns'
import type { KillStatus } from '@/types'

/**
 * Calculates respawn window timestamps from a kill time.
 */
export function calcWindow(killedAt: Date | string, minRespawn: number, maxRespawn: number) {
  const killed = new Date(killedAt)
  return {
    windowStart: addMinutes(killed, minRespawn),
    windowEnd:   addMinutes(killed, maxRespawn),
  }
}

/**
 * Returns the current status of a timer given its window.
 * Note: after the window expires the caller (enrichMVP) resets
 * the MVP to 'mvp' (unknown). Here we just return 'far' for
 * anything that hasn't opened yet, including expired windows
 * that haven't been cleaned up yet.
 */
export function getTimerStatus(
  windowStart: Date | string,
  windowEnd:   Date | string,
): KillStatus {
  const now   = new Date()
  const start = new Date(windowStart)
  const end   = new Date(windowEnd)

  if (isAfter(now, end))   return 'far'
  if (isAfter(now, start)) return 'window-open'
  return 'far'
}

/**
 * Returns a human-readable countdown string.
 * e.g. "1h 23m" or "4m 30s"
 */
export function formatCountdown(targetDate: Date | string): string {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) return '00:00'

  const totalSeconds = Math.floor(diff / 1000)
  const hours        = Math.floor(totalSeconds / 3600)
  const minutes      = Math.floor((totalSeconds % 3600) / 60)
  const seconds      = totalSeconds % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}
