import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GCP_PROJECT_ID ?? 'tech-digest-prod',
  location: 'asia-northeast1',
})

export type Classification = {
  summary: string
  category: string
}

export async function summarizeAndClassify(title: string, url: string): Promise<Classification> {
  const prompt = `以下の技術記事のタイトルから、日本語で1行の要約と、カテゴリ(自由に1つ)を出してください。
JSON形式のみで返してください。他の文章は不要です。

タイトル: ${title}
URL: ${url}

出力形式: {"summary": "...", "category": "..."}`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
  })

  const text = response.text ?? '{}'
  const jsonText = text.replace(/```json|```/g, '').trim()
  return JSON.parse(jsonText) as Classification
}