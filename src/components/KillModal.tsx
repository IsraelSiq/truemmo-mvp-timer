import { useState } from 'react'
import { X, Clock } from 'lucide-react'
import type { EnrichedMVP, KillLog } from '@/types'

interface Props {
  item: EnrichedMVP
  groupName: string
  defaultKiller: string
  onConfirm: (log: KillLog) => void
  onClose: () => void
}

function toLocalDatetimeInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  )
}

export function KillModal({ item, groupName, defaultKiller, onConfirm, onClose }: Props) {
  const [killer,   setKiller]   = useState(defaultKiller)
  const [note,     setNote]     = useState('')
  const [killedAt, setKilledAt] = useState(() => toLocalDatetimeInput(new Date()))

  function submit() {
    onConfirm({
      mvp_id:     item.id,
      mvp_name:   item.name,
      killer:     killer.trim() || 'Sem nome',
      killed_at:  new Date(killedAt).toISOString(),
      note:       note.trim(),
      group_name: groupName,
    })
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-rag-surface border border-rag-border rounded-xl p-5 w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-body font-bold text-rag-text">Registrar kill: {item.name}</h3>
          <button onClick={onClose} className="text-rag-muted hover:text-rag-text transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-rag-muted text-xs mb-1">Quem matou?</label>
            <input
              value={killer}
              onChange={e => setKiller(e.target.value)}
              placeholder="Nome do killer / líder / personagem"
              className="w-full bg-rag-bg border border-rag-border rounded-lg px-3 py-2 text-rag-text text-sm outline-none focus:border-rag-accent"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-rag-muted text-xs mb-1">
              <Clock size={11} /> Hora da morte
            </label>
            <input
              type="datetime-local"
              value={killedAt}
              onChange={e => setKilledAt(e.target.value)}
              className="w-full bg-rag-bg border border-rag-border rounded-lg px-3 py-2 text-rag-text text-sm outline-none focus:border-rag-accent [color-scheme:dark]"
            />
            <p className="text-rag-muted/70 text-xs mt-1">Ajuste se o boss morreu alguns minutos atrás.</p>
          </div>

          <div>
            <label className="block text-rag-muted text-xs mb-1">Observações</label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Ex: solo, pt full, spot disputado, drop relevante..."
              rows={3}
              className="w-full bg-rag-bg border border-rag-border rounded-lg px-3 py-2 text-rag-text text-sm outline-none focus:border-rag-accent resize-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={submit}
              className="flex-1 bg-rag-accent hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors text-sm"
            >
              Salvar kill
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-rag-surface2 hover:bg-rag-border text-rag-text py-2 rounded-lg transition-colors text-sm border border-rag-border"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
