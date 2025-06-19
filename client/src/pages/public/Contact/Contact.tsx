import React, { useState, useCallback } from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
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

interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitStatus("idle");

      try {
        // Simulation d'envoi de formulaire
        await new Promise((resolve) => setTimeout(resolve, 2000));

        console.log("Contact form submitted:", formData);
        setSubmitStatus("success");

        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } catch (error) {
        setSubmitStatus("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData]
  );

  return (
    <>
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
            Nous Contacter
          </h1>

          <SkewedElement className="inline-block bg-orange-500 text-white px-6 py-2.5 hover:bg-orange-600 transition-colors duration-200 shadow-lg">
            <span className="text-sm font-medium">Pages</span>
            <span className="mx-2">›</span>
            <span className="text-sm font-medium">Contact</span>
          </SkewedElement>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 inline-block pb-2">
                  Informations de Contact
                </h2>
                <p className="text-gray-700 leading-relaxed mb-8">
                  Notre équipe est à votre disposition pour répondre à toutes
                  vos questions concernant nos services de coaching,
                  l'utilisation de la plateforme ou pour toute assistance
                  technique.
                </p>
              </div>

              <div className="space-y-6">
                {/* Adresse */}
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 p-3 rounded-lg flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Adresse
                    </h3>
                    <p className="text-gray-600">
                      123 Rue de la Paix
                      <br />
                      75001 Paris, France
                    </p>
                  </div>
                </div>

                {/* Téléphone */}
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 p-3 rounded-lg flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Téléphone
                    </h3>
                    <p className="text-gray-600">
                      <a
                        href="tel:+33123456789"
                        className="hover:text-orange-500"
                      >
                        +33 1 23 45 67 89
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 p-3 rounded-lg flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                    <div className="space-y-1 text-gray-600">
                      <p>
                        Support général :{" "}
                        <a
                          href="mailto:contact@fitconnect.com"
                          className="hover:text-orange-500"
                        >
                          contact@fitconnect.com
                        </a>
                      </p>
                      <p>
                        Support technique :{" "}
                        <a
                          href="mailto:support@fitconnect.com"
                          className="hover:text-orange-500"
                        >
                          support@fitconnect.com
                        </a>
                      </p>
                      <p>
                        Questions juridiques :{" "}
                        <a
                          href="mailto:legal@fitconnect.com"
                          className="hover:text-orange-500"
                        >
                          legal@fitconnect.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Horaires */}
                <div className="flex items-start space-x-4">
                  <div className="bg-orange-500 p-3 rounded-lg flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Horaires d'ouverture
                    </h3>
                    <div className="text-gray-600 space-y-1">
                      <p>Lundi - Vendredi : 9h00 - 18h00</p>
                      <p>Samedi : 10h00 - 16h00</p>
                      <p>Dimanche : Fermé</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Réponse rapide */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Réponse rapide
                </h3>
                <p className="text-gray-700 text-sm">
                  Nous nous engageons à répondre à tous les messages dans les 24
                  heures ouvrées. Pour les urgences techniques, utilisez notre
                  chat en ligne disponible pendant les heures d'ouverture.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-orange-500 inline-block pb-2">
                Envoyez-nous un message
              </h2>

              {submitStatus === "success" && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="text-green-800 font-medium">
                    Votre message a été envoyé avec succès ! Nous vous
                    répondrons dans les plus brefs délais.
                  </p>
                </div>
              )}

              {submitStatus === "error" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <p className="text-red-800 font-medium">
                    Une erreur est survenue lors de l'envoi. Veuillez réessayer
                    ou nous contacter par téléphone.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Nom et Prénom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Prénom *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                {/* Email et Téléphone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                      placeholder="01 23 45 67 89"
                    />
                  </div>
                </div>

                {/* Sujet */}
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="information">Demande d'information</option>
                    <option value="technique">Problème technique</option>
                    <option value="coaching">Question sur le coaching</option>
                    <option value="facturation">Facturation et paiement</option>
                    <option value="partenariat">Partenariat</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-vertical"
                    placeholder="Décrivez votre demande en détail..."
                  />
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 disabled:bg-orange-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Envoi en cours...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Envoyer le message</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-sm text-gray-600 text-center">
                  En envoyant ce formulaire, vous acceptez que vos données
                  soient utilisées pour traiter votre demande conformément à
                  notre{" "}
                  <a href="/cgu" className="text-orange-500 hover:underline">
                    politique de confidentialité
                  </a>
                  .
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Notre Localisation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Venez nous rendre visite dans nos bureaux parisiens ou
              contactez-nous pour organiser un rendez-vous.
            </p>
          </div>

          {/* Placeholder for map - in a real app, you would integrate Google Maps or similar */}
          <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Carte Interactive</p>
              <p className="text-sm">123 Rue de la Paix, 75001 Paris</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
