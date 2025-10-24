"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, Shield, MapPin, CreditCard, Mail, Phone, Users, Database, Lock, Eye, Trash2, Download, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PrivacyPolicyPage() {
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
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-white rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Politique de Confidentialité</h1>
              <p className="text-gray-600 mt-1">LILYGO - Transport VIP Premium</p>
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="glass rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500" />
            <p className="text-sm text-gray-600">
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <section className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              LILYGO ("nous", "notre" ou "nos") exploite l'application de transport VIP premium LILYGO 
              (ci-après dénommée le "Service"). Cette page vous informe de nos politiques concernant 
              la collecte, l'utilisation et la divulgation de données personnelles lorsque vous utilisez 
              notre Service et les choix que vous avez associés à ces données.
            </p>
          </section>

          {/* Data Collection */}
          <section className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Informations Collectées</h2>
            
            <div className="space-y-6">
              {/* Personal Data */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-500" />
                  Données Personnelles
                </h3>
                <p className="text-gray-700 mb-4">
                  Lors de l'utilisation de notre Service, nous collectons les informations suivantes :
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Nom et prénom</strong> - Pour l'identification et la personnalisation du service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Adresse e-mail</strong> - Pour les confirmations et communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Numéro de téléphone</strong> - Pour la coordination des trajets</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Numéro de vol</strong> (optionnel) - Pour les services aéroport</span>
                  </li>
                </ul>
              </div>

              {/* Location Data */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  Données de Localisation
                </h3>
                <p className="text-gray-700 mb-4">
                  Nous collectons et traitons des informations sur votre localisation pour :
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Afficher votre position sur la carte</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Calculer des itinéraires optimaux</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span>Fournir des services basés sur la localisation</span>
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700">
                    <strong>Contrôle :</strong> Vous pouvez activer ou désactiver les services de localisation 
                    à tout moment dans les paramètres de votre appareil.
                  </p>
                </div>
              </div>

              {/* Payment Data */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-500" />
                  Données de Paiement
                </h3>
                <p className="text-gray-700 mb-4">
                  Nous utilisons des processeurs de paiement tiers sécurisés :
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Stripe</h4>
                    <p className="text-sm text-gray-600">Paiements par carte bancaire</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2">PayPal</h4>
                    <p className="text-sm text-gray-600">Paiements via PayPal</p>
                  </div>
                  <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Espèces</h4>
                    <p className="text-sm text-gray-600">Paiement à la livraison</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    <strong>Important :</strong> Nous ne stockons pas vos informations de carte bancaire. 
                    Toutes les transactions sont traitées de manière sécurisée par nos partenaires certifiés PCI-DSS.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Usage */}
          <section className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Utilisation des Données</h2>
            <p className="text-gray-700 mb-4">
              LILYGO utilise les données collectées à diverses fins :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Fournir et maintenir le Service</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Traiter les réservations</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Coordonner les trajets</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Envoyer des confirmations</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Améliorer l'expérience utilisateur</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Fournir un support client</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Analyser l'utilisation du service</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Détecter et prévenir les problèmes</span>
                </div>
              </div>
            </div>
          </section>

          {/* Third Party Services */}
          <section className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6">Services Tiers Utilisés</h2>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-gray-900 mb-2">Firebase (Google)</h3>
                <p className="text-sm text-gray-600 mb-2">Authentification, base de données, analytics</p>
                <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer" 
                   className="text-sm text-blue-600 hover:text-blue-800 underline">
                  Politique de confidentialité Firebase
                </a>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
                <h3 className="font-semibold text-gray-900 mb-2">Google Maps</h3>
                <p className="text-sm text-gray-600 mb-2">Services de cartographie et géolocalisation</p>
                <a href="https://www.google.com/intl/fr/help/terms_maps/" target="_blank" rel="noopener noreferrer" 
                   className="text-sm text-red-600 hover:text-red-800 underline">
                  Politique de confidentialité Google Maps
                </a>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                <h3 className="font-semibold text-gray-900 mb-2">Stripe</h3>
                <p className="text-sm text-gray-600 mb-2">Traitement des paiements par carte</p>
                <a href="https://stripe.com/fr/privacy" target="_blank" rel="noopener noreferrer" 
                   className="text-sm text-purple-600 hover:text-purple-800 underline">
                  Politique de confidentialité Stripe
                </a>
              </div>
              
              <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-gray-900 mb-2">PayPal</h3>
                <p className="text-sm text-gray-600 mb-2">Traitement des paiements PayPal</p>
                <a href="https://www.paypal.com/fr/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" 
                   className="text-sm text-yellow-600 hover:text-yellow-800 underline">
                  Politique de confidentialité PayPal
                </a>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Lock className="w-6 h-6 text-green-500" />
              Sécurité des Données
            </h2>
            <p className="text-gray-700 mb-4">
              La sécurité de vos données est importante pour nous. Nous mettons en œuvre les mesures suivantes :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Chiffrement SSL/TLS pour toutes les transmissions</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Authentification sécurisée via Firebase</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Tokenisation des paiements</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Accès restreint aux données personnelles</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Surveillance régulière de la sécurité</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Conformité aux standards de sécurité</span>
                </div>
              </div>
            </div>
          </section>

          {/* User Rights */}
          <section className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Eye className="w-6 h-6 text-blue-500" />
              Vos Droits (RGPD)
            </h2>
            <p className="text-gray-700 mb-6">
              Si vous êtes résident de l'Espace économique européen (EEE), vous avez les droits suivants :
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-500" />
                    Droit d'accès
                  </h3>
                  <p className="text-sm text-gray-600">Demander des copies de vos données personnelles</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-green-500" />
                    Droit de rectification
                  </h3>
                  <p className="text-sm text-gray-600">Corriger toute information inexacte</p>
                </div>
                
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-red-500" />
                    Droit à l'effacement
                  </h3>
                  <p className="text-sm text-gray-600">Demander la suppression de vos données</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Droit de restreindre le traitement</h3>
                  <p className="text-sm text-gray-600">Limiter le traitement de vos données</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Download className="w-4 h-4 text-purple-500" />
                    Droit à la portabilité
                  </h3>
                  <p className="text-sm text-gray-600">Transférer vos données à une autre organisation</p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-gray-900 mb-2">Droit d'opposition</h3>
                  <p className="text-sm text-gray-600">Vous opposer au traitement de vos données</p>
                </div>
              </div>
            </div>
          </section>

          {/* Data Retention */}
          <section className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Conservation des Données</h2>
            <p className="text-gray-700">
              LILYGO conservera vos Données Personnelles uniquement aussi longtemps que nécessaire aux fins 
              énoncées dans cette Politique de confidentialité. Nous conserverons et utiliserons vos Données 
              Personnelles dans la mesure nécessaire pour nous conformer à nos obligations légales, résoudre 
              les litiges et appliquer nos politiques.
            </p>
          </section>

          {/* Children Privacy */}
          <section className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Confidentialité des Enfants</h2>
            <p className="text-gray-700">
              Notre Service ne s'adresse pas aux personnes de moins de 18 ans ("Enfants"). Nous ne collectons 
              pas sciemment d'informations personnellement identifiables auprès de personnes de moins de 18 ans. 
              Si vous êtes un parent ou un tuteur et que vous savez que votre enfant nous a fourni des Données 
              Personnelles, veuillez nous contacter.
            </p>
          </section>

          {/* Contact */}
          <section className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Mail className="w-6 h-6 text-orange-500" />
              Nous Contacter
            </h2>
            <p className="text-gray-700 mb-4">
              Si vous avez des questions concernant cette Politique de confidentialité ou pour exercer vos droits, 
              veuillez nous contacter :
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700">
                  <strong>Email :</strong> contact@lilygo.fr
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span className="text-gray-700">
                  <strong>Téléphone :</strong> +33 1 23 45 67 89
                </span>
              </div>
            </div>
          </section>

          {/* Policy Updates */}
          <section className="glass rounded-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-4">Modifications de cette Politique</h2>
            <p className="text-gray-700">
              Nous pouvons mettre à jour notre Politique de confidentialité de temps en temps. Nous vous 
              informerons de tout changement en publiant la nouvelle Politique de confidentialité sur cette page. 
              Il vous est conseillé de consulter cette Politique de confidentialité périodiquement pour tout changement.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            © 2024 LILYGO. Tous droits réservés. | 
            <a href="/privacy" className="text-orange-600 hover:text-orange-800 underline ml-1">
              Politique de Confidentialité
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

