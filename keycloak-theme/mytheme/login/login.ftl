<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Connexion | FitConnect</title>

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
  <div class="flex min-h-screen">

    <!-- Colonne gauche : formulaire -->
    <div class="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12">
      <div class="w-full max-w-md">
        <a href="/" class="inline-flex items-center mb-8 text-sm text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour au site
        </a>

        <h1 class="mb-2 text-2xl font-semibold">Connexion</h1>
        <p class="mb-6 text-sm text-gray-500">Entrez votre email et mot de passe pour vous connecter</p>
        
        <div class="grid grid-cols-1">
        <button class="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10"><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"></path><path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"></path><path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"></path><path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335">
        </path></svg>Connexion avec Google</button></div>

        <div class="relative py-3 sm:py-5"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200 dark:border-gray-800"></div></div><div class="relative flex justify-center text-sm"><span class="p-2 text-gray-400 bg-white dark:bg-gray-900 sm:px-5 sm:py-2">Ou</span></div></div>

        <form id="kc-form-login" action="${url.loginAction}" method="post" class="space-y-6">
          <div>
            <label for="username" class="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input type="text" id="username" name="username" class="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md" />
          </div>

          <div>
            <label for="password" class="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
            <input type="password" id="password" name="password" class="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md" />
          </div>

          <div class="flex items-center justify-between">
            <label class="flex items-center text-sm text-gray-700">
              <input type="checkbox" name="rememberMe" class="mr-2" />
              Rester connecté
            </label>
            <a href="${url.loginResetCredentialsUrl}" class="text-sm text-orange-500 hover:text-orange-600">Mot de passe oublié ?</a>
          </div>

          <button type="submit" class="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600">Se connecter</button>
        </form>

        <p class="mt-6 text-sm text-center text-gray-700">
          Vous n'avez pas de compte ?
          <a href="${url.registrationUrl}" class="text-orange-500 hover:text-orange-600">S'inscrire</a>
        </p>
      </div>
    </div>

    <!-- Colonne droite : image -->
    <div class="hidden md:block w-1/2 bg-orange-200">
    <h1 class="text-8xl font-bold text-orange-400 absolute top-80 right-10 "> FIT-CONNECT </h1>
      <img src="ressources/images/test.jpg" alt="Image de fond" class="object-cover w-full h-full" />
    </div>
  </div>
</body>
</html>
