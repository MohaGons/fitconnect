import SkewedElement, {
  SKEW_STYLE,
  COUNTER_SKEW_STYLE,
} from "../../../components/common/SkewedElement";

const OurTeam = () => {
  const teamMembers = [
    {
      id: 1,
      name: "EMILY",
      role: "PROFESSEURE DE YOGA",
      image: "/images/team/TRAINER6.png",
      selected: false,
    },
    {
      id: 2,
      name: "EMMA",
      role: "ENTRAÎNEUSE FITNESS",
      image: "/images/team/TRAINER5.png",
      selected: false,
    },
    {
      id: 3,
      name: "OLIVER",
      role: "ENTRAÎNEUR DE MUSCULATION",
      image: "/images/team/TRAINER4.png",
      selected: false,
    },
    {
      id: 4,
      name: "ELIJAH",
      role: "ENTRAÎNEUR MUSCULATION",
      image: "/images/team/TRAINER3.png",
      selected: false,
    },
    {
      id: 5,
      name: "JAMES",
      role: "ENTRAÎNEUR PERSONNEL",
      image: "/images/team/TRAINER2.png",
      selected: false,
    },
    {
      id: 6,
      name: "AMELIA",
      role: "PROFESSEURE DE YOGA",
      image: "/images/team/TRAINER1.png",
      selected: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Section Héros */}
      <section className="relative overflow-hidden py-24 min-h-[300px] pt-20">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/welcome/HeroBackground.png')",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Notre Équipe
          </h1>

          <SkewedElement className="inline-block bg-orange-500 text-white px-6 py-2.5 hover:bg-orange-600 transition-colors duration-200 shadow-lg">
            <span className="text-sm font-medium">Pages</span>
            <span className="mx-2">›</span>
            <span className="text-sm font-medium">Notre équipe</span>
          </SkewedElement>
        </div>
      </section>

      {/* Section Équipe */}
      <div className="container mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.id} className="relative mx-auto">
              {/* Bordure bleue pour la carte sélectionnée */}
              {member.selected && (
                <div
                  className="absolute inset-0 bg-blue-500 transform -translate-x-1 translate-y-1 z-0"
                  style={{
                    clipPath:
                      "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)",
                  }}
                />
              )}

              {/* Carte principale */}
              <div
                className="relative bg-white shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 z-10"
                style={{
                  clipPath:
                    "polygon(20px 0%, 100% 0%, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0% 100%, 0% 20px)",
                  width: "280px",
                  height: "320px",
                }}
              >
                {/* Image */}
                <div className="relative h-full w-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
              </div>

              {/* Badge orange avec nom et rôle */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 z-20">
                <div
                  className="bg-orange-500 text-white px-6 py-3 shadow-lg"
                  style={{
                    clipPath:
                      "polygon(15px 0%, 100% 0%, calc(100% - 15px) 100%, 0% 100%)",
                    minWidth: "220px",
                  }}
                >
                  <div className="text-center">
                    <div className="text-lg font-bold text-white mb-1">
                      {member.name}
                    </div>
                    <div className="text-xs font-semibold uppercase tracking-wider">
                      {member.role}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section Newsletter */}
      <section className="bg-white py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-orange-400 py-8 px-8 flex flex-col lg:flex-row items-center justify-between gap-6">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Abonnez-vous à notre newsletter
            </h2>

            <div className="flex items-center gap-4">
              <div className="bg-white" style={SKEW_STYLE}>
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="w-80 px-4 py-3 bg-transparent text-gray-800 border-0 focus:ring-0 focus:outline-none"
                  style={COUNTER_SKEW_STYLE}
                />
              </div>
              <div
                className="bg-gray-900 cursor-pointer"
                style={SKEW_STYLE}
                onClick={() => console.log("Inscription à la newsletter")}
              >
                <div
                  className="bg-transparent text-white px-8 py-3 hover:bg-gray-800 transition-colors font-medium"
                  style={COUNTER_SKEW_STYLE}
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

export default OurTeam;
