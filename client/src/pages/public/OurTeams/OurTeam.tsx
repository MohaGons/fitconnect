import React from 'react';

const OurTeam = () => {
    // Données des membres de l'équipe
    const teamMembers = [
        {
            id: 1,
            name: "EMILY",
            role: "YOGA TRAINER",
            image: "/src/assets/coach.jpg",
            color: "from-blue-400 to-blue-600"
        },
        {
            id: 2,
            name: "EMMA",
            role: "YOGA TRAINER", 
            image: "/src/assets/coach2.jpg",
            color: "from-purple-400 to-purple-600"
        },
        {
            id: 3,
            name: "OLIVER",
            role: "YOGA TRAINER",
            image: "/src/assets/coach.jpg",
            color: "from-gray-600 to-gray-800"
        },
        {
            id: 4,
            name: "ELIJAH",
            role: "YOGA TRAINER",
            image: "/src/assets/coach2.jpg",
            color: "from-gray-400 to-gray-600"
        },
        {
            id: 5,
            name: "JAMES",
            role: "YOGA TRAINER",
            image: "/src/assets/coach.jpg",
            color: "from-blue-500 to-blue-700"
        },
        {
            id: 6,
            name: "AMELIA",
            role: "YOGA TRAINER",
            image: "/src/assets/coach2.jpg",
            color: "from-gray-700 to-gray-900"
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section - Style FAQ */}
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
                            <span className="text-sm font-medium">Notre équipe</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section Équipe */}
            <div className="container mx-auto px-6 py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
                    {teamMembers.map((member) => (
                        <div key={member.id} className="group relative">
                            {/* Carte du membre */}
                            <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden transform group-hover:scale-105 transition-all duration-300">
                                {/* Image */}
                                <div className="relative h-80 overflow-hidden">
                                    <img 
                                        src={member.image} 
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${member.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}></div>
                                </div>
                                
                                {/* Badge de nom et rôle */}
                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg transform rotate-2 group-hover:rotate-0 transition-transform duration-300">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-1">{member.name}</h3>
                                        <div className="bg-orange-500 text-white px-4 py-2 rounded-full inline-block">
                                            <span className="text-sm font-medium">{member.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section Newsletter - Style FAQ */}
            <section className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-orange-400 py-8 px-8 flex items-center justify-between">
                        <h2 className="text-3xl lg:text-4xl font-bold text-white">
                            Abonnez-vous à notre newsletter
                        </h2>

                        <form className="flex items-center gap-4">
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
                                    required
                                />
                            </div>
                            <div 
                                className="bg-gray-900" 
                                style={{
                                    transform: "skewX(-12deg)",
                                    transformOrigin: "center",
                                }}
                            >
                                <button
                                    type="submit"
                                    className="bg-transparent text-white px-8 py-3 hover:bg-gray-800 transition-colors font-medium"
                                    style={{
                                        transform: "skewX(12deg)",
                                    }}
                                >
                                    S'abonner
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* Section Footer rapide */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                        {/* Articles de blog */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Articles de Blog</h3>
                            <div className="space-y-4">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-2">
                                        Une Sérénité Merveilleuse S'est Emparée
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        De Mon Âme Entière Comme Ceux...
                                    </p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold text-gray-800 mb-2">
                                        La Philosophie Du Meilleur Fitness
                                    </h4>
                                    <p className="text-gray-600 text-sm">
                                        Nos conseils pour une meilleure forme physique...
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Localisations */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Localisations</h3>
                            <div className="space-y-3">
                                <div>
                                    <h4 className="font-semibold text-gray-800">Washington</h4>
                                    <p className="text-gray-600 text-sm">1592 Alabama Ave SE, DC 20032</p>
                                    <p className="text-gray-600 text-sm">Washington, USA</p>
                                </div>
                            </div>
                        </div>

                        {/* Horaires d'ouverture */}
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-6">Horaires d'Ouverture</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Lundi - Vendredi</span>
                                    <span className="text-gray-800 font-medium">07:00 - 21:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Samedi</span>
                                    <span className="text-gray-800 font-medium">09:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Dimanche</span>
                                    <span className="text-gray-800 font-medium">Fermé</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OurTeam;