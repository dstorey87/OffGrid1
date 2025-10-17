# Oracle Cloud Deployment Guide - Our Off Grid Journey

## 🎯 Overview
This guide will help you deploy the WordPress site to Oracle Cloud's **Always Free** tier.

## 📋 Prerequisites
- Oracle Cloud account (we'll create this together)
- Domain name `ouroffgridjourney.com` (purchase after setup)
- Credit/debit card for Oracle verification (no charges on Always Free tier)

## 🚀 Quick Deploy Steps

### Step 1: Create Oracle Cloud Account
I'll use Playwright to:
1. Navigate to https://www.oracle.com/cloud/free/
2. Sign up with: `darrenstorey87@gmail.com`
3. Complete verification (you'll need to add card details manually)

### Step 2: Provision Free VM
Once account is ready:
1. Create Compute Instance (Always Free - AMD or ARM)
   - Shape: VM.Standard.E2.1.Micro (AMD) or VM.Standard.A1.Flex (ARM)
   - Image: Ubuntu 22.04
   - Storage: 50GB (Always Free)
2. Configure security rules (ports 80, 443)
3. Get public IP address

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

## 💰 Cost Breakdown
- **Oracle Cloud Always Free**: $0/month forever
- **Domain (ouroffgridjourney.com)**: ~$10/year
- **SSL Certificate (Let's Encrypt)**: Free
- **Total**: ~$0.83/month

## 🎯 Oracle Cloud Free Tier Limits
- ✅ 2 AMD Compute VMs (1/8 OCPU, 1GB RAM each)
- ✅ 4 ARM Compute VMs (24GB RAM total, 4 OCPUs)
- ✅ 200GB Block Storage
- ✅ 10TB outbound data transfer/month
- ✅ Unlimited inbound data transfer
- ✅ No time limits - free forever!

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
