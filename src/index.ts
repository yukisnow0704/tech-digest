import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { feachAllFeeds } from './lib/res.js'
import { summarizeAndClassify } from './lib/gemini.js'
import { isNewArticle, saveArticle } from './lib/store.js'

const app = new Hono()

app.get('/', (c) => c.text('tech-digest is running'))
app.get('/ingest', async (c) => {
  const items = await feachAllFeeds()

  let savedConst = 0
  let skippedCount = 0
  for (const item of items) {
    const isNew = await isNewArticle(item.url)
    if (!isNew) {
        skippedCount++
        continue
    }

    const classification = await summarizeAndClassify(item.title, item.url)
    await saveArticle({ ...item, ...classification })
    savedConst++
  }

  return c.json({ saved: savedConst, skipped: skippedCount })
})

const port = 8080
serve({ fetch: app.fetch, port })
console.log(`Server running on port ${port}`)
