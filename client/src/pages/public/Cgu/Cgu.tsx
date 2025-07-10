import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "../../../layout/public/Header";
import SkewedElement from "../../../components/common/SkewedElement";

const Cgu: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>CGU - Conditions Générales d'Utilisation | Fitconnect</title>
        <meta
          name="description"
          content="Consultez les Conditions Générales d'Utilisation de Fitconnect, plateforme de coaching fitness personnalisé."
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
            Conditions Générales d'Utilisation
          </h1>

          <SkewedElement
            data-cy="breadcrumb"
            className="inline-block bg-orange-500 text-white px-6 py-2.5 hover:bg-orange-600 transition-colors duration-200 shadow-lg"
          >
            <span className="text-sm font-medium">Pages</span>
            <span className="mx-2">›</span>
            <span className="text-sm font-medium">CGU</span>
          </SkewedElement>
        </div>
      </section>

      {/* CGU Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div
              className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8"
              data-cy="last-updated"
            >
              <p className="text-gray-700 mb-0">
                <strong>Dernière mise à jour :</strong>{" "}
                {new Date().toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  1. Objet et acceptation
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les présentes Conditions Générales d'Utilisation (CGU)
                  régissent l'utilisation de la plateforme Fitconnect, service
                  de mise en relation entre coaches sportifs et clients proposé
                  par notre société.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  L'accès et l'utilisation de notre plateforme impliquent
                  l'acceptation pleine et entière des présentes CGU. Si vous
                  n'acceptez pas ces conditions, nous vous invitons à ne pas
                  utiliser nos services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  2. Définitions
                </h2>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    <strong>Plateforme :</strong> Le site web et l'application
                    mobile Fitconnect
                  </li>
                  <li>
                    <strong>Coach :</strong> Professionnel du sport inscrit sur
                    la plateforme proposant ses services
                  </li>
                  <li>
                    <strong>Client :</strong> Utilisateur souhaitant bénéficier
                    des services d'un coach
                  </li>
                  <li>
                    <strong>Utilisateur :</strong> Toute personne accédant à la
                    plateforme (coach ou client)
                  </li>
                  <li>
                    <strong>Services :</strong> L'ensemble des fonctionnalités
                    proposées par la plateforme
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  3. Inscription et compte utilisateur
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.1 Conditions d'inscription
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  L'inscription est ouverte à toute personne majeure (18 ans
                  révolus) disposant de la capacité juridique. Les mineurs
                  peuvent s'inscrire avec l'autorisation et sous la
                  responsabilité de leurs représentants légaux.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.2 Informations fournies
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  L'utilisateur s'engage à fournir des informations exactes,
                  complètes et à jour lors de son inscription. Il s'engage à
                  mettre à jour ces informations en cas de modification.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.3 Sécurité du compte
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  L'utilisateur est responsable de la confidentialité de ses
                  identifiants de connexion et de toutes les activités
                  effectuées sur son compte. Il s'engage à nous informer
                  immédiatement de toute utilisation non autorisée de son
                  compte.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  4. Services proposés
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.1 Pour les clients
                </h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• Recherche et sélection de coaches certifiés</li>
                  <li>• Accès aux programmes d'entraînement personnalisés</li>
                  <li>• Suivi nutritionnel et plans de repas</li>
                  <li>• Système de messagerie avec le coach</li>
                  <li>• Suivi de progression et statistiques</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.2 Pour les coaches
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Création et gestion de profil professionnel</li>
                  <li>• Outils de création de programmes d'entraînement</li>
                  <li>• Gestion de la clientèle et planning</li>
                  <li>• Système de paiement sécurisé</li>
                  <li>• Outils de suivi et d'analyse</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  5. Obligations des utilisateurs
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  5.1 Obligations générales
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les utilisateurs s'engagent à utiliser la plateforme de
                  manière loyale et conforme à sa destination. Il est interdit
                  de :
                </p>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>
                    • Utiliser la plateforme à des fins illégales ou non
                    autorisées
                  </li>
                  <li>
                    • Publier des contenus offensants, diffamatoires ou
                    inappropriés
                  </li>
                  <li>
                    • Tenter de contourner les mesures de sécurité de la
                    plateforme
                  </li>
                  <li>
                    • Utiliser des robots, scripts ou autres moyens automatisés
                  </li>
                  <li>• Perturber le fonctionnement normal de la plateforme</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  5.2 Obligations spécifiques des coaches
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    • Disposer des certifications professionnelles requises
                  </li>
                  <li>
                    • Fournir des services de qualité conformes aux standards de
                    la profession
                  </li>
                  <li>
                    • Respecter la confidentialité des informations clients
                  </li>
                  <li>
                    • Maintenir à jour leurs qualifications et assurances
                    professionnelles
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  6. Propriété intellectuelle
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La plateforme Fitconnect, son design, ses fonctionnalités, ses
                  textes, images et tous les éléments la composant sont protégés
                  par les droits de propriété intellectuelle et appartiennent à
                  notre société ou à ses partenaires.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Les contenus créés par les utilisateurs (programmes, articles,
                  photos) restent leur propriété, mais ils accordent à la
                  plateforme une licence d'utilisation dans le cadre de la
                  fourniture des services.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  7. Protection des données personnelles
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La collecte et le traitement des données personnelles sont
                  régis par notre Politique de Confidentialité, conforme au
                  Règlement Général sur la Protection des Données (RGPD).
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Les utilisateurs disposent d'un droit d'accès, de
                  rectification, de suppression et de portabilité de leurs
                  données personnelles. Pour exercer ces droits, ils peuvent
                  nous contacter à l'adresse : privacy@fitconnect.com
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  8. Responsabilité et garanties
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Notre société met tout en œuvre pour assurer le bon
                  fonctionnement de la plateforme, mais ne peut garantir un
                  accès ininterrompu aux services. Nous ne saurions être tenus
                  responsables des dommages résultant d'une interruption de
                  service.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  La responsabilité concernant la qualité des services de
                  coaching reste entièrement celle des coaches. Notre rôle se
                  limite à la mise en relation et à la fourniture des outils de
                  la plateforme.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  9. Modification des CGU
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Nous nous réservons le droit de modifier les présentes CGU à
                  tout moment. Les utilisateurs seront informés des
                  modifications par email ou via une notification sur la
                  plateforme. La poursuite de l'utilisation après notification
                  vaut acceptation des nouvelles conditions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  10. Résiliation
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les utilisateurs peuvent résilier leur compte à tout moment
                  depuis leur espace personnel. Nous nous réservons le droit de
                  suspendre ou supprimer un compte en cas de non-respect des
                  présentes CGU.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  En cas de résiliation, certaines données peuvent être
                  conservées pour des besoins légaux ou administratifs,
                  conformément à notre politique de conservation des données.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  11. Droit applicable et juridiction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Les présentes CGU sont soumises au droit français. En cas de
                  litige, les tribunaux français seront seuls compétents, sauf
                  disposition légale contraire.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  12. Contact
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed mb-2">
                    <strong>
                      Pour toute question concernant ces CGU, vous pouvez nous
                      contacter :
                    </strong>
                  </p>
                  <ul className="space-y-1 text-gray-700">
                    <li>
                      • Email :{" "}
                      <a
                        href="mailto:legal@fitconnect.com"
                        className="text-orange-500 hover:text-orange-600"
                      >
                        legal@fitconnect.com
                      </a>
                    </li>
                    <li>
                      • Téléphone :{" "}
                      <a
                        href="tel:+33123456789"
                        className="text-orange-500 hover:text-orange-600"
                      >
                        +33 1 23 45 67 89
                      </a>
                    </li>
                    <li>• Adresse : 123 Rue de la Paix, 75001 Paris, France</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cgu;
