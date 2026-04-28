#!/usr/bin/env bash
set -e

# Usage:
#   ./deploy.sh           -> deploy without seeding
#   ./deploy.sh seed      -> deploy and run solid seed

# RUN_SEED=false

# if [[ "$1" == "seed" ]]; then
#   RUN_SEED=true
# fi

echo "▶ Starting deployment..."

# echo "▶ Pulling latest code..."
# git pull

# echo "▶ Installing npm dependencies..."
# npm install


echo "▶ Build..."
npm run build

# echo "▶ Rebuilding project..."
# cd ..

# npx @solidxai/solidctl build

# if [[ "$RUN_SEED" == true ]]; then
#   echo "▶ Running solid seed..."
#   # solid seed
#   cd ..
#   npx @solidxai/solidctl seed
# else
#   echo "▶ Skipping solid seed"
# fi

echo "▶ Stopping PM2 process: hmelectricals_api"
pm2 stop hmelectricals_api   || true

echo "▶ Starting PM2 process: hmelectricals_api"
pm2 start hmelectricals_api

echo "✅ Deployment complete"
