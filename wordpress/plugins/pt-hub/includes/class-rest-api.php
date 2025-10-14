<?php
/**
 * REST API endpoints
 */

class PT_Hub_REST_API {
    
    /**
     * Register REST API routes
     */
    public function register_routes() {
        // Directory endpoints
        register_rest_route('pt-hub/v1', '/directory', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_directory_items'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('pt-hub/v1', '/directory/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_directory_item'),
            'permission_callback' => '__return_true',
        ));
        
        // Calculator endpoints
        register_rest_route('pt-hub/v1', '/calculate/solar', array(
            'methods' => 'POST',
            'callback' => array($this, 'calculate_solar'),
            'permission_callback' => '__return_true',
        ));
        
        register_rest_route('pt-hub/v1', '/calculate/savings', array(
            'methods' => 'POST',
            'callback' => array($this, 'calculate_savings'),
            'permission_callback' => '__return_true',
        ));
    }
    
    /**
     * Get directory items
     */
    public function get_directory_items($request) {
        $params = $request->get_params();
        
        $args = array(
            'post_type' => 'pt_directory',
            'posts_per_page' => isset($params['per_page']) ? intval($params['per_page']) : 10,
            'paged' => isset($params['page']) ? intval($params['page']) : 1,
        );
        
        if (isset($params['category'])) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'directory_category',
                    'field' => 'slug',
                    'terms' => $params['category'],
                ),
            );
        }
        
        $query = new WP_Query($args);
        $items = array();
        
        foreach ($query->posts as $post) {
            $items[] = $this->prepare_directory_item($post);
        }
        
        return rest_ensure_response(array(
            'items' => $items,
            'total' => $query->found_posts,
            'pages' => $query->max_num_pages,
        ));
    }
    
    /**
     * Get single directory item
     */
    public function get_directory_item($request) {
        $id = $request->get_param('id');
        $post = get_post($id);
        
        if (!$post || $post->post_type !== 'pt_directory') {
            return new WP_Error('not_found', 'Directory item not found', array('status' => 404));
        }
        
        return rest_ensure_response($this->prepare_directory_item($post));
    }
    
    /**
     * Prepare directory item for response
     */
    private function prepare_directory_item($post) {
        return array(
            'id' => $post->ID,
            'title' => $post->post_title,
            'description' => $post->post_content,
            'excerpt' => $post->post_excerpt,
            'location' => get_post_meta($post->ID, '_pt_location', true),
            'email' => get_post_meta($post->ID, '_pt_email', true),
            'phone' => get_post_meta($post->ID, '_pt_phone', true),
            'url' => get_post_meta($post->ID, '_pt_url', true),
            'featured' => get_post_meta($post->ID, '_pt_featured', true),
            'created_at' => $post->post_date,
        );
    }
    
    /**
     * Calculate solar requirements
     */
    public function calculate_solar($request) {
        $params = $request->get_json_params();
        
        $usage = floatval($params['energy_usage']);
        $hours = floatval($params['sunlight_hours']);
        $efficiency = floatval($params['efficiency']) / 100;
        
        $dailyUsage = $usage / 30;
        $panelOutput = $hours * $efficiency * 0.3; // 300W panel
        $panelsNeeded = ceil($dailyUsage / $panelOutput);
        
        return rest_ensure_response(array(
            'panels_needed' => $panelsNeeded,
            'system_size_kw' => round($panelsNeeded * 0.3, 2),
            'daily_production' => round($panelOutput * $panelsNeeded, 2),
        ));
    }
    
    /**
     * Calculate savings
     */
    public function calculate_savings($request) {
        $params = $request->get_json_params();
        
        $investment = floatval($params['investment']);
        $monthlySavings = floatval($params['monthly_savings']);
        
        $paybackMonths = ceil($investment / $monthlySavings);
        
        return rest_ensure_response(array(
            'payback_months' => $paybackMonths,
            'payback_years' => round($paybackMonths / 12, 1),
            'annual_savings' => round($monthlySavings * 12, 2),
        ));
    }
}
