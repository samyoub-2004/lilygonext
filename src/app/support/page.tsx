"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, LifeBuoy, Mail, Phone, MessageCircle, Clock, MapPin, FileText, ShieldCheck } from "lucide-react"
import { CONTACT_EMAIL, CONTACT_PHONE, SITE_NAME, ORGANIZATION_ADDRESS } from "../../lib/seo"

const supportChannels = [
  {
    title: "Assistance par email",
    description:
      "Écrivez-nous pour toute question liée à votre compte, vos réservations ou un incident dans l'application. Nous répondons en moins de 24 heures ouvrées.",
    icon: Mail,
    action: {
      label: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
    },
  },
  {
    title: "Support téléphonique",
    description:
      "Notre équipe est disponible pour les situations urgentes ou les accompagnements personnalisés. N'hésitez pas à nous appeler pour un suivi immédiat.",
    icon: Phone,
    action: {
      label: CONTACT_PHONE,
      href: `tel:${CONTACT_PHONE.replace(/\s+/g, "")}`,
    },
  },
  {
    title: "Messagerie in-app",
    description:
      "Depuis l'application LILYGO, ouvrez la section Assistance pour discuter en direct avec un conseiller lorsque vous êtes connecté.",
    icon: MessageCircle,
    action: {
      label: "Ouvrir le centre d'aide",
      href: "#centre-aide",
    },
  },
]

const resourceLinks = [
  {
    title: "FAQ et guides",
    description: "Consultez les réponses aux questions fréquentes sur les réservations, paiements et droits des passagers.",
    href: "#ressources",
  },
  {
    title: "Politique de confidentialité",
    description: "Découvrez comment nous protégeons vos données personnelles et vos informations de paiement.",
    href: "/privacy",
  },
  {
    title: "Mentions légales",
    description: "Accédez aux informations relatives à l'éditeur du service et à nos engagements réglementaires.",
    href: "/mentions-legales",
  },
]

export default function SupportPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-white rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
              <LifeBuoy className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Support {SITE_NAME}</h1>
              <p className="text-gray-600 mt-1">Votre assistance dédiée pour un transport VIP en toute sérénité.</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-gray-700">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm uppercase tracking-wide text-gray-500">Disponibilité de l'équipe</p>
                <p className="font-medium">Lundi au dimanche · 7h00 — 23h00 (heure de Paris)</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-orange-600" />
              <p className="text-sm md:text-right">
                Temps de réponse moyen : <span className="font-semibold">moins de 24h ouvrées</span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {supportChannels.map((channel) => (
            <div key={channel.title} className="glass rounded-2xl p-6 border border-white/20 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <channel.icon className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-serif font-bold text-gray-900">{channel.title}</h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{channel.description}</p>
              <a
                href={channel.action.href}
                className="inline-flex items-center justify-center rounded-full bg-orange-600 text-white px-4 py-2 text-sm font-semibold hover:bg-orange-700 transition-colors"
              >
                {channel.action.label}
              </a>
            </div>
          ))}
        </div>

        <section id="centre-aide" className="glass rounded-2xl p-8 border border-white/20 mt-10">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Centre d'aide LILYGO</h2>
          <p className="text-gray-700 leading-relaxed">
            Consultez les étapes détaillées pour réserver un trajet, suivre votre chauffeur ou gérer vos informations personnelles.
            Si vous avez besoin d'une intervention rapide, contactez-nous par téléphone pour être mis en relation avec un conseiller.
          </p>
        </section>

        <section id="ressources" className="glass rounded-2xl p-8 border border-white/20 mt-10">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="w-6 h-6 text-orange-600" />
            <h2 className="text-2xl font-serif font-bold text-gray-900">Ressources utiles</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {resourceLinks.map((resource) => (
              <Link key={resource.title} href={resource.href} className="block">
                <article className="h-full rounded-2xl border border-white/10 bg-white/40 p-6 backdrop-blur transition-transform hover:-translate-y-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{resource.description}</p>
                </article>
              </Link>
            ))}
          </div>
        </section>

        <section className="glass rounded-2xl p-8 border border-white/20 mt-10">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-serif font-bold text-gray-900">Coordonnées officielles</h2>
              <p className="text-gray-700 leading-relaxed">
                Pour toute demande écrite, veuillez adresser vos correspondances à notre siège social. Notre équipe support vous répondra sous 24 heures ouvrées.
              </p>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-orange-600" />
                  <span>
                    <strong>Email :</strong> {CONTACT_EMAIL}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-orange-600" />
                  <span>
                    <strong>Téléphone :</strong> {CONTACT_PHONE}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <span>
                    <strong>Adresse :</strong> {ORGANIZATION_ADDRESS.streetAddress}, {ORGANIZATION_ADDRESS.postalCode} {ORGANIZATION_ADDRESS.addressLocality}, {ORGANIZATION_ADDRESS.addressCountry}
                  </span>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/50 p-6 backdrop-blur">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Situations prioritaires</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li>• Assistance chauffeur en cours de trajet</li>
                <li>• Problèmes de facturation ou de paiement Stripe/PayPal</li>
                <li>• Demandes RGPD (droit d'accès ou suppression)</li>
                <li>• Signalement de sécurité ou incident urgent</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Dernière mise à jour : Octobre 2024 · © {new Date().getFullYear()} {SITE_NAME}
          </p>
        </div>
      </div>
    </div>
  )
}
