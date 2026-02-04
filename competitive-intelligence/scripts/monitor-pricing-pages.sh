#!/bin/bash
# DoppelDown Competitive Intelligence: Pricing Page Monitor
# Specifically tracks pricing page changes — the most critical competitive signal

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="${SCRIPT_DIR}/../monitoring/data"
ALERTS_FILE="${SCRIPT_DIR}/../monitoring/pricing-alerts.log"
mkdir -p "${DATA_DIR}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() { echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"; }
alert() { echo -e "${RED}[ALERT]${NC} $1"; }
info() { echo -e "${BLUE}[INFO]${NC} $1"; }

# Track competitor pricing signals
declare -A COMPETITOR_URLS=(
    ["zerofox_pricing"]='https://www.zerofox.com/pricing'
    ["zerofox_plans"]='https://www.zerofox.com/platform'
    ["brandshield_solutions"]='https://www.brandshield.com/solutions'
    ["netcraft_cybercrime"]='https://www.netcraft.com/cybercrime/'
    ["bolster"]='https://bolster.ai/'
    ["checkphish"]='https://checkphish.ai/'
    ["redpoints_pricing"]='https://www.redpoints.com/solutions/brand-protection-software/pricing/'
    ["doppel"]='https://doppel.com/'
    ["phishfort"]='https://phishfort.com/'
    ["allure"]='https://alluresecurity.com/'
    ["memcyco"]='https://memcyco.com/'
)

# Keywords to watch for (signals of self-serve or pricing changes)
SIGNAL_KEYWORDS=(
    "pricing"
    "plans"
    "self-serve"
    "free tier"
    "free plan"
    "start free"
    "sign up"
    "$"
    "month"
    "annual"
    "contact sales"
    "request demo"
    "get started"
    "SMB"
    "small business"
    "startup"
)

# Extract pricing-related text
extract_pricing_signals() {
    local file="$1"
    local signals=""
    
    for keyword in "${SIGNAL_KEYWORDS[@]}"; do
        if grep -i "$keyword" "$file" > /dev/null 2>&1; then
            signals+="$keyword "
        fi
    done
    
    echo "$signals"
}

# Check if pricing-related content changed
check_pricing_changes() {
    local name="$1"
    local current_file="$2"
    local prev_file="${current_file}.prev"
    
    if [[ ! -f "$prev_file" ]]; then
        info "First run for $name — establishing baseline"
        return
    fi
    
    # Extract pricing signals from both versions
    local current_signals
    local prev_signals
    current_signals=$(extract_pricing_signals "$current_file")
    prev_signals=$(extract_pricing_signals "$prev_file")
    
    # Check for significant content changes
    local diff_output
    diff_output=$(diff -u "$prev_file" "$current_file" 2>/dev/null | grep -E "^\+.*(price|plan|\$|month|annual|free|tier)" -i | head -20 || true)
    
    if [[ -n "$diff_output" ]]; then
        alert "🚨 PRICING-RELATED CHANGE DETECTED: $name"
        echo "$diff_output"
        
        # Log the alert
        echo "$(date '+%Y-%m-%d %H:%M:%S') - PRICING SIGNAL: $name" >> "$ALERTS_FILE"
        echo "$diff_output" >> "$ALERTS_FILE"
        echo "" >> "$ALERTS_FILE"
        
        # Create detailed alert
        cat > "${DATA_DIR}/ALERT-${name}-$(date +%Y%m%d-%H%M%S).txt" << EOF
PRICING CHANGE ALERT: $name
Detected: $(date '+%Y-%m-%d %H:%M:%S')
URL: ${COMPETITOR_URLS[$name]}

Changes detected:
$diff_output

ACTION REQUIRED:
1. Visit ${COMPETITOR_URLS[$name]} to verify
2. Update battle card if pricing changed
3. Consider strategic response
4. Update pricing tracker document
EOF
    else
        info "No pricing signals changed for $name"
    fi
}

# Main monitoring function
main() {
    log "Starting pricing page monitoring..."
    
    for name in "${!COMPETITOR_URLS[@]}"; do
        local url="${COMPETITOR_URLS[$name]}"
        local timestamp
        timestamp=$(date +%Y%m%d-%H%M%S)
        local current_file="${DATA_DIR}/${name}-${timestamp}.html"
        local latest_file="${DATA_DIR}/${name}-latest.html"
        
        log "Checking: $name"
        
        # Fetch page
        if curl -s -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)" \
            -o "$current_file" "$url" 2>/dev/null; then
            
            # Convert to text for easier comparison
            if command -v lynx &> /dev/null; then
                lynx -dump "$current_file" > "${current_file}.txt" 2>/dev/null || \
                    cat "$current_file" > "${current_file}.txt"
            else
                # Simple HTML tag stripping if lynx not available
                sed 's/<[^>]*>//g' "$current_file" > "${current_file}.txt" 2>/dev/null || \
                    cat "$current_file" > "${current_file}.txt"
            fi
            
            # Check for changes
            if [[ -f "${latest_file}.txt" ]]; then
                check_pricing_changes "$name" "${current_file}.txt"
            fi
            
            # Update latest file
            cp "${current_file}.txt" "${latest_file}.txt"
            cp "$current_file" "$latest_file"
            
            # Cleanup old files (keep last 5)
            ls -t "${DATA_DIR}/${name}-"*.html 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
            ls -t "${DATA_DIR}/${name}-"*.txt 2>/dev/null | tail -n +6 | xargs rm -f 2>/dev/null || true
            
        else
            warn "Failed to fetch $url"
        fi
    done
    
    log "Pricing monitoring complete."
    
    # Summary
    local alert_count
    alert_count=$(find "${DATA_DIR}" -name "ALERT-*" -mtime -1 2>/dev/null | wc -l)
    
    if [[ $alert_count -gt 0 ]]; then
        alert "$alert_count pricing alerts in the last 24 hours!"
        alert "Check ${DATA_DIR}/ALERT-* files for details."
    else
        info "No pricing alerts in this run."
    fi
}

main "$@"
