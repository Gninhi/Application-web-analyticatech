#!/bin/bash
# Build script — portable (Linux/macOS).
# Détecte le répertoire projet (parent de .zscripts) au lieu de hardcoder un chemin Unix.
exec 2>&1
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
# Projet = parent du dossier .zscripts
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

if [ ! -f "$PROJECT_DIR/package.json" ]; then
    echo "❌ Aucun package.json trouvé dans: $PROJECT_DIR"
    exit 1
fi

echo "🚀 Build Analyticatech"
echo "📁 Projet: $PROJECT_DIR"

cd "$PROJECT_DIR"

export NEXT_TELEMETRY_DISABLED=1

BUILD_DIR="${BUILD_DIR:-/tmp/build_fullstack_$(date +%s)}"
echo "📁 Dossier de build: $BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Installe les dépendances
echo "📦 Installation des dépendances..."
if command -v bun >/dev/null 2>&1; then
    bun install
elif command -v npm >/dev/null 2>&1; then
    npm install --no-audit --no-fund
else
    echo "❌ Ni bun ni npm trouvés dans le PATH"
    exit 1
fi

# Build Next.js
echo "🔨 Build Next.js..."
if command -v bun >/dev/null 2>&1; then
    bun run build
else
    npm run build
fi

# Copie standalone + static + public
if [ -d ".next/standalone" ]; then
    echo "  - copie .next/standalone"
    mkdir -p "$BUILD_DIR/next-service-dist"
    cp -r .next/standalone/. "$BUILD_DIR/next-service-dist/"
fi
if [ -d ".next/static" ]; then
    echo "  - copie .next/static"
    mkdir -p "$BUILD_DIR/next-service-dist/.next"
    cp -r .next/static "$BUILD_DIR/next-service-dist/.next/"
fi
if [ -d "public" ]; then
    echo "  - copie public"
    cp -r public "$BUILD_DIR/next-service-dist/"
fi

# Copie + synchronise la DB (prod : DATABASE_URL doit pointer vers un volume persistant)
if [ -f "./db/custom.db" ]; then
    echo "🗄️  Copie de la DB locale de référence..."
    mkdir -p "$BUILD_DIR/db"
    cp ./db/custom.db "$BUILD_DIR/db/custom.db"

    echo "🗄️  Synchronisation du schéma..."
    if command -v bun >/dev/null 2>&1; then
        DATABASE_URL="file:$BUILD_DIR/db/custom.db" bun run db:push
    else
        DATABASE_URL="file:$BUILD_DIR/db/custom.db" npx prisma db push
    fi
    echo "✅ DB prête"
else
    echo "⚠️  ./db/custom.db absent — la DB sera créée via db:push en prod"
fi

# mini-services (optionnel)
if [ -d "$PROJECT_DIR/mini-services" ] && [ -f "$SCRIPT_DIR/mini-services-install.sh" ]; then
    echo "🔨 Build mini-services..."
    sh "$SCRIPT_DIR/mini-services-install.sh"
    sh "$SCRIPT_DIR/mini-services-build.sh"
    [ -f "$SCRIPT_DIR/mini-services-start.sh" ] && cp "$SCRIPT_DIR/mini-services-start.sh" "$BUILD_DIR/" && chmod +x "$BUILD_DIR/mini-services-start.sh"
fi

# Caddyfile
[ -f "Caddyfile" ] && echo "  - copie Caddyfile" && cp Caddyfile "$BUILD_DIR/"

# start.sh
[ -f "$SCRIPT_DIR/start.sh" ] && echo "  - copie start.sh" && cp "$SCRIPT_DIR/start.sh" "$BUILD_DIR/" && chmod +x "$BUILD_DIR/start.sh"

# Tarball
PACKAGE_FILE="${BUILD_DIR}.tar.gz"
echo "📦 Packaging $PACKAGE_FILE..."
cd "$BUILD_DIR"
tar -czf "$PACKAGE_FILE" .
cd - > /dev/null

echo ""
echo "✅ Build terminé: $PACKAGE_FILE"
ls -lh "$PACKAGE_FILE"
