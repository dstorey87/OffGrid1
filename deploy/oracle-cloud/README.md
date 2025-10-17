# Oracle Cloud Deployment Guide - Our Off Grid Journey

## ⚠️ CRITICAL: Read This First

**BEFORE deploying, complete these safety steps to prevent ANY charges:**

1. **Read `SAFETY-CHECKLIST.md`** - Understand Always Free limits and what to avoid
2. **Complete `budget-setup.md`** - Set up $0.01 budget alerts (takes 5 minutes)
3. **Verify Always Free shapes** - Only use VM.Standard.E2.1.Micro or VM.Standard.A1.Flex

**If you skip step 2 (budget alerts), you risk accidental charges!**

## 🎯 Overview
This guide will help you deploy the WordPress site to Oracle Cloud's **Always Free** tier - genuinely $0/month forever.

## 📋 Prerequisites
- ✅ Oracle Cloud account created (with card verification completed)
- ✅ **Budget alerts configured** (see `budget-setup.md` - MANDATORY)
- ✅ Domain name `ouroffgridjourney.com` (purchase after setup)
- SSH key pair for accessing the VM

## 🚀 Quick Deploy Steps

### Step 1: Create Oracle Cloud Account
I'll use Playwright to:
1. Navigate to https://www.oracle.com/cloud/free/
2. Sign up with: `darrenstorey87@gmail.com`
3. Complete verification (you'll need to add card details manually)

### Step 2: Provision Always Free VM

**⚠️ BEFORE creating VM:**
1. ✅ Verify budget alerts are active (check email for confirmation)
2. ✅ Confirm you're on Always Free tier (not trial/paid)
3. ✅ Only create resources with "Always Free-eligible" badge

**Create Compute Instance:**
1. Navigate to: **Compute** → **Instances** → **Create Instance**
2. Configure:
   - **Name**: `offgrid-wordpress-prod`
   - **Image**: Ubuntu 22.04
   - **Shape**: Click "Change Shape" → Select **VM.Standard.E2.1.Micro** (AMD)
     - Must show: "⭐ Always Free-eligible" badge
     - Estimated cost: **$0.00/month**
     - 1/8 OCPU, 1GB RAM
   - **Networking**: Create new VCN `offgrid-vcn` (Always Free)
   - **Public IP**: YES (Always Free)
   - **Boot Volume**: 47GB (default, Always Free)
3. **VERIFY BEFORE CREATING:**
   - ✅ Shape shows "Always Free-eligible" badge
   - ✅ Estimated cost: $0.00/month
   - ✅ No charge warnings
4. Download SSH keys when prompted
5. Note the public IP address after creation

### Step 3: Deploy WordPress
SSH into the VM and run:
```bash
# Clone and run setup script
git clone https://github.com/dstorey87/OffGrid1.git
cd OffGrid1/deploy/oracle-cloud
chmod +x setup.sh
./setup.sh
```

The script will:
- ✅ Install Docker & Docker Compose
- ✅ Configure firewall
- ✅ Pull and start WordPress + MySQL containers
- ✅ Generate secure passwords
- ✅ Display your site URL

### Step 4: Configure Domain (After Purchase)
1. Buy `ouroffgridjourney.com` from Porkbun/Namecheap (~$10/year)
2. Add DNS A record pointing to Oracle Cloud IP:
   ```
   Type: A
   Name: @
   Value: [Your Oracle Cloud IP]
   TTL: 3600
   ```
3. Add www subdomain:
   ```
   Type: CNAME
   Name: www
   Value: ouroffgridjourney.com
   TTL: 3600
   ```

### Step 5: Install SSL Certificate
```bash
cd ~/offgrid-deployment/OffGrid1/deploy/oracle-cloud
./install-ssl.sh
```

## 📦 What's Included
- WordPress 6.4+ with MySQL 8.0
- Docker containerized setup
- Automatic backups configuration
- Security hardening
- Performance optimization

## 🔧 Management Commands

### View logs
```bash
cd ~/offgrid-deployment/OffGrid1/deploy/oracle-cloud
docker-compose -f docker-compose.prod.yml logs -f
```

### Restart services
```bash
docker-compose -f docker-compose.prod.yml restart
```

### Stop services
```bash
docker-compose -f docker-compose.prod.yml down
```

### Backup database
```bash
docker exec offgrid-db-prod mysqldump -u wpuser -p wordpress > backup-$(date +%Y%m%d).sql
```

## 💰 Cost Breakdown (Always Free Configuration)

- **Hosting**: $0/month forever (Oracle Cloud Always Free tier)
- **Compute VM**: $0/month (VM.Standard.E2.1.Micro - Always Free)
- **Block Storage**: $0/month (~147GB used, 200GB Always Free limit)
- **Networking**: $0/month (10TB transfer included, public IP free)
- **SSL Certificate**: $0/month (Let's Encrypt)
- **Domain**: ~$10/year (from Porkbun or Namecheap)

**Total**: ~$0.83/month ($10/year for domain only)

### ⚠️ How to Stay Free Forever:
1. ✅ Only use Always Free shapes (VM.Standard.E2.1.Micro or A1.Flex)
2. ✅ Keep total block storage under 200GB
3. ✅ Don't create more than 1 VM for this project
4. ✅ Monitor costs weekly via Oracle Cloud Console (should always be $0.00)
5. ✅ Never upgrade to paid shapes or services
6. ✅ Keep budget alerts active (see `budget-setup.md`)

## 🎯 Oracle Cloud Always Free Tier Limits

### What We're Using (All Free):
- ✅ **Compute**: 1 VM (VM.Standard.E2.1.Micro)
- ✅ **Block Storage**: ~147GB (boot + data volumes)
- ✅ **Networking**: 1 public IP, VCN, subnet, firewall rules
- ✅ **Outbound Transfer**: < 1TB/month (well under 10TB limit)

### Always Free Limits (Do NOT Exceed):
- **Compute**: 2 AMD VMs (1/8 OCPU, 1GB each) OR 4 ARM VMs (24GB RAM, 4 OCPUs total)
- **Block Storage**: 200GB total
- **Object Storage**: 20GB
- **Load Balancer**: 1 instance (10 Mbps)
- **Outbound Data Transfer**: 10TB per month
- **Databases**: 2 Autonomous Databases (20GB each)

### ⚠️ What Costs Money (NEVER Create):
- ❌ Shapes without "Always Free-eligible" badge
- ❌ More than 2 AMD VMs or 4 ARM VMs total
- ❌ Block storage over 200GB total
- ❌ AI services (Vision, Speech, Language, Document Understanding)
- ❌ Analytics Cloud
- ❌ GPU instances
- ❌ Any service marked "Trial" after 30-day trial expires

**This deployment uses ~75% of Always Free compute/storage limits - completely safe!**

## 🔐 Security Features
- Automatic security updates
- Firewall configured (ports 80, 443 only)
- Strong password generation
- Database isolated in Docker network
- WordPress security hardening
- Fail2ban for brute force protection

## 📈 Next Steps After Deployment
1. Complete WordPress setup wizard
2. Install WordPress plugins from your `wordpress/plugins/` folder
3. Import your custom theme
4. Configure affiliate marketing plugins
5. Set up Google Analytics
6. Configure backup schedule
7. Test monetization features

## 🆘 Troubleshooting

### Services won't start
```bash
docker-compose -f docker-compose.prod.yml ps
docker-compose -f docker-compose.prod.yml logs
```

### Can't access site
1. Check Oracle Cloud security list rules
2. Verify firewall: `sudo iptables -L`
3. Check if services are running: `docker ps`

### Database connection errors
```bash
# Check database logs
docker logs offgrid-db-prod

# Restart database
docker-compose -f docker-compose.prod.yml restart db
```

## 📞 Support
Repository: https://github.com/dstorey87/OffGrid1
Issues: https://github.com/dstorey87/OffGrid1/issues

---

**Ready to deploy?** Let's start with the Oracle Cloud account setup!
