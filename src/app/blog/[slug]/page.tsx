"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import Navbar from "../../../components/navbar"
import Footer from "../../../components/sections/footer"
import BottomNav from "../../../components/bottom-nav"
import type { Language } from "../../../lib/i18n"
import { fetchBlogArticle } from "../../../lib/hygraph"

type ArticleState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | {
      status: "ready"
      data: {
        title: string
        subtitle: string | null
        contentHtml: string
        date: string
        pictureUrl?: string | null
      }
    }

export default function BlogArticlePage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const slug = params?.slug

  const [language, setLanguage] = useState<Language>("fr")
  const [mounted, setMounted] = useState(false)
  const [articleState, setArticleState] = useState<ArticleState>({ status: "idle" })

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    if (!mounted || !slug) return

    let isActive = true
    const loadArticle = async () => {
      setArticleState({ status: "loading" })
      try {
        const article = await fetchBlogArticle(slug, language)
        if (!isActive) return

        if (!article) {
          setArticleState({
            status: "error",
            message:
              language === "fr"
                ? "Cet article n'existe plus ou a été déplacé."
                : "This article no longer exists or has been moved.",
          })
          return
        }

        setArticleState({
          status: "ready",
          data: {
            title: article.title,
            subtitle: article.subtitle,
            contentHtml: article.contentHtml,
            date: article.date,
            pictureUrl: article.picture?.url,
          },
        })
      } catch (err) {
        if (!isActive) return
        setArticleState({
          status: "error",
          message:
            language === "fr"
              ? "Impossible de charger l'article. Réessayez plus tard."
              : "Unable to load the article. Please try again later.",
        })
      }
    }

    void loadArticle()

    return () => {
      isActive = false
    }
  }, [slug, language, mounted])

  const formatDate = useMemo(() => {
    return (date: string) => {
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
  }, [language])

  const backLabel = language === "fr" ? "← Retour au blog" : "← Back to blog"

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <Navbar language={language} onLanguageChange={setLanguage} />

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-6">
            <button
              onClick={() => router.push("/blog")}
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm transition hover:bg-white"
            >
              {backLabel}
            </button>
          </div>

          {articleState.status === "loading" ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" aria-label="Loading" />
            </div>
          ) : articleState.status === "error" ? (
            <div className="rounded-2xl bg-white/90 border border-red-200 p-10 text-center text-red-600">
              <p className="mb-6 font-medium">{articleState.message}</p>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-orange-700"
              >
                {language === "fr" ? "Voir tous les articles" : "View all articles"}
              </Link>
            </div>
          ) : articleState.status === "ready" ? (
            <article className="glass rounded-3xl border border-white/40 bg-white/80 p-6 md:p-10 space-y-8">
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-3 text-sm text-orange-600">
                  <span>{language === "fr" ? "Publié le" : "Published on"}</span>
                  <span className="font-semibold">{formatDate(articleState.data.date)}</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
                  {articleState.data.title}
                </h1>

                {articleState.data.subtitle ? (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {articleState.data.subtitle}
                  </p>
                ) : null}
              </header>

              {articleState.data.pictureUrl ? (
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={articleState.data.pictureUrl}
                    alt={articleState.data.title}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div
                className="prose prose-orange max-w-none prose-headings:font-serif prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-orange-600"
                dangerouslySetInnerHTML={{ __html: articleState.data.contentHtml }}
              />
            </article>
          ) : null}
        </div>
      </main>

      <Footer language={language} />
      <BottomNav />
    </div>
  )
}
