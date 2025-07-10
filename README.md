# FitConnect - Plateforme Fitness Moderne 🏋️‍♂️

> **Plateforme de Coaching Fitness Personnalisé** - Application web complète avec authentification SSO, monitoring et déploiement Kubernetes

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://gitlab.com/Ali1999/projet-annuel)
[![Deployment](https://img.shields.io/badge/deployment-production-blue)](https://fitnessconnect.fr)
[![Uptime](https://img.shields.io/badge/uptime-99.9%25-green)](https://uptimekuma.fitnessconnect.fr)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

FitConnect est une plateforme web complète dédiée au coaching fitness personnalisé, déployée sur Google Kubernetes Engine (GKE) avec toutes les bonnes pratiques de production.

![FitConnect Preview](https://i.postimg.cc/sgDwQdxk/preview.png)

## 🎯 Présentation du Projet

Dans un monde où la santé et le bien-être sont devenus des priorités, les influenceurs fitness jouent un rôle clé en inspirant et en accompagnant des milliers de personnes dans leur transformation physique. **FitConnect** permet aux coachs et influenceurs de gérer facilement leurs clients, de proposer des programmes sur-mesure et de suivre les progrès en temps réel.

## ✨ Fonctionnalités Implémentées

### 🔐 Authentification et Gestion des Comptes
- ✅ Création de compte Coach et Client
- ✅ Validation de mot de passe avec critères de sécurité
- ✅ Envoi de mail de confirmation automatique
- ✅ Connexion SSO via Keycloak
- ✅ Profils utilisateurs personnalisés

### 💪 Gestion des Entraînements
- ✅ Création d'exercices personnalisés
- ✅ Création de programmes d'entraînement
- ✅ Planification des séances d'entraînement
- ✅ Base de données exercices avec catégories

### 🥗 Système Nutritionnel
- ✅ Création d'ingrédients avec valeurs nutritionnelles
- ✅ Création de repas équilibrés
- ✅ Plans nutritionnels personnalisés
- ✅ Planification des repas quotidiens

### 💬 Communication et Interaction
- ✅ Messagerie en temps réel entre client et coach
- ✅ Système de notifications intégré
- ✅ Interface chat responsive

### 💳 Gestion des Abonnements
- ✅ Système d'abonnement pour les coachs
- ✅ Intégration Stripe pour les paiements
- ✅ Gestion des statuts d'abonnement

### 🤝 Système de Coaching
- ✅ Demande d'un client vers un coach
- ✅ Acceptation/refus de la demande par le coach
- ✅ Gestion des relations coach-client

## 🏗️ Architecture Technique

### Stack Technologique

| Couche | Technologie | Version | Statut |
|--------|-------------|---------|--------|
| **Frontend** | React.js + TypeScript | 18.x | ✅ Déployé |
| **CSS Framework** | Tailwind CSS | 3.x | ✅ Configuré |
| **Backend** | NestJS + TypeScript | 10.x | ✅ Production |
| **Base de Données** | PostgreSQL | 14 | ✅ Cluster GKE |
| **Authentification** | Keycloak SSO | 24.x | ✅ Fonctionnel |
| **Paiements** | Stripe API | Latest | ✅ Intégré |
| **Messaging** | WebSocket + Socket.io | - | ✅ Temps réel |
| **Email** | SMTP + Nodemailer | - | ✅ Notifications |
| **Monitoring** | Uptime Kuma | Latest | ✅ 24/7 |
| **Administration** | Adminer | Latest | ✅ DB Management |
| **Orchestration** | Kubernetes (GKE) | 1.28+ | ✅ Production |
| **CI/CD** | GitLab CI | - | ✅ Automatisé |

### Infrastructure Déployée

```
Cluster GKE (k8s-frist-test)
├── Frontend (2 replicas) → fitnessconnect.fr
├── API NestJS (1 replica) → api.fitnessconnect.fr  
├── PostgreSQL (1 replica) → Base de données
├── Keycloak (1 replica) → login.fitnessconnect.fr
├── Adminer (1 replica) → adminer.fitnessconnect.fr
└── Uptime Kuma (1 replica) → uptimekuma.fitnessconnect.fr
```

## 🌐 Accès aux Services

| Service | URL Production | Description |
|---------|---------------|-------------|
| **Application** | [fitnessconnect.fr](https://fitnessconnect.fr) | Interface utilisateur principale |
| **API REST** | [api.fitnessconnect.fr](https://api.fitnessconnect.fr) | Endpoints backend |
| **Authentification** | [login.fitnessconnect.fr](https://login.fitnessconnect.fr) | Portail Keycloak SSO |
| **Administration DB** | [adminer.fitnessconnect.fr](https://adminer.fitnessconnect.fr) | Interface PostgreSQL |
| **Monitoring** | [Uptime Kuma](http://34.79.238.35:3001/dashboard) | Surveillance système |

## 🚀 Déploiement

### Prérequis

#### Google Cloud Platform
- Projet GCP : `k8s-frist-test`
- Cluster GKE : `react-app-cluster` (europe-west1-b)
- Artifact Registry : `annual-project-repo`
- Domaine configuré : `fitnessconnect.fr`

#### Outils Requis
- `gcloud` CLI configuré
- `kubectl` installé
- `docker` disponible
- Accès GitLab CI avec runner `ilyes-runner`

### Configuration des Variables

Dans GitLab CI, configurer les variables suivantes :

```bash
# Google Cloud
GCP_PROJECT_ID=k8s-frist-test
GKE_CLUSTER_NAME=react-app-cluster  
GKE_ZONE=europe-west1-b
AR_LOCATION=europe-west1
AR_REPO=annual-project-repo
NAMESPACE=annual-project

# Secrets (protégés)
GCP_SERVICE_KEY=<base64-encoded-service-account>
POSTGRES_PASSWORD=<secure-password>
JWT_SECRET=<secure-jwt-secret>
STRIPE_SECRET_KEY=<stripe-secret>
```

### Pipeline CI/CD

Le déploiement s'effectue automatiquement via GitLab CI sur la branche `feature-deploy-ilyes` :

```yaml
Stages:
1. 🔨 BUILD    - Images Docker Frontend/API
2. 🧪 TEST     - Tests unitaires (branche main)
3. 🚀 DEPLOY   - Déploiement Kubernetes
```

### Déploiement Manuel

```bash
# 1. Connexion au cluster
gcloud container clusters get-credentials react-app-cluster --zone europe-west1-b

# 2. Déploiement des ressources
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/secrets/
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/keycloak/
kubectl apply -f k8s/api/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress/

# 3. Vérification
kubectl get pods -n annual-project
kubectl get services -n annual-project
```

## 📊 Monitoring et Métriques

### État du Cluster

```bash
PODS EN PRODUCTION (AGE: 8 jours)
┌─────────────────────────────────────┐
│ ✅ Frontend      │ 2/2 Running      │
│ ✅ API NestJS    │ 1/1 Running      │  
│ ✅ PostgreSQL    │ 1/1 Running      │
│ ✅ Keycloak      │ 1/1 Running      │
│ ✅ Adminer       │ 1/1 Running      │
│ ✅ Uptime Kuma   │ 1/1 Running      │
└─────────────────────────────────────┘
```

### Métriques de Performance

- **Uptime** : 99.9% (8 jours de production stable)
- **Load Balancing** : Distribution automatique du trafic
- **Auto-Recovery** : Redémarrage automatique des pods défaillants
- **Zero-Downtime** : Déploiements sans interruption

## 🧪 Tests

### Frontend (React + TypeScript)
```bash
cd client
npm install
npm run test        # Tests unitaires
npm run test:e2e    # Tests end-to-end
npm run lint        # Linting
```

### Backend (NestJS)
```bash
cd server
npm install
npm run test        # Tests unitaires
npm run test:e2e    # Tests intégration
npm run lint        # Linting
```

## 📁 Structure du Projet

```
fitconnect/
├── README.md
├── .gitlab-ci.yml                # Pipeline CI/CD
├── client/                       # Frontend React
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── ...
├── server/                       # Backend NestJS
│   ├── Dockerfile
│   ├── package.json
│   ├── src/
│   └── ...
└── k8s/                         # Manifests Kubernetes
    ├── namespace/
    ├── secrets/
    ├── postgres/
    ├── api/
    ├── frontend/
    ├── keycloak/
    ├── adminer/
    ├── uptime-kuma/
    ├── network-policy/
    └── ingress/
```

## 🔧 Développement Local

### Backend
```bash
cd server
npm install
cp .env.example .env    # Configurer les variables
npm run start:dev       # Mode développement
```

### Frontend
```bash
cd client
npm install
npm run dev            # Serveur de développement
```

### Base de Données
```bash
# Avec Docker
docker run -d \
  --name postgres-dev \
  -e POSTGRES_DB=fitness_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:14
```

## 🔒 Sécurité

- **HTTPS Everywhere** : Certificats SSL automatiques via Google Cloud
- **Network Policies** : Isolation réseau entre pods
- **Secrets Management** : Variables sensibles chiffrées dans Kubernetes
- **Authentication** : SSO Keycloak avec sécurité renforcée
- **RBAC** : Contrôle d'accès basé sur les rôles

## 🔄 Roadmap

### Phase 2 - Amélioration UX
- 📊 Tableaux de bord avec graphiques de progression
- 📱 Optimisation mobile et PWA
- 🎨 Interface utilisateur avancée

### Phase 3 - Fonctionnalités Avancées
- 📈 Suivi des performances et statistiques
- 📷 Upload photos avant/après
- 🔔 Notifications push mobile

### Phase 4 - Intelligence Artificielle
- 🤖 Suggestions automatiques d'exercices
- 📈 Prédiction des progressions
- 🎯 Recommandations personnalisées

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📞 Support

- **Documentation** : [docs.fitnessconnect.fr](https://docs.page/alikhelifa15/K8S-DOC)
- **Issues** : [GitHub Issues](https://gitlab.com/Ali1999/projet-annuel)
- **Email** : support@fitnessconnect.fr

---

## 🏆 Achievements

> **🎯 MVP Fonctionnel** : 8 modules complets implémentés et déployés en production

> **☁️ Cloud-Native** : Architecture microservices sur Kubernetes avec monitoring 24/7

> **🔐 Production-Ready** : Sécurité, performance et haute disponibilité

> **⚡ DevOps Excellence** : CI/CD automatisé avec GitLab et déploiement continu

---

*Développé avec ❤️ par l'équipe FitConnect*