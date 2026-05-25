import React from "react";
import { Play, Users, TrendingUp, Calendar } from "lucide-react";

const HeroSection: React.FC = () => {
  const partners = [
    { name: "FitTrack", logo: "💪" },
    { name: "NutriPro", logo: "🥗" },
    { name: "GymPlus", logo: "🏋️" },
  ];

  const stats = [
    { icon: Users, value: "500+", label: "Coachs Actifs" },
    { icon: TrendingUp, value: "95%", label: "Taux de Satisfaction" },
    { icon: Calendar, value: "10k+", label: "Séances Planifiées" },
  ];

  return (
    <section className="relative overflow-hidden min-h-screen pt-20">
      {/* Background image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/welcome/HeroBackground.png')",
        }}
      ></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1
                data-cy="hero-title"
                className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight"
              >
                La Plateforme de
                <br />
                <span className="text-orange-500">Coaching Fitness</span>{" "}
                Personnalisé
              </h1>
              <p className="mt-6 text-gray-600 text-lg leading-relaxed">
                Gérez facilement vos clients, proposez des programmes sur-mesure
                et suivez les progrès en temps réel. Notre interface intuitive
                digitalise l'expérience du coaching pour maximiser l'engagement
                et garantir des résultats concrets.
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <button className="bg-orange-500 text-white px-8 py-3 rounded-full hover:bg-orange-600 transition-all duration-200 transform hover:scale-105 shadow-lg">
                Commencer Maintenant
              </button>
              <button className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 transition-colors">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                  <Play className="w-5 h-5 ml-1" />
                </div>
                <span className="font-medium">Voir la Démo</span>
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-5 h-5 text-orange-500 mr-2" />
                    <span className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Partners */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-gray-700 font-semibold mb-4">
                Nos Partenaires
              </h3>
              <div className="flex items-center space-x-8">
                {partners.map((partner) => (
                  <div
                    key={partner.name}
                    className="flex items-center space-x-2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <span className="text-2xl">{partner.logo}</span>
                    <span className="text-lg font-medium">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className="relative lg:h-[600px]">
            {/* Decorative circles */}
            <div className="absolute top-8 right-8 w-8 h-8 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-8 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
            <div className="absolute bottom-16 right-16 w-10 h-10 bg-orange-400 rounded-full animate-bounce delay-200"></div>

            {/* Main image */}
            <div className="relative h-full flex items-center justify-center">
              <div className="relative">
                <div className="flex items-center justify-center">
                  <img
                    src="/images/welcome/athlete.svg"
                    alt="Coach et client FitConnect"
                    className="relative z-10"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
