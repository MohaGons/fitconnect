<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Erreur | FitConnect</title>

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            orange: {
              500: '#f97316',
              600: '#ea580c' 
            }
          }
        }
      }
    }
  </script>
</head>
<body class="bg-white text-gray-800">
  <div class="flex h-screen overflow-hidden">

    <!-- Colonne gauche : message d'erreur -->
    <div class="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12">
      <div class="w-full max-w-md text-center">
        <a href="http://localhost:5173/" class="inline-flex items-center mb-8 text-sm text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour au site
        </a>

        <h1 class="mb-4 text-3xl font-bold text-orange-600">Oups ! Une erreur est survenue</h1>
        <p class="mb-6 text-gray-600 text-lg">
           Veuillez réessayer plus tard.
        </p>

        <a href="http://localhost:5173/login"
           class="inline-block px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition">
          Retour à la connexion
        </a>
      </div>
    </div>

    <!-- Colonne droite : image décorative (comme sur ta page login) -->
    <div class="hidden md:block w-1/2 bg-orange-200 relative overflow-hidden">
      <img src="${url.resourcesPath}/images/grid-01.svg"
           alt="Décoration en haut à droite"
           class="absolute top-0 right-0 w-240 h-240" />

      <img src="${url.resourcesPath}/images/hero-login.svg"
           alt="Image principale"
           class="mx-auto h-[550px] object-contain" />

      <h1 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-orange-400 text-center whitespace-nowrap">
        FIT-CONNECT
      </h1>

      <img src="${url.resourcesPath}/images/grid-01.svg"
           alt="Décoration en bas à gauche"
           class="absolute bottom-0 left-0 w-240 h-240" />
    </div>

  </div>
</body>
</html>
