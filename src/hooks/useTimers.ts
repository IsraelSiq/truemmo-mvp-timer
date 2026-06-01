/**
 * useTimers — subscribes to active timers for a group via Supabase Realtime.
 *
 * TODO: implement in Issue #5
 * - Query kill_log table filtered by group_id
 * - Subscribe to INSERT/DELETE events
 * - Merge with MVP definitions from src/data/mvps.ts
 * - Return TimerWithDef[] with live status
 */
export function useTimers(_groupId: string | null) {
  // Stub — to be implemented
  return { timers: [], loading: false, error: null }
}
