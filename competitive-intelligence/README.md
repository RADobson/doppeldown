# DoppelDown Competitive Intelligence System

A comprehensive framework for monitoring competitors, tracking market trends, and informing strategic decisions.

---

## Quick Start

```bash
# Monitor all competitor websites for changes
cd competitive-intelligence/scripts
./monitor-competitor-sites.sh

# Monitor pricing pages specifically
./monitor-pricing-pages.sh

# Generate review collection template
./monitor-reviews.sh template
```

---

## System Overview

This competitive intelligence system provides:

1. **Competitor Profiles** — Deep-dive analysis of each major competitor
2. **Battle Cards** — Sales-ready competitive positioning documents
3. **Automated Monitoring** — Scripts to track competitor websites and pricing
4. **Feature Parity Matrix** — Complete feature comparison across all competitors
5. **Market Trend Radar** — Macro trends affecting the DRP market
6. **Win/Loss Tracking** — Analysis of sales outcomes
7. **Pricing Tracker** — Historical pricing data and change alerts

---

## Directory Structure

```
competitive-intelligence/
├── README.md                          # This file
├── competitor-profiles/               # Deep-dive competitor analysis
│   ├── zerofox.md                     # Tier 1: Most important
│   ├── doppel.md                      # Tier 1: Most important
│   ├── brandshield.md                 # Tier 1
│   ├── netcraft.md                    # Tier 1
│   ├── bolster-checkphish.md          # Tier 1
│   ├── red-points.md                  # Tier 1
│   ├── phishfort.md                   # Tier 2
│   ├── allure-security.md             # Tier 2
│   └── memcyco.md                     # Tier 2
├── battle-cards/                      # Sales competitive positioning
│   ├── TEMPLATE.md                    # Battle card template
│   ├── vs-enterprise-vendors.md       # Generic enterprise positioning
│   └── vs-diy-opensource.md           # DIY/open source positioning
├── analysis/                          # Strategic analysis documents
│   ├── feature-parity-matrix.md       # Complete feature comparison
│   └── market-trend-radar.md          # Macro trend analysis
├── tracking/                          # Ongoing tracking documents
│   ├── win-loss-log.md                # Sales win/loss analysis
│   └── pricing-tracker.md             # Historical pricing data
├── monitoring/                        # Monitoring outputs
│   ├── signal-log.md                  # Recent competitive signals
│   └── data/                          # Fetched data and alerts
└── scripts/                           # Automated monitoring
    ├── monitor-competitor-sites.sh    # Website change detection
    ├── monitor-pricing-pages.sh       # Pricing page monitoring
    └── monitor-reviews.sh             # Review tracking framework
```

---

## Monitoring Cadence

### Weekly (Every Monday ~1 hour)
- [ ] Run `monitor-competitor-sites.sh`
- [ ] Review any detected changes
- [ ] Scan competitor LinkedIn/Twitter for announcements
- [ ] Check Hacker News for DRP discussions
- [ ] Update battle cards if changes detected
- [ ] Add signals to `monitoring/signal-log.md`

### Monthly (First Friday ~2 hours)
- [ ] Deep-dive one Tier 1 competitor (rotate monthly)
- [ ] Update `analysis/feature-parity-matrix.md`
- [ ] Review and update `tracking/pricing-tracker.md`
- [ ] Check G2/Capterra reviews for new insights
- [ ] Scan for new market entrants
- [ ] Update `analysis/market-trend-radar.md`

### Quarterly (~1 day)
- [ ] Full competitive landscape refresh
- [ ] Update all competitor profiles
- [ ] Review win/loss patterns
- [ ] Strategic response planning
- [ ] Board-ready competitive brief

---

## Key Competitors by Priority

### 🔴 Tier 1 (Monitor Weekly)
| Competitor | Why It Matters | Monitoring Focus |
|-----------|---------------|------------------|
| **ZeroFox** | Market leader, massive brand | SMB moves, pricing, self-serve |
| **Doppel** | Similar name, AI-first, well-funded | Self-serve plans, funding, product |
| **BrandShield** | Strong enforcement, pharma vertical | Downmarket moves, integrations |
| **Netcraft** | Oldest player, fast takedowns | PE acquisition impact, pricing |
| **Bolster/CheckPhish** | Only other PLG motion | CheckPhish evolution, pricing page |
| **Red Points** | Well-funded, marketplace focus | Self-serve, feature expansion |

### 🟡 Tier 2 (Monitor Monthly)
- PhishFort, Allure Security, Memcyco

### 🟢 Watch List (Monitor Quarterly)
- Cloudflare (if they add brand monitoring)
- Big Tech (Microsoft, Google, AWS security suites)
- New YC/startup entrants

---

## Critical Signals to Watch For

### 🔴 Red Alert Signals
- Any Tier 1 competitor launches **self-serve signup**
- Any Tier 1 competitor publishes **transparent pricing**
- Any Tier 1 competitor drops below **$500/mo** entry price
- Any Tier 1 competitor launches a **free tier**
- **Doppel** specifically (similar name, well-funded)
- **CheckPhish** adds monitoring/moves upmarket

### 🟡 Yellow Alert Signals
- Funding announcements >$20M
- Major feature launches (AI, takedowns, integrations)
- Key hires (growth, PLG, SMB sales)
- Content campaigns comparing to competitors
- Conference sponsorships (RSA, Black Hat)

---

## Using the Battle Cards

When in a competitive sales situation:

1. **Identify the competitor** — Which one are they evaluating?
2. **Read the battle card** — Know their strengths and weaknesses
3. **Ask trap questions** — Questions that highlight DoppelDown's advantages
4. **Be honest** — Don't oversell or misrepresent competitors
5. **Focus on fit** — Not every customer is right for DoppelDown

### Key Differentiators to Emphasize

vs. **Enterprise vendors** (ZeroFox, BrandShield, Netcraft):
- 10-25x cheaper
- Self-serve, instant setup
- Transparent pricing
- Free tier
- Modern UX

vs. **DIY/Open source**:
- AI analysis (not possible with scripts)
- Continuous monitoring
- No maintenance burden
- Evidence collection & reports
- Faster time-to-value

---

## Updating the System

### Adding a New Competitor

1. Create `competitor-profiles/[name].md` using the template
2. Add to `monitor-competitor-sites.sh` URL list
3. Update `feature-parity-matrix.md`
4. Create battle card if they become a frequent competitor

### Updating After a Signal

1. Update the relevant competitor profile
2. Update affected battle cards
3. Log the signal in `monitoring/signal-log.md`
4. If critical signal, trigger strategic response playbook

---

## Strategic Response Playbooks

See the main `COMPETITIVE_INTELLIGENCE_SYSTEM.md` for detailed playbooks:

- **Playbook A**: Competitor launches self-serve pricing
- **Playbook B**: Well-funded competitor enters SMB market
- **Playbook C**: Major platform adds brand monitoring
- **Playbook D**: Competitor has security breach or PR crisis
- **Playbook E**: Open-source tool threatens substitution

---

## Integration with Product Roadmap

The CI system directly informs product prioritization:

1. **Feature gaps** identified in parity matrix → Product backlog
2. **Customer requests** from win/loss analysis → Product backlog
3. **Competitor moves** → Strategic pivots or accelerations
4. **Market trends** → Long-term roadmap planning

---

## Maintenance

- **Weekly**: Review automated monitoring results
- **Monthly**: Update tracking documents
- **Quarterly**: Full system audit and refresh
- **Annually**: Rebuild market map, review CI strategy

---

## Questions?

This system is designed for a lean, bootstrapped team. If something feels like overkill, it probably is. Focus on:
1. Knowing what competitors are doing (monitoring)
2. Winning competitive deals (battle cards)
3. Staying ahead of market trends (analysis)

Everything else is optional.

---

*Last updated: 2026-02-05*
