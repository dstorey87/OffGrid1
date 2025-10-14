<?php
/**
 * Main PT Hub class
 */

class PT_Hub {
    
    /**
     * Plugin version
     */
    private $version = PT_HUB_VERSION;
    
    /**
     * Directory instance
     */
    private $directory;
    
    /**
     * Calculator instance
     */
    private $calculator;
    
    /**
     * REST API instance
     */
    private $rest_api;
    
    /**
     * Constructor
     */
    public function __construct() {
        $this->load_dependencies();
    }
    
    /**
     * Load plugin dependencies
     */
    private function load_dependencies() {
        $this->directory = new PT_Hub_Directory();
        $this->calculator = new PT_Hub_Calculator();
        $this->rest_api = new PT_Hub_REST_API();
    }
    
    /**
     * Run the plugin
     */
    public function run() {
        // Add actions and filters
        add_action('init', array($this, 'init'));
        add_action('rest_api_init', array($this->rest_api, 'register_routes'));
        
        // Register custom post types
        add_action('init', array($this->directory, 'register_post_type'));
        
        // Register shortcodes
        add_shortcode('pt_directory', array($this->directory, 'shortcode'));
        add_shortcode('pt_calculator', array($this->calculator, 'shortcode'));
    }
    
    /**
     * Initialize plugin
     */
    public function init() {
        // Load text domain
        load_plugin_textdomain('pt-hub', false, dirname(plugin_basename(__FILE__)) . '/languages');
    }
}
