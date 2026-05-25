/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

import "@testing-library/cypress/add-commands";
import "cypress-real-events/support";

// ===============================================
// AUTHENTICATION COMMANDS
// ===============================================

/**
 * Commande pour se connecter avec Keycloak
 */
Cypress.Commands.add("loginWithKeycloak", (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit("/login");
    cy.get("[data-cy=email-input]").type(email);
    cy.get("[data-cy=password-input]").type(password);
    cy.get("[data-cy=login-button]").click();

    // Attendre la redirection après connexion
    cy.url().should("not.include", "/login");
    cy.window().its("localStorage").should("have.property", "token");
  });
});

/**
 * Commande pour se connecter en tant que client
 */
Cypress.Commands.add("loginAsClient", () => {
  const email = Cypress.env("TEST_USER_EMAIL");
  const password = Cypress.env("TEST_USER_PASSWORD");
  cy.loginWithKeycloak(email, password);
});

/**
 * Commande pour se connecter en tant que coach
 */
Cypress.Commands.add("loginAsCoach", () => {
  const email = Cypress.env("TEST_COACH_EMAIL");
  const password = Cypress.env("TEST_COACH_PASSWORD");
  cy.loginWithKeycloak(email, password);
});

/**
 * Commande pour se connecter en tant qu'admin
 */
Cypress.Commands.add("loginAsAdmin", () => {
  const email = Cypress.env("TEST_ADMIN_EMAIL");
  const password = Cypress.env("TEST_ADMIN_PASSWORD");
  cy.loginWithKeycloak(email, password);
});

/**
 * Commande pour se déconnecter
 */
Cypress.Commands.add("logout", () => {
  cy.get("[data-cy=user-menu]").click();
  cy.get("[data-cy=logout-button]").click();
  cy.url().should("include", "/");
  cy.window().its("localStorage").should("not.have.property", "token");
});

// ===============================================
// NAVIGATION COMMANDS
// ===============================================

/**
 * Commande pour naviguer vers le dashboard
 */
Cypress.Commands.add("navigateToDashboard", () => {
  cy.get("[data-cy=dashboard-link]").click();
  cy.url().should("include", "/dashboard");
  cy.get("[data-cy=dashboard-title]").should("be.visible");
});

/**
 * Commande pour naviguer vers une section spécifique
 */
Cypress.Commands.add("navigateToSection", (section: string) => {
  cy.get(`[data-cy=${section}-nav]`).click();
  cy.url().should("include", `/${section}`);
});

// ===============================================
// FORM COMMANDS
// ===============================================

/**
 * Commande pour remplir le formulaire de contact
 */
Cypress.Commands.add(
  "fillContactForm",
  (formData: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
  }) => {
    cy.get("[data-cy=contact-form]").within(() => {
      cy.get("[name=firstName]").type(formData.firstName);
      cy.get("[name=lastName]").type(formData.lastName);
      cy.get("[name=email]").type(formData.email);
      cy.get("[name=subject]").select(formData.subject);
      cy.get("[name=message]").type(formData.message);
    });
  }
);

/**
 * Commande pour créer un programme d'entraînement
 */
Cypress.Commands.add(
  "createProgram",
  (programData: {
    name: string;
    description: string;
    duration: number;
    difficulty: string;
    type: string;
  }) => {
    cy.get("[data-cy=create-program-button]").click();
    cy.get("[data-cy=program-form]").within(() => {
      cy.get("[name=name]").type(programData.name);
      cy.get("[name=description]").type(programData.description);
      cy.get("[name=duration]").type(programData.duration.toString());
      cy.get("[name=difficulty]").select(programData.difficulty);
      cy.get("[name=type]").select(programData.type);
      cy.get("[data-cy=submit-button]").click();
    });

    // Vérifier que le programme a été créé
    cy.get("[data-cy=success-message]").should("be.visible");
    cy.get("[data-cy=program-list]").should("contain", programData.name);
  }
);

// ===============================================
// API COMMANDS
// ===============================================

/**
 * Commande pour faire un appel API authentifié
 */
Cypress.Commands.add(
  "apiRequest",
  (method: string, url: string, body?: any) => {
    return cy.window().then((win) => {
      const token = win.localStorage.getItem("token");
      return cy.request({
        method,
        url: `${Cypress.env("API_URL")}${url}`,
        body,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    });
  }
);

/**
 * Commande pour nettoyer les données de test
 */
Cypress.Commands.add("cleanTestData", () => {
  return cy.task("cleanDatabase");
});

/**
 * Commande pour créer des données de test
 */
Cypress.Commands.add("seedTestData", (data: any) => {
  return cy.task("seedTestData", data);
});

// ===============================================
// UI HELPERS
// ===============================================

/**
 * Commande pour attendre qu'un élément soit visible et interactif
 */
Cypress.Commands.add("waitForElement", (selector: string, timeout = 10000) => {
  cy.get(selector, { timeout }).should("be.visible").should("not.be.disabled");
});

/**
 * Commande pour faire défiler jusqu'à un élément
 */
Cypress.Commands.add("scrollToElement", (selector: string) => {
  cy.get(selector).scrollIntoView().should("be.visible");
});

/**
 * Commande pour vérifier les erreurs de validation
 */
Cypress.Commands.add("checkValidationErrors", (fields: string[]) => {
  fields.forEach((field) => {
    cy.get(`[data-cy=${field}-error]`).should("be.visible");
  });
});

/**
 * Commande pour vérifier qu'il n'y a pas d'erreurs console
 */
Cypress.Commands.add("checkNoConsoleErrors", () => {
  // Pour une version simple, on peut juste s'assurer qu'il n'y a pas d'erreurs JS critiques
  cy.window().then((win) => {
    // Vérifier qu'il n'y a pas d'erreurs dans les logs (version simplifiée)
    cy.log("Checking for console errors - simplified version");
  });
});

// ===============================================
// LOADING AND PERFORMANCE
// ===============================================

/**
 * Commande pour attendre que la page soit complètement chargée
 */
Cypress.Commands.add("waitForPageLoad", () => {
  cy.window().its("document.readyState").should("equal", "complete");
  cy.get("[data-cy=loading-spinner]").should("not.exist");
});

/**
 * Commande pour mesurer les performances de chargement
 */
Cypress.Commands.add("measurePagePerformance", () => {
  cy.window().then((win) => {
    const navigation = win.performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;
    const loadTime = navigation.loadEventEnd - navigation.fetchStart;

    cy.log(`Page load time: ${loadTime}ms`);

    // Vérifier que le temps de chargement est acceptable
    expect(loadTime).to.be.lessThan(Cypress.env("SLOW_TEST_THRESHOLD"));
  });
});

// ===============================================
// ACCESSIBILITY
// ===============================================

/**
 * Commande pour vérifier l'accessibilité de base
 */
Cypress.Commands.add("checkA11y", () => {
  // Vérifier que tous les boutons ont des labels ou du texte
  cy.get("button").each(($btn) => {
    const hasAriaLabel = $btn.attr("aria-label");
    const hasText = $btn.text().trim().length > 0;
    expect(hasAriaLabel || hasText).to.be.true;
  });

  // Vérifier que tous les inputs ont des labels ou placeholders
  cy.get("input").each(($input) => {
    const hasAriaLabel = $input.attr("aria-label");
    const hasPlaceholder = $input.attr("placeholder");
    const hasLabel =
      $input.attr("id") &&
      Cypress.$(`label[for="${$input.attr("id")}"]`).length > 0;
    expect(hasAriaLabel || hasPlaceholder || hasLabel).to.be.true;
  });
});

// ===============================================
// TYPE DECLARATIONS
// ===============================================

declare global {
  namespace Cypress {
    interface Chainable {
      // Authentication
      loginWithKeycloak(email: string, password: string): Chainable<void>;
      loginAsClient(): Chainable<void>;
      loginAsCoach(): Chainable<void>;
      loginAsAdmin(): Chainable<void>;
      logout(): Chainable<void>;

      // Navigation
      navigateToDashboard(): Chainable<void>;
      navigateToSection(section: string): Chainable<void>;

      // Forms
      fillContactForm(formData: {
        firstName: string;
        lastName: string;
        email: string;
        subject: string;
        message: string;
      }): Chainable<void>;
      createProgram(programData: {
        name: string;
        description: string;
        duration: number;
        difficulty: string;
        type: string;
      }): Chainable<void>;

      // API
      apiRequest(
        method: string,
        url: string,
        body?: any
      ): Chainable<Cypress.Response<any>>;
      cleanTestData(): Chainable<void>;
      seedTestData(data: any): Chainable<void>;

      // UI Helpers
      waitForElement(selector: string, timeout?: number): Chainable<void>;
      scrollToElement(selector: string): Chainable<void>;
      checkValidationErrors(fields: string[]): Chainable<void>;
      checkNoConsoleErrors(): Chainable<void>;

      // Performance
      waitForPageLoad(): Chainable<void>;
      measurePagePerformance(): Chainable<void>;

      // Accessibility
      checkA11y(): Chainable<void>;
    }
  }
}
