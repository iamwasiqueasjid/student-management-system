#!/bin/bash

# ============================================
# ngrok Tunnel Script
# Exposes WebApp and Minikube Dashboard
# ============================================

echo "============================================"
echo "Starting ngrok Tunnels"
echo "============================================"
echo ""
echo "IMPORTANT: You need to authenticate ngrok first!"
echo "Run: ngrok config add-authtoken YOUR_AUTH_TOKEN"
echo "Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken"
echo ""

# Get the webapp service URL
WEBAPP_URL=$(minikube service webapp-service --url)
WEBAPP_PORT=$(echo $WEBAPP_URL | grep -oP ':\K[0-9]+')

echo "WebApp is running at: $WEBAPP_URL"
echo ""

# Start dashboard in background and get URL
echo "Starting Minikube Dashboard..."
minikube dashboard --url &
sleep 5

# Get dashboard URL
DASHBOARD_URL=$(minikube dashboard --url 2>/dev/null | tail -1)
DASHBOARD_PORT=$(echo $DASHBOARD_URL | grep -oP ':\K[0-9]+')

echo "Dashboard is running at: $DASHBOARD_URL"
echo ""

echo "============================================"
echo "Starting ngrok tunnels..."
echo "============================================"
echo ""
echo "Open two separate terminal windows and run:"
echo ""
echo "Terminal 1 (WebApp tunnel):"
echo "  ngrok http $WEBAPP_URL"
echo ""
echo "Terminal 2 (Dashboard tunnel):"
echo "  ngrok http $DASHBOARD_URL"
echo ""
echo "============================================"
echo "Copy the ngrok URLs and submit them for evaluation"
echo "============================================"
