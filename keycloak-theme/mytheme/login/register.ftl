<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inscription | FitConnect</title>

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

    <!-- Colonne gauche : formulaire -->
    <div class="w-full md:w-1/2 flex items-center justify-center px-6 md:px-12">
      <div class="w-full max-w-md">
        <a href="/" class="inline-flex items-center mb-8 text-sm text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour au site
        </a>

        <h1 class="mb-2 text-2xl font-semibold">Inscription</h1>
        <p class="mb-6 text-sm text-gray-500">Créez un compte pour rejoindre FitConnect</p>

       
      <#if message??>
  <#if message.summary == "emailExistsMessage">
    <div class="mb-4 p-3 text-sm text-white bg-red-400 rounded">
      Cette adresse email est déjà utilisée.
    </div>
  <#elseif message.summary == "usernameExistsMessage">
    <div class="mb-4 p-3 text-sm text-white bg-red-400 rounded">
      Ce nom d'utilisateur est déjà pris.
    </div>
  <#elseif message.summary == "invalidPasswordConfirmMessage">
    <div class="mb-4 p-3 text-sm text-white bg-red-400 rounded">
      La confirmation du mot de passe ne correspond pas.
    </div>
  <#elseif message.summary == "invalidPasswordMessage">
    <div class="mb-4 p-3 text-sm text-white bg-red-400 rounded">
      Le mot de passe est invalide.
    </div>
  <#else>
    <div class="mb-4 p-3 text-sm text-white bg-red-400 rounded">
      Une erreur s'est produite. Veuillez réessayer.
    </div>
  </#if>
</#if>

    

        <form id="registerForm" class="space-y-5" action="${url.registrationAction}" method="post">
          <input type="hidden" name="client_id" value="${client.clientId}" />

             <div>
            <label for="username" class="block text-sm font-medium">Nom d'utilisateur <span class="text-red-500">*</span></label>
            <input id="username" name="username" type="text" value="${(register.formData.username!'')}" class="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
          </div>
         <div class="flex gap-4">
  <div class="w-1/2">
    <label for="firstName" class="block text-sm font-medium">Prénom <span class="text-red-500">*</span></label>
    <input id="firstName" name="firstName" type="text" value="${(register.formData.firstName!'')}" class="mt-1 w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
  </div>

  <div class="w-1/2">
    <label for="lastName" class="block text-sm font-medium">Nom <span class="text-red-500">*</span></label>
    <input id="lastName" name="lastName" type="text" value="${(register.formData.lastName!'')}" class="mt-1 w-full px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
  </div>
</div>


          <div>
            <label for="email" class="block text-sm font-medium">Email <span class="text-red-500">*</span></label>
            <input id="email" name="email" type="email" value="${(register.formData.email!'')}" class="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium"> Mot de passe<span class="text-red-500">*</span></label>
            <input id="password" name="password" type="password" class="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
          </div>

          <div>
            <label for="password-confirm" class="block text-sm font-medium">Confirmez le mot de passe <span class="text-red-500">*</span></label>
            <input id="password-confirm" name="password-confirm" type="password" class="w-full mt-1 px-4 py-2 text-sm border rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
          </div>
<div class="flex items-center gap-3">
  <label class="flex items-center space-x-3 group cursor-pointer">
    <div class="relative w-5 h-5">
      <input class="w-5 h-5 appearance-none cursor-pointer dark:border-gray-700 border border-gray-300 checked:border-transparent rounded-md checked:bg-orange-500 disabled:opacity-60 checked:dark:bg-brand-500" type="checkbox">
    </div>
  </label>
  <p class="inline-block text-xs text-gray-500 dark:text-gray-400">
    En créant un compte, vous acceptez les 
    <a class="text-orange-400" href="https://www.google.com" target="_blank" rel="noopener noreferrer">Conditions Générales d'Utilisation</a> 
    et notre 
    <a class="text-orange-400" href="https://www.google.com" target="_blank" rel="noopener noreferrer">Politique de Confidentialité</a>
  </p>
</div>

          <button type="submit" class="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600">S'inscrire</button>
        </form>

        <p class="mt-6 text-sm text-center text-gray-700">
          Vous avez déjà un compte ?
          <a href="${url.loginUrl}" class="text-orange-500 hover:text-orange-600">Se connecter</a>
        </p>
      </div>
    </div>

    <!-- Colonne droite : image -->
    <div class="hidden md:block w-1/2 bg-orange-200 relative overflow-hidden">
      <img src="${url.resourcesPath}/images/grid-01.svg" alt="Décoration" class="absolute top-0 right-0 w-240 h-240" />
      <img src="${url.resourcesPath}/images/hero-login.svg" alt="Image principale" class="mx-auto h-[550px] object-contain" />
      <h1 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-5xl font-bold text-orange-400 text-center whitespace-nowrap">
        FIT-CONNECT
      </h1>
      <img src="${url.resourcesPath}/images/grid-01.svg" alt="Décoration" class="absolute bottom-0 left-0 w-240 h-240" />
    </div>
  </div>
</body>
</html>
