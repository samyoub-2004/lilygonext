"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, FileText } from "lucide-react"

const sections = [
  {
    title: "Informations sur l'éditeur du site",
    content: [
      "Ce site internet est édité par la société HYMAS, société immatriculée au Registre du Commerce et des Sociétés sous le numéro 89276782300016, dont le siège social est situé au : 7 rue Edouard Pons, 13006 MARSEILLE 06, France.",
      "Téléphone : +33 7 50 14 18 64",
      "E-mail : contact@lilygo.fr",
      "Représentée par : M. HYMAS",
      "L'hébergement du site internet de l'entreprise est assuré par la société LWS, fournisseur spécialisé en hébergement web et services de domaine."
    ]
  },
  {
    title: "Description du service",
    content: [
      "L'entreprise HYMAS propose un service de réservation de trajets privés en VTC. L'accès à ce service via notre site implique l'adhésion sans réserve de l'utilisateur aux conditions générales en vigueur. Ces conditions s'imposent systématiquement, même en présence de clauses contraires dans d'autres documents."
    ]
  },
  {
    title: "Modalités de réservation",
    content: [
      "Les tarifs forfaitaires sont prioritairement appliqués lorsque le trajet correspond à un forfait existant. Ces forfaits peuvent être attribués après la réservation si les conditions le justifient."
    ]
  },
  {
    title: "Obligations du client-passager",
    list: [
      "Il est formellement interdit de fumer dans les véhicules, d'y introduire des animaux sans autorisation préalable, ou de transporter des objets dangereux (produits inflammables, toxiques, explosifs, etc.).",
      "En cas de non-respect de ces règles, le client sera tenu responsable. La société se réserve le droit de prendre toute mesure nécessaire en cas d'infraction.",
      "Aucun remboursement ou indemnité ne sera accordé en cas de retard dû à des aléas de circulation ou à des événements indépendants de notre volonté.",
      "Annulation par le client ou l'entreprise, remboursement sous 7 jours ouvrables suivant votre demande de remboursement.",
      "Toute demande d'annulation, qu'elle émane du client ou de l'entreprise, peut donner lieu à un remboursement. Celui-ci sera effectué dans un délai maximum de 7 jours ouvrables à compter de la réception de la demande.",
      "Pour toute demande de remboursement, le client est invité à adresser un email à l'adresse suivante : contact@lilygo.fr en précisant les informations relatives à la course concernée (date, heure, nom, numéro de réservation).",
      "La société peut confier tout ou partie des prestations à des chauffeurs partenaires, rigoureusement sélectionnés."
    ]
  },
  {
    title: "Assurance",
    content: [
      "Tous les chauffeurs affiliés à notre service disposent d'une couverture d'assurance professionnelle conforme à la législation en vigueur, garantissant la sécurité des passagers tout au long de leur trajet."
    ]
  },
  {
    title: "Politique de non-discrimination",
    content: [
      "Nos services sont accessibles à toutes et à tous, sans aucune distinction d'origine, de couleur de peau, de nationalité, de religion, de genre, de situation familiale, de handicap ou toute autre caractéristique protégée par la loi. Les réservations sont acceptées sous réserve de la disponibilité du chauffeur, sans considération discriminatoire."
    ]
  },
  {
    title: "Résolution en ligne des litiges (RLL)",
    content: [
      "Conformément au Règlement (UE) n° 524/2013 relatif à la résolution des litiges en ligne dans le cadre de la consommation, la Commission européenne propose une plateforme en ligne pour le règlement des litiges, accessible à l'adresse suivante : https://ec.europa.eu/consumers/odr."
    ]
  },
  {
    title: "Droit applicable et juridiction",
    content: [
      "Les présentes mentions légales et conditions d'utilisation sont régies par le droit français. Tout différend relatif à leur interprétation ou à leur exécution sera soumis aux tribunaux compétents."
    ]
  }
]

export default function LegalNoticePage() {
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
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Mentions Légales</h1>
              <p className="text-gray-600 mt-1">LILYGO - Transport VIP Premium</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section) => (
            <section key={section.title} className="glass rounded-2xl p-8 border border-white/20">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">{section.title}</h2>
              {section.content && (
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  {section.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              )}
              {section.list && (
                <ul className="mt-4 space-y-3 text-gray-700 leading-relaxed">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            © 2024 LILYGO. Tous droits réservés.
          </p>
        </div>
      </div>
    </div>
  )
}
