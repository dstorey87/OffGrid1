<?php
/**
 * Plugin Name: PT Hub
 * Plugin URI: https://offgrid.example.com
 * Description: Directory and calculator functionality for WordPress multisite
 * Version: 0.1.0
 * Author: OffGrid Team
 * License: GPL v2 or later
 * Network: true
 * Text Domain: pt-hub
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('PT_HUB_VERSION', '0.1.0');
define('PT_HUB_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('PT_HUB_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include required files
require_once PT_HUB_PLUGIN_DIR . 'includes/class-pt-hub.php';
require_once PT_HUB_PLUGIN_DIR . 'includes/class-directory.php';
require_once PT_HUB_PLUGIN_DIR . 'includes/class-calculator.php';
require_once PT_HUB_PLUGIN_DIR . 'includes/class-rest-api.php';

/**
 * Initialize the plugin
 */
function pt_hub_init() {
    $plugin = new PT_Hub();
    $plugin->run();
}
add_action('plugins_loaded', 'pt_hub_init');

/**
 * Activation hook
 */
function pt_hub_activate() {
    // Create custom tables
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    
    // Directory table
    $table_directory = $wpdb->prefix . 'pt_directory';
    $sql_directory = "CREATE TABLE $table_directory (
        id bigint(20) NOT NULL AUTO_INCREMENT,
        site_id bigint(20) NOT NULL,
        title varchar(255) NOT NULL,
        description text,
        category varchar(100),
        location varchar(255),
        url varchar(255),
        email varchar(100),
        phone varchar(50),
        featured tinyint(1) DEFAULT 0,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY site_id (site_id),
        KEY category (category)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql_directory);
    
    // Set default options
    add_option('pt_hub_version', PT_HUB_VERSION);
}
register_activation_hook(__FILE__, 'pt_hub_activate');

/**
 * Deactivation hook
 */
function pt_hub_deactivate() {
    // Cleanup if needed
}
register_deactivation_hook(__FILE__, 'pt_hub_deactivate');
