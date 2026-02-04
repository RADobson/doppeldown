#!/bin/bash
# DoppelDown Competitive Intelligence: Website Monitor
# Tracks competitor website changes using screenshots and text extraction
# Usage: ./monitor-competitor-sites.sh [competitor-name]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="${SCRIPT_DIR}/../monitoring/data"
mkdir -p "${DATA_DIR}"

# Competitor URL mapping
COMPETITORS=(
    "zerofox:https://www.zerofox.com/"
    "brandshield:https://www.brandshield.com/"
    "netcraft:https://www.netcraft.com/"
    "redpoints:https://www.redpoints.com/"
    "bolster:https://bolster.ai/"
    "checkphish:https://checkphish.ai/"
    "doppel:https://doppel.com/"
    "phishfort:https://phishfort.com/"
    "allure:https://alluresecurity.com/"
    "memcyco:https://memcyco.com/"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check dependencies
check_deps() {
    local deps=("curl" "pandoc")
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            error "$dep is required but not installed."
            exit 1
        fi
    done
}

# Fetch and convert page to markdown
fetch_page() {
    local url="$1"
    local output_file="$2"
    
    log "Fetching $url..."
    
    # Fetch with headers to look like a browser
    curl -s -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" \
        -H "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" \
        -H "Accept-Language: en-US,en;q=0.5" \
        "$url" -o "${output_file}.html"
    
    # Convert to markdown for easier diffing
    if command -v pandoc &> /dev/null; then
        pandoc -f html -t markdown --wrap=none "${output_file}.html" > "${output_file}.md" 2>/dev/null || \
            cat "${output_file}.html" > "${output_file}.md"
    else
        cat "${output_file}.html" > "${output_file}.md"
    fi
    
    rm -f "${output_file}.html"
}

# Compare with previous version
detect_changes() {
    local name="$1"
    local current_file="$2"
    local prev_file="${current_file}.prev"
    local change_log="${DATA_DIR}/${name}-changes.log"
    
    if [[ -f "$prev_file" ]]; then
        local diff_output
        diff_output=$(diff -u "$prev_file" "$current_file" 2>/dev/null || true)
        
        if [[ -n "$diff_output" ]]; then
            warn "CHANGES DETECTED for $name!"
            
            # Log the change
            echo "=== $(date '+%Y-%m-%d %H:%M:%S') - $name ===" >> "$change_log"
            echo "$diff_output" | head -100 >> "$change_log"
            echo "" >> "$change_log"
            
            # Print summary
            local change_count
            change_count=$(echo "$diff_output" | grep -c "^[+-]" | head -1)
            echo -e "${RED}⚠️  $change_count lines changed${NC}"
            echo "$diff_output" | grep "^[+-]" | head -20
            
            return 0
        else
            log "No changes detected for $name"
            return 1
        fi
    else
        log "First run for $name - establishing baseline"
        return 1
    fi
}

# Monitor a single competitor
monitor_competitor() {
    local name="$1"
    local url="$2"
    local timestamp
    timestamp=$(date +%Y%m%d-%H%M%S)
    local current_file="${DATA_DIR}/${name}-${timestamp}.md"
    local prev_latest="${DATA_DIR}/${name}-latest.md"
    
    log "Monitoring $name at $url..."
    
    fetch_page "$url" "$current_file"
    
    # Check for changes against previous version
    if [[ -f "$prev_latest" ]]; then
        if detect_changes "$name" "$current_file"; then
            # Changes detected - update symlink to new version
            ln -sf "${name}-${timestamp}.md" "$prev_latest"
            
            # Keep only last 10 versions to save space
            ls -t "${DATA_DIR}/${name}-"*.md 2>/dev/null | tail -n +11 | xargs rm -f 2>/dev/null || true
        else
            # No changes - remove this version
            rm -f "$current_file"
        fi
    else
        # First run - establish baseline
        ln -sf "${name}-${timestamp}.md" "$prev_latest"
    fi
}

# Monitor pricing pages specifically
monitor_pricing_pages() {
    log "Checking pricing pages..."
    
    # Known pricing page URLs
    declare -A PRICING_URLS=(
        ["zerofox"]='https://www.zerofox.com/pricing'
        ["bolster"]='https://bolster.ai/pricing'
        ["checkphish"]='https://checkphish.ai/pricing'
        ["doppel"]='https://doppel.com/pricing'
        # Most competitors don't have pricing pages (contact sales)
    )
    
    for name in "${!PRICING_URLS[@]}"; do
        local url="${PRICING_URLS[$name]}"
        local timestamp
        timestamp=$(date +%Y%m%d-%H%M%S)
        local current_file="${DATA_DIR}/${name}-pricing-${timestamp}.md"
        local prev_file="${DATA_DIR}/${name}-pricing-latest.md"
        
        log "Checking pricing page for $name..."
        
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
            fetch_page "$url" "$current_file"
            
            if [[ -f "$prev_file" ]]; then
                if detect_changes "${name}-pricing" "$current_file"; then
                    ln -sf "${name}-pricing-${timestamp}.md" "$prev_file"
                else
                    rm -f "$current_file"
                fi
            else
                ln -sf "${name}-pricing-${timestamp}.md" "$prev_file"
            fi
        else
            warn "Pricing page not found or not accessible for $name (may be contact-sales only)"
        fi
    done
}

# Generate summary report
generate_report() {
    local report_file="${DATA_DIR}/weekly-report-$(date +%Y%m%d).md"
    
    log "Generating weekly report..."
    
    cat > "$report_file" << EOF
# Competitive Intelligence Weekly Report
*Generated: $(date '+%Y-%m-%d %H:%M:%S')*

## Summary

### Competitors Monitored: ${#COMPETITORS[@]}
EOF

    # Add detected changes
    local changes_found=false
    for entry in "${COMPETITORS[@]}"; do
        local name="${entry%%:*}"
        local change_log="${DATA_DIR}/${name}-changes.log"
        
        if [[ -f "$change_log" ]]; then
            # Check if changes in last 7 days
            if find "$change_log" -mtime -7 | grep -q .; then
                changes_found=true
                echo "" >> "$report_file"
                echo "### Changes: $name" >> "$report_file"
                tail -50 "$change_log" >> "$report_file"
            fi
        fi
    done
    
    if [[ "$changes_found" == false ]]; then
        echo "" >> "$report_file"
        echo "### No significant changes detected this week." >> "$report_file"
    fi
    
    echo "" >> "$report_file"
    echo "---" >> "$report_file"
    echo "*Report generated by DoppelDown CI system*" >> "$report_file"
    
    log "Report saved to: $report_file"
}

# Main execution
main() {
    log "Starting competitive intelligence monitoring..."
    
    check_deps
    
    # If specific competitor requested, only monitor that one
    if [[ -n "$1" ]]; then
        local found=false
        for entry in "${COMPETITORS[@]}"; do
            local name="${entry%%:*}"
            local url="${entry##*:}"
            
            if [[ "$name" == "$1" ]]; then
                monitor_competitor "$name" "$url"
                found=true
                break
            fi
        done
        
        if [[ "$found" == false ]]; then
            error "Competitor '$1' not found in list. Available:"
            for entry in "${COMPETITORS[@]}"; do
                echo "  - ${entry%%:*}"
            done
            exit 1
        fi
    else
        # Monitor all competitors
        for entry in "${COMPETITORS[@]}"; do
            local name="${entry%%:*}"
            local url="${entry##*:}"
            monitor_competitor "$name" "$url"
        done
        
        # Check pricing pages
        monitor_pricing_pages
        
        # Generate report if it's Monday
        if [[ $(date +%u) -eq 1 ]]; then
            generate_report
        fi
    fi
    
    log "Monitoring complete."
}

# Run main function
main "$@"
