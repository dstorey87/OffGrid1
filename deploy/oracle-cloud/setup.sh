#!/bin/bash

###############################################################################
# Oracle Cloud WordPress Setup Script
# Purpose: Automated setup for "Our Off Grid Journey" WordPress site
###############################################################################

set -e  # Exit on error

echo "🚀 Starting Oracle Cloud WordPress Setup for Our Off Grid Journey..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Update system
echo -e "${GREEN}📦 Updating system packages...${NC}"
sudo apt-get update -y
sudo apt-get upgrade -y

# Install Docker
echo -e "${GREEN}🐳 Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
else
    echo "Docker already installed"
fi

# Install Docker Compose
echo -e "${GREEN}🔧 Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose already installed"
fi

# Install Git
echo -e "${GREEN}📥 Installing Git...${NC}"
sudo apt-get install -y git

# Configure firewall
echo -e "${GREEN}🔥 Configuring firewall...${NC}"
sudo iptables -I INPUT 1 -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 1 -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save || echo "Firewall rules set (netfilter-persistent not available)"

# Create deployment directory
echo -e "${GREEN}📁 Creating deployment directory...${NC}"
mkdir -p ~/offgrid-deployment
cd ~/offgrid-deployment

# Clone repository
echo -e "${GREEN}📥 Cloning repository...${NC}"
if [ -d "OffGrid1" ]; then
    echo "Repository already exists, pulling latest changes..."
    cd OffGrid1
    git pull origin main
else
    git clone https://github.com/dstorey87/OffGrid1.git
    cd OffGrid1
fi

# Set up environment file
echo -e "${GREEN}⚙️  Setting up environment variables...${NC}"
cd deploy/oracle-cloud

if [ ! -f ".env" ]; then
    cat > .env << EOF
# Database Configuration
DB_ROOT_PASSWORD=$(openssl rand -base64 32)
DB_NAME=wordpress
DB_USER=wpuser
DB_PASSWORD=$(openssl rand -base64 32)

# Site Configuration
SITE_URL=http://$(curl -s ifconfig.me)

# WordPress Admin (change these!)
WP_ADMIN_USER=admin
WP_ADMIN_EMAIL=darrenstorey87@gmail.com
EOF
    echo -e "${YELLOW}⚠️  Environment file created with random passwords${NC}"
    echo -e "${YELLOW}⚠️  Please edit .env to set your preferred admin credentials${NC}"
else
    echo ".env file already exists"
fi

# Start services
echo -e "${GREEN}🚀 Starting WordPress services...${NC}"
docker-compose -f docker-compose.prod.yml up -d

# Wait for WordPress to be ready
echo -e "${GREEN}⏳ Waiting for WordPress to start...${NC}"
sleep 30

# Get the public IP
PUBLIC_IP=$(curl -s ifconfig.me)

echo ""
echo -e "${GREEN}✅ ============================================${NC}"
echo -e "${GREEN}✅ WordPress Setup Complete!${NC}"
echo -e "${GREEN}✅ ============================================${NC}"
echo ""
echo -e "🌐 Your site is available at: ${GREEN}http://${PUBLIC_IP}${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo -e "   1. Visit http://${PUBLIC_IP}/wp-admin"
echo -e "   2. Complete WordPress setup wizard"
echo -e "   3. Point your domain 'ouroffgridjourney.com' to: ${GREEN}${PUBLIC_IP}${NC}"
echo -e "   4. Install SSL certificate (Let's Encrypt)"
echo ""
echo -e "${YELLOW}🔐 Important Files:${NC}"
echo -e "   - Environment: ~/offgrid-deployment/OffGrid1/deploy/oracle-cloud/.env"
echo -e "   - Logs: docker-compose logs -f"
echo -e "   - Restart: docker-compose restart"
echo ""
echo -e "${GREEN}🎉 Your Off Grid Journey starts here!${NC}"
echo ""
