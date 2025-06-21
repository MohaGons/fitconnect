# Build stage
FROM node:18-alpine as build
WORKDIR /app

# Copier les fichiers de configuration
COPY package*.json ./

# Installer TOUTES les dépendances (dev + prod) pour le build
RUN npm ci

# Copier le code source
COPY . .

# Build de l'application NestJS
RUN npm run build

# Production stage
FROM node:18-alpine as production
WORKDIR /app

# Copier package.json et installer les dépendances de production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier l'application buildée depuis le stage build
COPY --from=build /app/dist ./dist

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs

EXPOSE 3000

# Démarrer l'application compilée
CMD ["node", "dist/main"]