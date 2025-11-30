# Destinova Production Deployment Guide

This document provides comprehensive instructions for deploying Destinova to a production environment.

## Table of Contents

1. [Server Requirements](#server-requirements)
2. [Initial Server Setup](#initial-server-setup)
3. [Application Deployment](#application-deployment)
4. [Database Setup](#database-setup)
5. [Nginx Configuration](#nginx-configuration)
6. [SSL Certificate](#ssl-certificate)
7. [Process Management](#process-management)
8. [Monitoring & Logging](#monitoring--logging)
9. [Backup Strategy](#backup-strategy)
10. [Security Hardening](#security-hardening)
11. [Troubleshooting](#troubleshooting)

---

## Server Requirements

### Minimum Requirements
- **CPU**: 2 vCPU
- **RAM**: 4 GB
- **Storage**: 40 GB SSD
- **OS**: Ubuntu 22.04 LTS

### Recommended for Production
- **CPU**: 4+ vCPU
- **RAM**: 8+ GB
- **Storage**: 100 GB SSD
- **OS**: Ubuntu 22.04 LTS

### Software Requirements
- Node.js 18+
- MongoDB 6.0+ (or MongoDB Atlas)
- Nginx 1.18+
- Redis 7.0+ (optional)
- PM2 (Process Manager)

---

## Initial Server Setup

### 1. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v20.x.x
```

### 3. Install MongoDB (if not using Atlas)

```bash
# Import MongoDB GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install
sudo apt update
sudo apt install -y mongodb-org

# Start and enable
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 4. Install Redis (Optional)

```bash
sudo apt install -y redis-server
sudo systemctl enable redis-server
```

### 5. Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
```

### 6. Install PM2

```bash
sudo npm install -g pm2
```

### 7. Create Application User

```bash
sudo useradd -m -s /bin/bash destinova
sudo usermod -aG sudo destinova
```

---

## Application Deployment

### 1. Clone Repository

```bash
sudo mkdir -p /var/www/destinova
sudo chown destinova:destinova /var/www/destinova
su - destinova

cd /var/www/destinova
git clone https://github.com/lucifers-0666/Destinova.git current
cd current
```

### 2. Install Dependencies

```bash
npm ci --production=false  # Install all dependencies including devDependencies for build
```

### 3. Configure Environment

```bash
cp .env.production.example .env.production
nano .env.production
```

Fill in all required values:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Generate with `openssl rand -hex 64`
- `STRIPE_SECRET_KEY` - From Stripe dashboard
- `SENDGRID_API_KEY` - From SendGrid
- `SENTRY_DSN` - From Sentry

### 4. Build Application

```bash
npm run build
```

### 5. Create Log Directory

```bash
mkdir -p /var/www/destinova/current/logs
chmod 755 /var/www/destinova/current/logs
```

### 6. Seed Database (First Time Only)

```bash
npm run seed:prod
```

---

## Database Setup

### Option A: MongoDB Atlas (Recommended)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
2. Create account and project
3. Create M10+ cluster for production (M0 free tier for testing)
4. Under "Database Access", create user with readWrite role
5. Under "Network Access", add your server's IP
6. Get connection string from "Connect" button

Connection string format:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/destinova?retryWrites=true&w=majority
```

### Option B: Self-Hosted MongoDB

```bash
# Create admin user
mongosh
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

# Create application database and user
use destinova
db.createUser({
  user: "destinova_app",
  pwd: "secure_app_password",
  roles: ["readWrite"]
})
```

Enable authentication in `/etc/mongod.conf`:
```yaml
security:
  authorization: enabled
```

---

## Nginx Configuration

### 1. Copy Configuration

```bash
sudo cp /var/www/destinova/current/nginx/destinova.conf /etc/nginx/sites-available/destinova
```

### 2. Update Domain Name

```bash
sudo nano /etc/nginx/sites-available/destinova
# Replace destinova.com with your actual domain
```

### 3. Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/destinova /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Remove default site
```

### 4. Test and Reload

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## SSL Certificate

### Using Let's Encrypt (Certbot)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d destinova.com -d www.destinova.com

# Test auto-renewal
sudo certbot renew --dry-run
```

Certbot automatically adds a cron job for renewal.

### Manual Renewal (if needed)

```bash
# Add to crontab
sudo crontab -e

# Add this line (renew at 3 AM on the 1st of each month)
0 3 1 * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

---

## Process Management

### Start Application with PM2

```bash
cd /var/www/destinova/current
pm2 start ecosystem.config.cjs --env production
```

### PM2 Commands

```bash
# View status
pm2 status

# View logs
pm2 logs destinova

# Monitor
pm2 monit

# Restart
pm2 restart destinova

# Stop
pm2 stop destinova

# Delete
pm2 delete destinova
```

### Enable Auto-Start on Boot

```bash
pm2 startup systemd
# Copy and run the command it outputs

pm2 save
```

### Cluster Mode

The `ecosystem.config.cjs` is configured to use cluster mode with all CPU cores.
To adjust:

```javascript
// ecosystem.config.cjs
instances: 4,  // Specific number
// or
instances: 'max',  // All cores
```

---

## Monitoring & Logging

### PM2 Plus (Optional)

```bash
pm2 plus
# Follow instructions to link your server
```

### Sentry Error Tracking

1. Create project at [sentry.io](https://sentry.io)
2. Copy DSN to `.env.production`
3. Errors are automatically tracked

### Log Files

- **Application logs**: `/var/www/destinova/current/logs/`
  - `error.log` - Error level logs
  - `combined.log` - All logs
  - `http.log` - HTTP request logs
- **PM2 logs**: `~/.pm2/logs/`
- **Nginx logs**: `/var/log/nginx/`

### Health Check

```bash
# Basic health check
curl http://localhost:4000/health

# Detailed health check
curl http://localhost:4000/health/detailed

# Prometheus metrics
curl http://localhost:4000/health/metrics
```

---

## Backup Strategy

### Automated Database Backups

```bash
# Make backup script executable
chmod +x /var/www/destinova/current/scripts/backup-db.sh

# Test backup
/var/www/destinova/current/scripts/backup-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
0 2 * * * /var/www/destinova/current/scripts/backup-db.sh >> /var/log/destinova-backup.log 2>&1
```

### Manual Backup

```bash
# Using mongodump
mongodump --uri="$MONGODB_URI" --out="backups/manual_$(date +%Y%m%d)"
```

### Restore from Backup

```bash
/var/www/destinova/current/scripts/restore-db.sh backups/backup_20251130_020000.tar.gz
```

---

## Security Hardening

### 1. Firewall Configuration

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 2. Fail2Ban

```bash
sudo apt install -y fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

Enable nginx and sshd jails:
```ini
[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

```bash
sudo systemctl restart fail2ban
```

### 3. Automatic Security Updates

```bash
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### 4. Secure MongoDB

- Use strong passwords
- Enable authentication
- Whitelist only necessary IPs
- Use TLS/SSL connections

### 5. Environment Variables

- Never commit `.env.production` to git
- Use strong, unique secrets
- Rotate secrets periodically

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs destinova --lines 100

# Check if port is in use
sudo lsof -i :4000

# Check Node.js version
node --version
```

### Database Connection Issues

```bash
# Test MongoDB connection
mongosh "$MONGODB_URI"

# Check MongoDB status
sudo systemctl status mongod
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log

# Check if running
sudo systemctl status nginx
```

### SSL Certificate Issues

```bash
# Check certificate expiry
sudo certbot certificates

# Force renewal
sudo certbot renew --force-renewal
```

### High Memory Usage

```bash
# Check PM2 memory
pm2 monit

# Restart with memory limit
pm2 restart destinova --max-memory-restart 1G
```

### Permission Issues

```bash
# Fix ownership
sudo chown -R destinova:destinova /var/www/destinova

# Fix log permissions
chmod 755 /var/www/destinova/current/logs
```

---

## Deployment Checklist

Before going live, ensure:

- [ ] All environment variables configured
- [ ] Database connection tested
- [ ] SSL certificate installed
- [ ] Nginx configured and tested
- [ ] PM2 auto-start enabled
- [ ] Backups configured and tested
- [ ] Monitoring set up (Sentry, PM2 Plus)
- [ ] Firewall configured
- [ ] Log rotation configured
- [ ] Health checks passing
- [ ] Load testing completed
- [ ] DNS configured
- [ ] Email service tested
- [ ] Payment processing tested (Stripe)

---

## Quick Reference

```bash
# Start application
pm2 start ecosystem.config.cjs --env production

# View logs
pm2 logs destinova

# Restart application
pm2 restart destinova

# Deploy updates
cd /var/www/destinova/current
git pull
npm ci
npm run build
pm2 restart destinova

# Check health
curl localhost:4000/health

# Backup database
./scripts/backup-db.sh
```

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/lucifers-0666/Destinova/issues
- Documentation: https://destinova.com/docs
