#!/bin/bash

###############################################################################
# SSL Certificate Installation Script (Let's Encrypt)
# Run this AFTER pointing your domain to Oracle Cloud IP
###############################################################################

set -e

echo "🔐 Installing SSL Certificate for Our Off Grid Journey..."

# Check if domain is provided
if [ -z "$1" ]; then
    echo "❌ Error: Domain name required"
    echo "Usage: ./install-ssl.sh ouroffgridjourney.com"
    exit 1
fi

DOMAIN=$1
EMAIL="darrenstorey87@gmail.com"

echo "📋 Domain: $DOMAIN"
echo "📧 Email: $EMAIL"

# Install Certbot
echo "📦 Installing Certbot..."
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

# Stop WordPress temporarily
echo "⏸️  Stopping WordPress..."
cd ~/offgrid-deployment/OffGrid1/deploy/oracle-cloud
docker-compose -f docker-compose.prod.yml down

# Get certificate
echo "🔐 Obtaining SSL certificate..."
sudo certbot certonly --standalone \
    --preferred-challenges http \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN \
    -d www.$DOMAIN

# Update docker-compose to use SSL
echo "⚙️  Configuring SSL in Docker..."

# Create nginx config directory
mkdir -p nginx/conf.d

cat > nginx/conf.d/ssl.conf << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate /etc/letsencrypt/live/$DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/$DOMAIN/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    location / {
        proxy_pass http://wordpress;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Update docker-compose to include nginx
cat > docker-compose.prod-ssl.yml << EOF
version: "3.8"

services:
  db:
    image: mysql:8.0
    container_name: offgrid-db-prod
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: \${DB_ROOT_PASSWORD}
      MYSQL_DATABASE: \${DB_NAME:-wordpress}
      MYSQL_USER: \${DB_USER:-wpuser}
      MYSQL_PASSWORD: \${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - offgrid-network

  wordpress:
    image: wordpress:latest
    container_name: offgrid-wordpress-prod
    restart: always
    depends_on:
      - db
    environment:
      WORDPRESS_DB_HOST: db:3306
      WORDPRESS_DB_NAME: \${DB_NAME:-wordpress}
      WORDPRESS_DB_USER: \${DB_USER:-wpuser}
      WORDPRESS_DB_PASSWORD: \${DB_PASSWORD}
      WORDPRESS_CONFIG_EXTRA: |
        define('WP_HOME', 'https://$DOMAIN');
        define('WP_SITEURL', 'https://$DOMAIN');
        define('FORCE_SSL_ADMIN', true);
        if (strpos(\$_SERVER['HTTP_X_FORWARDED_PROTO'], 'https') !== false) {
            \$_SERVER['HTTPS'] = 'on';
        }
    volumes:
      - wp_data:/var/www/html
      - ./wordpress-content:/var/www/html/wp-content
    networks:
      - offgrid-network

  nginx:
    image: nginx:alpine
    container_name: offgrid-nginx-prod
    restart: always
    depends_on:
      - wordpress
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - /etc/letsencrypt:/etc/letsencrypt:ro
    networks:
      - offgrid-network

volumes:
  db_data:
  wp_data:

networks:
  offgrid-network:
    driver: bridge
EOF

# Update .env with HTTPS URL
sed -i "s|SITE_URL=.*|SITE_URL=https://$DOMAIN|" .env

# Start services with SSL
echo "🚀 Starting services with SSL..."
docker-compose -f docker-compose.prod-ssl.yml up -d

# Set up auto-renewal
echo "🔄 Setting up certificate auto-renewal..."
(sudo crontab -l 2>/dev/null || true; echo "0 3 * * * certbot renew --quiet --post-hook 'docker-compose -f ~/offgrid-deployment/OffGrid1/deploy/oracle-cloud/docker-compose.prod-ssl.yml restart nginx'") | sudo crontab -

echo ""
echo "✅ ============================================"
echo "✅ SSL Certificate Installed Successfully!"
echo "✅ ============================================"
echo ""
echo "🌐 Your site is now accessible at: https://$DOMAIN"
echo "🔐 Certificate will auto-renew every 90 days"
echo ""
echo "📝 Next Steps:"
echo "   1. Visit https://$DOMAIN/wp-admin"
echo "   2. Update WordPress Site URL in Settings > General"
echo "   3. Test affiliate links and monetization features"
echo ""
