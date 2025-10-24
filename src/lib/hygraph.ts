export const HYGRAPH_ENDPOINT = "https://eu-west-2.cdn.hygraph.com/content/cmevmjyrn01mi07w8qsukduc7/master"

export type SupportedLocale = "fr" | "en"

interface HygraphImage {
  url: string
}

export interface BlogArticleSummary {
  title: string
  subtitle: string | null
  slug: string
  date: string
  picture?: HygraphImage | null
}

export interface BlogArticleDetail extends BlogArticleSummary {
  contentHtml: string
}

async function hygraphFetch<T>(query: string, variables?: Record<string, unknown>) {
  const options: RequestInit & { next?: { revalidate?: number } } = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  }

  if (typeof window === "undefined") {
    options.next = { revalidate: 3600 }
  }

  const response = await fetch(HYGRAPH_ENDPOINT, options)

  if (!response.ok) {
    throw new Error(`Hygraph request failed with status ${response.status}`)
  }

  const json = await response.json()
  if (json.errors) {
    throw new Error("Hygraph returned errors")
  }

  return json.data as T
}

export async function fetchBlogArticles(locale: SupportedLocale): Promise<BlogArticleSummary[]> {
  const targetLocale = locale === "en" ? "en" : "fr"

  const data = await hygraphFetch<{
    articles: {
      title: string
      subtitle: string | null
      slug: string
      date: string
      picture?: HygraphImage | null
    }[]
  }>(
    `
      query Articles {
        articles(locales: ${targetLocale}) {
          title
          subtitle
          slug
          date
          picture(locales: [${targetLocale}, en, fr]) {
            url
          }
        }
      }
    `
  )

  return data.articles ?? []
}

export async function fetchBlogArticle(slug: string, locale: SupportedLocale): Promise<BlogArticleDetail | null> {
  const targetLocale = locale === "en" ? "en" : "fr"

  const data = await hygraphFetch<{
    article: {
      title: string
      subtitle: string | null
      slug: string
      date: string
      content: { html: string }
      picture?: HygraphImage | null
    } | null
  }>(
    `
      query Article($slug: String!) {
        article(where: { slug: $slug }, locales: ${targetLocale}) {
          title
          subtitle
          slug
          date
          content {
            html
          }
          picture(locales: [${targetLocale}, en, fr]) {
            url
          }
        }
      }
    `,
    {
      slug,
    }
  )

  if (!data.article) {
    return null
  }

  return {
    title: data.article.title,
    subtitle: data.article.subtitle,
    slug: data.article.slug,
    date: data.article.date,
    contentHtml: data.article.content?.html ?? "",
    picture: data.article.picture,
  }
}

export async function fetchBlogSlugs(): Promise<string[]> {
  const data = await hygraphFetch<{
    articles: { slug: string }[]
  }>(
    `
      query ArticleSlugs {
        articles {
          slug
        }
      }
    `
  )

  const slugs = data.articles?.map((article) => article.slug).filter(Boolean) ?? []
  return Array.from(new Set(slugs))
}
