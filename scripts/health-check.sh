#!/bin/bash
# DoppelDown Quick Health Check
# Run daily or on suspected issues
# See: docs/DISASTER_RECOVERY_PLAN.md — Runbook 1

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

pass() { echo -e "  ${GREEN}✓${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠${NC} $1"; }
fail() { echo -e "  ${RED}✗${NC} $1"; }

DOMAIN="${DOPPELDOWN_DOMAIN:-doppeldown.com}"
WORKER_IP="${WORKER_VPS_IP:-159.13.34.62}"
SSH_KEY="${WORKER_SSH_KEY:-$HOME/.ssh/doppeldown-worker.key}"

echo "═══════════════════════════════════════"
echo "  DoppelDown Health Check"
echo "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
echo "═══════════════════════════════════════"
echo ""

ISSUES=0

# 1. Web Application
echo "── Web Application ──"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://${DOMAIN}" 2>/dev/null || echo "000")
if [ "$HTTP_CODE" = "200" ]; then
    pass "Homepage: HTTP ${HTTP_CODE}"
else
    fail "Homepage: HTTP ${HTTP_CODE}"
    ISSUES=$((ISSUES + 1))
fi

HEALTH_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://${DOMAIN}/api/health" 2>/dev/null || echo "000")
if [ "$HEALTH_CODE" = "200" ]; then
    HEALTH_BODY=$(curl -s --max-time 10 "https://${DOMAIN}/api/health" 2>/dev/null || echo "{}")
    pass "Health endpoint: ${HEALTH_BODY}"
elif [ "$HEALTH_CODE" = "404" ]; then
    warn "Health endpoint not yet implemented (HTTP 404)"
else
    fail "Health endpoint: HTTP ${HEALTH_CODE}"
    ISSUES=$((ISSUES + 1))
fi
echo ""

# 2. Worker VPS
echo "── Worker VPS ──"
if ssh -i "${SSH_KEY}" -o ConnectTimeout=5 -o StrictHostKeyChecking=no "ubuntu@${WORKER_IP}" 'true' 2>/dev/null; then
    pass "SSH connection OK"
    
    PM2_STATUS=$(ssh -i "${SSH_KEY}" -o ConnectTimeout=5 "ubuntu@${WORKER_IP}" 'pm2 jlist 2>/dev/null' 2>/dev/null || echo "[]")
    if echo "$PM2_STATUS" | python3 -c "
import json, sys
try:
    procs = json.load(sys.stdin)
    for p in procs:
        name = p.get('name', 'unknown')
        status = p.get('pm2_env', {}).get('status', 'unknown')
        restarts = p.get('pm2_env', {}).get('restart_time', 0)
        if status == 'online':
            print(f'OK|{name}: {status} (restarts: {restarts})')
        else:
            print(f'FAIL|{name}: {status} (restarts: {restarts})')
    if not procs:
        print('WARN|No PM2 processes found')
except:
    print('FAIL|Could not parse PM2 output')
" 2>/dev/null | while IFS='|' read -r level msg; do
        case "$level" in
            OK) pass "$msg" ;;
            WARN) warn "$msg"; ISSUES=$((ISSUES + 1)) ;;
            FAIL) fail "$msg"; ISSUES=$((ISSUES + 1)) ;;
        esac
    done; then true; fi
    
    # Check disk and memory
    DISK_USE=$(ssh -i "${SSH_KEY}" -o ConnectTimeout=5 "ubuntu@${WORKER_IP}" "df -h / | awk 'NR==2{print \$5}'" 2>/dev/null || echo "unknown")
    MEM_USE=$(ssh -i "${SSH_KEY}" -o ConnectTimeout=5 "ubuntu@${WORKER_IP}" "free -m | awk 'NR==2{printf \"%.0f%%\", \$3*100/\$2}'" 2>/dev/null || echo "unknown")
    
    if [ "$DISK_USE" != "unknown" ]; then
        DISK_PCT=$(echo "$DISK_USE" | tr -d '%')
        if [ "$DISK_PCT" -gt 90 ]; then
            fail "Disk usage: ${DISK_USE} (CRITICAL)"
            ISSUES=$((ISSUES + 1))
        elif [ "$DISK_PCT" -gt 75 ]; then
            warn "Disk usage: ${DISK_USE}"
        else
            pass "Disk usage: ${DISK_USE}"
        fi
    fi
    
    if [ "$MEM_USE" != "unknown" ]; then
        MEM_PCT=$(echo "$MEM_USE" | tr -d '%')
        if [ "$MEM_PCT" -gt 90 ]; then
            fail "Memory usage: ${MEM_USE} (CRITICAL)"
            ISSUES=$((ISSUES + 1))
        elif [ "$MEM_PCT" -gt 75 ]; then
            warn "Memory usage: ${MEM_USE}"
        else
            pass "Memory usage: ${MEM_USE}"
        fi
    fi
else
    fail "SSH connection FAILED"
    ISSUES=$((ISSUES + 1))
fi
echo ""

# 3. External Services
echo "── External Services ──"
for service in "Supabase:status.supabase.com" "Vercel:status.vercel.com" "Stripe:status.stripe.com"; do
    NAME=$(echo "$service" | cut -d: -f1)
    URL=$(echo "$service" | cut -d: -f2-)
    CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://${URL}" 2>/dev/null || echo "000")
    if [ "$CODE" = "200" ]; then
        pass "${NAME} status page reachable"
    else
        warn "${NAME} status page: HTTP ${CODE}"
    fi
done
echo ""

# 4. SSL Certificate
echo "── SSL Certificate ──"
EXPIRY=$(echo | openssl s_client -servername "${DOMAIN}" -connect "${DOMAIN}:443" 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -n "$EXPIRY" ]; then
    EXPIRY_EPOCH=$(date -j -f "%b %d %H:%M:%S %Y %Z" "$EXPIRY" "+%s" 2>/dev/null || date -d "$EXPIRY" "+%s" 2>/dev/null || echo "0")
    NOW_EPOCH=$(date "+%s")
    DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
    if [ "$DAYS_LEFT" -lt 7 ]; then
        fail "SSL expires in ${DAYS_LEFT} days! (${EXPIRY})"
        ISSUES=$((ISSUES + 1))
    elif [ "$DAYS_LEFT" -lt 30 ]; then
        warn "SSL expires in ${DAYS_LEFT} days (${EXPIRY})"
    else
        pass "SSL certificate valid for ${DAYS_LEFT} days"
    fi
else
    warn "Could not check SSL certificate"
fi
echo ""

# Summary
echo "═══════════════════════════════════════"
if [ "$ISSUES" -eq 0 ]; then
    echo -e "  ${GREEN}All checks passed ✓${NC}"
else
    echo -e "  ${RED}${ISSUES} issue(s) detected${NC}"
fi
echo "═══════════════════════════════════════"

exit $ISSUES
