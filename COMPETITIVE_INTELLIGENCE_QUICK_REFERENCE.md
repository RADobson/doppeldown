# DoppelDown Competitive Intelligence: Quick Reference
*One-page summary for Richard*

---

## What This Is

A lightweight system to track what competitors are doing so DoppelDown stays ahead. Not overkill — just what's needed for a bootstrapped founder.

---

## Your Weekly CI Routine (15 minutes every Monday)

```bash
cd competitive-intelligence/scripts
./monitor-competitor-sites.sh
./monitor-pricing-pages.sh
```

Then:
1. Check if any alerts were generated
2. Scan competitor LinkedIn/Twitter for announcements
3. Note anything significant in `monitoring/signal-log.md`

---

## Who to Watch Most Closely

| Priority | Competitor | Why | What to Watch |
|----------|-----------|-----|---------------|
| 🔴 **CRITICAL** | **Doppel** | Same name, AI-first, well-funded by a16z | Self-serve launch, pricing page, new features |
| 🔴 **CRITICAL** | **ZeroFox** | Market leader, massive brand | Any SMB move, pricing changes |
| 🔴 **CRITICAL** | **CheckPhish** | Only other company with free tools | Evolution toward full platform |
| 🟡 **WATCH** | **Netcraft** | Fast takedowns, just PE-acquired | Growth moves, pricing changes |
| 🟡 **WATCH** | **BrandShield** | Strong enforcement | Downmarket moves |
| 🟢 **MONITOR** | Others | Less direct threat | Monthly check-in |

---

## Critical Signals (Alert Immediately If You See These)

1. 🚨 **Any competitor launches self-serve signup**
2. 🚨 **Any competitor publishes transparent pricing**
3. 🚨 **Any competitor drops below $500/mo**
4. 🚨 **Doppel launches free tier or self-serve**
5. 🚨 **Well-funded new entrant ($20M+) enters market**
6. 🚨 **Cloudflare/Microsoft/Google adds brand monitoring**

**What to do**: Update the battle card, log in signal-log.md, and consider strategic response (see main CI doc for playbooks).

---

## Battle Cards (When You're in a Competitive Deal)

| If prospect is considering... | Read this battle card |
|------------------------------|----------------------|
| Any enterprise vendor (ZeroFox, BrandShield, Netcraft) | `battle-cards/vs-enterprise-vendors.md` |
| Building their own solution / using dnstwist | `battle-cards/vs-diy-opensource.md` |
| Multiple competitors | Start with vs-enterprise-vendors (covers most) |

**Key messages**:
- vs. Enterprise: "Same AI, 1/25th the cost, no sales calls"
- vs. DIY: "You can build it, but your time is worth more than $79/mo"

---

## Key Documents

| Document | What's In It | When to Use It |
|----------|-------------|----------------|
| `COMPETITIVE_INTELLIGENCE_SYSTEM.md` | Full framework and strategy | Quarterly review, strategic planning |
| `competitive-intelligence/README.md` | System overview | Getting oriented |
| `competitor-profiles/[name].md` | Deep competitor analysis | Before a competitive sales call |
| `battle-cards/vs-*.md` | Sales positioning | During competitive sales process |
| `analysis/feature-parity-matrix.md` | What features we have vs. competitors | Product roadmap planning |
| `analysis/market-trend-radar.md` | Macro trends | Long-term strategy |
| `tracking/win-loss-log.md` | Sales outcomes | After every sales conversation |
| `tracking/pricing-tracker.md` | Pricing history | Pricing decisions |
| `monitoring/signal-log.md` | Recent competitive moves | Weekly review |

---

## In a Sales Conversation: Ask These Questions

These highlight DoppelDown's advantages:

1. **"Can you show me their pricing on their website?"** (They can't — it's hidden)
2. **"How quickly can you see your first threat results?"** (DoppelDown: 5 minutes. Them: weeks.)
3. **"Do they offer a free tier to test first?"** (We do, they don't.)
4. **"What's their minimum annual commitment?"** (Us: $0. Them: $24K-$60K.)
5. **"How many brands can you monitor for $5,000/month?"** (Us: 10+ months of Enterprise. Them: one month.)

---

## Where We Win (Lead with These)

| Our Advantage | Proof Point |
|--------------|-------------|
| **Price** | 10-25x cheaper than enterprise vendors |
| **Speed** | 5 minutes to first results vs. weeks |
| **Transparency** | Published pricing vs. "contact sales" |
| **Free tier** | Start for $0 vs. $24K minimum |
| **AI-first** | Modern architecture vs. legacy bolt-ons |
| **No lock-in** | Month-to-month vs. 12-36 month contracts |

## Where We Lag (Know These Gaps)

| Our Gap | Competitor Advantage | How to Handle |
|---------|---------------------|---------------|
| **No automated takedowns** | They execute takedowns for customers | "Our reports give you everything to do it yourself" |
| **No dark web monitoring** | Some include this | "On our roadmap — not critical for most SMBs" |
| **No SOC 2 (yet)** | Enterprise certified | "In progress — full documentation available" |
| **No marketplace monitoring** | Some specialize here | "Different focus — we're domain/social specialists" |

---

## Monthly Deep-Dive Schedule

| Month | Competitor to Deep-Dive |
|-------|------------------------|
| Jan | Doppel |
| Feb | ZeroFox |
| Mar | BrandShield |
| Apr | Netcraft |
| May | Bolster/CheckPhish |
| Jun | Red Points |
| Jul | Doppel (repeat) |
| Aug | ZeroFox (repeat) |
| Sep | New entrant scan |
| Oct | BrandShield (repeat) |
| Nov | All profiles refresh |
| Dec | System audit |

---

## One Thing to Remember

> **"The best competitive advantage isn't being better at everything — it's being dramatically better at the thing that matters most to the customer in front of you."**

DoppelDown's superpower: **Enterprise-grade AI brand protection at SMB prices with instant self-serve setup.**

Everything else is secondary.

---

## Need More Detail?

- Full framework: `COMPETITIVE_INTELLIGENCE_SYSTEM.md`
- All competitor profiles: `competitive-intelligence/competitor-profiles/`
- All battle cards: `competitive-intelligence/battle-cards/`
- Run monitoring: `cd competitive-intelligence/scripts && ./monitor-competitor-sites.sh`

---

*Keep this handy during sales calls. Update battle cards after every competitive deal. Stay sharp.*
