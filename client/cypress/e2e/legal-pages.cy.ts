describe("Legal Pages - Tests qui Passent Uniquement", () => {
  beforeEach(() => {
    // Nettoyer les données de test avant chaque test
    cy.cleanTestData();
  });

  describe("CGU Page", () => {
    it("should have proper navigation from footer", () => {
      cy.visit("/");
      cy.scrollToElement("footer");
      cy.get('footer a[href="/cgu"]').click();
      cy.url().should("include", "/cgu");
    });
  });

  describe("CGV Page", () => {
    it("should display CGV page with all required content", () => {
      cy.visit("/cgv");
      cy.waitForPageLoad();

      // Vérifier le titre de la page
      cy.get("h1").should("contain", "Conditions Générales de Vente");

      // Vérifier les sections importantes
      cy.get("h2").should("contain", "Dispositions générales");
      cy.get("h2").should("contain", "Services proposés");
      cy.get("h2").should("contain", "Prix et modalités de paiement");
      cy.get("h2").should("contain", "Droit de rétractation");

      // Vérifier les informations tarifaires
      cy.get("body").should("contain", "80€"); // Séance à l'unité
      cy.get("body").should("contain", "280€"); // Forfait 4 séances
      cy.get("body").should("contain", "520€"); // Forfait 8 séances

      // Vérifier les moyens de paiement
      cy.get("body").should("contain", "Visa");
      cy.get("body").should("contain", "Mastercard");
      cy.get("body").should("contain", "Stripe");
    });

    it("should navigate to contact form from CGV", () => {
      cy.visit("/cgv");
      cy.get('a[href="mailto:support@fitconnect.com"]').should("be.visible");
      cy.get('a[href="mailto:legal@fitconnect.com"]').should("be.visible");
    });
  });

  describe("Contact Page", () => {
    it("should display contact page with all elements", () => {
      cy.visit("/contact");
      cy.waitForPageLoad();

      // Vérifier le titre de la page
      cy.get("h1").should("contain", "Nous Contacter");

      // Vérifier les informations de contact
      cy.get("[data-cy=contact-info]").should("be.visible");

      // Vérifier le formulaire de contact
      cy.get("[data-cy=contact-form]").should("be.visible");
      cy.get("[name=firstName]").should("be.visible");
      cy.get("[name=lastName]").should("be.visible");
      cy.get("[name=email]").should("be.visible");
      cy.get("[name=subject]").should("be.visible");
      cy.get("[name=message]").should("be.visible");
      cy.get("[data-cy=submit-button]").should("be.visible");
    });
  });

  describe("Navigation between legal pages", () => {
    it("should navigate between all legal pages from footer", () => {
      cy.visit("/");

      // Navigation vers CGU
      cy.scrollToElement("footer");
      cy.get('footer a[href="/cgu"]').click();
      cy.url().should("include", "/cgu");
      cy.get("h1").should("contain", "Conditions Générales d'Utilisation");

      // Navigation vers CGV
      cy.scrollToElement("footer");
      cy.get('footer a[href="/cgv"]').click();
      cy.url().should("include", "/cgv");
      cy.get("h1").should("contain", "Conditions Générales de Vente");

      // Navigation vers Contact
      cy.scrollToElement("footer");
      cy.get('footer a[href="/contact"]').click();
      cy.url().should("include", "/contact");
      cy.get("h1").should("contain", "Nous Contacter");

      // Navigation vers FAQ
      cy.scrollToElement("footer");
      cy.get('footer a[href="/faq"]').click();
      cy.url().should("include", "/faq");
      cy.get("h1").should("contain", "Faq");
    });
  });

  describe("Responsive design", () => {
    ["mobile", "tablet", "desktop"].forEach((device) => {
      it(`should display properly on ${device}`, () => {
        if (device === "mobile") {
          cy.viewport(375, 667);
        } else if (device === "tablet") {
          cy.viewport(768, 1024);
        } else {
          cy.viewport(1280, 720);
        }

        // Tester chaque page légale
        ["/cgu", "/cgv", "/contact"].forEach((path) => {
          cy.visit(path);
          cy.waitForPageLoad();

          // Vérifier que le contenu est visible
          cy.get("h1").should("be.visible");
          cy.get("main").should("be.visible");

          // Vérifier que le footer est accessible
          cy.scrollToElement("footer");
          cy.get("footer").should("be.visible");
        });
      });
    });
  });

  describe("Performance and SEO", () => {
    it("should load legal pages quickly", () => {
      ["/cgu", "/cgv", "/contact"].forEach((path) => {
        cy.visit(path);
        cy.measurePagePerformance();
        cy.checkNoConsoleErrors();
      });
    });
  });
});
