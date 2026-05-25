import { Check, Star, Users, Clock, Target, Zap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Header from "../../../layout/public/Header";
import SkewedElement from "../../../components/common/SkewedElement";
import { Link } from "react-router-dom";

const Prices = () => {
  const pricingPlans = [
    {
      id: 1,
      name: "Séance Découverte",
      price: "Gratuit",
      originalPrice: null,
      description: "Première séance offerte pour découvrir nos services",
      features: [
        "Évaluation initiale complète",
        "Définition de vos objectifs",
        "Rencontre avec votre coach",
        "Programme personnalisé",
        "Sans engagement"
      ],
      popular: false,
      bgColor: "bg-white",
      icon: Users
    },
    {
      id: 2,
      name: "Séance à l'Unité",
      price: "80€",
      originalPrice: null,
      description: "Parfait pour tester ou pour des séances ponctuelles",
      features: [
        "Séance personnalisée de 1h",
        "Programme sur mesure",
        "Suivi des progrès",
        "Support nutritionnel",
        "Flexibilité totale"
      ],
      popular: false,
      bgColor: "bg-white",
      icon: Target
    },
    {
      id: 3,
      name: "Forfait 4 Séances",
      price: "280€",
      originalPrice: "320€",
      description: "Notre formule la plus populaire pour un suivi régulier",
      features: [
        "4 séances par mois",
        "Programme progressif",
        "Suivi nutritionnel complet",
        "Support 24/7",
        "Économies de 40€"
      ],
      popular: true,
      bgColor: "bg-[#FFF7F0]",
      icon: Star
    },
    {
      id: 4,
      name: "Forfait 8 Séances",
      price: "520€",
      originalPrice: "640€",
      description: "Intensif pour des résultats rapides et durables",
      features: [
        "8 séances par mois",
        "Programme intensif",
        "Nutrition personnalisée",
        "Accompagnement premium",
        "Économies de 120€"
      ],
      popular: false,
      bgColor: "bg-white",
      icon: Zap
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: "Coachs Certifiés",
      description: "Tous nos coachs sont diplômés et expérimentés"
    },
    {
      icon: Target,
      title: "Programmes Sur-Mesure",
      description: "Chaque programme est adapté à vos objectifs"
    },
    {
      icon: Clock,
      title: "Flexibilité Totale",
      description: "Séances à domicile ou en salle, selon vos préférences"
    },
    {
      icon: Star,
      title: "Suivi Personnalisé",
      description: "Accompagnement complet pour atteindre vos objectifs"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Tarifs - Nos Formules de Coaching | Fitconnect</title>
        <meta
          name="description"
          content="Découvrez nos tarifs transparents et accessibles pour le coaching fitness personnalisé. Séances à l'unité, forfaits mensuels, accompagnement sur-mesure."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 min-h-[300px]">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/welcome/HeroBackground.png')",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Nos Tarifs
          </h1>

          <SkewedElement
            data-cy="breadcrumb"
            className="inline-block bg-orange-500 text-white px-6 py-2.5 hover:bg-orange-600 transition-colors duration-200 shadow-lg"
          >
            <span className="text-sm font-medium">Pages</span>
            <span className="mx-2">›</span>
            <span className="text-sm font-medium">Tarifs</span>
          </SkewedElement>
        </div>
      </section>

      {/* Pricing Content */}
      <section className="relative py-16 bg-[#FFF9F6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choisissez la formule qui correspond le mieux à vos objectifs et à votre budget. <br />Tous nos forfaits incluent un accompagnement personnalisé et des résultats garantis.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {pricingPlans.map((plan) => {
              const IconComponent = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`relative ${plan.bgColor} rounded-2xl shadow-lg border border-orange-100 px-8 py-10 flex flex-col items-center transition-all duration-300 hover:shadow-2xl`}
                >
                  {/* Badge populaire */}
                  {plan.popular && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-1 rounded-b-xl font-bold text-xs tracking-widest shadow-lg z-10">
                      POPULAIRE
                    </div>
                  )}
                  {/* Icône */}
                  <div className="flex items-center justify-center w-14 h-14 bg-orange-500 rounded-xl mb-4">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  {/* Titre */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">{plan.name}</h3>
                  {/* Prix */}
                  <div className="mb-2 flex items-end justify-center gap-2">
                    <span className="text-4xl font-extrabold text-orange-500">{plan.price}</span>
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-400 line-through">{plan.originalPrice}</span>
                    )}
                  </div>
                  {/* Description */}
                  <p className="text-gray-600 text-center mb-4">{plan.description}</p>
                  {/* Liste */}
                  <ul className="space-y-3 mt-6 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-base text-gray-700">
                        <Check className="w-5 h-5 text-orange-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {/* Bouton */}
                  <button
                    className={`w-full ${plan.id === 1 ? 'bg-gray-800 hover:bg-gray-900' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-xl py-3 uppercase font-bold tracking-wide shadow-md transition`}
                  >
                    {plan.id === 1 ? 'Réserver Gratuitement' : 'Choisir ce Plan'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Benefits Section */}
          <div className="bg-white p-12 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Pourquoi Choisir <span className="text-orange-500">FitConnect</span> ?
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Notre plateforme vous offre bien plus qu'un simple coaching. 
                Découvrez tous les avantages inclus dans nos formules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-orange-100 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-orange-500" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-gray-50 p-12 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Questions <span className="text-orange-500">Fréquentes</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Comment se déroule une séance ?
                  </h3>
                  <p className="text-gray-600">
                    Chaque séance dure 1 heure et comprend un échauffement, 
                    l'entraînement principal et une phase de récupération. 
                    Votre coach s'adapte à votre niveau et vos objectifs.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Puis-je annuler une séance ?
                  </h3>
                  <p className="text-gray-600">
                    Oui, vous pouvez annuler jusqu'à 24h avant la séance 
                    sans frais. Au-delà, la séance sera facturée.
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Les séances sont-elles à domicile ?
                  </h3>
                  <p className="text-gray-600">
                    Vous choisissez : à domicile, en salle de sport ou en extérieur. 
                    Nous nous adaptons à vos préférences et votre emploi du temps.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    Y a-t-il un engagement ?
                  </h3>
                  <p className="text-gray-600">
                    Aucun engagement pour les séances à l'unité. 
                    Les forfaits sont sans engagement et renouvelables mensuellement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-orange-500 p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Prêt à Transformer Votre Vie ?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Rejoignez des milliers de clients satisfaits et commencez votre transformation dès aujourd'hui.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="#" className="bg-white text-orange-500 font-bold px-8 py-3 hover:bg-gray-100 transition-colors">
                Commencer Maintenant
              </Link>
              <Link to="/contact" className="border-2 border-white text-white font-bold px-8 py-3 hover:bg-white hover:text-orange-500 transition-colors">
                Nous Contacter
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Prices;