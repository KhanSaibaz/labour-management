#!/usr/bin/env bash
set -e

echo "▶ Starting UI deployment..."

# echo "▶ Removing package-lock.json..."
# sudo rm -f package-lock.json

# echo "▶ Removing @solidstarters packages from node_modules..."
# sudo rm -rf node_modules/@solidstarters

echo "▶ Removing existing dist build..."
sudo rm -rf dist

# echo "▶ Installing Solid Core UI from local tarball..."
# npm i /opt/gitco/javascript/solid-core-ui/solidstarters-solid-core-ui-1.1.211.tgz

echo "▶ Building UI (Vite build)..."
npm run build

echo "✅ UI deployment complete"
