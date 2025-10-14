<?php
/**
 * Directory functionality
 */

class PT_Hub_Directory {
    
    /**
     * Register custom post type for directory items
     */
    public function register_post_type() {
        $args = array(
            'labels' => array(
                'name' => __('Directory Items', 'pt-hub'),
                'singular_name' => __('Directory Item', 'pt-hub'),
            ),
            'public' => true,
            'has_archive' => true,
            'show_in_rest' => true,
            'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
            'menu_icon' => 'dashicons-location',
            'rewrite' => array('slug' => 'directory'),
        );
        
        register_post_type('pt_directory', $args);
        
        // Register taxonomy for categories
        register_taxonomy('directory_category', 'pt_directory', array(
            'labels' => array(
                'name' => __('Categories', 'pt-hub'),
                'singular_name' => __('Category', 'pt-hub'),
            ),
            'hierarchical' => true,
            'show_in_rest' => true,
            'rewrite' => array('slug' => 'directory-category'),
        ));
    }
    
    /**
     * Shortcode for displaying directory
     */
    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'category' => '',
            'limit' => 10,
            'featured' => false,
        ), $atts);
        
        $args = array(
            'post_type' => 'pt_directory',
            'posts_per_page' => intval($atts['limit']),
            'orderby' => 'title',
            'order' => 'ASC',
        );
        
        if (!empty($atts['category'])) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'directory_category',
                    'field' => 'slug',
                    'terms' => $atts['category'],
                ),
            );
        }
        
        if ($atts['featured']) {
            $args['meta_query'] = array(
                array(
                    'key' => '_pt_featured',
                    'value' => '1',
                ),
            );
        }
        
        $query = new WP_Query($args);
        
        ob_start();
        
        if ($query->have_posts()) {
            echo '<div class="pt-directory-list">';
            while ($query->have_posts()) {
                $query->the_post();
                $this->render_directory_item(get_the_ID());
            }
            echo '</div>';
            wp_reset_postdata();
        } else {
            echo '<p>' . __('No directory items found.', 'pt-hub') . '</p>';
        }
        
        return ob_get_clean();
    }
    
    /**
     * Render single directory item
     */
    private function render_directory_item($post_id) {
        $location = get_post_meta($post_id, '_pt_location', true);
        $email = get_post_meta($post_id, '_pt_email', true);
        $phone = get_post_meta($post_id, '_pt_phone', true);
        $url = get_post_meta($post_id, '_pt_url', true);
        
        ?>
        <div class="pt-directory-item">
            <h3><?php echo get_the_title($post_id); ?></h3>
            <div class="pt-directory-content">
                <?php echo get_the_excerpt($post_id); ?>
            </div>
            <div class="pt-directory-meta">
                <?php if ($location): ?>
                    <p><strong><?php _e('Location:', 'pt-hub'); ?></strong> <?php echo esc_html($location); ?></p>
                <?php endif; ?>
                <?php if ($email): ?>
                    <p><strong><?php _e('Email:', 'pt-hub'); ?></strong> <a href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a></p>
                <?php endif; ?>
                <?php if ($phone): ?>
                    <p><strong><?php _e('Phone:', 'pt-hub'); ?></strong> <?php echo esc_html($phone); ?></p>
                <?php endif; ?>
                <?php if ($url): ?>
                    <p><a href="<?php echo esc_url($url); ?>" target="_blank"><?php _e('Visit Website', 'pt-hub'); ?></a></p>
                <?php endif; ?>
            </div>
        </div>
        <?php
    }
}
