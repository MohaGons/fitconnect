import { Gym, Fitness, Nutrition, Motivation } from "../../icons";

const PerfectTrainersBackground = () => {
  const clipPathStyle = {
    clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 100%, 30px 100%)",
  };
  return (
    <section className="relative overflow-hidden min-h-screen pt-20">
      {/* Image de fond */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('/images/welcome/PerfectTrainersBackground.png')",
        }}
      ></div>

      {/* Contenu principal */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu gauche */}
          <div>
            <img
              src="/images/welcome/PerfectTrainer.png"
              alt="Entraîneurs parfaits"
              className="w-[30rem] h-[35rem] object-contain"
            />
          </div>

          {/* Contenu droit */}
          <div className="space-y-8 text-gray-700">
            <div className="text-sm uppercase tracking-wide text-gray-500">
              Trouve ton entraînement idéal
            </div>
            <h2 className="text-4xl font-bold">
              Entraîneurs <span className="text-orange-500">Parfaits</span>
            </h2>
            <p className="text-base text-gray-600 max-w-lg">
              Adoptez une routine sur mesure pour atteindre vos objectifs. Que
              vous soyez débutant ou confirmé, nos coachs vous accompagnent avec
              des programmes efficaces et motivants. Entraînez-vous à votre
              rythme, progressez durablement, et transformez votre bien-être
              jour après jour.
            </p>

            {/* Grille des fonctionnalités */}
            <div className="grid grid-cols-2 gap-4">
              <div
                className="flex items-center gap-3 p-4 bg-white shadow-md rounded-lg"
                style={clipPathStyle}
              >
                <Gym className="w-6 h-6" />
                <span className="font-semibold text-sm">
                  Musculation & Exercice
                </span>
              </div>
              <div
                className="flex items-center gap-3 p-4 bg-white shadow-md rounded-lg"
                style={clipPathStyle}
              >
                <Fitness className="w-6 h-6" />
                <span className="font-semibold text-sm">Santé & Fitness</span>
              </div>
              <div
                className="flex items-center gap-3 p-4 bg-white shadow-md rounded-lg"
                style={clipPathStyle}
              >
                <Motivation className="w-6 h-6" />
                <span className="font-semibold text-sm">Motivation Santé</span>
              </div>
              <div
                className="flex items-center gap-3 p-4 bg-white shadow-md rounded-lg"
                style={clipPathStyle}
              >
                <Nutrition className="w-6 h-6" />
                <span className="font-semibold text-sm">Nutrition adaptée</span>
              </div>
            </div>

            {/* Bouton */}
            <button
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3  shadow-md transition-colors duration-200"
              style={clipPathStyle}
            >
              En savoir plus
            </button>
          </div>
        </div>
      </div>
      {/* Section Statistiques */}
      <div className="relative z-20 mt-20 flex justify-center w-[84rem] mx-auto" >
        <div className="bg-gray-900 text-white px-12 py-10 mb-14  transform -rotate-6 shadow-lg flex gap-40 items-center w-[50rem]" style={clipPathStyle}>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-orange-400">987</div>
            <div className="mt-2 text-sm text-gray-300">Clients Satisfaits</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-orange-400">845</div>
            <div className="mt-2 text-sm text-gray-300">Tasses de Café</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-extrabold text-orange-400">789</div>
            <div className="mt-2 text-sm text-gray-300">Séances Réalisées</div>
          </div>
        </div>

        {/* Image du coach à droite */}
        <img
          src="/images/welcome/coach-stats.svg"
          alt="Coach Stats"
          className="absolute right-0 -top-44 w-100  h-auto z-30 hidden md:block"
        />
      </div>
    </section>
  );
};

export default PerfectTrainersBackground;
