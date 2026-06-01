import type { EnrichedMVP } from '@/types'
import { formatDateTime } from '@/utils/timer'

const MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-flash-latest',
]

/** Sugestão calculada localmente quando a IA estiver indisponível */
function localSuggestion(mvps: EnrichedMVP[]): string {
  const open  = mvps.filter(m => m.status === 'window-open').sort((a, b) => b.priority - a.priority)
  const soon  = mvps.filter(m => m.status === 'soon').sort((a, b) => b.priority - a.priority)
  const alive = mvps.filter(m => m.status === 'alive' || m.status === 'no-record').sort((a, b) => b.priority - a.priority)

  const best = open[0] ?? soon[0] ?? alive[0]
  if (!best) return 'ℹ️ Nenhum MVP com janela aberta no momento.'

  const statusLabel =
    best.status === 'window-open' ? '🟡 Janela ABERTA agora' :
    best.status === 'soon'        ? '⏳ Abrindo em breve'    :
                                    '🟢 Vivo sem registro'

  const alternatives = [...open, ...soon, ...alive]
    .filter(m => m.id !== best.id)
    .slice(0, 2)
    .map(m => `• ${m.name} (${m.map}) — prioridade ${m.priority}`)
    .join('\n')

  return [
    `🤖 Sugestão local — IA offline (quota Gemini atingida)`,
    ``,
    `Melhor alvo agora: ${best.name}`,
    `${statusLabel} — Mapa: ${best.map} — Prioridade: ${best.priority}`,
    alternatives ? `\nAlternativas:\n${alternatives}` : '',
    ``,
    `⚠️ Para ativar IA real: ative billing no projeto em aistudio.google.com`,
  ].filter(Boolean).join('\n')
}

function parseRetryDelay(body: string): number | null {
  try {
    const json = JSON.parse(body)
    const rd = json?.error?.details?.find(
      (d: { '@type': string }) => d['@type'] === 'type.googleapis.com/google.rpc.RetryInfo'
    )?.retryDelay as string | undefined
    return rd ? Math.ceil(parseFloat(rd)) : null
  } catch { return null }
}

async function tryModel(model: string, prompt: string, apiKey: string) {
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    )
    const text = await res.text()
    return { ok: res.ok, status: res.status, text }
  } catch (e) {
    return { ok: false, status: 0, text: String(e) }
  }
}

export async function askGemini(mvps: EnrichedMVP[]): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string
  if (!apiKey) return '⚠️ VITE_GEMINI_API_KEY não configurada. Adicione nas variáveis de ambiente da Vercel e faça redeploy.'

  const snapshot = mvps.slice(0, 10).map(item => ({
    name: item.name, map: item.map, status: item.status,
    minRespawn: item.minRespawnDate ? formatDateTime(item.minRespawnDate) : 'sem registro',
    maxRespawn: item.maxRespawnDate ? formatDateTime(item.maxRespawnDate) : 'sem registro',
    priority: item.priority, lastKiller: item.latest?.killer ?? 'sem info',
  }))

  const prompt = `Você é um analista de rota de MVP para Ragnarok Online (servidor TRUEMMO).
Responda em português do Brasil, de forma objetiva e curta.
Indique: 1) melhor alvo agora com justificativa rápida; 2) até 2 alternativas.
Dados: ${JSON.stringify(snapshot)}`

  for (const model of MODELS) {
    const { ok, status, text } = await tryModel(model, prompt, apiKey)

    if (ok) {
      try {
        const data = JSON.parse(text)
        return (
          data?.candidates?.[0]?.content?.parts
            ?.map((p: { text: string }) => p.text)
            .join('\n') ?? 'Gemini não retornou sugestão.'
        )
      } catch { return 'Erro ao processar resposta do Gemini.' }
    }

    if (status === 429)                   return localSuggestion(mvps)
    if (status === 401 || status === 403) return '🔑 Chave inválida ou sem permissão. Verifique VITE_GEMINI_API_KEY na Vercel.'
    if (status === 404)                   continue
    return `❌ Erro na API Gemini (${status}). Tente novamente.`
  }

  return localSuggestion(mvps)
}
