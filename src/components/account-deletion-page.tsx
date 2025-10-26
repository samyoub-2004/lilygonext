"use client"

import type React from "react"
import { useState } from "react"
import { Trash2, Mail, Phone, User, Calendar, CreditCard, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import Navbar from "./navbar"
import Footer from "./sections/footer"
import { SITE_NAME, CONTACT_EMAIL, CONTACT_PHONE } from "../lib/seo"

export default function AccountDeletionPage() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    reason: "",
    confirmation: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.confirmation) {
      alert("Veuillez confirmer que vous comprenez les conséquences de la suppression.")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/delete-account", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setIsSubmitted(true)
      } else {
        throw new Error("Erreur lors de l'envoi de la demande")
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Une erreur s'est produite. Veuillez réessayer ou nous contacter directement.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar language="fr" onLanguageChange={() => {}} />

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                Demande de suppression reçue
              </h1>

              <p className="text-gray-600 mb-6">
                Votre demande de suppression de données a été reçue avec succès. Nous allons traiter votre demande
                dans les meilleurs délais, sous 30 jours maximum comme l'exige la réglementation.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Que se passe-t-il ensuite ?</strong><br />
                  • Nous vous enverrons un email de confirmation<br />
                  • Vos données personnelles seront supprimées de nos serveurs<br />
                  • Vous recevrez un email de confirmation de suppression
                </p>
              </div>

              <div className="text-center">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all"
                >
                  Retour à l'accueil
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer language="fr" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar language="fr" onLanguageChange={() => {}} />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="w-10 h-10 text-red-600" />
            </div>

            <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
              Suppression de Compte et Données
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Demandez la suppression de vos données personnelles collectées par {SITE_NAME}
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm text-amber-800 font-semibold mb-1">
                    Important : Cette action est irréversible
                  </p>
                  <p className="text-sm text-amber-700">
                    La suppression de vos données entraînera l'effacement définitif de toutes vos informations
                    personnelles de nos systèmes. Cette action ne peut pas être annulée.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Formulaire de demande */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">
                Formulaire de demande
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-900">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Adresse email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    placeholder="votre.email@exemple.com"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    L'email utilisé lors de vos réservations
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-900">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    placeholder="+33 6 XX XX XX XX"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Optionnel - Pour identifier plus facilement votre compte
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3 text-gray-900">
                    Raison de la suppression (optionnel)
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all"
                    placeholder="Expliquez-nous pourquoi vous souhaitez supprimer vos données..."
                  />
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="confirmation"
                      checked={formData.confirmation}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                      required
                    />
                    <div className="text-sm">
                      <p className="text-gray-900 font-semibold mb-1">
                        Je confirme ma demande de suppression *
                      </p>
                      <p className="text-gray-600">
                        Je comprends que cette action supprimera définitivement toutes mes données personnelles
                        de la base de données de {SITE_NAME} et que je ne pourrai plus accéder à mes réservations.
                      </p>
                    </div>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold transition-all duration-300 hover:from-red-600 hover:to-red-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-5 h-5" />
                      Envoyer la demande de suppression
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Informations sur les données */}
            <div className="space-y-6">
              {/* Types de données supprimées */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900">
                    Données supprimées
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Informations personnelles</p>
                      <p className="text-sm text-gray-600">Nom, prénom, email, téléphone</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Historique des réservations</p>
                      <p className="text-sm text-gray-600">Toutes vos réservations passées</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Informations de paiement</p>
                      <p className="text-sm text-gray-600">Historique des paiements et moyens de paiement</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Données conservées */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-gray-900">
                    Données conservées (anonymisées)
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Statistiques d'utilisation</p>
                      <p className="text-sm text-gray-600">Données anonymisées à des fins d'amélioration du service</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-semibold text-gray-900">Données financières</p>
                      <p className="text-sm text-gray-600">Conformément aux obligations légales de conservation</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations de contact */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-serif font-bold mb-4">
                  Besoin d'aide ?
                </h3>

                <p className="mb-4 opacity-90">
                  Vous pouvez également nous contacter directement pour toute question concernant
                  vos données personnelles.
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <a href={`mailto:${CONTACT_EMAIL}`} className="hover:underline">
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <a href={`tel:${CONTACT_PHONE}`} className="hover:underline">
                      {CONTACT_PHONE}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer language="fr" />
    </div>
  )
}
