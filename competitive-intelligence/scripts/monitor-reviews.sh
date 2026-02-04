#!/bin/bash
# DoppelDown Competitive Intelligence: Review Monitor
# Tracks G2, Capterra, and TrustRadius reviews for competitor insights

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="${SCRIPT_DIR}/../monitoring/data"
mkdir -p "${DATA_DIR}"

log() { echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"; }

# Known review page URLs (manual monitoring - these change frequently)
declare -A REVIEW_URLS=(
    ["zerofox_g2"]='https://www.g2.com/products/zerofox/reviews'
    ["zerofox_capterra"]='https://www.capterra.com/p/178010/ZeroFox/'
    ["brandshield_g2"]='https://www.g2.com/products/brandshield/reviews'
    ["redpoints_g2"]='https://www.g2.com/products/red-points/reviews'
    ["checkphish_g2"]='https://www.g2.com/products/checkphish/reviews'
)

# Since scraping review sites is difficult (anti-bot), this script provides
# a framework for manual review collection

generate_review_template() {
    local month_year
    month_year=$(date +%Y-%m)
    
    cat > "${DATA_DIR}/review-collection-${month_year}.md" << 'EOF'
# Competitor Review Analysis
*Collection Month: REPLACE_WITH_CURRENT_MONTH*

## How to Use This Template

1. Visit the review sites listed below
2. Read recent reviews (last 30 days)
3. Note patterns in pros, cons, and feature requests
4. Update this document with insights

## Review Sources

### G2 Reviews
- ZeroFox: https://www.g2.com/products/zerofox/reviews
- BrandShield: https://www.g2.com/products/brandshield/reviews
- Red Points: https://www.g2.com/products/red-points/reviews
- CheckPhish: https://www.g2.com/products/checkphish/reviews

### Capterra Reviews
- ZeroFox: https://www.capterra.com/p/178010/ZeroFox/

### TrustRadius
- Search: "brand protection" or specific product names

## Review Analysis Template

### ZeroFox
| Aspect | Recent Themes | DoppelDown Opportunity |
|--------|---------------|------------------------|
| **Top Pros** | | |
| **Top Cons** | | |
| **Feature Requests** | | |
| **Pricing Complaints** | | |
| **Support Feedback** | | |

### BrandShield
| Aspect | Recent Themes | DoppelDown Opportunity |
|--------|---------------|------------------------|
| **Top Pros** | | |
| **Top Cons** | | |
| **Feature Requests** | | |
| **Pricing Complaints** | | |
| **Support Feedback** | | |

### Other Competitors
[Repeat pattern for other tracked competitors]

## Cross-Competitor Insights

### Common Complaints
- 

### Unmet Needs
- 

### Pricing Sensitivity Patterns
- 

## Action Items
- [ ] 

EOF

    log "Review collection template created: ${DATA_DIR}/review-collection-${month_year}.md"
}

# Generate summary from collected data
generate_insights() {
    log "Generating insights from review data..."
    
    cat > "${DATA_DIR}/review-insights-$(date +%Y%m).md" << EOF
# Review Insights Summary
*Generated: $(date '+%Y-%m-%d')*

## Key Findings from Competitor Reviews

[Populate this after manual review collection]

## Customer Pain Points (Opportunities for DoppelDown)

1. 
2. 
3. 

## Feature Gaps in Competitor Products

1. 
2. 
3. 

## Pricing Insights

- 

## Recommended Actions

- [ ] 

EOF

    log "Insights template created."
}

main() {
    case "${1:-template}" in
        template)
            generate_review_template
            ;;
        insights)
            generate_insights
            ;;
        *)
            echo "Usage: $0 [template|insights]"
            echo "  template - Generate a review collection template"
            echo "  insights - Generate an insights summary template"
            exit 1
            ;;
    esac
}

main "$@"
