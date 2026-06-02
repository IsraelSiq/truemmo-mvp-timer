import { useMemo, useState } from 'react'
import { Shield, Radio, Search, LogIn, LogOut, User } from 'lucide-react'
import { MVP_LIST } from '@/data/mvps'
import { enrichMVP } from '@/utils/timer'
import { goalScore } from '@/utils/goalSort'
import { useKills } from '@/hooks/useKills'
import { useNow } from '@/hooks/useNow'
import { useAuth } from '@/hooks/useAuth'
import { askGemini } from '@/lib/gemini'
import { MVPCard } from '@/components/MVPCard'
import { KillModal } from '@/components/KillModal'
import { AISuggestion } from '@/components/AISuggestion'
import { KillLogPanel } from '@/components/KillLog'
import { GoalSelector } from '@/components/GoalSelector'
import { AuthModal } from '@/components/AuthModal'
import type { EnrichedMVP, KillLog, KillStatus, GoalMode } from '@/types'
import toast from 'react-hot-toast'

type StatusFilter = 'all' | KillStatus

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all',           label: 'Todos' },
  { value: 'alive',         label: '🟢 Vivo' },
  { value: 'window-open',   label: '🟡 Janela aberta' },
  { value: 'soon',          label: '⏳ Em breve' },
  { value: 'far',           label: 'Longe' },
  { value: 'window-passed', label: 'Passou' },
]

export function Dashboard() {
  const now = useNow()
  const { user, loading: authLoading, displayName, signOut } = useAuth()
  const [groupName,    setGroupName]    = useState(() => localStorage.getItem('rag-group') ?? 'truemmo-main')
  const { kills, synced, addKill, clearLocal } = useKills(groupName)
  const [query,        setQuery]        = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [goalMode,     setGoalMode]     = useState<GoalMode>('default')
  const [selected,     setSelected]     = useState<EnrichedMVP | null>(null)
  const [aiSuggestion, setAiSuggestion] = useState('')
  const [aiLoading,    setAiLoading]    = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [showAuth,     setShowAuth]     = useState(false)

  // Nick: displayName do Supabase ou input manual (fallback offline)
  const [playerOverride, setPlayerOverride] = useState(() => localStorage.getItem('rag-player') ?? '')
  const player = displayName || playerOverride

  const enriched = useMemo(() => {
    return MVP_LIST
      .filter(m => `${m.name} ${m.map}`.toLowerCase().includes(query.toLowerCase()))
      .map(m => enrichMVP(m, kills, now))
      .sort((a, b) => goalScore(b, goalMode) - goalScore(a, goalMode) || b.priority - a.priority)
  }, [kills, now, query, goalMode])

  const filtered = useMemo(() =>
    statusFilter === 'all' ? enriched : enriched.filter(e =>
      statusFilter === 'alive'
        ? e.status === 'alive' || e.status === 'no-record'
        : e.status === statusFilter
    )
  , [enriched, statusFilter])

  const openCount = enriched.filter(e => e.status === 'window-open').length
  const soonCount = enriched.filter(e => e.status === 'soon').length
  const topTarget = enriched.find(e => e.status === 'window-open' || e.status === 'soon')

  async function handleAsk() {
    setAiLoading(true)
    try {
      const text = await askGemini(enriched)
      setAiSuggestion(text)
    } catch {
      setAiSuggestion('Falha ao consultar Gemini.')
    } finally {
      setAiLoading(false)
    }
  }

  function saveGroup() {
    localStorage.setItem('rag-group', groupName)
    toast.success('Grupo salvo!')
  }

  function savePlayer() {
    localStorage.setItem('rag-player', playerOverride)
  }

  function handleClearLocal() {
    if (!confirmClear) {
      setConfirmClear(true)
      setTimeout(() => setConfirmClear(false), 4000)
      return
    }
    clearLocal()
    setConfirmClear(false)
    toast.success('Registros locais apagados.')
  }

  // Kill só permitida se logado
  function handleKillClick(item: EnrichedMVP) {
    if (!user) { setShowAuth(true); return }
    setSelected(item)
  }

  function handleEnemyKill(item: EnrichedMVP, killedAt: string) {
    if (!user) { setShowAuth(true); return }
    const log: KillLog = {
      mvp_id:          item.id,
      mvp_name:        item.name,
      killer:          'Inimigo',
      killed_at:       killedAt,
      note:            'Morto por guild inimiga.',
      group_name:      groupName,
      killed_by_enemy: true,
    }
    addKill(log)
    toast.success(`${item.name} marcado como morto por inimigo.`, { icon: '⚡' })
  }

  return (
    <div className="min-h-screen bg-rag-bg text-rag-text font-body">
      <header className="border-b border-rag-border bg-rag-surface px-6 py-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg border border-rag-border bg-rag-surface2 flex items-center justify-center">
            <svg viewBox="0 0 64 64" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M32 6 12 18v14c0 13 8.5 21.5 20 26 11.5-4.5 20-13 20-26V18L32 6Z" />
              <path d="M23 34h18M32 19v30" />
            </svg>
          </div>
          <div>
            <h1 className="font-body font-bold text-rag-text text-lg leading-tight">Ragnarok MVP Timer</h1>
            <p className="text-rag-muted text-xs">TRUEMMO · logs em grupo · Gemini AI</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border ${
            synced
              ? 'border-green-700/40 bg-green-900/20 text-green-400'
              : 'border-rag-border bg-rag-surface2 text-rag-muted'
          }`}>
            <Radio size={11} /> {synced ? 'Realtime ativo' : 'Local apenas'}
          </span>
          <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border border-rag-blue/40 bg-blue-900/20 text-rag-blue">
            <Shield size={11} /> Cloud-ready
          </span>

          {/* Auth */}
          {authLoading ? null : user ? (
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full border border-rag-border bg-rag-surface2 text-rag-muted">
                <User size={11} /> {displayName}
              </span>
              <button
                onClick={() => signOut()}
                title="Sair"
                className="flex items-center gap-1 text-xs px-2 py-1 rounded-full border border-rag-border bg-rag-surface2 text-rag-muted hover:text-rag-text transition-colors"
              >
                <LogOut size={11} /> Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-rag-accent/50 bg-rag-accent/10 text-rag-accent hover:bg-rag-accent/20 transition-colors font-semibold"
            >
              <LogIn size={11} /> Entrar para registrar kills
            </button>
          )}
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 md:px-6 py-6 flex flex-col gap-6">

        {/* Objetivo */}
        <GoalSelector value={goalMode} onChange={setGoalMode} />

        {/* Busca + Configs */}
        <div className="bg-rag-surface border border-rag-border rounded-xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-rag-muted" />
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar MVP ou mapa..."
              className="w-full bg-rag-bg border border-rag-border rounded-lg pl-8 pr-3 py-2 text-rag-text text-sm outline-none focus:border-rag-accent"
            />
          </div>
          {/* Nick só aparece se não estiver logado */}
          {!user && (
            <input
              id="player-nick"
              name="player-nick"
              value={playerOverride}
              onChange={e => setPlayerOverride(e.target.value)}
              onBlur={savePlayer}
              placeholder="Seu nick (sem login)"
              className="bg-rag-bg border border-rag-border rounded-lg px-3 py-2 text-rag-text text-sm outline-none focus:border-rag-accent"
            />
          )}
          <input
            id="group-name"
            name="group-name"
            value={groupName}
            onChange={e => setGroupName(e.target.value)}
            onBlur={saveGroup}
            placeholder="Grupo / clã / tag"
            className="bg-rag-bg border border-rag-border rounded-lg px-3 py-2 text-rag-text text-sm outline-none focus:border-rag-accent"
          />
          <button
            onClick={handleClearLocal}
            className={`rounded-lg px-3 py-2 text-sm transition-colors border ${
              confirmClear
                ? 'bg-rag-accent/20 border-rag-accent text-rag-accent font-bold'
                : 'bg-rag-surface2 border-rag-border text-rag-muted hover:border-rag-accent/50 hover:text-rag-text'
            }`}
          >
            {confirmClear ? '⚠️ Confirmar limpeza?' : 'Limpar registros locais'}
          </button>
        </div>

        {/* Banner se não estiver logado */}
        {!authLoading && !user && (
          <div
            onClick={() => setShowAuth(true)}
            className="cursor-pointer flex items-center gap-3 bg-rag-accent/10 border border-rag-accent/30 rounded-xl px-4 py-3 text-sm text-rag-accent hover:bg-rag-accent/15 transition-colors"
          >
            <LogIn size={16} />
            <span>
              <strong>Faça login</strong> para registrar kills de MVP. O log de todos os jogadores fica visível para todos!
            </span>
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Janelas abertas',   value: openCount,              color: 'text-green-400'  },
            { label: 'Abrindo em breve',  value: soonCount,              color: 'text-yellow-400' },
            { label: 'Melhor alvo agora', value: topTarget?.name ?? '—', color: 'text-rag-accent'  },
          ].map(kpi => (
            <div key={kpi.label} className="bg-rag-surface border border-rag-border rounded-xl p-4">
              <span className="block text-rag-muted text-xs uppercase tracking-wider mb-1">{kpi.label}</span>
              <strong className={`text-xl font-bold tabular-nums ${kpi.color}`}>{kpi.value}</strong>
            </div>
          ))}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                statusFilter === tab.value
                  ? 'bg-rag-accent/20 border-rag-accent text-rag-accent font-bold'
                  : 'bg-rag-surface border-rag-border text-rag-muted hover:text-rag-text'
              }`}
            >
              {tab.label}
              {tab.value !== 'all' && (
                <span className="ml-1.5 text-rag-muted/70">
                  ({enriched.filter(e =>
                    tab.value === 'alive'
                      ? e.status === 'alive' || e.status === 'no-record'
                      : e.status === tab.value
                  ).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid + sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full border border-dashed border-rag-border rounded-xl p-10 text-center text-rag-muted text-sm">
                Nenhum MVP nessa categoria no momento.
              </div>
            ) : (
              filtered.map(item => (
                <MVPCard
                  key={item.id}
                  item={item}
                  now={now}
                  onKill={handleKillClick}
                  onEnemyKill={handleEnemyKill}
                />
              ))
            )}
          </div>

          <aside className="bg-rag-surface border border-rag-border rounded-xl p-4 flex flex-col gap-6 h-fit sticky top-6">
            <AISuggestion suggestion={aiSuggestion} loading={aiLoading} onAsk={handleAsk} />
            <hr className="border-rag-border" />
            <KillLogPanel kills={kills} groupName={groupName} />
          </aside>
        </div>
      </div>

      {selected && (
        <KillModal
          item={selected}
          groupName={groupName}
          defaultKiller={player}
          onConfirm={log => { addKill(log); setSelected(null); toast.success(`Kill de ${log.mvp_name} registrada!`) }}
          onClose={() => setSelected(null)}
        />
      )}

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </div>
  )
}
