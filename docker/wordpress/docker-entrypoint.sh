#!/bin/bash
set -e

echo "Starting WordPress setup..."

# Function from official WordPress docker-entrypoint.sh to set up WordPress
cd /usr/src/wordpress
if [ ! -e /var/www/html/index.php ] && [ ! -e /var/www/html/wp-includes/version.php ]; then
    echo "WordPress not found in /var/www/html - copying now..."
    tar cf - --one-file-system -C /usr/src/wordpress . | tar xf - -C /var/www/html
    echo "Complete! WordPress has been successfully copied to /var/www/html"
fi

cd /var/www/html

# Configure WordPress if wp-config.php doesn't exist
if [ ! -e wp-config.php ]; then
    echo "Creating wp-config.php..."
    
    # Generate wp-config.php
    cat > wp-config.php <<'EOF'
<?php
define( 'DB_NAME', getenv_docker('WORDPRESS_DB_NAME', 'wordpress') );
define( 'DB_USER', getenv_docker('WORDPRESS_DB_USER', 'example username') );
define( 'DB_PASSWORD', getenv_docker('WORDPRESS_DB_PASSWORD', 'example password') );
define( 'DB_HOST', getenv_docker('WORDPRESS_DB_HOST', 'mysql') );
define( 'DB_CHARSET', getenv_docker('WORDPRESS_DB_CHARSET', 'utf8') );
define( 'DB_COLLATE', getenv_docker('WORDPRESS_DB_COLLATE', '') );
function getenv_docker($env, $default) {
    return getenv($env) ?: $default;
}
EOF

    # Add salts
    curl -f https://api.wordpress.org/secret-key/1.1/salt/ >> wp-config.php || echo "Could not fetch salts"
    
    # Add table prefix and other config
    cat >> wp-config.php <<'EOF'
$table_prefix = getenv_docker('WORDPRESS_TABLE_PREFIX', 'wp_');
define( 'WP_DEBUG', !!getenv_docker('WORDPRESS_DEBUG', '') );
if ( WP_DEBUG ) {
    define( 'WP_DEBUG_LOG', true );
    define( 'WP_DEBUG_DISPLAY', false );
}
if ( ! defined( 'ABSPATH' ) ) {
    define( 'ABSPATH', __DIR__ . '/' );
}
require_once ABSPATH . 'wp-settings.php';
EOF

    echo "wp-config.php created!"
fi

# Set proper permissions
chown -R www-data:www-data /var/www/html

echo "WordPress files ready!"

# Wait for database to be ready
echo "Waiting for database..."
until mysqladmin ping -h"${WORDPRESS_DB_HOST%%:*}" -u"${WORDPRESS_DB_USER}" -p"${WORDPRESS_DB_PASSWORD}" --silent 2>/dev/null; do
    echo "Database not ready, waiting..."
    sleep 2
done
echo "Database is ready!"

# Check if WordPress is installed
if ! wp core is-installed --allow-root 2>/dev/null; then
    echo "Installing WordPress..."
    
    # Install WordPress (without multisite first)
    wp core install \
        --url="http://localhost:8080" \
        --title="OffGrid Platform" \
        --admin_user="${WP_ADMIN_USER:-admin}" \
        --admin_password="${WP_ADMIN_PASSWORD:-admin123}" \
        --admin_email="admin@example.com" \
        --skip-email \
        --allow-root
    
    echo "WordPress installed successfully!"
    
    # Now enable multisite
    echo "Converting to multisite..."
    wp core multisite-convert \
        --title="OffGrid Network" \
        --base="/" \
        --allow-root
    
    echo "Multisite enabled successfully!"
    
    echo "WordPress multisite setup complete!"
else
    echo "WordPress is already installed."
fi

# Start Apache in foreground
echo "Starting Apache..."
exec apache2-foreground
