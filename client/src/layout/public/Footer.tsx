import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa6';

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden">
      {/* Background image - Layer 1 */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/images/Footer/footer-background.png')"
        }}
      ></div>

      

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info with Woman Image */}
          <div className="relative">
            {/* Woman athlete image */}
            <div className="absolute -bottom-8 -left-40 h-65 ">
              <img 
                src="/images/Footer/woman-athlete.svg" 
                alt="Woman athlete" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="relative z-10 space-y-4 pl-16">
              {/* Logo */}
              <div className="flex items-center mb-4">
                <div className="relative">
                 <img src="/images/logo/logo.png" alt="logo" />
                </div>
               
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed">
                La plateforme de coaching fitness personnalisé qui révolutionne l'accompagnement sportif.
              </p>
              
              {/* Social Links */}
              <div className="pt-4">
                <h3 className="font-semibold text-gray-800 mb-3 text-sm">Our Socials</h3>
                <div className="flex space-x-2">
                  <a href="#" className="w-8 h-8 bg-orange-500 text-white rounded flex items-center justify-center hover:bg-orange-600 transition-colors">
                    <FaFacebook className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-200 text-gray-600 rounded flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                    <FaTwitter className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-200 text-gray-600 rounded flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                    <FaInstagram className="w-4 h-4" />
                  </a>
                  <a href="#" className="w-8 h-8 bg-gray-200 text-gray-600 rounded flex items-center justify-center hover:bg-orange-500 hover:text-white transition-colors">
                    <FaLinkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Blog Posts */}
          <div className="lg:pl-8">
            <h3 className="font-bold text-gray-800 text-lg mb-6 border-b-2 border-orange-500 inline-block pb-2">
              Articles Coaching
            </h3>
            <div className="space-y-4">
              <article className="group cursor-pointer">
                <h4 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors text-sm">
                  Guide Complet du Coaching Personnalisé 
                </h4>
                <time className="text-xs text-gray-500">18 JUIN 2023</time>
              </article>
              <article className="group cursor-pointer">
                <h4 className="font-semibold text-gray-800 group-hover:text-orange-500 transition-colors text-sm">
                  10 Stratégies de Suivi Nutritionnel
                </h4>
                <time className="text-xs text-gray-500">15 SEPT 2023</time>
              </article>
            </div>
          </div>

          {/* Locations */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-6 border-b-2 border-orange-500 inline-block pb-2">
              Localisation
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Paris</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  123 Rue de la Paix,<br />
                  75001 Paris, France
                </p>
              </div>
              {/* Map illustration */}
              <div className="mt-4 relative  bg-orange-50  w-[15rem]">
                <img 
                  src="/images/Footer/map.png" 
                  alt="Map illustration" 
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-6 border-b-2 border-orange-500 inline-block pb-2">
              Horaires
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 text-sm">Lundi – Vendredi</span>
                </div>
                <span className="text-orange-500 font-semibold">06:00 – 23:00</span>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 text-sm">Samedi:</span>
                </div>
                <span className="text-orange-500 font-semibold">06:00 – 20:00</span>
              </div>
              <div>
                <span className="text-gray-700 text-sm">Dimanche: </span><span className="text-orange-500 font-semibold">Fermeture</span>
              </div>
              <a href="#" className="inline-flex items-center text-orange-500 hover:text-orange-600 font-medium text-sm mt-4 group">
                <span>Plus d'informations</span>
                <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Copyright © 2025 <span className="text-orange-500 font-medium">Fitconnect</span>. Tous droits reservés.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;