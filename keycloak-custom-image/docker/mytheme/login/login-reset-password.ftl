<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Réinitialiser le mot de passe | FitConnect</title>

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

    <!-- Colonne gauche -->
    <div class="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12">
      <div class="w-full max-w-md">
        <a href="http://localhost:5173/" class="inline-flex items-center mb-8 text-sm text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour au site
        </a>

        <h1 class="mb-2 text-2xl font-semibold">Mot de passe oublié</h1>
        <p class="mb-6 text-sm text-gray-500">Entrez votre adresse email pour recevoir un lien de réinitialisation.</p>

        <form action="${url.loginAction}" method="post" class="space-y-4">
          <input type="email" name="username" placeholder="Votre adresse email" required 
                 class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"/>
          <button type="submit" class="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600">
            Envoyer le lien
          </button>
        </form>

        <p class="mt-6 text-sm text-center text-gray-700">
          Vous vous souvenez de votre mot de passe ? 
          <a href="${url.loginUrl}" class="text-orange-500 hover:text-orange-600">Se connecter</a>
        </p>
      </div>
    </div>

    <!-- Colonne droite : image -->
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
