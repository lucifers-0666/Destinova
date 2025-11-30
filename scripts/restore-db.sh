#!/bin/bash
# ============================================
# Destinova Database Restore Script
# ============================================
# 
# Usage: ./scripts/restore-db.sh <backup_file.tar.gz>
# 
# Example: ./scripts/restore-db.sh backups/backup_20251130_020000.tar.gz
#
# WARNING: This will REPLACE your current database!

set -e

# ============================================
# Configuration
# ============================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="${PROJECT_DIR}/backups"
TEMP_DIR="${PROJECT_DIR}/temp_restore"

# Load environment variables
if [ -f "${PROJECT_DIR}/.env.production" ]; then
    export $(cat "${PROJECT_DIR}/.env.production" | grep -v '^#' | xargs)
elif [ -f "${PROJECT_DIR}/.env" ]; then
    export $(cat "${PROJECT_DIR}/.env" | grep -v '^#' | xargs)
fi

# ============================================
# Functions
# ============================================

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

error() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1" >&2
}

usage() {
    echo "Usage: $0 <backup_file.tar.gz>"
    echo ""
    echo "Examples:"
    echo "  $0 backups/backup_20251130_020000.tar.gz"
    echo "  $0 s3://destinova-backups/mongodb/backup_20251130_020000.tar.gz"
    exit 1
}

check_dependencies() {
    if ! command -v mongorestore &> /dev/null; then
        error "mongorestore not found. Please install MongoDB Database Tools."
        exit 1
    fi
}

download_from_s3() {
    local s3_path=$1
    local local_file="${TEMP_DIR}/$(basename "$s3_path")"
    
    log "Downloading backup from S3..."
    
    aws s3 cp "$s3_path" "$local_file"
    
    if [ $? -eq 0 ]; then
        log "Download completed: $local_file"
        echo "$local_file"
    else
        error "Failed to download from S3"
        exit 1
    fi
}

extract_backup() {
    local backup_file=$1
    local extract_dir="${TEMP_DIR}/extracted"
    
    log "Extracting backup..."
    
    mkdir -p "$extract_dir"
    tar -xzf "$backup_file" -C "$extract_dir"
    
    # Find the actual backup directory
    BACKUP_DATA_DIR=$(find "$extract_dir" -type d -name "destinova" | head -1)
    
    if [ -z "$BACKUP_DATA_DIR" ]; then
        # If not found, use the first directory
        BACKUP_DATA_DIR=$(find "$extract_dir" -mindepth 2 -maxdepth 2 -type d | head -1)
    fi
    
    if [ -z "$BACKUP_DATA_DIR" ]; then
        error "Could not find backup data in archive"
        exit 1
    fi
    
    log "Backup data found at: $BACKUP_DATA_DIR"
    echo "$(dirname "$BACKUP_DATA_DIR")"
}

confirm_restore() {
    echo ""
    echo "============================================"
    echo "⚠️  WARNING: DATABASE RESTORE"
    echo "============================================"
    echo ""
    echo "This will REPLACE your current database with the backup."
    echo "Database: ${MONGODB_URI}"
    echo ""
    read -p "Are you sure you want to continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log "Restore cancelled by user"
        exit 0
    fi
}

restore_database() {
    local backup_path=$1
    
    log "Starting database restore..."
    
    # Check if MongoDB URI is set
    if [ -z "${MONGODB_URI}" ]; then
        error "MONGODB_URI environment variable not set"
        exit 1
    fi
    
    # Perform restore with drop (replace existing data)
    mongorestore --uri="${MONGODB_URI}" --gzip --drop "$backup_path"
    
    if [ $? -eq 0 ]; then
        log "Database restore completed successfully"
    else
        error "Database restore failed"
        exit 1
    fi
}

cleanup() {
    log "Cleaning up temporary files..."
    rm -rf "${TEMP_DIR}"
}

# ============================================
# Main Execution
# ============================================

main() {
    local backup_file=$1
    
    if [ -z "$backup_file" ]; then
        usage
    fi
    
    log "============================================"
    log "Starting Destinova restore process"
    log "============================================"
    
    check_dependencies
    
    # Create temp directory
    mkdir -p "${TEMP_DIR}"
    
    # Handle S3 paths
    if [[ "$backup_file" == s3://* ]]; then
        backup_file=$(download_from_s3 "$backup_file")
    fi
    
    # Check if file exists
    if [ ! -f "$backup_file" ]; then
        error "Backup file not found: $backup_file"
        exit 1
    fi
    
    # Confirm with user
    confirm_restore
    
    # Extract backup
    extracted_path=$(extract_backup "$backup_file")
    
    # Restore database
    restore_database "$extracted_path"
    
    # Cleanup
    cleanup
    
    log "============================================"
    log "Restore process completed successfully"
    log "============================================"
}

# Run main function
main "$@"
