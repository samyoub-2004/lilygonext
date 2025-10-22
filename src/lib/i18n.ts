export const translations = {
  fr: {
    nav: {
      services: "Services",
      faq: "FAQ",
      contact: "Contact",
    },
    hero: {
      badge: "Transport VIP Premium",
      title: "Votre Confort,",
      titleAccent: "Notre Priorité",
      description:
        "Découvrez le luxe du transport avec nos véhicules premium et nos chauffeurs professionnels. Une expérience de voyage exceptionnelle vous attend.",
      feature1: "Véhicules Premium",
      feature2: "Chauffeurs Certifiés",
      feature3: "Disponible 24/7",
      feature4: "Tarifs Transparents",
      cta: "Réserver Maintenant",
      availability: "Service actuellement disponible en France",
      availabilityDesc:
        "Nous opérons dans toutes les grandes villes françaises. Expansion européenne prévue prochainement.",
    },
    services: {
      badge: "Nos Services",
      title: "Excellence en Chaque Détail",
      description: "Découvrez ce qui fait de LUXE VTC le choix préféré des clients exigeants",
      service1Title: "Réservation Rapide",
      service1Desc: "Réservez en moins de 2 minutes via notre plateforme intuitive et sécurisée.",
      service2Title: "Chauffeurs Professionnels",
      service2Desc: "Nos chauffeurs sont certifiés, expérimentés et formés aux plus hauts standards.",
      service3Title: "Disponibilité 24/7",
      service3Desc: "Service disponible à tout moment, jour et nuit, pour vos déplacements.",
      service4Title: "Sécurité Garantie",
      service4Desc: "Véhicules assurés et chauffeurs vérifiés pour votre tranquillité d'esprit.",
    },
    faq: {
      badge: "Questions Fréquentes",
      title: "Vos Questions, Nos Réponses",
      q1: "Comment puis-je réserver un trajet ?",
      a1: "Vous pouvez réserver directement via notre formulaire en ligne en indiquant votre lieu de départ, destination, date et heure. Vous recevrez une confirmation par email et SMS.",
      q2: "Quels sont vos tarifs ?",
      a2: "Nos tarifs sont transparents et calculés en fonction de la distance et du type de véhicule. Pas de frais cachés. Vous recevrez un devis avant de confirmer votre réservation.",
      q3: "Puis-je annuler ma réservation ?",
      a3: "Oui, vous pouvez annuler gratuitement jusqu'à 2 heures avant votre trajet. Au-delà, des frais d'annulation peuvent s'appliquer.",
      q4: "Acceptez-vous les paiements par carte bancaire ?",
      a4: "Oui, nous acceptons Visa, Mastercard, ainsi que les paiements via Stripe et PayPal pour votre commodité.",
      q5: "Vos chauffeurs sont-ils assurés ?",
      a5: "Absolument. Tous nos chauffeurs sont certifiés, vérifiés et nos véhicules sont entièrement assurés pour votre sécurité.",
      q6: "Livrez-vous en dehors de la France ?",
      a6: "Actuellement, nos services sont disponibles uniquement en France. Nous prévoyons une expansion européenne prochainement.",
    },
  },
  en: {
    nav: {
      services: "Services",
      faq: "FAQ",
      contact: "Contact",
    },
    hero: {
      badge: "Premium VIP Transport",
      title: "Your Comfort,",
      titleAccent: "Our Priority",
      description:
        "Discover the luxury of transportation with our premium vehicles and professional drivers. An exceptional travel experience awaits you.",
      feature1: "Premium Vehicles",
      feature2: "Certified Drivers",
      feature3: "Available 24/7",
      feature4: "Transparent Pricing",
      cta: "Book Now",
      availability: "Service currently available in France",
      availabilityDesc: "We operate in all major French cities. European expansion planned soon.",
    },
    services: {
      badge: "Our Services",
      title: "Excellence in Every Detail",
      description: "Discover what makes LUXE VTC the preferred choice of demanding clients",
      service1Title: "Quick Booking",
      service1Desc: "Book in less than 2 minutes via our intuitive and secure platform.",
      service2Title: "Professional Drivers",
      service2Desc: "Our drivers are certified, experienced and trained to the highest standards.",
      service3Title: "24/7 Availability",
      service3Desc: "Service available at any time, day and night, for your travels.",
      service4Title: "Guaranteed Safety",
      service4Desc: "Insured vehicles and verified drivers for your peace of mind.",
    },
    faq: {
      badge: "Frequently Asked Questions",
      title: "Your Questions, Our Answers",
      q1: "How can I book a trip?",
      a1: "You can book directly via our online form by providing your departure location, destination, date and time. You will receive confirmation by email and SMS.",
      q2: "What are your rates?",
      a2: "Our rates are transparent and calculated based on distance and vehicle type. No hidden fees. You will receive a quote before confirming your reservation.",
      q3: "Can I cancel my reservation?",
      a3: "Yes, you can cancel for free up to 2 hours before your trip. Beyond that, cancellation fees may apply.",
      q4: "Do you accept credit card payments?",
      a4: "Yes, we accept Visa, Mastercard, as well as payments via Stripe and PayPal for your convenience.",
      q5: "Are your drivers insured?",
      a5: "Absolutely. All our drivers are certified, verified and our vehicles are fully insured for your safety.",
      q6: "Do you deliver outside of France?",
      a6: "Currently, our services are only available in France. We are planning European expansion soon.",
    },
  },
}

export type Language = "fr" | "en"

export function getTranslation(lang: Language, key: string): string {
  const keys = key.split(".")
  let value: any = translations[lang]

  for (const k of keys) {
    value = value?.[k]
  }

  return value || key
}
