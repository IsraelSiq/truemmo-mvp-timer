import type { JobTree } from '@/data/skillTrees'

interface Props {
  trees: JobTree[]
  selected: number
  onChange: (idx: number) => void
}

// Agrupa as classes por 1st job
const JOB_GROUPS: { label: string; emoji: string; indices: number[] }[] = [
  { label: 'Swordsman', emoji: '⚔️',  indices: [0, 1]   },
  { label: 'Mage',      emoji: '🔮',  indices: [2, 3]   },
  { label: 'Archer',    emoji: '🏹',  indices: [4, 5]   },
  { label: 'Merchant',  emoji: '⚙️',  indices: [6, 7]   },
  { label: 'Thief',     emoji: '🗡️',  indices: [8, 9]   },
  { label: 'Acolyte',   emoji: '✨',  indices: [10, 11] },
  { label: 'Ninja',     emoji: '🌀',  indices: [12]     },
  { label: 'Taekwon',   emoji: '🦵',  indices: [13, 14] },
]

export function ClassPicker({ trees, selected, onChange }: Props) {
  return (
    <div className="bg-rag-surface border border-rag-border rounded-xl p-4 flex flex-col gap-3">
      <h2 className="text-rag-text font-bold text-sm uppercase tracking-wider">Classe 4th</h2>
      <div className="flex flex-col gap-4">
        {JOB_GROUPS.map(group => (
          <div key={group.label}>
            <span className="text-rag-muted text-xs uppercase tracking-wide mb-1.5 block">
              {group.emoji} {group.label}
            </span>
            <div className="flex flex-wrap gap-2">
              {group.indices.map(idx => {
                const tree = trees[idx]
                if (!tree) return null
                const isSelected = selected === idx
                return (
                  <button
                    key={idx}
                    onClick={() => onChange(idx)}
                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                      isSelected
                        ? 'bg-rag-accent/20 border-rag-accent text-rag-accent font-bold'
                        : 'bg-rag-bg border-rag-border text-rag-muted hover:text-rag-text hover:border-rag-accent/40'
                    }`}
                  >
                    {tree.chain[tree.chain.length - 1].name}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
