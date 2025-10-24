import type { MetadataRoute } from "next"
import { fetchBlogSlugs } from "../lib/hygraph"
import { getSitemapRoutes, absoluteUrl } from "../lib/seo"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  let slugs: string[] = []
  try {
    slugs = await fetchBlogSlugs()
  } catch (error) {
    console.error("Failed to fetch blog slugs for sitemap", error)
  }

  return getSitemapRoutes(slugs).map(({ path, changeFrequency, priority }) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }))
}
