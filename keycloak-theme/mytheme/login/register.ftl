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
        <a href="http://localhost:5173/" class="inline-flex items-center mb-4 text-sm text-gray-500 hover:text-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour au site
        </a>

        <h1 class="mb-2 text-2xl font-semibold">Inscription</h1>
        <p class="mb-6 text-sm text-gray-500">Créez un compte pour rejoindre FitConnect</p>
        <div class="grid grid-cols-1 "><button class="inline-flex items-center justify-center gap-3 py-3 text-sm font-normal text-gray-700 transition-colors bg-gray-100 rounded-lg px-7 hover:bg-gray-200 hover:text-gray-800   "><svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.7511 10.1944C18.7511 9.47495 18.6915 8.94995 18.5626 8.40552H10.1797V11.6527H15.1003C15.0011 12.4597 14.4654 13.675 13.2749 14.4916L13.2582 14.6003L15.9087 16.6126L16.0924 16.6305C17.7788 15.1041 18.7511 12.8583 18.7511 10.1944Z" fill="#4285F4"></path><path d="M10.1788 18.75C12.5895 18.75 14.6133 17.9722 16.0915 16.6305L13.274 14.4916C12.5201 15.0068 11.5081 15.3666 10.1788 15.3666C7.81773 15.3666 5.81379 13.8402 5.09944 11.7305L4.99473 11.7392L2.23868 13.8295L2.20264 13.9277C3.67087 16.786 6.68674 18.75 10.1788 18.75Z" fill="#34A853"></path><path d="M5.10014 11.7305C4.91165 11.186 4.80257 10.6027 4.80257 9.99992C4.80257 9.3971 4.91165 8.81379 5.09022 8.26935L5.08523 8.1534L2.29464 6.02954L2.20333 6.0721C1.5982 7.25823 1.25098 8.5902 1.25098 9.99992C1.25098 11.4096 1.5982 12.7415 2.20333 13.9277L5.10014 11.7305Z" fill="#FBBC05"></path><path d="M10.1789 4.63331C11.8554 4.63331 12.9864 5.34303 13.6312 5.93612L16.1511 3.525C14.6035 2.11528 12.5895 1.25 10.1789 1.25C6.68676 1.25 3.67088 3.21387 2.20264 6.07218L5.08953 8.26943C5.81381 6.15972 7.81776 4.63331 10.1789 4.63331Z" fill="#EB4335"></path></svg>S'inscrire avec Google</button></div>    

        <div class="relative  ">
          <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-200 "></div></div>
          <div class="relative flex justify-center text-sm"><span class="p-2 text-gray-400 bg-white sm:px-5 sm:py-2">Ou</span></div>
        </div>

   <#if message??>
  <div id="error-message" class="mb-4 p-3 text-sm text-white bg-red-400 rounded relative">
    
    <#-- Croix de fermeture -->
    <button 
      onclick="document.getElementById('error-message').style.display='none'"
      class="absolute top-1 right-2 text-2xl text-white hover:text-black font-bold"
      aria-label="Fermer"
    >
      &times;
    </button>

    <#-- Affichage du bon message -->
    <#if message.summary == "emailExistsMessage">
      Cette adresse email est déjà utilisée.
    <#elseif message.summary == "usernameExistsMessage">
      Ce nom d'utilisateur est déjà pris.
    <#elseif message.summary == "invalidPasswordConfirmMessage">
      La confirmation du mot de passe ne correspond pas.
    <#elseif message.summary == "invalidPasswordMessage">
      Le mot de passe est invalide.
    <#else>
      Une erreur s'est produite. Veuillez réessayer.
    </#if>
    </div>
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

           <div class="relative">
            <label for="password" class="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
            <input type="password" id="password" name="password"
                class="w-full px-4 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-md 
                focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
            <button type="button" id="togglePassword" 
              class="absolute top-9 right-3 text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Afficher/Cacher le mot de passe">
              <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        

           <div class="relative">
            <label for="password-confirm" class="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
            <input type="password" id="password-confirm" name="password-confirm"
                class="w-full px-4 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-md 
                focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
            <button type="button" id="toggleConfirmPassword" 
              class="absolute top-9 right-3 text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Afficher/Cacher le mot de passe">
              <svg id="eyeIconConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
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

        <p class="mt-4 text-sm text-center text-gray-700">
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

  <script>
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password');
    const eyeIcon = document.querySelector('#eyeIcon');

    const toggleConfirmPassword = document.querySelector('#toggleConfirmPassword');
    const confirmPassword = document.querySelector('#password-confirm');
    const eyeIconConfirmPassword = document.querySelector('#eyeIconConfirmPassword');
   

    togglePassword.addEventListener('click', () => {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);

      // Change l'icône œil / œil barré
      if (type === 'text') {
        eyeIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.957 9.957 0 012.298-3.477m2.293-2.293A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.092 2.457M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18"/>
        `;
      } else {
        eyeIcon.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `;
      }
    });

    toggleConfirmPassword.addEventListener('click', () => {
      const type = confirmPassword.getAttribute('type') === 'password' ? 'text' : 'password';
      confirmPassword.setAttribute('type', type);

      if (type === 'text') {
        eyeIconConfirmPassword.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.957 9.957 0 012.298-3.477m2.293-2.293A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.092 2.457M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18"/>
        `;
      } else {
        eyeIconConfirmPassword.innerHTML = `
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        `;
      }
    });

  </script>



</body>
</html>
