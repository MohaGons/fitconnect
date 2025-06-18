<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Définir un nouveau mot de passe | FitConnect</title>

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

        <h1 class="mb-2 text-2xl font-semibold">Définir un nouveau mot de passe</h1>
        <p class="mb-6 text-sm text-gray-500">Veuillez saisir votre nouveau mot de passe ci-dessous.</p>

        <#if message?has_content && message.summary?has_content>
        <div id="error-message" class="mb-4 p-3 text-sm text-white bg-red-400 rounded relative">
    
        <button 
          onclick="document.getElementById('error-message').style.display='none'"
          class="absolute top-1 right-2 text-2xl text-white hover:text-black font-bold"
          aria-label="Fermer"
        >
          &times;
        </button>

        <#if message.summary == "invalidPasswordConfirmMessage">
          La confirmation du mot de passe ne correspond pas.
        <#elseif message.summary == "invalidPasswordMessage">
          Le mot de passe est invalide.
        <#elseif message.summary == "expiredActionTokenSessionExistsMessage">
          Votre lien de réinitialisation est expiré ou déjà utilisé.
        <#elseif message.summary == "resetPasswordMessage">
            Veuillez définir un nouveau mot de passe pour votre compte.
        <#else>
          Une erreur s'est produite. Veuillez réessayer.
        </#if>
        </div>
        </#if>


        <form action="${url.loginAction}" method="post" class="space-y-4">
        <div class="relative">
            <label for="username" class="block mb-1 text-sm font-medium text-gray-700">Nouveau mot de passe</label>
            <input type="password" id="password-new" name="password-new" required
                class="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md 
                focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"/>
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
            <label for="password-confirm" class="block mb-1 text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input type="password" id="password-confirm" name="password-confirm" required
                    class="w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-md 
                    focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"/>
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
        <button type="submit" class="w-full px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600">
            Enregistrer le nouveau mot de passe
        </button>
        </form>

        <p class="mt-6 text-sm text-center text-gray-700">
          Vous avez déjà un compte ? 
          <a href="http://localhost:5173/login" class="text-orange-500 hover:text-orange-600">Se connecter</a>
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


  <script>
    const togglePassword = document.querySelector('#togglePassword');
    const password = document.querySelector('#password-new');
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
