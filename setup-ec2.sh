#!/bin/bash

# ============================================
# EC2 Setup Script for Minikube Deployment
# Student Management System
# ============================================

set -e

echo "============================================"
echo "Step 1: Updating System Packages"
echo "============================================"
sudo apt-get update -y
sudo apt-get upgrade -y

echo "============================================"
echo "Step 2: Installing Docker"
echo "============================================"
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Add current user to docker group
sudo usermod -aG docker $USER

echo "============================================"
echo "Step 3: Installing kubectl"
echo "============================================"
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
rm kubectl

echo "============================================"
echo "Step 4: Installing Minikube"
echo "============================================"
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
rm minikube-linux-amd64

echo "============================================"
echo "Step 5: Installing conntrack (required for minikube)"
echo "============================================"
sudo apt-get install -y conntrack

echo "============================================"
echo "Step 6: Installing ngrok"
echo "============================================"
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt-get update -y
sudo apt-get install -y ngrok

echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "IMPORTANT: Log out and log back in for docker group changes to take effect."
echo "Or run: newgrp docker"
echo ""
echo "Then run: ./deploy.sh to deploy the application"
