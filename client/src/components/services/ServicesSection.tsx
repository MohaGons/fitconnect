import { useState } from "react";
import {
  Fitness,
  Gym,
  Health,
  Heart,
  Juice,
  Motivation,
  Nutrition,
  Yoga,
} from "../../icons";

const ServicesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "Richard Harrisong",
      role: "Fondateur",
      text: "Optimisation des indicateurs clés de performance pour maximiser les résultats. Garder le cap tout en explorant en profondeur une mentalité de start-up pour assurer une intégration multiplateforme efficace.",
      avatar: "https://i.pravatar.cc/150?img=7",
      rating: 5,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Directrice Générale",
      text: "Excellent service et résultats incroyables ! J'ai atteint mes objectifs de fitness en seulement 3 mois. L'équipe est professionnelle et vraiment à l'écoute de mes besoins.",
      avatar: "https://i.pravatar.cc/150?img=8",
      rating: 5,
    },
    {
      id: 3,
      name: "Michel Dupont",
      role: "Athlète",
      text: "Le programme de nutrition combiné avec l'entraînement personnalisé a transformé ma performance. Je recommande vivement leurs services !",
      avatar: "https://i.pravatar.cc/150?img=9",
      rating: 5,
    },
  ];

  const services = [
    {
      id: 1,
      icon: <Nutrition className="w-12 h-12" />,
      title: "Nutrition Combat",
      description:
        "Programme nutritionnel personnalisé pour optimiser vos performances et votre récupération physique",
      bgColor: "bg-orange-500",
    },
    {
      id: 2,
      icon: <Fitness className="w-12 h-12" />,
      title: "Santé & Fitness",
      description:
        "Programmes complets pour améliorer votre condition physique générale et votre bien-être au quotidien",
      bgColor: "bg-orange-50",
    },
    {
      id: 3,
      icon: <Gym className="w-12 h-12" />,
      title: "Musculation & Exercices",
      description:
        "Entraînements de musculation adaptés à tous les niveaux pour développer votre force et votre masse musculaire",
      bgColor: "bg-orange-50",
    },
    {
      id: 4,
      icon: <Motivation className="w-12 h-12" />,
      title: "Motivation Santé",
      description:
        "Accompagnement personnalisé pour maintenir votre motivation et atteindre durablement vos objectifs",
      bgColor: "bg-orange-50",
    },
    {
      id: 5,
      icon: <Heart className="w-12 h-12" />,
      title: "Cœur en Santé",
      description:
        "Programmes cardio-vasculaires pour renforcer votre cœur et améliorer votre endurance",
      bgColor: "bg-orange-50",
    },
    {
      id: 6,
      icon: <Juice className="w-12 h-12" />,
      title: "Smoothies & Jus",
      description:
        "Recettes nutritives et délicieuses pour compléter votre alimentation équilibrée et énergisante",
      bgColor: "bg-orange-50",
    },
    {
      id: 7,
      icon: <Yoga className="w-12 h-12" />,
      title: "Yoga & Étirements",
      description:
        "Séances de yoga et d'étirements pour la flexibilité, l'équilibre et la relaxation corps-esprit",
      bgColor: "bg-orange-50",
    },
    {
      id: 8,
      icon: <Health className="w-12 h-12" />,
      title: "Méditation Santé",
      description:
        "Techniques de méditation et de pleine conscience pour réduire le stress et améliorer votre bien-être mental",
      bgColor: "bg-orange-50",
    },
  ];

  const floatingAvatars = [
    {
      top: "10%",
      left: "5%",
      size: "w-16 h-16",
      img: "https://i.pravatar.cc/150?img=1",
    },
    {
      top: "20%",
      right: "10%",
      size: "w-20 h-20",
      img: "https://i.pravatar.cc/150?img=2",
    },
    {
      bottom: "20%",
      left: "10%",
      size: "w-14 h-14",
      img: "https://i.pravatar.cc/150?img=3",
    },
    {
      bottom: "10%",
      right: "5%",
      size: "w-18 h-18",
      img: "https://i.pravatar.cc/150?img=4",
    },
    {
      top: "50%",
      left: "5%",
      size: "w-12 h-12",
      img: "https://i.pravatar.cc/150?img=5",
    },
    {
      top: "33%",
      right: "25%",
      size: "w-16 h-16",
      img: "https://i.pravatar.cc/150?img=6",
    },
  ];
const fitnessImages = [
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&h=800&fit=crop",
  "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&h=800&fit=crop",
];
  return (
    <div>
      {/* Section Héros */}
      <section className="relative overflow-hidden py-24 min-h-[300px] pt-40">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/welcome/HeroBackground.png')",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Services
          </h1>

          <div
            className="inline-block bg-orange-500 text-white px-6 py-2.5 hover:bg-orange-600 transition-colors duration-200 shadow-lg"
            style={{
              transform: "skewX(-12deg)",
              transformOrigin: "center",
            }}
          >
            <div style={{ transform: "skewX(12deg)" }}>
              <span className="text-sm font-medium">Pages</span>
              <span className="mx-2">›</span>
              <span className="text-sm font-medium">Services</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section Services */}
      <section className="relative overflow-hidden py-24">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/services/BgServices.png')",
          }}
        />

        {/* Container pour la grille des services */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Grille des Services */}
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            style={{
              transform: "skewX(-10deg)",
              transformOrigin: "center",
            }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                className={` p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  service.id ? service.bgColor : "bg-white"
                }`}
              >
                {/* Conteneur de l'icône */}
                <div
                  className={`w-20 h-20 bg-white flex items-center justify-center mb-4 `}
                >
                  {service.icon}
                </div>

                {/* Contenu */}
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    service.id === 1 ? "text-white" : "text-gray-800"
                  }`}
                >
                  {service.title}
                </h3>
                <p
                  className={`text-sm mb-4 line-clamp-3 ${
                    service.id === 1 ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  {service.description}
                </p>

                {/* Bouton */}
                <button
                  className={`px-6 py-2 text-sm font-medium transition-all duration-300 ${
                    service.id === 1
                      ? "bg-white text-orange-500 hover:bg-gray-100"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                  style={{
                    transform: "skewX(-12deg)",
                    transformOrigin: "center",
                  }}
                >
                  Lire Plus
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
   <section className="bg-gray-900 py-16 relative overflow-hidden">
  <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-500 transform skew-x-12 origin-right"></div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="relative">
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="lg:w-1/2 text-white">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">
            Fitness - Entraînements
            <br />
            Exercices pour tous les niveaux
          </h2>
          <div className="w-20 h-1 bg-orange-500 mb-6"></div>
        </div>

        <div className="lg:w-1/2 flex justify-center">
          <img
            src={fitnessImages[currentSlide]}
            alt={`Fitness ${currentSlide + 1}`}
            className="rounded-lg object-cover w-full max-w-sm h-96"
          />
        </div>
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {fitnessImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === index
                ? "w-12 bg-orange-500"
                : "w-2 bg-gray-600 hover:bg-orange-500"
            }`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev > 0 ? prev - 1 : fitnessImages.length - 1))
        }
        className="absolute -left-20 top-1/2 -translate-y-1/2 bg-orange-500 text-white p-3 hover:bg-orange-600 transition-colors"
        style={{
          transform: "translateY(-50%) skewX(-12deg)",
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ transform: "skewX(12deg)" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() =>
          setCurrentSlide((prev) => (prev < fitnessImages.length - 1 ? prev + 1 : 0))
        }
        className="absolute -right-20 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-3 hover:bg-gray-900 transition-colors"
        style={{
          transform: "translateY(-50%) skewX(-12deg)",
        }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          style={{ transform: "skewX(12deg)" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</section>


      {/* Section Témoignages */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-20 relative overflow-hidden">
        {/* Avatars flottants */}
        {floatingAvatars.map((avatar, index) => (
          <div
            key={index}
            className={`absolute ${avatar.size} rounded-full overflow-hidden shadow-lg`}
            style={{
              top: avatar.top,
              bottom: avatar.bottom,
              left: avatar.left,
              right: avatar.right,
            }}
          >
            <img
              src={avatar.img}
              alt="Client"
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <p className="text-sm font-medium text-gray-500 mb-2">TÉMOIGNAGES</p>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-12">
            Ce que disent nos clients
          </h2>

          {/* Témoignage principal */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex justify-center mb-4">
              <img
                src={testimonials[currentTestimonial].avatar}
                alt={testimonials[currentTestimonial].name}
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>

            {/* Étoiles */}
            <div className="flex justify-center mb-4 space-x-1">
              {[...Array(testimonials[currentTestimonial].rating)].map(
                (_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-orange-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                )
              )}
            </div>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {testimonials[currentTestimonial].text}
            </p>

            <h4 className="font-semibold text-lg text-gray-800 mb-1">
              {testimonials[currentTestimonial].name}
            </h4>
            <p className="text-orange-500 text-sm">
              {testimonials[currentTestimonial].role}
            </p>
          </div>

          {/* Navigation dots */}
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentTestimonial === index
                    ? "w-12 bg-orange-500"
                    : "w-2 bg-gray-400 hover:bg-orange-500"
                }`}
              />
            ))}
          </div>

          {/* Navigation arrows */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() =>
                setCurrentTestimonial(Math.max(0, currentTestimonial - 1))
              }
              className="bg-white text-orange-500 p-3 shadow-md hover:bg-orange-500 hover:text-white transition-all duration-300"
              style={{
                transform: "skewX(-12deg)",
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ transform: "skewX(12deg)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={() =>
                setCurrentTestimonial(
                  Math.min(testimonials.length - 1, currentTestimonial + 1)
                )
              }
              className="bg-white text-orange-500 p-3 shadow-md hover:bg-orange-500 hover:text-white transition-all duration-300"
              style={{
                transform: "skewX(-12deg)",
              }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ transform: "skewX(12deg)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
      {/* Section Newsletter */}
      <section className="bg-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-400 py-8 px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Abonnez-vous à notre newsletter
            </h2>

            <div className="flex items-center gap-4">
              <div
                className="bg-white"
                style={{
                  transform: "skewX(-12deg)",
                  transformOrigin: "center",
                }}
              >
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-80 px-4 py-3 bg-transparent text-gray-800 border-0 focus:ring-0 focus:outline-none"
                  style={{
                    transform: "skewX(12deg)",
                  }}
                />
              </div>
              <div
                className="bg-gray-900 cursor-pointer"
                style={{
                  transform: "skewX(-12deg)",
                  transformOrigin: "center",
                }}
                onClick={() => console.log("Inscription à la newsletter")}
              >
                <div
                  className="bg-transparent text-white px-8 py-3 hover:bg-gray-800 transition-colors font-medium"
                  style={{
                    transform: "skewX(12deg)",
                  }}
                >
                  S'abonner
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesSection;
