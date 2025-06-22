import React from "react";
import { Helmet } from "react-helmet-async";
import Header from "../../../layout/public/Header";

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
}> = ({ children, className = "" }) => (
  <div className={className} style={SKEW_STYLE}>
    <div style={COUNTER_SKEW_STYLE}>{children}</div>
  </div>
);

const Cgv: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>CGV - Conditions Générales de Vente | Fitconnect</title>
        <meta
          name="description"
          content="Consultez les Conditions Générales de Vente de Fitconnect, plateforme de coaching fitness personnalisé."
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
            Conditions Générales de Vente
          </h1>

          <SkewedElement className="inline-block bg-orange-500 text-white px-6 py-2.5 hover:bg-orange-600 transition-colors duration-200 shadow-lg">
            <span className="text-sm font-medium">Pages</span>
            <span className="mx-2">›</span>
            <span className="text-sm font-medium">CGV</span>
          </SkewedElement>
        </div>
      </section>

      {/* CGV Content */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
              <p className="text-gray-700 mb-0">
                <strong>Dernière mise à jour :</strong>{" "}
                {new Date().toLocaleDateString("fr-FR")}
              </p>
            </div>

            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  1. Dispositions générales
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les présentes Conditions Générales de Vente (CGV) s'appliquent
                  à tous les services de coaching sportif proposés sur la
                  plateforme Fitconnect. Elles définissent les droits et
                  obligations des parties dans le cadre de la vente de services
                  de coaching.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Toute commande implique l'acceptation pleine et entière des
                  présentes CGV. Les CGV applicables sont celles en vigueur à la
                  date de passation de la commande.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  2. Services proposés
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2.1 Offres de coaching
                </h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>
                    • <strong>Coaching à l'unité :</strong> Séances
                    individuelles facturées 80€
                  </li>
                  <li>
                    • <strong>Forfait mensuel 4 séances :</strong> 280€ par mois
                  </li>
                  <li>
                    • <strong>Forfait mensuel 8 séances :</strong> 520€ par mois
                  </li>
                  <li>
                    • <strong>Abonnements trimestriels :</strong> Tarifs
                    préférentiels selon la formule
                  </li>
                  <li>
                    • <strong>Séance découverte :</strong> Gratuite pour tous
                    les nouveaux clients
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  2.2 Services inclus
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Programme d'entraînement personnalisé</li>
                  <li>• Suivi nutritionnel de base</li>
                  <li>• Accès à la plateforme de suivi</li>
                  <li>• Support client par messagerie</li>
                  <li>• Statistiques de progression</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  3. Commande et conclusion du contrat
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.1 Processus de commande
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  La commande s'effectue en ligne via la plateforme. Le client
                  sélectionne son coach, choisit sa formule et procède au
                  paiement. La confirmation de commande est envoyée par email.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  3.2 Validation de la commande
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le contrat est considéré comme formé après :
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li>• Validation du paiement</li>
                  <li>• Envoi de l'email de confirmation</li>
                  <li>• Acceptation du client par le coach (dans les 24h)</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  4. Prix et modalités de paiement
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.1 Prix
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les prix sont indiqués en euros TTC (TVA 20% incluse). Ils
                  peuvent être modifiés à tout moment mais ne s'appliquent
                  qu'aux nouvelles commandes. Une facture est émise pour chaque
                  paiement.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.2 Modalités de paiement
                </h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>
                    • <strong>Cartes bancaires :</strong> Visa, Mastercard,
                    American Express
                  </li>
                  <li>
                    • <strong>Virements bancaires :</strong> Pour les forfaits
                    trimestriels
                  </li>
                  <li>
                    • <strong>Paiement sécurisé :</strong> Via notre partenaire
                    Stripe
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  4.3 Facturation
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Les forfaits mensuels sont prélevés automatiquement chaque
                  mois à date fixe. Les séances à l'unité sont facturées
                  immédiatement. Les factures sont disponibles dans l'espace
                  client.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  5. Exécution du service
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  5.1 Délais
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les services débutent après validation de la commande par le
                  coach. La première séance doit être programmée dans les 7
                  jours suivant la confirmation.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  5.2 Planification
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Les séances sont planifiées en accord entre le client et le
                  coach via la plateforme. Les créneaux sont confirmés
                  automatiquement ou dans les 24h maximum.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  5.3 Modalités d'annulation/report
                </h3>
                <ul className="space-y-2 text-gray-700">
                  <li>
                    • <strong>Report gratuit :</strong> Jusqu'à 24h avant la
                    séance
                  </li>
                  <li>
                    • <strong>Annulation tardive :</strong> Facturation de 50%
                    du montant
                  </li>
                  <li>
                    • <strong>Absence sans prévenir :</strong> Facturation
                    intégrale
                  </li>
                  <li>
                    • <strong>Annulation coach :</strong> Report ou
                    remboursement intégral
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  6. Droit de rétractation
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Conformément à l'article L.221-28 du Code de la consommation,
                  le client dispose d'un délai de 14 jours à compter de la
                  conclusion du contrat pour exercer son droit de rétractation.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  <strong>Exception :</strong> Si le service a commencé avec
                  l'accord exprès du client avant la fin du délai de
                  rétractation, le droit de rétractation ne peut plus être
                  exercé.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm mb-0">
                    <strong>Note :</strong> La séance découverte gratuite ne
                    constitue pas un commencement d'exécution du service
                    principal.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  7. Garanties et responsabilités
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  7.1 Garanties des coaches
                </h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>• Certification professionnelle validée</li>
                  <li>• Assurance responsabilité civile professionnelle</li>
                  <li>• Formation continue aux dernières méthodes</li>
                  <li>• Respect du code de déontologie professionnel</li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  7.2 Responsabilité de la plateforme
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Notre responsabilité se limite à la mise en relation et à la
                  fourniture des outils de la plateforme. Nous ne sommes pas
                  responsables de la qualité des services de coaching ni des
                  résultats obtenus.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  7.3 Limitations de responsabilité
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Les coaches sont seuls responsables de leurs prestations. En
                  cas de litige, notre responsabilité est limitée au montant des
                  commissions perçues sur la prestation concernée.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  8. Résiliation et remboursement
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  8.1 Résiliation par le client
                </h3>
                <ul className="space-y-2 text-gray-700 mb-4">
                  <li>
                    • <strong>Forfaits mensuels :</strong> Résiliation possible
                    à tout moment avec préavis de 30 jours
                  </li>
                  <li>
                    • <strong>Abonnements trimestriels :</strong> Remboursement
                    prorata des séances non consommées
                  </li>
                  <li>
                    • <strong>Séances unitaires :</strong> Remboursables si non
                    programmées
                  </li>
                </ul>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  8.2 Résiliation par le coach
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Le coach peut résilier le contrat en cas de comportement
                  inapproprié du client ou de non-respect des consignes de
                  sécurité. Les séances non effectuées sont remboursées
                  intégralement.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  8.3 Modalités de remboursement
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Les remboursements sont effectués dans un délai de 14 jours
                  ouvrés sur le même moyen de paiement utilisé pour l'achat
                  initial.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  9. Service client et réclamations
                </h2>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  9.1 Support client
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Notre service client est disponible du lundi au vendredi de 9h
                  à 18h pour répondre à vos questions et traiter vos
                  réclamations.
                </p>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  9.2 Procédure de réclamation
                </h3>
                <ol className="space-y-2 text-gray-700 list-decimal list-inside mb-4">
                  <li>Contact direct avec le coach concerné</li>
                  <li>Saisie du service client si nécessaire</li>
                  <li>Médiation interne par notre équipe</li>
                  <li>Recours aux voies de médiation externes si applicable</li>
                </ol>

                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  9.3 Médiation
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  En cas de litige non résolu, vous pouvez saisir le médiateur
                  de la consommation dont nous relevons. Les coordonnées sont
                  disponibles sur demande.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  10. Données personnelles
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Le traitement des données personnelles est régi par notre
                  Politique de Confidentialité. Les données sont collectées pour
                  l'exécution du contrat et peuvent être partagées avec les
                  coaches dans le cadre de la prestation de service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  11. Droit applicable et juridiction
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  Les présentes CGV sont soumises au droit français. En cas de
                  litige, et après tentative de résolution amiable, les
                  tribunaux français seront seuls compétents.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-orange-500 inline-block pb-2">
                  12. Contact
                </h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong>
                      Pour toute question concernant ces CGV ou vos commandes :
                    </strong>
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Service Client
                      </h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>
                          Email :{" "}
                          <a
                            href="mailto:support@fitconnect.com"
                            className="text-orange-500 hover:text-orange-600"
                          >
                            support@fitconnect.com
                          </a>
                        </li>
                        <li>Téléphone : +33 1 23 45 67 89</li>
                        <li>Horaires : Lun-Ven 9h-18h</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Service Juridique
                      </h4>
                      <ul className="space-y-1 text-gray-700 text-sm">
                        <li>
                          Email :{" "}
                          <a
                            href="mailto:legal@fitconnect.com"
                            className="text-orange-500 hover:text-orange-600"
                          >
                            legal@fitconnect.com
                          </a>
                        </li>
                        <li>Adresse : 123 Rue de la Paix</li>
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

export default Cgv;
