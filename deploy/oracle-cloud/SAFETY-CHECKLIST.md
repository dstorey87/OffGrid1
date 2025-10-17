# Oracle Cloud Always Free - Safety Checklist

**CRITICAL: Follow this checklist to ensure you NEVER get charged**

## ✅ Pre-Deployment Checklist

### 1. Always Free Tier Limits - DO NOT EXCEED
- ✅ **Compute**: 2 AMD VMs (1/8 OCPU, 1GB RAM each) OR 4 ARM VMs (24GB RAM total)
- ✅ **Block Storage**: 200GB total (including boot volumes)
- ✅ **Object Storage**: 20GB total (Standard + Infrequent + Archive combined)
- ✅ **Load Balancer**: 1 instance at 10 Mbps
- ✅ **Outbound Data Transfer**: 10TB per month
- ✅ **Databases**: 2 Autonomous Databases (20GB storage each)

### 2. Account Configuration - MANDATORY STEPS

#### A. Set Account Budget Alerts
```
1. Go to: Account Management → Budgets
2. Click "Create Budget"
3. Set budget: $0.01 (one cent)
4. Set alert at: 50%, 75%, 90%, 100%
5. Add your email: darrenstorey87@gmail.com
6. Enable: "Alert on Forecast"
```

#### B. Verify Free Tier Status
```
1. Go to: Governance → Tenancy Details
2. Check: "Account Type" shows "Free Tier"
3. Verify: "$300 credit" is NOT being consumed (we're using Always Free only)
```

#### C. Disable Pay-As-You-Go Resources
```
1. Go to: Governance → Cost Management → Cost Tracking
2. Review all services
3. Confirm: ZERO billable resources
```

## 🚫 NEVER Create These Resources (They Cost Money)

### Compute - AVOID:
- ❌ Any VM shape except: `VM.Standard.E2.1.Micro` (AMD Always Free)
- ❌ Any VM shape except: `VM.Standard.A1.Flex` (ARM Always Free)
- ❌ GPU instances
- ❌ Bare metal servers
- ❌ More than 2 AMD VMs OR more than 4 ARM VMs total

### Storage - AVOID:
- ❌ Block volumes over 200GB total
- ❌ Object storage over 20GB total
- ❌ Archive storage over 20GB total
- ❌ Performance storage (use "Balanced" only)

### Database - AVOID:
- ❌ More than 2 Autonomous Databases
- ❌ Databases over 20GB each
- ❌ Exadata infrastructure
- ❌ MySQL HeatWave paid tiers
- ❌ NoSQL storage over 25GB per table

### Networking - AVOID:
- ❌ FastConnect
- ❌ Load balancers over 10 Mbps
- ❌ More than 1 load balancer
- ❌ Site-to-Site VPN over 50 connections
- ❌ Data transfer over 10TB/month

### Other Services - AVOID:
- ❌ AI services (Vision, Speech, Language, etc.)
- ❌ Analytics Cloud
- ❌ Integration services
- ❌ Blockchain Platform
- ❌ Any service marked "Trial" after 30 days

## ✅ Safe Always Free Resources for WordPress

### 1. Compute Instance (Choose ONE option)

**Option A: AMD VM (Recommended for simplicity)**
```yaml
Shape: VM.Standard.E2.1.Micro
OCPU: 1/8
RAM: 1GB
Instances: 1 (we only need one for WordPress)
Cost: $0 forever
```

**Option B: ARM VM (Better performance, more complex)**
```yaml
Shape: VM.Standard.A1.Flex
OCPU: 1-4 (allocate 2 OCPUs)
RAM: 1-24GB (allocate 12GB)
Instances: 1
Cost: $0 forever (within 3000 OCPU hours, 18000 GB hours/month)
```

### 2. Block Storage
```yaml
Boot Volume: 47GB (for OS)
WordPress Volume: 50GB (for WordPress files)
Database Volume: 50GB (for MySQL data)
Backups: 5 volume backups
Total: 147GB (well under 200GB limit)
Cost: $0 forever
```

### 3. Networking
```yaml
VCN: 1 Virtual Cloud Network
Subnet: 1 public subnet
Public IP: 1 reserved public IP (Always Free)
Firewall: Port 80, 443 open
Cost: $0 forever
```

## 🛡️ WordPress Deployment - Always Free Configuration

### Modified docker-compose.prod.yml
Use the version I created in `deploy/oracle-cloud/docker-compose.prod.yml` - it's already configured for minimal resource usage.

### VM Provisioning Steps (Always Free Only)

1. **Login to Oracle Cloud Console**
   - URL: https://cloud.oracle.com

2. **Create Compute Instance**
   ```
   Navigation: Compute → Instances → Create Instance
   
   Name: offgrid-wordpress-prod
   
   Image: Ubuntu 22.04 (Always Free eligible)
   
   Shape: 
   - Click "Change Shape"
   - Select "Specialty and previous generation"
   - Choose: VM.Standard.E2.1.Micro (Always Free)
   - OR choose: VM.Standard.A1.Flex (Always Free, allocate 2 OCPU, 12GB RAM)
   
   Networking:
   - Create new VCN: offgrid-vcn
   - Create new subnet: offgrid-public-subnet
   - Assign public IPv4 address: YES
   
   Boot Volume:
   - Size: 47GB (default for Always Free)
   
   SSH Keys:
   - Generate SSH key pair → Download both keys
   ```

3. **Verify Always Free Status**
   ```
   BEFORE clicking "Create", verify:
   ✅ Shape shows "Always Free-eligible" badge
   ✅ Estimated cost: $0.00/month
   ✅ No warnings about charges
   ```

## 🚨 Emergency Stop Procedures

### If You See ANY Charges:

1. **Immediate Actions**
   ```
   1. Go to: Governance → Cost Management
   2. Click: "Cost Analysis"
   3. Identify: Any non-zero charges
   4. Delete: That resource IMMEDIATELY
   ```

2. **Delete All Billable Resources**
   ```
   1. Go to: Compute → Instances
   2. For each non-Always-Free instance:
      - Click three dots (⋮)
      - Select "Terminate"
      - Confirm deletion
   ```

3. **Contact Oracle Support**
   ```
   1. Go to: Help → Support
   2. Create ticket: "Unexpected charges on Always Free account"
   3. Reference: Free Tier terms (no charges without upgrade)
   ```

## 📊 Monthly Monitoring Routine

### Every Week, Check:
```
1. Governance → Cost Management → Cost Analysis
   - Verify: $0.00 total
   
2. Compute → Instances
   - Verify: All instances show "Always Free" badge
   
3. Block Storage → Block Volumes
   - Verify: Total < 200GB
   
4. Networking → Load Balancers
   - Verify: ≤ 1 load balancer at 10 Mbps
```

## ✅ Post-Deployment Verification

After running the setup script, verify:

```bash
# SSH into your VM
ssh -i <your-private-key> ubuntu@<your-public-ip>

# Check Docker containers are running
docker ps

# Should see:
# - wordpress container
# - mysql container

# Check disk usage (must be under 200GB total)
df -h

# Check memory usage
free -h

# Verify WordPress is accessible
curl http://localhost
```

## 🎯 Final Safety Summary

### ALWAYS:
- ✅ Use VM.Standard.E2.1.Micro (AMD) or VM.Standard.A1.Flex (ARM)
- ✅ Keep total block storage under 200GB
- ✅ Monitor costs weekly
- ✅ Verify "Always Free" badge on all resources
- ✅ Set budget alerts at $0.01

### NEVER:
- ❌ Create more than 1 WordPress VM (you only need one)
- ❌ Upgrade shapes to paid tiers
- ❌ Enable AI, Analytics, or Trial services after 30 days
- ❌ Exceed data transfer limits (10TB/month)
- ❌ Create resources without "Always Free" badge

## 📞 Support Contacts

**Oracle Cloud Support (Free Tier)**
- Community Forums: https://cloudcustomerconnect.oracle.com/
- Documentation: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm
- Email: Check your account dashboard for support options

**Emergency Contact (if charged)**
- Immediately open support ticket through console
- Reference: Oracle Cloud Free Tier Terms of Service
- Dispute any charges related to Always Free resources

---

**Remember: If a resource doesn't show "Always Free" or "Always Free-eligible", DON'T CREATE IT!**
