#!/bin/bash
# WordPress Multisite Installation Script

set -e

echo "Waiting for WordPress to be ready..."
sleep 10

echo "Installing WordPress..."
wp core install \
  --url="http://localhost:8080" \
  --title="OffGrid Platform" \
  --admin_user="${WP_ADMIN_USER:-admin}" \
  --admin_password="${WP_ADMIN_PASSWORD:-admin}" \
  --admin_email="${WP_ADMIN_EMAIL:-admin@localhost}" \
  --skip-email \
  --allow-root

echo "Converting to multisite..."
wp core multisite-convert \
  --title="OffGrid Network" \
  --base="/" \
  --allow-root

echo "WordPress multisite installation complete!"
