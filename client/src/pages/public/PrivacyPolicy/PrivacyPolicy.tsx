import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "../../../layout/public/Header";
import SkewedElement from "../../../components/common/SkewedElement";

const PrivacyPolicy: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Politique de Confidentialité | Fitconnect</title>
        <meta
          name="description"
          content="Consultez notre politique de confidentialité conforme RGPD. Découvrez comment nous collectons, utilisons et protégeons vos données personnelles sur Fitconnect."
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
            Politique de Confidentialité
          </h1>

          <SkewedElement
            data-cy="breadcrumb"
            className="inline-block bg-orange-500 text-white px-6 py-2.5 hover:bg-orange-600 transition-colors duration-200 shadow-lg"
          >
            <span className="text-sm font-medium">Pages</span>
            <span className="mx-2">›</span>
            <span className="text-sm font-medium">Confidentialité</span>
          </SkewedElement>
        </div>
      </section>

      {/* Privacy Policy Content */}
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
              <p className="text-gray-700 mt-2 mb-0">
                <strong>Entrée en vigueur :</strong> Conforme au RGPD depuis le
                25 mai 2018
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  1. Introduction et responsable du traitement
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La présente politique de confidentialité vous informe sur la
                  manière dont Fitconnect (ci-après "nous", "notre" ou "la
                  société") collecte, utilise, partage et protège vos
                  informations personnelles dans le cadre de votre utilisation
                  de notre plateforme de coaching fitness.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Responsable du traitement
                  </h3>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>
                      <strong>Société :</strong> Fitconnect SAS
                    </li>
                    <li>
                      <strong>Adresse :</strong> 123 Rue de la Paix, 75001
                      Paris, France
                    </li>
                    <li>
                      <strong>Email :</strong> privacy@fitconnect.com
                    </li>
                    <li>
                      <strong>Téléphone :</strong> +33 1 23 45 67 89
                    </li>
                    <li>
                      <strong>DPO :</strong> dpo@fitconnect.com
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  2. Données personnelles collectées
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2.1 Données d'identification et de contact
                </h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• Nom et prénom</li>
                  <li>• Adresse email</li>
                  <li>• Numéro de téléphone (optionnel)</li>
                  <li>• Photo de profil (optionnelle)</li>
                  <li>• Genre et date de naissance</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2.2 Données de santé et de fitness
                </h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 text-sm mb-2">
                    <strong>⚠️ Données sensibles :</strong> Ces informations
                    sont considérées comme des données de santé au sens du RGPD
                    et bénéficient d'une protection renforcée.
                  </p>
                </div>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• Poids, taille et mensurations corporelles</li>
                  <li>• Objectifs de fitness et de santé</li>
                  <li>• Restrictions alimentaires et allergies</li>
                  <li>• Problèmes de santé déclarés</li>
                  <li>• Expérience sportive et niveau d'activité</li>
                  <li>• Photos de progression corporelle</li>
                  <li>• Données de suivi des exercices et performances</li>
                  <li>• Historique des séances et mesures de progression</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2.3 Données de communication
                </h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• Messages échangés avec les coaches</li>
                  <li>• Commentaires et notes sur les séances</li>
                  <li>• Évaluations et avis</li>
                  <li>• Historique des communications</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2.4 Données techniques et d'utilisation
                </h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>
                    • Adresse IP et informations de géolocalisation
                    approximative
                  </li>
                  <li>
                    • Type d'appareil, navigateur et système d'exploitation
                  </li>
                  <li>• Pages visitées et temps passé sur la plateforme</li>
                  <li>• Actions effectuées et fonctionnalités utilisées</li>
                  <li>• Cookies et technologies similaires</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2.5 Données de paiement
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Informations de facturation</li>
                  <li>• Historique des transactions (via Stripe)</li>
                  <li>• Statut d'abonnement et préférences de paiement</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  3. Finalités et bases légales du traitement
                </h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Finalité
                        </th>
                        <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Base légale
                        </th>
                        <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Données concernées
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Fourniture des services de coaching
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Exécution du contrat
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Toutes les données nécessaires au service
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Gestion des comptes utilisateurs
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Exécution du contrat
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Données d'identification
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Traitement des paiements
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Exécution du contrat
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Données de facturation et paiement
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Amélioration des services
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Intérêt légitime
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Données d'utilisation et techniques
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Communication marketing
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Consentement
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Email et préférences de communication
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Suivi de santé et fitness
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Consentement explicite
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Données de santé et progression
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  4. Partage des données et destinataires
                </h2>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.1 Partage avec les coaches
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vos données personnelles et de santé sont partagées avec votre
                  coach attitré dans le cadre strict de la prestation de
                  service. Les coaches s'engagent à respecter la confidentialité
                  de vos informations.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.2 Prestataires de services
                </h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>
                    • <strong>Stripe :</strong> Traitement des paiements (soumis
                    à leur politique de confidentialité)
                  </li>
                  <li>
                    • <strong>Keycloak :</strong> Gestion de l'authentification
                    et des identités
                  </li>
                  <li>
                    • <strong>Hébergement :</strong> Stockage sécurisé des
                    données sur serveurs européens
                  </li>
                  <li>
                    • <strong>Outils d'analyse :</strong> Amélioration de
                    l'expérience utilisateur (avec votre consentement)
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.3 Autorités compétentes
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Nous pouvons divulguer vos données personnelles si la loi
                  l'exige ou pour protéger nos droits, notre propriété ou la
                  sécurité de nos utilisateurs.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  5. Transferts internationaux de données
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Vos données sont principalement traitées et stockées dans
                  l'Union européenne. Certains de nos prestataires de services
                  peuvent être situés en dehors de l'UE, auquel cas nous nous
                  assurons que des garanties appropriées sont en place :
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Clauses contractuelles types de l'UE</li>
                  <li>• Décisions d'adéquation de la Commission européenne</li>
                  <li>• Certifications et codes de conduite reconnus</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  6. Durée de conservation des données
                </h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Type de données
                        </th>
                        <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Durée de conservation
                        </th>
                        <th className="border-b border-gray-300 px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Justification
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Données de compte actif
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Durée de la relation contractuelle
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Fourniture du service
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Données de facturation
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          10 ans après la dernière transaction
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Obligations comptables et fiscales
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Données de santé
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          3 ans après fin de relation ou suppression sur demande
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Suivi médical et responsabilité
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Logs techniques
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          12 mois
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Sécurité et maintenance
                        </td>
                      </tr>
                      <tr>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Cookies analytiques
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          13 mois maximum
                        </td>
                        <td className="border-b border-gray-200 px-4 py-3">
                          Analyse d'audience
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  7. Vos droits sur vos données personnelles
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Conformément au RGPD, vous disposez des droits suivants
                  concernant vos données personnelles :
                </p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">
                      ✓ Droit d'accès
                    </h4>
                    <p className="text-green-800 text-sm">
                      Obtenir confirmation que vos données sont traitées et
                      accéder à ces données
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      ✓ Droit de rectification
                    </h4>
                    <p className="text-blue-800 text-sm">
                      Corriger ou compléter vos données personnelles inexactes
                      ou incomplètes
                    </p>
                  </div>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">
                      ✓ Droit à l'effacement
                    </h4>
                    <p className="text-red-800 text-sm">
                      Demander la suppression de vos données dans certaines
                      conditions
                    </p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      ✓ Droit à la portabilité
                    </h4>
                    <p className="text-purple-800 text-sm">
                      Récupérer vos données dans un format structuré et les
                      transférer
                    </p>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">
                      ✓ Droit d'opposition
                    </h4>
                    <p className="text-yellow-800 text-sm">
                      Vous opposer au traitement de vos données pour des raisons
                      légitimes
                    </p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      ✓ Droit de limitation
                    </h4>
                    <p className="text-gray-800 text-sm">
                      Demander la limitation du traitement dans certaines
                      situations
                    </p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                  <h4 className="font-semibold text-orange-900 mb-3">
                    📧 Comment exercer vos droits ?
                  </h4>
                  <p className="text-orange-800 text-sm mb-3">
                    Pour exercer vos droits, contactez-nous par email à{" "}
                    <strong>privacy@fitconnect.com</strong>
                    ou via votre espace personnel dans la section "Gestion des
                    données".
                  </p>
                  <p className="text-orange-800 text-sm">
                    <strong>Délai de réponse :</strong> 1 mois maximum
                    (extensible à 3 mois pour les demandes complexes)
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  8. Sécurité des données
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous mettons en œuvre des mesures techniques et
                  organisationnelles appropriées pour protéger vos données
                  personnelles contre :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <ul className="space-y-2 text-gray-700">
                    <li>• Accès non autorisés</li>
                    <li>• Altération des données</li>
                    <li>• Destruction accidentelle</li>
                    <li>• Perte de données</li>
                  </ul>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Chiffrement des données sensibles</li>
                    <li>• Contrôles d'accès stricts</li>
                    <li>• Sauvegardes régulières</li>
                    <li>• Surveillance continue</li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  9. Cookies et technologies similaires
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Notre site utilise différents types de cookies. Vous pouvez
                  gérer vos préférences de cookies à tout moment via la bannière
                  de cookies ou dans les paramètres de votre compte.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Pour plus d'informations détaillées sur les cookies que nous
                  utilisons, consultez notre{" "}
                  <a
                    href="#cookie-manager"
                    className="text-orange-600 hover:text-orange-700 underline"
                  >
                    gestionnaire de cookies
                  </a>
                  .
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  10. Modifications de cette politique
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Nous pouvons mettre à jour cette politique de confidentialité
                  pour refléter les changements dans nos pratiques ou pour
                  d'autres raisons opérationnelles, légales ou réglementaires.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  En cas de modification substantielle, nous vous en informerons
                  par email et/ou par une notification sur notre plateforme au
                  moins 30 jours avant l'entrée en vigueur des changements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  11. Réclamations et autorité de contrôle
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Si vous estimez que le traitement de vos données personnelles
                  constitue une violation du RGPD, vous avez le droit
                  d'introduire une réclamation auprès de l'autorité de contrôle
                  compétente.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-2">
                    🇫🇷 Commission Nationale de l'Informatique et des Libertés
                    (CNIL)
                  </h4>
                  <ul className="text-blue-800 text-sm space-y-1">
                    <li>
                      <strong>Site web :</strong>{" "}
                      <a href="https://www.cnil.fr" className="underline">
                        www.cnil.fr
                      </a>
                    </li>
                    <li>
                      <strong>Adresse :</strong> 3 Place de Fontenoy, 75007
                      Paris
                    </li>
                    <li>
                      <strong>Téléphone :</strong> 01 53 73 22 22
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  12. Contact
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>
                      Pour toute question concernant cette politique de
                      confidentialité ou vos données personnelles,
                      contactez-nous :
                    </strong>
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Service Protection des Données
                      </h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>
                          Email :{" "}
                          <a
                            href="mailto:privacy@fitconnect.com"
                            className="text-orange-500 hover:text-orange-600 underline"
                          >
                            privacy@fitconnect.com
                          </a>
                        </li>
                        <li>
                          DPO :{" "}
                          <a
                            href="mailto:dpo@fitconnect.com"
                            className="text-orange-500 hover:text-orange-600 underline"
                          >
                            dpo@fitconnect.com
                          </a>
                        </li>
                        <li>Téléphone : +33 1 23 45 67 89</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Adresse postale
                      </h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>Fitconnect - Service DPO</li>
                        <li>123 Rue de la Paix</li>
                        <li>75001 Paris, France</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
