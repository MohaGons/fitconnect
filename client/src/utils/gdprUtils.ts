import { CookieCategories } from "../context/CookieConsentContext";

// Types pour les droits GDPR
export type GDPRRight =
  | "access" // Droit d'accès
  | "rectification" // Droit de rectification
  | "erasure" // Droit à l'effacement
  | "portability" // Droit à la portabilité
  | "restriction" // Droit de limitation
  | "objection" // Droit d'opposition
  | "consent_withdrawal"; // Retrait du consentement

// Interface pour une demande GDPR
export interface GDPRRequest {
  id: string;
  userId: string;
  type: GDPRRight;
  description: string;
  status: "pending" | "processing" | "completed" | "rejected";
  requestedAt: Date;
  processedAt?: Date;
  processingDeadline: Date;
  documents?: string[]; // URLs des documents générés
  notes?: string;
}

// Interface pour l'audit de conformité
export interface ComplianceAudit {
  timestamp: Date;
  userId?: string;
  action: string;
  category:
    | "data_collection"
    | "data_usage"
    | "data_sharing"
    | "user_rights"
    | "security"
    | "cookies";
  status: "compliant" | "non_compliant" | "warning";
  details: string;
  recommendations?: string[];
}

export class GDPRUtils {
  // Calculer la deadline pour traiter une demande GDPR (1 mois par défaut)
  static calculateProcessingDeadline(
    requestDate: Date,
    isComplex: boolean = false
  ): Date {
    const deadline = new Date(requestDate);
    const daysToAdd = isComplex ? 90 : 30; // 3 mois pour les demandes complexes, 1 mois sinon
    deadline.setDate(deadline.getDate() + daysToAdd);
    return deadline;
  }

  // Valider si une demande peut être traitée
  static validateGDPRRequest(request: Partial<GDPRRequest>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!request.userId) {
      errors.push("ID utilisateur requis");
    }

    if (!request.type) {
      errors.push("Type de demande requis");
    }

    if (!request.description?.trim()) {
      errors.push("Description de la demande requise");
    }

    // Vérifications spécifiques par type de demande
    switch (request.type) {
      case "erasure":
        warnings.push(
          "Vérifier les obligations légales de conservation avant suppression"
        );
        warnings.push(
          "S'assurer que la suppression n'affecte pas les droits d'autrui"
        );
        break;

      case "portability":
        warnings.push(
          "Vérifier que les données sont traitées de manière automatisée"
        );
        warnings.push(
          "S'assurer que le transfert ne porte pas atteinte aux droits d'autrui"
        );
        break;

      case "objection":
        warnings.push(
          "Vérifier si des intérêts légitimes impérieux justifient la poursuite du traitement"
        );
        break;
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // Générer un rapport de données personnelles pour l'utilisateur
  static generateDataExportStructure(userData: any): {
    personal_data: any;
    metadata: {
      exportDate: string;
      format: string;
      dataCategories: string[];
      retentionInfo: Record<string, string>;
    };
  } {
    const dataCategories = [];
    const retentionInfo: Record<string, string> = {};

    // Identifier les catégories de données
    if (userData.profile) {
      dataCategories.push("Données de profil");
      retentionInfo["Données de profil"] =
        "Conservées pendant la durée de la relation contractuelle";
    }

    if (userData.healthData) {
      dataCategories.push("Données de santé");
      retentionInfo["Données de santé"] =
        "Conservées 3 ans après la fin de la relation ou suppression sur demande";
    }

    if (userData.communications) {
      dataCategories.push("Communications");
      retentionInfo["Communications"] =
        "Conservées pendant la durée de la relation contractuelle";
    }

    if (userData.paymentHistory) {
      dataCategories.push("Données de paiement");
      retentionInfo["Données de paiement"] =
        "Conservées 10 ans pour obligations comptables et fiscales";
    }

    return {
      personal_data: {
        ...userData,
        _note:
          "Ces données vous appartiennent et sont traitées selon notre politique de confidentialité",
      },
      metadata: {
        exportDate: new Date().toISOString(),
        format: "JSON structuré conforme GDPR",
        dataCategories,
        retentionInfo,
      },
    };
  }

  // Valider la conformité des cookies
  static validateCookieCompliance(
    consent: CookieCategories,
    currentCookies: { name: string; category?: string }[]
  ): ComplianceAudit {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Vérifier les cookies non autorisés
    const unauthorizedCookies = currentCookies.filter((cookie) => {
      if (!cookie.category) return false;
      return !consent[cookie.category as keyof CookieCategories];
    });

    if (unauthorizedCookies.length > 0) {
      issues.push(
        `Cookies non autorisés détectés: ${unauthorizedCookies
          .map((c) => c.name)
          .join(", ")}`
      );
      recommendations.push("Supprimer immédiatement les cookies non autorisés");
    }

    // Vérifier la durée de validité du consentement
    const consentData = localStorage.getItem("fitconnect_cookie_consent");
    if (consentData) {
      try {
        const parsed = JSON.parse(consentData);
        if (parsed.consentDate) {
          const consentDate = new Date(parsed.consentDate);
          const now = new Date();
          const daysDiff =
            (now.getTime() - consentDate.getTime()) / (1000 * 3600 * 24);

          if (daysDiff > 365) {
            recommendations.push(
              "Le consentement date de plus d'un an, envisager de le renouveler"
            );
          }
        }
      } catch (error) {
        issues.push("Erreur lors de la lecture du consentement stocké");
      }
    }

    return {
      timestamp: new Date(),
      action: "Cookie compliance validation",
      category: "cookies",
      status: issues.length > 0 ? "non_compliant" : "compliant",
      details:
        issues.length > 0
          ? issues.join("; ")
          : "Conformité des cookies validée",
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  // Valider la conformité des données de santé
  static validateHealthDataCompliance(userData: any): ComplianceAudit {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Vérifier le consentement explicite pour les données de santé
    if (userData.healthData && !userData.healthDataConsent) {
      issues.push("Données de santé sans consentement explicite");
      recommendations.push(
        "Obtenir un consentement explicite pour les données de santé"
      );
    }

    // Vérifier la minimisation des données
    const sensitiveFields = ["weight", "height", "healthIssues", "medications"];
    const unnecessaryFields = sensitiveFields.filter(
      (field) =>
        userData.healthData?.[field] && !userData.activePrograms?.length
    );

    if (unnecessaryFields.length > 0) {
      recommendations.push(
        "Évaluer la nécessité de conserver certaines données de santé non utilisées"
      );
    }

    // Vérifier l'accès aux données de santé
    if (userData.healthData && userData.lastAccess) {
      const lastAccess = new Date(userData.lastAccess);
      const daysSinceAccess =
        (Date.now() - lastAccess.getTime()) / (1000 * 3600 * 24);

      if (daysSinceAccess > 180) {
        recommendations.push(
          "Utilisateur inactif depuis plus de 6 mois, considérer l'archivage des données de santé"
        );
      }
    }

    return {
      timestamp: new Date(),
      userId: userData.id,
      action: "Health data compliance validation",
      category: "data_usage",
      status: issues.length > 0 ? "non_compliant" : "compliant",
      details:
        issues.length > 0
          ? issues.join("; ")
          : "Conformité des données de santé validée",
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  // Générer un rapport de conformité global
  static generateComplianceReport(
    userData: any,
    consent: CookieCategories,
    currentCookies: { name: string; category?: string }[]
  ): {
    overallCompliance: "compliant" | "non_compliant" | "warning";
    audits: ComplianceAudit[];
    summary: {
      totalIssues: number;
      criticalIssues: number;
      recommendations: number;
    };
    nextActions: string[];
  } {
    const audits: ComplianceAudit[] = [];
    let totalIssues = 0;
    let criticalIssues = 0;
    let totalRecommendations = 0;
    const nextActions: string[] = [];

    // Audit des cookies
    const cookieAudit = this.validateCookieCompliance(consent, currentCookies);
    audits.push(cookieAudit);
    if (cookieAudit.status === "non_compliant") {
      totalIssues++;
      criticalIssues++;
    }
    if (cookieAudit.recommendations) {
      totalRecommendations += cookieAudit.recommendations.length;
    }

    // Audit des données de santé
    if (userData.healthData) {
      const healthAudit = this.validateHealthDataCompliance(userData);
      audits.push(healthAudit);
      if (healthAudit.status === "non_compliant") {
        totalIssues++;
        criticalIssues++;
      }
      if (healthAudit.recommendations) {
        totalRecommendations += healthAudit.recommendations.length;
      }
    }

    // Audit général de la conformité GDPR
    const generalAudit = this.validateGeneralCompliance(userData);
    audits.push(generalAudit);
    if (generalAudit.status === "non_compliant") {
      totalIssues++;
    }
    if (generalAudit.recommendations) {
      totalRecommendations += generalAudit.recommendations.length;
    }

    // Déterminer les actions suivantes
    if (criticalIssues > 0) {
      nextActions.push(
        "Corriger immédiatement les problèmes critiques de conformité"
      );
    }
    if (totalRecommendations > 0) {
      nextActions.push(
        "Examiner et implémenter les recommandations d'amélioration"
      );
    }
    if (totalIssues === 0) {
      nextActions.push("Maintenir le niveau de conformité actuel");
      nextActions.push("Programmer un audit de suivi dans 3 mois");
    }

    const overallCompliance =
      criticalIssues > 0
        ? "non_compliant"
        : totalIssues > 0
        ? "warning"
        : "compliant";

    return {
      overallCompliance,
      audits,
      summary: {
        totalIssues,
        criticalIssues,
        recommendations: totalRecommendations,
      },
      nextActions,
    };
  }

  // Validation générale de la conformité GDPR
  private static validateGeneralCompliance(userData: any): ComplianceAudit {
    const issues: string[] = [];
    const recommendations: string[] = [];

    // Vérifier les informations requises
    if (!userData.email) {
      issues.push("Email manquant dans les données utilisateur");
    }

    // Vérifier la date de création du compte
    if (userData.createdAt) {
      const createdDate = new Date(userData.createdAt);
      const gdprDate = new Date("2018-05-25");

      if (createdDate < gdprDate && !userData.gdprMigrated) {
        recommendations.push(
          "Compte créé avant le RGPD, vérifier la migration de conformité"
        );
      }
    }

    // Vérifier les préférences de communication
    if (!userData.communicationPreferences) {
      recommendations.push("Définir des préférences de communication claires");
    }

    return {
      timestamp: new Date(),
      userId: userData.id,
      action: "General GDPR compliance validation",
      category: "data_collection",
      status: issues.length > 0 ? "non_compliant" : "compliant",
      details:
        issues.length > 0
          ? issues.join("; ")
          : "Conformité générale GDPR validée",
      recommendations: recommendations.length > 0 ? recommendations : undefined,
    };
  }

  // Utilitaire pour nettoyer les données selon la demande de suppression
  static prepareDataDeletion(
    userData: any,
    deletionType: "partial" | "complete" = "complete"
  ): {
    toDelete: string[];
    toRetain: string[];
    toAnonymize: string[];
    legalBasis: Record<string, string>;
  } {
    const toDelete: string[] = [];
    const toRetain: string[] = [];
    const toAnonymize: string[] = [];
    const legalBasis: Record<string, string> = {};

    if (deletionType === "complete") {
      // Données à supprimer immédiatement
      toDelete.push(
        "profile",
        "healthData",
        "progressPhotos",
        "communications"
      );

      // Données à conserver pour obligations légales
      if (userData.paymentHistory?.length > 0) {
        toRetain.push("paymentHistory");
        legalBasis["paymentHistory"] =
          "Obligations comptables et fiscales (10 ans)";
      }

      // Données à anonymiser
      if (userData.reviews?.length > 0) {
        toAnonymize.push("reviews");
        legalBasis["reviews"] = "Anonymisation pour statistiques publiques";
      }
    } else {
      // Suppression partielle - uniquement les données sensibles
      toDelete.push("healthData", "progressPhotos");
      toRetain.push("profile", "paymentHistory", "communications");
    }

    return {
      toDelete,
      toRetain,
      toAnonymize,
      legalBasis,
    };
  }

  // Générer un certificat de suppression
  static generateDeletionCertificate(
    userId: string,
    deletionDetails: ReturnType<typeof GDPRUtils.prepareDataDeletion>
  ): {
    certificateId: string;
    userId: string;
    deletionDate: Date;
    deletedData: string[];
    retainedData: string[];
    legalBasis: Record<string, string>;
    signature: string;
  } {
    const certificateId = `DEL_${userId}_${Date.now()}`;
    const deletionDate = new Date();

    // Signature simplifiée (dans un vrai projet, utiliser une vraie signature cryptographique)
    const signature = Buffer.from(
      `${certificateId}_${deletionDate.toISOString()}_FITCONNECT`
    ).toString("base64");

    return {
      certificateId,
      userId,
      deletionDate,
      deletedData: deletionDetails.toDelete,
      retainedData: deletionDetails.toRetain,
      legalBasis: deletionDetails.legalBasis,
      signature,
    };
  }

  // Vérifier si l'utilisateur peut exercer un droit spécifique
  static canExerciseRight(
    userData: any,
    right: GDPRRight
  ): {
    canExercise: boolean;
    reason?: string;
    conditions?: string[];
  } {
    const conditions: string[] = [];

    switch (right) {
      case "erasure":
        // Vérifier s'il y a des obligations de conservation
        if (userData.paymentHistory?.length > 0) {
          conditions.push(
            "Certaines données de facturation doivent être conservées pour obligations légales"
          );
        }
        if (userData.activeContracts?.length > 0) {
          return {
            canExercise: false,
            reason:
              "Impossible de supprimer les données pendant la durée du contrat actif",
          };
        }
        break;

      case "portability":
        if (!userData.automatedProcessing) {
          return {
            canExercise: false,
            reason:
              "Le droit à la portabilité ne s'applique qu'aux traitements automatisés",
          };
        }
        break;

      case "objection":
        if (userData.contractualData) {
          conditions.push(
            "L'objection peut ne pas s'appliquer aux données nécessaires à l'exécution du contrat"
          );
        }
        break;
    }

    return {
      canExercise: true,
      conditions: conditions.length > 0 ? conditions : undefined,
    };
  }
}

export default GDPRUtils;
