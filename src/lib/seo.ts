import type { MetadataRoute } from "next"

export const SITE_URL = "https://www.lilygo.fr"
export const SITE_NAME = "LILYGO"
export const CONTACT_EMAIL = "contact@lilygo.fr"
export const CONTACT_PHONE = "+33 7 50 14 18 64"

export const ORGANIZATION_ADDRESS = {
  streetAddress: "7 rue Edouard Pons",
  addressLocality: "Marseille",
  postalCode: "13006",
  addressCountry: "FR",
}

export interface SitemapRoute {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  priority: MetadataRoute.Sitemap[number]["priority"]
}

export const CORE_ROUTES: SitemapRoute[] = [
  { path: "/", changeFrequency: "monthly", priority: 1 },
  { path: "/book", changeFrequency: "monthly", priority: 0.9 },
  { path: "/reservation", changeFrequency: "monthly", priority: 0.8 },
  { path: "/payment", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.5 },
  { path: "/mentions-legales", changeFrequency: "yearly", priority: 0.5 },
  { path: "/suppression-compte", changeFrequency: "yearly", priority: 0.3 },
]

export const BLOG_BASE_PATH = "/blog"

export const getSitemapRoutes = (blogSlugs: string[] = []): SitemapRoute[] => {
  const blogRoutes: SitemapRoute[] = blogSlugs.map((slug) => ({
    path: `${BLOG_BASE_PATH}/${slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  return [...CORE_ROUTES, { path: BLOG_BASE_PATH, changeFrequency: "weekly", priority: 0.7 }, ...blogRoutes]
}

export const absoluteUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path
  }
  return `${SITE_URL}${path}`
}
