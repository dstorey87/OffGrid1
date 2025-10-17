# Oracle Cloud Budget Alert Setup

**COMPLETE THIS IMMEDIATELY TO PREVENT CHARGES**

## Step-by-Step Budget Configuration

### 1. Access Budget Management

1. Login to Oracle Cloud Console: https://cloud.oracle.com
2. Click the hamburger menu (☰) in top left
3. Navigate to: **Governance & Administration** → **Account Management** → **Budgets**

### 2. Create First Budget Alert

Click **"Create Budget"** and configure:

```yaml
Budget Name: WordPress-Always-Free-Protection
Description: Alert if ANY charges appear on Always Free account

Target:
  Compartment: root (entire account)
  
Budget Amount:
  Type: Monthly
  Amount: $0.01 USD
  
Alert Rules:
  1. Alert Name: "50% Budget Alert"
     Threshold: 50% of budget ($0.005)
     Email: darrenstorey87@gmail.com
     
  2. Alert Name: "75% Budget Alert"  
     Threshold: 75% of budget ($0.0075)
     Email: darrenstorey87@gmail.com
     
  3. Alert Name: "90% Budget Alert"
     Threshold: 90% of budget ($0.009)
     Email: darrenstorey87@gmail.com
     
  4. Alert Name: "100% Budget Alert"
     Threshold: 100% of budget ($0.01)
     Email: darrenstorey87@gmail.com
     
  5. Alert Name: "Forecast Alert"
     Type: Forecast
     Threshold: 100%
     Email: darrenstorey87@gmail.com
```

### 3. Create Second Budget (Backup Alert)

Create another budget for extra safety:

```yaml
Budget Name: Daily-Cost-Monitor
Description: Daily monitoring for unexpected charges

Target:
  Compartment: root
  
Budget Amount:
  Type: Daily
  Amount: $0.001 USD (one tenth of a cent per day)
  
Alert Rules:
  1. Alert Name: "Daily Charge Detected"
     Threshold: 100%
     Email: darrenstorey87@gmail.com
```

## Email Alert Examples

You'll receive emails like this if ANY charge appears:

```
Subject: Oracle Cloud Budget Alert: WordPress-Always-Free-Protection

Your budget "WordPress-Always-Free-Protection" has exceeded 50% of the allocated amount.

Current spending: $0.005
Budget amount: $0.01
Percentage: 50%

Review your costs: [Link to Cost Analysis]
```

## What To Do If You Receive Alert

### IMMEDIATE ACTIONS:

1. **Check Cost Analysis**
   ```
   Governance → Cost Management → Cost Analysis
   View: Last 7 days
   Group by: Service
   ```

2. **Identify Billable Resource**
   - Look for any service showing non-zero cost
   - Note the resource name and type

3. **Terminate Billable Resource**
   ```
   Navigate to that service
   Find the resource
   Click Actions → Terminate
   Confirm deletion
   ```

4. **Verify Termination**
   ```
   Wait 1 hour
   Re-check Cost Analysis
   Confirm: $0.00 total
   ```

5. **Contact Oracle Support**
   ```
   If charge persists:
   - Open support ticket
   - Title: "Unexpected charge on Always Free account"
   - Attach: Screenshots of the resource and cost
   - Request: Immediate removal of charge
   ```

## Monthly Cost Review Checklist

### Every Month (1st of month), verify:

- [ ] Total monthly cost: $0.00
- [ ] No billable resources listed
- [ ] All VMs show "Always Free" badge
- [ ] Block storage total: < 200GB
- [ ] Outbound transfer: < 10TB
- [ ] Budget alerts still active
- [ ] Email notifications working

## Additional Protection Settings

### 1. Limit Resource Creation

```
Governance → Quotas
Review limits for:
- Compute Instances: Max 1 or 2 (Always Free limit)
- Block Volumes: Max 200GB total
- Load Balancers: Max 1
```

### 2. Enable Cost Tracking Tags

```
Governance → Tag Namespaces → Create Tag Namespace

Namespace: CostTracking
Tags:
  - Always-Free: Yes/No
  - Environment: Production
  - Project: WordPress
  
Apply tag "Always-Free: Yes" to all resources
Filter cost reports by tag to ensure only Always Free resources exist
```

### 3. Set Spending Limits (if available)

```
Governance → Account Management → Payment Methods

If "Spending Limit" option exists:
- Enable spending limit
- Set to: $0.00
- This prevents ANY charges to your card
```

## Automation Script (Optional)

Create a weekly cost check script:

```bash
#!/bin/bash
# Save as: check-oracle-costs.sh

# Install OCI CLI first: https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/cliinstall.htm

# Check current month costs
COST=$(oci usage-api usage-summary list \
  --tenant-id <your-tenancy-ocid> \
  --time-usage-started "$(date -u -d '1 month ago' '+%Y-%m-%dT%H:%M:%SZ')" \
  --time-usage-ended "$(date -u '+%Y-%m-%dT%H:%M:%SZ')" \
  --granularity DAILY \
  --query 'data[*]."computed-amount" | sum(@)')

if (( $(echo "$COST > 0" | bc -l) )); then
    echo "WARNING: Cost detected: $COST USD"
    echo "Review immediately: https://cloud.oracle.com/usage"
    # Send email alert
    echo "Cost alert: $COST" | mail -s "Oracle Cloud Cost Alert" darrenstorey87@gmail.com
else
    echo "All clear: $0.00 costs"
fi
```

## Visual Verification

### Always Free Badge Examples

When creating resources, look for these indicators:

✅ **SAFE** - Shows "Always Free" or "Always Free-eligible":
```
┌─────────────────────────────────────┐
│ VM.Standard.E2.1.Micro             │
│ ⭐ Always Free-eligible              │
│ 1/8 OCPU, 1GB RAM                   │
│ Estimated cost: $0.00/month         │
└─────────────────────────────────────┘
```

❌ **DANGER** - No "Always Free" badge:
```
┌─────────────────────────────────────┐
│ VM.Standard2.1                      │
│ 1 OCPU, 15GB RAM                     │
│ Estimated cost: $37.23/month        │
└─────────────────────────────────────┘
```

## Summary

**Critical Setup (Do NOW):**
1. ✅ Create budget with $0.01 monthly limit
2. ✅ Add 5 alert rules (50%, 75%, 90%, 100%, Forecast)
3. ✅ Verify email notifications work
4. ✅ Review costs weekly

**If you follow this guide, you will NEVER be charged.**

The Always Free tier is genuinely free forever, but you must:
- Only use Always Free shapes
- Stay within Always Free limits
- Monitor costs weekly
- Delete any accidental paid resources immediately

---

**Next Steps:**
1. Complete budget setup above
2. Return to `SAFETY-CHECKLIST.md` for VM deployment
3. Only create resources with "Always Free" badge
