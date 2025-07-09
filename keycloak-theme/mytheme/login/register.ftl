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
  <div class="w-full md:w-1/2 flex flex-col justify-center px-4 md:px-6 py-10">
      <div class="w-full max-w-sm mx-auto ">
        <a href="/" class="inline-flex items-center mb-3 text-sm text-gray-500 hover:text-gray-700">
          <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Retour au site
      </a>

      <h1 class="mb-2 text-xl font-semibold">Inscription</h1>
      <p class="mb-4 text-sm text-gray-500">Créez un compte pour rejoindre FitConnect</p>

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
        <#elseif message.summary?contains("invalidPasswordMin")>
          Le mot de passe est invalide.
        <#else>
          Une erreur s'est produite. Veuillez réessayer.
        </#if>
        </div>
        </#if>


    

        <form id="registerForm" class="space-y-3" action="${url.registrationAction}" method="post">
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
            <label for="password" class="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
              <div class="text-xs mb-2 font-medium text-gray-500">Doit contenir minimum (12 caractères, 1 chiffre,1 lettre et 1 symbole)</div>
            <div class="relative">
            <input type="password" id="password" name="password"
                class="w-full px-4 py-2 pr-10 text-sm bg-white border border-gray-300 rounded-md 
                focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
            <button type="button" id="togglePassword" 
              class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none" aria-label="Afficher/Cacher le mot de passe">
              <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
            </div>
          </div>
        

          <div class="relative">
            <label for="password-confirm" class="block mb-1 text-sm font-medium text-gray-700">Confirmation de mot de passe</label>
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
      <!-- Grid en haut à droite -->
      <img src="${url.resourcesPath}/images/grid-01.svg"
           alt="Décoration en haut à droite"
           class="absolute top-0 right-0 w-240 h-240" />

      <!-- Image principale (centrée) -->
      <img src="${url.resourcesPath}/images/hero-login.svg"
           alt="Image principale"
           class="mx-auto h-[550px] object-contain" />

      <!-- Titre positionné en bas -->
      <h1 class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-orange-400 text-center whitespace-nowrap">
        FIT-CONNECT
      </h1>

      <!-- Grid en bas à gauche -->
      <img src="${url.resourcesPath}/images/grid-01.svg"
           alt="Décoration en bas à gauche"
           class="absolute bottom-0 left-0 w-240 h-240" />
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
