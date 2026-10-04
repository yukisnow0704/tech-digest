import Parser from 'rss-parser'

const parser = new Parser()

export const RSS_SOURCES = [
  { name: 'zenn', url: 'https://zenn.dev/feed' },
  { name: 'qiita', url: 'https://qiita.com/popular-items/feed' },
] as const

export type FeedItem = {
  source: string
  title: string
  url: string
  publishedAt: string | undefined
}

export async function feachAllFeeds(): Promise<FeedItem[]> {
  const results: FeedItem[] = []

  for (const source of RSS_SOURCES) {
    const feed = await parser.parseURL(source.url)
    for (const item of feed.items) {
      if (!item.title || !item.link) continue
      results.push({
        source: source.name,
        title: item.title,
        url: item.link,
        publishedAt: item.pubDate,
      })
    }
  }

  return results
}
