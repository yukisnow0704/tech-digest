import { Firestore } from '@google-cloud/firestore'
import { BigQuery } from '@google-cloud/bigquery'
import type { FeedItem } from './res.js'
import type { Classification } from './gemini.js'
import { fire } from 'hono/service-worker'

const PROJECT_ID = process.env.GCP_PROJECT_ID ?? 'tech-digest-prod'

const firestore = new Firestore({ projectId: PROJECT_ID })
const bigquery = new BigQuery({ projectId: PROJECT_ID })

export type Article = FeedItem & Classification

function docId(url: string): string {
  return Buffer.from(url).toString('base64url')
}

export async function isNewArticle(url: string): Promise<boolean> {
  const doc = await firestore.collection('articles').doc(docId(url)).get()
  return !doc.exists
}

export async function saveArticle(article: Article): Promise<void> {
  const now = new Date();

  await firestore.collection('articles').doc(docId(article.url)).set({
    ...article,
    createdAt: now,
  })

  await bigquery.dataset('tech_digest').table('articles').insert([
    {
      id: docId(article.url),
      title: article.title,
      url: article.url,
      summary: article.summary,
      category: article.category,
      published_at: article.publishedAt ? new Date(article.publishedAt).toISOString() : null,
      created_at: now.toISOString(),
    },
  ])
}