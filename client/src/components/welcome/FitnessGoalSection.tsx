const FitnessGoalSection = () => {
      const clipPathStyle = {
    clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 100%, 30px 100%)",
  };
  return (
    <section className="relative overflow-hidden min-h-screen pt-20">
      {/* Image de fond */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/welcome/FitnessGoal.png')",
        }}
      ></div>



      <div className="relative z-10 container mx-auto px-6 lg:px-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
          {/* Contenu principal à gauche */}
          <div className="space-y-7">
            {/* Badge ABOUT US */}
            <div className="inline-block">
              <span className="bg-blue-100 text-orange-500 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wide">
                À Propos
              </span>
            </div>

            {/* Titre principal */}
            <div>
              <h1 className="text-5xl lg:text-4xl font-bold leading-tight">
                Nous Vous Aidons À Atteindre Vos{" "}
                <span className="text-orange-500">Objectifs</span>{" "}
                <span className="text-orange-500">Fitness</span>
              </h1>
            </div>

            {/* Description */}
            <p className="text-gray-600 ">
              Nous sommes une salle de sport indépendante qui s'engage à travailler avec vous pour 
              atteindre les résultats que vous souhaitez. Que votre objectif soit de perdre du poids, 
              vous tonifier, prendre de la masse ou gagner du poids, nous pouvons créer ensemble un 
              programme d'entraînement adapté.
            </p>

            {/* Boutons */}
            <div className="flex flex-wrap gap-4">
              <button className="bg-white border-2 border-orange-500 text-orange-500 px-8 py-3 font-semibold hover:bg-orange-500 hover:text-white transition-all duration-300" style={clipPathStyle}>
                Notre Mission
              </button>
              <button className="bg-orange-500 text-white px-8 py-3  font-semibold hover:bg-orange-600 transition-all duration-300" style={clipPathStyle}>
                Notre Vision
              </button>
            </div>

            {/* Texte additionnel */}
            <p className="text-gray-600 ">
              Nous sommes une salle de sport indépendante qui s'engage à travailler avec vous 
              pour atteindre les résultats que vous souhaitez. Que votre objectif soit de perdre du poids, 
              vous tonifier, prendre de la masse ou gagner du poids, nous pouvons créer ensemble un 
              programme d'entraînement adapté.
            </p>

            {/* Numéro de téléphone */}
            <div className="flex items-center gap-3 ">
              <div className="bg-orange-500 px-10 py-4 " style={clipPathStyle}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Appelez-nous pour de l'aide</p>
                <p className="text-2xl font-bold text-orange-500">12 452 1505</p>
              </div>
            </div>
          </div>

          {/* Images à droite */}
          <div className="relative">
            {/* Image principale avec couple */}
            <div className="relative bg-white rounded-2xl p-4 shadow-xl mb-6 max-w-sm mx-auto">
              <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center relative overflow-hidden">
                <img 
                  src="/images/welcome/video1.png" 
                  alt="Fitness couple" 
                  className="w-full h-full object-cover"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-full p-4">
                    <svg className="w-8 h-8 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              {/* Badge High Quality Video */}
              <div className="absolute -top-3 right-4 bg-orange-500 text-white px-8 py-2  text-sm font-medium" style={clipPathStyle}>
                📹 Vidéo Haute Qualité
              </div>
            </div>

            {/* Image secondaire avec trainer */}
            <div className="relative bg-white rounded-2xl p-4 shadow-xl max-w-sm mx-auto lg:ml-12">
              <div className="bg-gray-200 rounded-xl h-64 flex items-center justify-center overflow-hidden">
                <img 
                  src="/images/welcome/video2.png" 
                  alt="Professional trainer" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
              {/* Badge Professional Trainer */}
              <div className="absolute -top-3 right-4 bg-orange-500 text-white px-8 py-2  text-sm font-medium" style={clipPathStyle}>
                🏆 Coach Professionnel
              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default FitnessGoalSection;