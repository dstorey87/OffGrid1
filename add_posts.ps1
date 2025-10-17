# PowerShell script to add sample posts to WordPress

# Post 1: Sustainable Living
$post1 = @{
    title = "Sustainable Living Made Simple"
    content = @"
<p>Sustainable living doesn't have to be overwhelming. Start with small changes that reduce your environmental footprint while saving money and improving your quality of life.</p>

<p><strong>Energy Conservation:</strong></p>
<ul>
<li>Switch to LED lighting</li>
<li>Use programmable thermostats</li>
<li>Unplug devices when not in use</li>
<li>Invest in energy-efficient appliances</li>
</ul>

<p><strong>Water Conservation:</strong></p>
<p>Simple changes like fixing leaks, installing low-flow fixtures, and collecting rainwater can significantly reduce your water usage and utility bills.</p>

<p><strong>Waste Reduction:</strong></p>
<p>Practice the 3 R's: Reduce, Reuse, Recycle. Compost organic waste, buy items with minimal packaging, and repurpose containers whenever possible.</p>

<p><strong>Growing Your Own Food:</strong></p>
<p>Even a small garden can provide fresh vegetables and herbs. Container gardening works well for apartments and small spaces.</p>
"@
    excerpt = "Simple steps to start living more sustainably while saving money and reducing your environmental impact."
    status = "publish"
    categories = @(1)
} | ConvertTo-Json -Depth 10

# Post 2: Off-Grid Cabin Design
$post2 = @{
    title = "Designing Your Off-Grid Cabin"
    content = @"
<p>Building an off-grid cabin requires careful planning to create a sustainable, comfortable living space that minimizes environmental impact while maximizing self-sufficiency.</p>

<p><strong>Location and Orientation:</strong></p>
<ul>
<li>Choose a site with good solar exposure</li>
<li>Consider wind patterns for natural cooling</li>
<li>Ensure access to water sources</li>
<li>Plan for waste management</li>
<li>Check building codes and permits</li>
</ul>

<p><strong>Energy-Efficient Design:</strong></p>
<p>Passive solar design can significantly reduce your energy needs. Position large windows facing south, use thermal mass for heat storage, and include proper insulation to maintain comfortable temperatures year-round.</p>

<p><strong>Building Materials:</strong></p>
<p>Choose locally sourced, sustainable materials when possible. Consider options like reclaimed lumber, natural stone, and energy-efficient windows. These choices reduce environmental impact and often provide better long-term performance.</p>
"@
    excerpt = "Design and build the perfect off-grid cabin with sustainable materials and energy-efficient principles."
    status = "publish"
    categories = @(1)
} | ConvertTo-Json -Depth 10

# Post 3: Energy Storage
$post3 = @{
    title = "Battery Storage for Renewable Energy Systems"
    content = @"
<p>Effective energy storage is crucial for any off-grid renewable energy system. Modern battery technology has made it more affordable and practical to store solar and wind energy for use when the sun isn't shining or the wind isn't blowing.</p>

<p><strong>Battery Types:</strong></p>
<ul>
<li>Lithium Iron Phosphate (LiFePO4) - Long lifespan, safe, efficient</li>
<li>Lead Acid - Lower upfront cost, proven technology</li>
<li>Saltwater - Environmentally friendly, no toxic materials</li>
</ul>

<p><strong>Sizing Your System:</strong></p>
<p>Calculate your daily energy consumption and multiply by the number of days of backup power you want. Consider seasonal variations in energy production and consumption.</p>

<p><strong>Safety and Maintenance:</strong></p>
<p>Proper ventilation, temperature monitoring, and regular maintenance are essential for battery safety and longevity. Install appropriate fusing and disconnects for safety.</p>
"@
    excerpt = "Learn about battery storage options for your renewable energy system and how to size them properly."
    status = "publish"
    categories = @(1)
} | ConvertTo-Json -Depth 10

# Send the posts
Write-Host "Adding sustainable living post..."
Invoke-RestMethod -Uri "http://localhost:8080/wp-json/wp/v2/posts" -Method Post -Body $post1 -ContentType "application/json"

Write-Host "Adding off-grid cabin post..."
Invoke-RestMethod -Uri "http://localhost:8080/wp-json/wp/v2/posts" -Method Post -Body $post2 -ContentType "application/json"

Write-Host "Adding battery storage post..."
Invoke-RestMethod -Uri "http://localhost:8080/wp-json/wp/v2/posts" -Method Post -Body $post3 -ContentType "application/json"

Write-Host "All posts added successfully!"