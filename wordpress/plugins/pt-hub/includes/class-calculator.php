<?php
/**
 * Calculator functionality
 */

class PT_Hub_Calculator {
    
    /**
     * Shortcode for calculator
     */
    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'type' => 'basic',
        ), $atts);
        
        ob_start();
        
        switch ($atts['type']) {
            case 'solar':
                $this->render_solar_calculator();
                break;
            case 'savings':
                $this->render_savings_calculator();
                break;
            default:
                $this->render_basic_calculator();
                break;
        }
        
        return ob_get_clean();
    }
    
    /**
     * Render basic calculator
     */
    private function render_basic_calculator() {
        ?>
        <div class="pt-calculator pt-calculator-basic">
            <h3><?php _e('Basic Calculator', 'pt-hub'); ?></h3>
            <form class="pt-calculator-form">
                <div class="pt-form-group">
                    <label><?php _e('Input Value:', 'pt-hub'); ?></label>
                    <input type="number" name="value" class="pt-input" step="0.01" required>
                </div>
                <button type="submit" class="pt-button"><?php _e('Calculate', 'pt-hub'); ?></button>
            </form>
            <div class="pt-calculator-result"></div>
        </div>
        <?php
    }
    
    /**
     * Render solar calculator
     */
    private function render_solar_calculator() {
        ?>
        <div class="pt-calculator pt-calculator-solar">
            <h3><?php _e('Solar Panel Calculator', 'pt-hub'); ?></h3>
            <form class="pt-calculator-form">
                <div class="pt-form-group">
                    <label><?php _e('Monthly Energy Usage (kWh):', 'pt-hub'); ?></label>
                    <input type="number" name="energy_usage" class="pt-input" required>
                </div>
                <div class="pt-form-group">
                    <label><?php _e('Average Sunlight Hours per Day:', 'pt-hub'); ?></label>
                    <input type="number" name="sunlight_hours" class="pt-input" step="0.1" value="5" required>
                </div>
                <div class="pt-form-group">
                    <label><?php _e('Panel Efficiency (%):', 'pt-hub'); ?></label>
                    <input type="number" name="efficiency" class="pt-input" step="0.1" value="20" required>
                </div>
                <button type="submit" class="pt-button"><?php _e('Calculate', 'pt-hub'); ?></button>
            </form>
            <div class="pt-calculator-result"></div>
        </div>
        <script>
        (function() {
            document.querySelector('.pt-calculator-solar form').addEventListener('submit', function(e) {
                e.preventDefault();
                const usage = parseFloat(e.target.energy_usage.value);
                const hours = parseFloat(e.target.sunlight_hours.value);
                const efficiency = parseFloat(e.target.efficiency.value) / 100;
                
                const dailyUsage = usage / 30;
                const panelOutput = hours * efficiency * 0.3; // 300W panel
                const panelsNeeded = Math.ceil(dailyUsage / panelOutput);
                
                const resultDiv = document.querySelector('.pt-calculator-solar .pt-calculator-result');
                resultDiv.innerHTML = '<h4>Results:</h4>' +
                    '<p>Panels Needed: ' + panelsNeeded + '</p>' +
                    '<p>Estimated System Size: ' + (panelsNeeded * 0.3).toFixed(2) + ' kW</p>';
            });
        })();
        </script>
        <?php
    }
    
    /**
     * Render savings calculator
     */
    private function render_savings_calculator() {
        ?>
        <div class="pt-calculator pt-calculator-savings">
            <h3><?php _e('Savings Calculator', 'pt-hub'); ?></h3>
            <form class="pt-calculator-form">
                <div class="pt-form-group">
                    <label><?php _e('Initial Investment ($):', 'pt-hub'); ?></label>
                    <input type="number" name="investment" class="pt-input" required>
                </div>
                <div class="pt-form-group">
                    <label><?php _e('Monthly Savings ($):', 'pt-hub'); ?></label>
                    <input type="number" name="monthly_savings" class="pt-input" required>
                </div>
                <button type="submit" class="pt-button"><?php _e('Calculate', 'pt-hub'); ?></button>
            </form>
            <div class="pt-calculator-result"></div>
        </div>
        <script>
        (function() {
            document.querySelector('.pt-calculator-savings form').addEventListener('submit', function(e) {
                e.preventDefault();
                const investment = parseFloat(e.target.investment.value);
                const savings = parseFloat(e.target.monthly_savings.value);
                
                const paybackMonths = Math.ceil(investment / savings);
                const paybackYears = (paybackMonths / 12).toFixed(1);
                
                const resultDiv = document.querySelector('.pt-calculator-savings .pt-calculator-result');
                resultDiv.innerHTML = '<h4>Results:</h4>' +
                    '<p>Payback Period: ' + paybackYears + ' years (' + paybackMonths + ' months)</p>' +
                    '<p>Annual Savings: $' + (savings * 12).toFixed(2) + '</p>';
            });
        })();
        </script>
        <?php
    }
}
