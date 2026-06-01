import { GoogleGenerativeAI } from '@google/generative-ai'
import type { TimerWithDef } from '@/types'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string

if (!apiKey) {
  console.warn('[gemini] VITE_GEMINI_API_KEY not set — AI suggestions disabled')
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null

/**
 * Asks Gemini to suggest the best MVP target given the current active timers.
 * Returns a structured suggestion or null if AI is unavailable.
 */
export async function getSuggestion(
  timers: TimerWithDef[],
  userName: string,
): Promise<string | null> {
  if (!genAI) return null

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const timerSummary = timers
    .map(t => {
      const minutesLeft = Math.round(
        (new Date(t.windowStart).getTime() - Date.now()) / 60000
      )
      return `- ${t.definition.name} (${t.definition.mapLabel}): janela em ${minutesLeft > 0 ? minutesLeft + 'min' : 'ABERTA AGORA'}, drops valiosos: ${t.definition.drops?.filter(d => d.isHighValue).map(d => d.itemName).join(', ') || 'nenhum registrado'}`
    })
    .join('\n')

  const prompt = `
Você é um assistente especialista em Ragnarok Online para o servidor privado TRUEMMO.
O jogador "${userName}" quer saber qual MVP caçar agora.

Status atual dos timers:
${timerSummary}

Considerando janelas de respawn, valor dos drops e urgência, sugira o melhor alvo agora.
Seja direto e objetivo, máximo 3 frases. Fale em português.
`.trim()

  try {
    const result = await model.generateContent(prompt)
    return result.response.text()
  } catch (err) {
    console.error('[gemini] Error generating suggestion:', err)
    return null
  }
}
