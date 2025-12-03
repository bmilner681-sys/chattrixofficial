#!/bin/bash

# Deploy frontend to Railway
# Usage: ./deploy-frontend.sh <BACKEND_URL>

if [ -z "$1" ]; then
    echo "Usage: ./deploy-frontend.sh <BACKEND_URL>"
    echo "Example: ./deploy-frontend.sh https://chattrix-api-xxxxx.railway.app"
    exit 1
fi

BACKEND_URL=$1

echo "Deploying Chattrix frontend to Railway..."
echo "Backend URL: $BACKEND_URL"

# Deploy with environment variables
railway service create --name chattrix-web

railway variable set VITE_SOCKET_URL=$BACKEND_URL
railway variable set VITE_API_URL=$BACKEND_URL

railway up --detach

echo "Frontend deployment started!"
