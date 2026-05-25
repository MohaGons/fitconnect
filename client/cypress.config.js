import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false, // Désactivé pour économiser l'espace disque
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 30000,

    env: {
      // URLs d'environnement
      API_URL: "http://localhost:3000",
      KEYCLOAK_URL: "http://localhost:8080",

      // Données de test
      TEST_USER_EMAIL: "testuser@example.com",
      TEST_USER_PASSWORD: "testpassword123",
      TEST_COACH_EMAIL: "testcoach@example.com",
      TEST_COACH_PASSWORD: "coachpassword123",
      TEST_ADMIN_EMAIL: "testadmin@example.com",
      TEST_ADMIN_PASSWORD: "adminpassword123",

      // Configuration des tests
      ENABLE_COVERAGE: true,
      SLOW_TEST_THRESHOLD: 10000,
    },

    setupNodeEvents(on, config) {
      // Configuration de la couverture de code
      // require("@cypress/code-coverage/task")(on, config);

      // Gestion des tâches personnalisées
      on("task", {
        // Tâche pour nettoyer la base de données de test
        cleanDatabase() {
          return new Promise((resolve) => {
            // Ici vous pourriez faire un appel API pour nettoyer la DB de test
            // ou exécuter des commandes SQL directement
            console.log("🧹 Cleaning test database...");
            resolve(null);
          });
        },

        // Tâche pour créer des données de test
        seedTestData(data) {
          return new Promise((resolve) => {
            console.log("🌱 Seeding test data:", data);
            // Logique pour créer des données de test
            resolve(data);
          });
        },

        // Tâche pour générer des tokens de test
        generateTestToken(userData) {
          return new Promise((resolve) => {
            console.log("🔑 Generating test token for:", userData);
            // Logique pour générer un token JWT de test
            resolve("mock-jwt-token");
          });
        },

        // Tâche pour vérifier l'état de l'API
        checkApiHealth() {
          return new Promise((resolve) => {
            console.log("🏥 Checking API health...");
            // Vérifier que l'API est disponible
            resolve({ status: "healthy" });
          });
        },
      });

      // Configuration pour différents navigateurs
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.name === "chrome") {
          launchOptions.args.push("--disable-dev-shm-usage");
          launchOptions.args.push("--no-sandbox");
          launchOptions.args.push("--disable-web-security");
          launchOptions.args.push("--allow-running-insecure-content");
        }

        return launchOptions;
      });

      // Gestion des échecs de test
      on("after:spec", (spec, results) => {
        if (results && results.video) {
          // Supprimer la vidéo si tous les tests ont réussi
          const failures = results.tests.some((test) =>
            test.attempts.some((attempt) => attempt.state === "failed")
          );
          if (!failures) {
            console.log("✅ All tests passed, video not needed");
            // fs.unlinkSync(results.video); // Optionnel: supprimer la vidéo
          }
        }
      });

      return config;
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    supportFile: "cypress/support/component.ts",
    specPattern: "src/**/*.cy.{js,jsx,ts,tsx}",
    indexHtmlFile: "cypress/support/component-index.html",
  },
});
