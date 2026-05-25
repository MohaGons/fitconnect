import { Gym, Fitness, Nutrition, Motivation } from "../../icons";
import { ArrowRight } from 'lucide-react';

const FitnessServicesSection = () => {
       const clipPathStyle = {
    clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 100%, 30px 100%)",
  };
  const services = [
    {
      id: 1,
      title: "Bonne Nutrition",
      description: "Découvrez les secrets d'une alimentation équilibrée pour optimiser vos performances.",
      icon: Nutrition,
      bgColor: "bg-orange-500",
      textColor: "text-white",
      buttonStyle: "bg-white text-orange-500 hover:bg-gray-50"
    },
    {
      id: 2,
      title: "Santé & Fitness",
      description: "Programmes personnalisés pour améliorer votre condition physique et votre bien-être.",
      icon: Fitness,
      bgColor: "bg-orange-100",
      textColor: "text-gray-800",
      buttonStyle: "bg-orange-500 text-white hover:bg-orange-600"
    },
    {
      id: 3,
      title: "Salle de Sport & Exercice",
      description: "Entraînements variés et équipements modernes pour atteindre vos objectifs fitness.",
      icon: Gym,
      bgColor: "bg-orange-100",
      textColor: "text-gray-800",
      buttonStyle: "bg-orange-500 text-white hover:bg-orange-600"
    },
    {
      id: 4,
      title: "Motivation Santé",
      description: "Accompagnement et conseils pour maintenir votre motivation et vos bonnes habitudes.",
      icon: Motivation,
      bgColor: "bg-orange-100",
      textColor: "text-gray-800",
      buttonStyle: "bg-orange-500 text-white hover:bg-orange-600"
    }
  ];

  return (
     <section className="relative overflow-hidden min-h-screen pt-20">
      {/* Image de fond */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/welcome/FitnessServices.png')",
        }}
      ></div>
      
      {/* Overlay pour améliorer la lisibilité */}

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="relative z-10 flex justify-between items-center mb-12">
          <div className="flex items-center">
            <div className="w-1 h-16 bg-orange-500 mr-4"></div>
            <div>
              <p className="text-orange-500 font-medium text-sm uppercase tracking-wider mb-2">
                NOS SERVICES
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Donnez Vie À Vos<br />
                Idées Fitness
              </h2>
            </div>
          </div>
          <button className="bg-orange-500 text-white px-10 py-2 font-medium hover:bg-orange-600 transition-colors" style={clipPathStyle}>
            Voir Tout
          </button>
        </div>

        {/* Services Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" >
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.id}
                className={`${service.bgColor}  p-8 transition-transform hover:scale-105 hover:shadow-lg backdrop-blur-sm`}
              style={clipPathStyle}>
                {/* Icon */}
                <div className={`bg-white w-36 h-28  flex items-center justify-center mb-2`} style={clipPathStyle}>
                  <IconComponent 
                    
                    className="w-10 h-20" 
                  />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className={`text-xl font-bold ${service.textColor}`}>
                    {service.title}
                  </h3>
                  <p className={`${service.textColor} opacity-80 text-sm leading-relaxed`}>
                    {service.description}
                  </p>
                  
                  {/* Read More Button */}
                  <button className={`${service.buttonStyle} px-8 py-2  font-medium text-sm flex items-center gap-2 transition-all duration-200 group`} style={clipPathStyle}>
                    Lire Plus
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FitnessServicesSection;