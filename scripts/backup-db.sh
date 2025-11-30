#!/bin/bash
# ============================================
# Destinova Database Backup Script
# ============================================
# 
# Usage: ./scripts/backup-db.sh
# 
# Prerequisites:
# - mongodump installed (MongoDB Database Tools)
# - AWS CLI configured (if using S3)
# - Environment variables set
#
# Cron setup (daily at 2 AM):
# 0 2 * * * /var/www/destinova/scripts/backup-db.sh >> /var/log/destinova-backup.log 2>&1

set -e

# ============================================
# Configuration
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_DIR}/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${DATE}"
RETENTION_DAYS=7

# Load environment variables
if [ -f "${PROJECT_DIR}/.env.production" ]; then
    export $(cat "${PROJECT_DIR}/.env.production" | grep -v '^#' | xargs)
elif [ -f "${PROJECT_DIR}/.env" ]; then
    export $(cat "${PROJECT_DIR}/.env" | grep -v '^#' | xargs)
fi

# S3 Configuration
S3_BUCKET="${BACKUP_S3_BUCKET:-destinova-backups}"
S3_REGION="${AWS_REGION:-ap-south-1}"

# ============================================
# Functions
# ============================================

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

check_dependencies() {
    if ! command -v mongodump &> /dev/null; then
        error "mongodump not found. Please install MongoDB Database Tools."
        exit 1
    fi
}

create_backup() {
    log "Starting database backup..."
    
    # Create backup directory
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"
    
    # Check if MongoDB URI is set
    if [ -z "${MONGODB_URI}" ]; then
        error "MONGODB_URI environment variable not set"
        exit 1
    fi
    
    # Perform backup
    mongodump --uri="${MONGODB_URI}" --out="${BACKUP_DIR}/${BACKUP_NAME}" --gzip
    
    if [ $? -eq 0 ]; then
        log "Database backup completed: ${BACKUP_DIR}/${BACKUP_NAME}"
    else
        error "Database backup failed"
        exit 1
    fi
}

compress_backup() {
    log "Compressing backup..."
    
    cd "${BACKUP_DIR}"
    tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
    rm -rf "${BACKUP_NAME}"
    
    log "Backup compressed: ${BACKUP_NAME}.tar.gz"
}

upload_to_s3() {
    if ! command -v aws &> /dev/null; then
        log "AWS CLI not installed. Skipping S3 upload."
        return
    fi
    
    if [ -z "${AWS_ACCESS_KEY_ID}" ] || [ -z "${AWS_SECRET_ACCESS_KEY}" ]; then
        log "AWS credentials not configured. Skipping S3 upload."
        return
    fi
    
    log "Uploading backup to S3..."
    
    aws s3 cp "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" \
        "s3://${S3_BUCKET}/mongodb/${BACKUP_NAME}.tar.gz" \
        --region "${S3_REGION}" \
        --storage-class STANDARD_IA
    
    if [ $? -eq 0 ]; then
        log "Backup uploaded to S3: s3://${S3_BUCKET}/mongodb/${BACKUP_NAME}.tar.gz"
    else
        error "S3 upload failed"
    fi
}

cleanup_old_backups() {
    log "Cleaning up old local backups (older than ${RETENTION_DAYS} days)..."
    
    find "${BACKUP_DIR}" -name "backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete
    
    log "Cleanup completed"
}

cleanup_old_s3_backups() {
    if ! command -v aws &> /dev/null; then
        return
    fi
    
    if [ -z "${AWS_ACCESS_KEY_ID}" ]; then
        return
    fi
    
    log "Cleaning up old S3 backups (older than 30 days)..."
    
    # List and delete old backups
    CUTOFF_DATE=$(date -d "-30 days" +%Y%m%d)
    
    aws s3 ls "s3://${S3_BUCKET}/mongodb/" --region "${S3_REGION}" | while read -r line; do
        FILE_DATE=$(echo "$line" | awk '{print $4}' | grep -oP '\d{8}')
        FILE_NAME=$(echo "$line" | awk '{print $4}')
        
        if [ -n "${FILE_DATE}" ] && [ "${FILE_DATE}" -lt "${CUTOFF_DATE}" ]; then
            log "Deleting old S3 backup: ${FILE_NAME}"
            aws s3 rm "s3://${S3_BUCKET}/mongodb/${FILE_NAME}" --region "${S3_REGION}"
        fi
    done
}

send_notification() {
    local status=$1
    local message=$2
    
    # Slack notification (if webhook URL is set)
    if [ -n "${SLACK_WEBHOOK_URL}" ]; then
        curl -s -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"Destinova Backup ${status}: ${message}\"}" \
            "${SLACK_WEBHOOK_URL}"
    fi
    
    # Email notification (if configured)
    if [ -n "${ADMIN_EMAIL}" ] && command -v mail &> /dev/null; then
        echo "${message}" | mail -s "Destinova Backup ${status}" "${ADMIN_EMAIL}"
    fi
}

# ============================================
# Main Execution
# ============================================

main() {
    log "============================================"
    log "Starting Destinova backup process"
    log "============================================"
    
    check_dependencies
    
    # Create backup
    create_backup
    
    # Compress
    compress_backup
    
    # Calculate backup size
    BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" | cut -f1)
    log "Backup size: ${BACKUP_SIZE}"
    
    # Upload to S3
    upload_to_s3
    
    # Cleanup
    cleanup_old_backups
    cleanup_old_s3_backups
    
    log "============================================"
    log "Backup process completed successfully"
    log "============================================"
    
    send_notification "SUCCESS" "Backup completed successfully. Size: ${BACKUP_SIZE}"
}

# Run main function
main "$@"
