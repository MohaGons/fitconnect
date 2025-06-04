import React, { useState, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import Header from "../../../layout/public/Header";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// Constants pour éviter la duplication
const SKEW_STYLE = {
  transform: "skewX(-12deg)",
  transformOrigin: "center",
} as const;

const COUNTER_SKEW_STYLE = {
  transform: "skewX(12deg)",
} as const;

// Composant réutilisable pour les éléments avec style skew
const SkewedElement: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}> = ({ children, className = "", onClick }) => (
  <div className={className} style={SKEW_STYLE} onClick={onClick}>
    <div style={COUNTER_SKEW_STYLE}>{children}</div>
  </div>
);

// Composant pour un élément FAQ individuel
const FAQItemComponent: React.FC<{
  item: FAQItem;
  isOpen: boolean;
  onToggle: (id: number) => void;
}> = ({ item, isOpen, onToggle }) => (
  <div className="group">
    <div className="flex items-center">
      <div
        className="flex-1 bg-orange-50 text-gray-800 py-3 px-4 cursor-pointer hover:bg-orange-100 transition-colors duration-200 flex items-center justify-between"
        style={SKEW_STYLE}
        onClick={() => onToggle(item.id)}
      >
        <span
          className="font-medium text-gray-800 flex-1"
          style={COUNTER_SKEW_STYLE}
        >
          {item.question}
        </span>

        <div
          className="ml-4 bg-orange-500 w-8 h-8 flex items-center justify-center"
          style={SKEW_STYLE}
        >
          <ChevronDown
            className={`w-4 h-4 text-white transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            style={COUNTER_SKEW_STYLE}
          />
        </div>
      </div>
    </div>

    {isOpen && (
      <div className="mt-4">
        <div className="bg-white border border-gray-200 rounded-lg p-6 ml-8">
          <p className="text-gray-700 leading-relaxed">{item.answer}</p>
        </div>
      </div>
    )}
  </div>
);

const Faq: React.FC = () => {
  const [openItem, setOpenItem] = useState<number | null>(null);
  const [email, setEmail] = useState("");

  // useCallback pour optimiser les re-renders
  const toggleItem = useCallback((id: number) => {
    setOpenItem((current) => (current === id ? null : id));
  }, []);

  const handleNewsletterSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      console.log("Newsletter signup:", email);
      setEmail("");
    },
    [email]
  );

  // Déplacement des données vers le top pour une meilleure lisibilité
  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "Comment fonctionne le coaching personnalisé ?",
      answer:
        "Notre coaching personnalisé commence par une évaluation complète de votre condition physique, vos objectifs et vos contraintes. Votre coach certifié crée ensuite un programme sur-mesure adapté à votre niveau et vos disponibilités, avec un suivi régulier pour ajuster l'entraînement selon vos progrès.",
    },
    {
      id: 2,
      question: "Quelles sont les qualifications de vos coachs ?",
      answer:
        "Tous nos coachs possèdent des certifications reconnues (BPJEPS, STAPS, ou équivalents internationaux) et une expérience minimum de 3 ans. Ils suivent régulièrement des formations continues pour rester à jour avec les dernières méthodes d'entraînement et de nutrition.",
    },
    {
      id: 3,
      question: "À quelle fréquence dois-je m'entraîner ?",
      answer:
        "La fréquence idéale dépend de vos objectifs et votre niveau. Généralement, nous recommandons 2-3 séances par semaine pour débuter, puis 3-4 séances pour des objectifs plus ambitieux. Votre coach adaptera la fréquence selon votre progression et votre récupération.",
    },
    {
      id: 4,
      question: "Quel équipement est nécessaire pour commencer ?",
      answer:
        "Vous pouvez commencer avec un équipement minimal : tapis de sport, bouteille d'eau et tenue confortable. Selon votre programme, votre coach pourra recommander des accessoires spécifiques (haltères, élastiques, etc.) mais nous adaptons les exercices à votre matériel disponible.",
    },
    {
      id: 5,
      question: "Proposez-vous un suivi nutritionnel ?",
      answer:
        "Oui, nos coachs incluent des conseils nutritionnels de base dans leur accompagnement. Pour un suivi approfondi, nous collaborons avec des diététiciens-nutritionnistes diplômés qui peuvent créer des plans alimentaires personnalisés selon vos objectifs et contraintes.",
    },
    {
      id: 6,
      question: "Quand vais-je voir les premiers résultats ?",
      answer:
        "Les premiers changements (énergie, bien-être) se ressentent dès 2-3 semaines. Les résultats physiques visibles apparaissent généralement après 4-6 semaines d'entraînement régulier. Cependant, chaque personne évolue différemment selon son point de départ et son engagement.",
    },
    {
      id: 7,
      question: "Puis-je modifier ou annuler mes séances ?",
      answer:
        "Vous pouvez reprogrammer vos séances jusqu'à 24h avant le rendez-vous sans frais. Les annulations de dernière minute peuvent être facturées selon les conditions de votre abonnement. Nous encourageons la flexibilité pour s'adapter à vos imprévus.",
    },
    {
      id: 8,
      question: "Quels sont vos tarifs et formules d'abonnement ?",
      answer:
        "Nous proposons plusieurs formules : séances à l'unité (80€), forfaits mensuels (4 séances/mois à 280€, 8 séances/mois à 520€) et abonnements trimestriels avec tarifs préférentiels. Une séance découverte gratuite est offerte pour tous les nouveaux clients.",
    },
  ];

  return (
    <>
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
            Faq
          </h1>

          <SkewedElement className="inline-block bg-orange-500 text-white px-6 py-2.5 hover:bg-orange-600 transition-colors duration-200 shadow-lg">
            <span className="text-sm font-medium">Pages</span>
            <span className="mx-2">›</span>
            <span className="text-sm font-medium">Faq</span>
          </SkewedElement>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {faqData.slice(0, 4).map((item) => (
                <FAQItemComponent
                  key={item.id}
                  item={item}
                  isOpen={openItem === item.id}
                  onToggle={toggleItem}
                />
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {faqData.slice(4, 8).map((item) => (
                <FAQItemComponent
                  key={item.id}
                  item={item}
                  isOpen={openItem === item.id}
                  onToggle={toggleItem}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-400 py-8 px-8 flex items-center justify-between">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Abonnez-vous à notre newsletter
            </h2>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex items-center gap-4"
            >
              <div className="bg-white" style={SKEW_STYLE}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Votre adresse email"
                  className="w-80 px-4 py-3 bg-transparent text-gray-800 border-0 focus:ring-0 focus:outline-none"
                  style={COUNTER_SKEW_STYLE}
                  required
                />
              </div>
              <div className="bg-gray-900" style={SKEW_STYLE}>
                <button
                  type="submit"
                  className="bg-transparent text-white px-8 py-3 hover:bg-gray-800 transition-colors font-medium"
                  style={COUNTER_SKEW_STYLE}
                >
                  S'abonner
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq;
