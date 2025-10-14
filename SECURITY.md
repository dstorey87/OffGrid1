# Security Policy

> **Last Updated:** October 14, 2025  
> **Status:** Active Development

---

## 🔒 Security Overview

This document outlines the security practices, configurations, and guidelines for the OffGrid platform. Our security strategy follows industry best practices and assumes a **defense-in-depth** approach.

---

## 🎯 Security Principles

1. **No Secrets in Code** - Never commit credentials, API keys, or passwords to version control
2. **Strong Credentials** - All passwords must be 32+ characters, randomly generated
3. **Least Privilege** - Services have minimal permissions required for operation
4. **Network Isolation** - Internal services not exposed to host network unless required
5. **Encrypted Communication** - TLS/HTTPS in production environments
6. **Regular Updates** - Dependencies and base images kept current
7. **Audit Logging** - All security-relevant events logged and retained

---

## 🚨 Reporting Security Vulnerabilities

If you discover a security vulnerability, please:

1. **DO NOT** open a public GitHub issue
2. Email security concerns to: [your-security-email@example.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

We will respond within **48 hours** and provide a timeline for resolution.

---

## 🔐 Secrets Management

### Current Approach (Development)

**Environment Variables via `.env` file:**

```bash
# ⚠️ Development Only - DO NOT use in production
# Create .env from .env.example
cp .env.example .env

# Generate strong passwords (PowerShell)
-join ((33..126) | Get-Random -Count 32 | % {[char]$_})

# Generate strong passwords (Bash)
openssl rand -base64 32
```

**Required Secrets:**

| Secret               | Purpose                  | Min Length | Format            |
| -------------------- | ------------------------ | ---------- | ----------------- |
| DB_ROOT_PASSWORD     | MySQL root access        | 32 chars   | Alphanumeric+Special |
| DB_PASSWORD          | WordPress DB access      | 32 chars   | Alphanumeric+Special |
| WP_ADMIN_PASSWORD    | WordPress admin login    | 32 chars   | Alphanumeric+Special |
| JWT_SECRET           | Token signing            | 32 chars   | Alphanumeric+Special |
| OPENAI_API_KEY       | OpenAI API access        | N/A        | From OpenAI       |
| ANTHROPIC_API_KEY    | Anthropic API access     | N/A        | From Anthropic    |
| STRIPE_SECRET_KEY    | Payment processing       | N/A        | From Stripe       |
| STRIPE_WEBHOOK_SECRET| Webhook verification     | N/A        | From Stripe       |

### Production Approach (HashiCorp Vault)

**For production deployments, use HashiCorp Vault:**

See `vault-setup/` directory for complete implementation guide.

**Benefits:**
- Centralized secrets management
- Automatic rotation
- Audit logging
- Access control policies
- Encryption at rest and in transit

---

## 🌐 Network Security

### Port Exposure

**Exposed Ports (Development):**

| Port | Service      | Protocol | Access Level | Security Notes              |
| ---- | ------------ | -------- | ------------ | --------------------------- |
| 3001 | Frontend     | HTTP     | localhost    | Use HTTPS in production     |
| 8001 | AI Service   | HTTP     | localhost    | Use HTTPS in production     |
| 8080 | WordPress    | HTTP     | localhost    | Use HTTPS in production     |

**Internal Ports (Not Exposed):**

| Port | Service | Access Level      | Security Notes                    |
| ---- | ------- | ----------------- | --------------------------------- |
| 3306 | MySQL   | Docker network    | ✅ Correct - no external access   |
| 6379 | Redis   | Docker network    | ✅ Correct - no external access   |

### Docker Network Isolation

All services communicate via the `offgrid-network` bridge network. This provides:

- ✅ DNS resolution between containers
- ✅ Network isolation from host
- ✅ No direct external access to internal services
- ✅ Explicit port mapping required for external access

---

## 🔧 Service-Specific Security

### MySQL Database

**Security Measures:**
- ✅ No default passwords (must be set in .env)
- ✅ Not exposed to host network
- ✅ Data encrypted at rest via volume encryption
- ✅ Health checks prevent zombie containers
- ⚠️ Root user disabled in production (use dedicated app user)

**Production Hardening:**
```sql
-- Disable root remote access
DELETE FROM mysql.user WHERE User='root' AND Host NOT IN ('localhost', '127.0.0.1', '::1');

-- Remove test database
DROP DATABASE IF EXISTS test;

-- Flush privileges
FLUSH PRIVILEGES;
```

### Redis Cache

**Security Measures:**
- ✅ Not exposed to host network (removed port mapping)
- ✅ No default password (authentication via network isolation)
- ✅ Persistent data in volume
- ⚠️ Add `requirepass` in production

**Production Configuration:**
```redis
# redis.conf
requirepass ${REDIS_PASSWORD}
maxmemory 256mb
maxmemory-policy allkeys-lru
```

### WordPress

**Security Measures:**
- ✅ No default admin password (must be set in .env)
- ✅ Debug mode disabled in production (set WP_DEBUG=false)
- ✅ Latest stable version (6.4)
- ✅ File permissions enforced by Docker
- ⚠️ Install security plugins (Wordfence, iThemes Security)
- ⚠️ Limit login attempts
- ⚠️ Enable 2FA for admin users

**wp-config.php Security Keys:**

WordPress uses security keys for encryption. These are auto-generated on first install but should be rotated regularly:

```php
define('AUTH_KEY',         'put your unique phrase here');
define('SECURE_AUTH_KEY',  'put your unique phrase here');
define('LOGGED_IN_KEY',    'put your unique phrase here');
define('NONCE_KEY',        'put your unique phrase here');
define('AUTH_SALT',        'put your unique phrase here');
define('SECURE_AUTH_SALT', 'put your unique phrase here');
define('LOGGED_IN_SALT',   'put your unique phrase here');
define('NONCE_SALT',       'put your unique phrase here');
```

Generate from: https://api.wordpress.org/secret-key/1.1/salt/

### AI Service (FastAPI)

**Security Measures:**
- ✅ API key validation for external calls
- ✅ Rate limiting via Redis
- ✅ Input validation with Pydantic models
- ✅ CORS restricted to known origins
- ✅ No debug mode in production
- ⚠️ Add request signing
- ⚠️ Implement OAuth2 for user endpoints

**Environment Variables:**
```bash
ENVIRONMENT=production
LOG_LEVEL=warning
CORS_ORIGINS=https://yourdomain.com
```

### Frontend (Next.js)

**Security Measures:**
- ✅ Environment variables scoped (NEXT_PUBLIC_ only for browser)
- ✅ API routes server-side only
- ✅ CSP headers in production
- ✅ XSS protection via React
- ⚠️ Add JWT validation middleware
- ⚠️ Implement CSRF protection
- ⚠️ Rate limiting on API routes

**next.config.js Security Headers:**
```javascript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Content-Security-Policy',
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 🔍 Security Audit Checklist

### Before Production Deployment

- [ ] All default passwords removed/changed
- [ ] `.env` file not committed to git (verify with `git log --all --full-history -- .env`)
- [ ] TLS/HTTPS enabled for all external services
- [ ] Database root access disabled
- [ ] Redis password authentication enabled
- [ ] WordPress admin uses 2FA
- [ ] Security plugins installed and configured
- [ ] All dependencies updated (`npm audit`, `pip-audit`)
- [ ] Docker images from trusted sources only
- [ ] No exposed debug endpoints
- [ ] CORS restricted to known domains
- [ ] Rate limiting implemented
- [ ] Audit logging enabled
- [ ] Backup and recovery tested
- [ ] Incident response plan documented

### Regular Maintenance (Monthly)

- [ ] Update all Docker base images
- [ ] Update npm dependencies (`npm update`)
- [ ] Update Python dependencies (`pip list --outdated`)
- [ ] Update WordPress core and plugins
- [ ] Review access logs for suspicious activity
- [ ] Rotate API keys and secrets
- [ ] Test backup restoration
- [ ] Review and update security policies

---

## 🛡️ Known Security Considerations

### Development Environment

⚠️ **Current State (Development Mode):**

- HTTP only (no TLS)
- Debug logging enabled
- Permissive CORS
- Local network access only
- Simplified authentication

✅ **Acceptable Because:**

- Not exposed to internet
- Localhost binding only
- Development/testing phase
- Full production security planned

### Production Roadmap

**Phase 1: Vault Integration** (In Progress - see `vault-setup/`)
- Centralized secrets management
- Automatic credential rotation
- Audit logging
- Access control policies

**Phase 2: TLS/HTTPS Everywhere**
- Let's Encrypt certificates
- Automatic renewal
- HSTS enforcement
- Certificate pinning

**Phase 3: Advanced Authentication**
- OAuth2/OIDC integration
- Multi-factor authentication
- Session management
- JWT with refresh tokens

**Phase 4: Monitoring & Alerting**
- Intrusion detection (Fail2ban)
- Log aggregation (ELK stack)
- Security event alerting
- Automated response

---

## 📚 Security Resources

### Documentation

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [WordPress Security Hardening](https://wordpress.org/support/article/hardening-wordpress/)
- [Next.js Security Headers](https://nextjs.org/docs/advanced-features/security-headers)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

### Tools

- **Static Analysis:** `bandit` (Python), `npm audit` (Node.js)
- **Dependency Scanning:** `pip-audit`, `Snyk`, `Dependabot`
- **Container Scanning:** `docker scan`, `Trivy`, `Clair`
- **Penetration Testing:** `OWASP ZAP`, `Burp Suite`
- **Secrets Detection:** `gitleaks`, `truffleHog`

---

## 📝 Security Changelog

### 2025-10-14 - Initial Security Audit (Task 9)

**Findings:**
- ❌ Weak default passwords in docker-compose.yml (rootpass, wppass, admin123)
- ❌ Redis port 6380 exposed to host network
- ❌ WP_DEBUG enabled by default
- ✅ No .env file committed to repository
- ✅ .env.example uses placeholder values

**Remediations:**
- ✅ Removed all default password fallbacks (now required in .env)
- ✅ Removed Redis port exposure (internal network only)
- ✅ Updated .env.example with security guidance and strong password generation
- ✅ Set WP_DEBUG=false as default in .env.example
- ✅ Created this SECURITY.md document
- ✅ Added password generation commands for PowerShell and Bash
- 📋 Planned HashiCorp Vault integration (see vault-setup/)

---

## ✅ Compliance

This project aims to comply with:

- **OWASP Top 10** - Web application security risks
- **CIS Docker Benchmark** - Container security best practices
- **PCI DSS** (if handling payments) - Payment card industry standards
- **GDPR** (if handling EU user data) - Data protection and privacy

---

## 🤝 Contributing to Security

If you're contributing code, please:

1. Never commit secrets or credentials
2. Use environment variables for all configuration
3. Validate all user inputs
4. Escape all outputs
5. Use parameterized queries (no SQL injection)
6. Keep dependencies updated
7. Run security linters before committing
8. Review OWASP Top 10 regularly

---

**For questions or concerns, contact the security team.**

**Stay secure! 🔒**
