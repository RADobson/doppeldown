#!/bin/bash
# DoppelDown Weekly Database Backup
# See: docs/DISASTER_RECOVERY_PLAN.md — Section 5.1
#
# Prerequisites:
#   - pg_dump installed
#   - gpg installed
#   - DATABASE_URL env var set (Supabase connection string)
#   - Backup passphrase file at /root/.backup-passphrase (or PASSPHRASE_FILE env)
#
# Usage:
#   ./backup-database.sh                  # Normal backup
#   ./backup-database.sh --verify         # Backup + verify
#
# Recommended cron:
#   0 2 * * 0 /home/ubuntu/doppeldown-worker/scripts/backup-database.sh >> /home/ubuntu/logs/backup.log 2>&1

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/home/ubuntu/backups/doppeldown}"
PASSPHRASE_FILE="${PASSPHRASE_FILE:-/root/.backup-passphrase}"
RETENTION_DAYS="${RETENTION_DAYS:-90}"
DB_URL="${DATABASE_URL:?ERROR: DATABASE_URL environment variable is not set}"

BACKUP_DATE=$(date +%Y-%m-%d_%H%M%S)
BACKUP_FILE="doppeldown_${BACKUP_DATE}.dump"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILE}"
ENCRYPTED_PATH="${BACKUP_PATH}.gpg"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

log "=== DoppelDown Database Backup ==="
log "Backup directory: ${BACKUP_DIR}"
log "Retention: ${RETENTION_DAYS} days"

# Ensure backup directory exists
mkdir -p "${BACKUP_DIR}"

# Check passphrase file
if [ ! -f "${PASSPHRASE_FILE}" ]; then
    log "ERROR: Passphrase file not found at ${PASSPHRASE_FILE}"
    log "Create it with: echo 'your-secure-passphrase' > ${PASSPHRASE_FILE} && chmod 600 ${PASSPHRASE_FILE}"
    exit 1
fi

# Dump database
log "Starting pg_dump..."
pg_dump "${DB_URL}" \
    --format=custom \
    --compress=9 \
    --no-owner \
    --no-privileges \
    --verbose \
    --file="${BACKUP_PATH}" 2>&1 | while read -r line; do
        log "  pg_dump: ${line}"
    done

DUMP_SIZE=$(du -h "${BACKUP_PATH}" | cut -f1)
log "Dump completed: ${DUMP_SIZE}"

# Encrypt
log "Encrypting backup..."
gpg --batch --yes --symmetric --cipher-algo AES256 \
    --passphrase-file "${PASSPHRASE_FILE}" \
    "${BACKUP_PATH}"

# Remove unencrypted dump
rm -f "${BACKUP_PATH}"

ENCRYPTED_SIZE=$(du -h "${ENCRYPTED_PATH}" | cut -f1)
log "Encrypted backup: ${ENCRYPTED_SIZE}"

# Verify encryption (can we decrypt it?)
log "Verifying encryption..."
gpg --batch --decrypt --passphrase-file "${PASSPHRASE_FILE}" \
    "${ENCRYPTED_PATH}" > /dev/null 2>&1
log "Encryption verified ✓"

# Optional: Upload to off-site storage
# Uncomment and configure one of these:
#
# Backblaze B2:
# b2 upload-file doppeldown-backups "${ENCRYPTED_PATH}" "db/${BACKUP_FILE}.gpg"
#
# AWS S3:
# aws s3 cp "${ENCRYPTED_PATH}" "s3://doppeldown-backups/db/${BACKUP_FILE}.gpg"
#
# rclone (any provider):
# rclone copy "${ENCRYPTED_PATH}" remote:doppeldown-backups/db/

# Prune old backups
log "Pruning backups older than ${RETENTION_DAYS} days..."
PRUNED=$(find "${BACKUP_DIR}" -name "doppeldown_*.dump.gpg" -mtime +${RETENTION_DAYS} -print -delete | wc -l)
log "Pruned ${PRUNED} old backup(s)"

# Optional verification
if [ "${1:-}" = "--verify" ]; then
    log ""
    log "=== Backup Verification ==="
    
    TEMP_DUMP="/tmp/doppeldown_verify_${BACKUP_DATE}.dump"
    
    log "Decrypting for verification..."
    gpg --batch --decrypt --passphrase-file "${PASSPHRASE_FILE}" \
        "${ENCRYPTED_PATH}" > "${TEMP_DUMP}"
    
    log "Checking backup contents..."
    pg_restore --list "${TEMP_DUMP}" | head -20
    
    # Count tables in backup
    TABLE_COUNT=$(pg_restore --list "${TEMP_DUMP}" | grep "TABLE DATA" | wc -l)
    log "Tables with data in backup: ${TABLE_COUNT}"
    
    rm -f "${TEMP_DUMP}"
    log "Verification complete ✓"
fi

# List current backups
log ""
log "=== Current Backups ==="
ls -lh "${BACKUP_DIR}"/doppeldown_*.dump.gpg 2>/dev/null | while read -r line; do
    log "  ${line}"
done
TOTAL_SIZE=$(du -sh "${BACKUP_DIR}" 2>/dev/null | cut -f1)
TOTAL_COUNT=$(ls -1 "${BACKUP_DIR}"/doppeldown_*.dump.gpg 2>/dev/null | wc -l)
log "Total: ${TOTAL_COUNT} backup(s), ${TOTAL_SIZE}"

log ""
log "=== Backup Complete ==="
log "File: ${ENCRYPTED_PATH}"
