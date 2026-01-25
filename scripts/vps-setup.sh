#!/bin/bash
# ============================================================================
# VPS Initial Setup Script
# ============================================================================
# Run this ONCE on a fresh VPS to install Docker and required dependencies
# Usage: ssh root@72.60.123.249 'bash -s' < scripts/vps-setup.sh
# ============================================================================

set -e

echo "🔧 Setting up VPS for Qdoge Kennel Club..."

# Update system
echo "📦 Updating system packages..."
apt-get update && apt-get upgrade -y

# Install required packages
echo "📦 Installing dependencies..."
apt-get install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    rsync

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Install Docker Compose plugin
echo "🐳 Installing Docker Compose..."
apt-get install -y docker-compose-plugin

# Verify installation
echo "✅ Verifying installation..."
docker --version
docker compose version

# Create app directory
mkdir -p /opt/qdoge-kennel-club

# Configure firewall (if ufw is installed)
if command -v ufw &> /dev/null; then
    echo "🔥 Configuring firewall..."
    ufw allow 22/tcp   # SSH
    ufw allow 80/tcp   # HTTP
    ufw allow 443/tcp  # HTTPS
    ufw --force enable
fi

echo ""
echo "✅ VPS setup complete!"
echo "📋 Next steps:"
echo "   1. Run ./deploy.sh from your local machine"
echo "   2. Edit /opt/qdoge-kennel-club/.env on the VPS with your credentials"
echo "   3. Access your app at http://72.60.123.249"
