#!/bin/bash

# ============================================
# Deployment Script for Minikube
# Student Management System
# ============================================

set -e

echo "============================================"
echo "Step 1: Starting Minikube"
echo "============================================"
minikube start --driver=docker --memory=4096 --cpus=2

echo "============================================"
echo "Step 2: Enabling Metrics Server for HPA"
echo "============================================"
minikube addons enable metrics-server

echo "============================================"
echo "Step 3: Building Docker Image in Minikube"
echo "============================================"
eval $(minikube docker-env)
docker build -t student-management-app:latest .

echo "============================================"
echo "Step 4: Deploying MongoDB"
echo "============================================"
kubectl apply -f k8s/mongodb-pvc.yaml
kubectl apply -f k8s/mongodb-deployment.yaml
kubectl apply -f k8s/mongodb-service.yaml

echo "Waiting for MongoDB to be ready..."
kubectl wait --for=condition=ready pod -l app=mongodb --timeout=120s

echo "============================================"
echo "Step 5: Deploying Web Application"
echo "============================================"
kubectl apply -f k8s/webapp-deployment.yaml
kubectl apply -f k8s/webapp-service.yaml

echo "Waiting for WebApp to be ready..."
kubectl wait --for=condition=ready pod -l app=webapp --timeout=180s

echo "============================================"
echo "Step 6: Applying HorizontalPodAutoscaler"
echo "============================================"
kubectl apply -f k8s/webapp-hpa.yaml

echo "============================================"
echo "Step 7: Verifying Deployment"
echo "============================================"
echo ""
echo "All Pods:"
kubectl get pods
echo ""
echo "All Services:"
kubectl get services
echo ""
echo "HPA Status:"
kubectl get hpa
echo ""
echo "Persistent Volume Claims:"
kubectl get pvc

echo "============================================"
echo "Deployment Complete!"
echo "============================================"
echo ""
echo "To access the application, run: minikube service webapp-service --url"
echo "To access MongoDB, run: minikube service mongodb-service --url"
echo "To open Minikube dashboard, run: minikube dashboard --url"
echo ""
echo "Next Step: Run ./start-tunnels.sh to expose services via ngrok"
