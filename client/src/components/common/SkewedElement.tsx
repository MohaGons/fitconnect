import React from "react";

// Constants pour le style skew utilisé dans toute l'application
export const SKEW_STYLE = {
  transform: "skewX(-12deg)",
  transformOrigin: "center",
} as const;

export const COUNTER_SKEW_STYLE = {
  transform: "skewX(12deg)",
} as const;

// Interface pour les props du composant SkewedElement
interface SkewedElementProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  "data-cy"?: string;
}

/**
 * Composant réutilisable pour les éléments avec style skew
 * Utilisé dans toutes les pages publiques pour le breadcrumb et autres éléments stylisés
 */
const SkewedElement: React.FC<SkewedElementProps> = ({
  children,
  className = "",
  onClick,
  "data-cy": dataCy,
}) => (
  <div
    className={className}
    style={SKEW_STYLE}
    onClick={onClick}
    data-cy={dataCy}
  >
    <div style={COUNTER_SKEW_STYLE}>{children}</div>
  </div>
);

export default SkewedElement;
