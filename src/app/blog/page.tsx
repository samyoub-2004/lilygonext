"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Navbar from "../../components/navbar"
import Footer from "../../components/sections/footer"
import BottomNav from "../../components/bottom-nav"
import type { Language } from "../../lib/i18n"
import { fetchBlogArticles, type BlogArticleSummary } from "../../lib/hygraph"

export default function BlogPage() {
  const [language, setLanguage] = useState<Language>("fr")
  const [mounted, setMounted] = useState(false)
  const [articles, setArticles] = useState<BlogArticleSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    let isActive = true
    const loadArticles = async () => {
      setLoading(true)
      setError(null)
      try {
        const items = await fetchBlogArticles(language)
        if (isActive) {
          setArticles(items)
        }
      } catch (err) {
        if (isActive) {
          setError("Impossible de charger les articles. Réessayez plus tard.")
        }
      } finally {
        if (isActive) {
          setLoading(false)
        }
      }
    }

    void loadArticles()

    return () => {
      isActive = false
    }
  }, [language, mounted])

  const headline = useMemo(() => {
    return language === "fr" ? "Découvrez nos derniers articles" : "Discover our latest articles"
  }, [language])

  const subHeadline = useMemo(() => {
    return language === "fr"
      ? "Analyses, conseils et actualités sur le transport VIP et les services LilyGo."
      : "Insights, tips and news about premium chauffeur services and the LilyGo experience."
  }, [language])

  const formatDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString(language === "fr" ? "fr-FR" : "en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (err) {
      return date
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              {language === "fr" ? "Blog LILYGO" : "LILYGO Blog"}
            </span>
            <h1 className="mt-6 text-4xl md:text-5xl font-serif font-bold text-gray-900 leading-tight">
              {headline}
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {subHeadline}
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" aria-label="Loading" />
            </div>
          ) : error ? (
            <div className="rounded-2xl bg-white/80 border border-red-200 p-6 text-center text-red-600 font-medium">
              {error}
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-2xl bg-white/80 border border-orange-100 p-8 text-center text-gray-600">
              {language === "fr"
                ? "Aucun article disponible pour le moment. Revenez bientôt !"
                : "No articles available yet. Check back soon!"}
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="group overflow-hidden rounded-3xl bg-white/90 shadow-lg backdrop-blur border border-white/60 transition-transform hover:-translate-y-1 hover:shadow-xl"
                >
                  {article.picture?.url ? (
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={article.picture.url}
                        alt={article.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="h-56 bg-gradient-to-br from-orange-100 to-red-100" />
                  )}

                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <span>{language === "fr" ? "Publié le" : "Published on"}</span>
                      <span className="font-semibold">{formatDate(article.date)}</span>
                    </div>

                    <h2 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {article.title}
                    </h2>

                    {article.subtitle ? (
                      <p className="text-gray-600 leading-relaxed">
                        {article.subtitle}
                      </p>
                    ) : null}

                    <div className="pt-2">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                      >
                        {language === "fr" ? "Lire l'article" : "Read article"}
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer language={language} />
      <BottomNav />
    </div>
  )
}
