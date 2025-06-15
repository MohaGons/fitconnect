import React from "react";
import GridShape from "../../components/common/GridShape";
import { Link } from "react-router";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";
import { HeroLogin } from "../../icons";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div className="relative flex flex-col justify-center w-full h-screen lg:flex-row dark:bg-gray-900 sm:p-0">
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 bg-orange-200 dark:bg-white/5 lg:grid">
          <div className="relative flex items-center justify-center z-1">
            {/* <!-- ===== Common Grid Shape Start ===== --> */}
            <GridShape />
            <div className="flex flex-col items-center max-w-xs">
              
              <Link to="/" className="block mb-4">
                <HeroLogin className="w-100 h-100 text-orange-500 dark:text-orange-400" />
              </Link>
              <div className="absolute z-50 flex flex-col w-full">
                {/* Titre repositionné en haut à gauche */}
                <h1 className="text-8xl font-bold  absolute top-80 left-20 text-orange-400 dark:text-white">FIT</h1>
                {/* Titre repositionné en bas à droite */}
                <h1 className="text-8xl font-bold text-orange-400 absolute top-80 right-10 dark:text-white" >CONNECT</h1>
                {/* Description maintenue au même endroit */}
              
              </div>
            </div>
          </div>
        </div>
        <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div>
      </div>
    </div>
  );
}