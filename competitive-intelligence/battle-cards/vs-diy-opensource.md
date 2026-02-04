# Battle Card: DoppelDown vs. DIY / Open Source
*Last updated: 2026-02-05 | Confidence: High*
*Use this card when prospects mention using dnstwist, manual monitoring, or considering building in-house*

---

## The Situation

The prospect is either:
1. **Currently doing manual monitoring** — Google Alerts, occasional WHOIS checks
2. **Using open-source tools** — dnstwist, urlscan.io, etc.
3. **Considering building in-house** — "We could just script this ourselves"

This is actually a **high-conviction prospect** — they understand the problem and are actively trying to solve it. They're just evaluating if DIY is sufficient.

## Their Pitch (Internal/Passive)
> "We can monitor this ourselves with [dnstwist / Google Alerts / some scripts]. It's free, and we have technical people who can set this up. Why pay for something we can do ourselves?"

## Our Counter-Pitch
> "You're absolutely right that you *can* detect threats manually or with open-source tools. The question is: should you? DoppelDown doesn't just detect — we analyze with AI, collect evidence, generate takedown-ready reports, and alert you in real-time. A DIY approach catches maybe 30% of threats and takes 10x the time. Your team's time is worth more than the $79/month we'd cost."

---

## The Math: DIY vs. DoppelDown

### Option A: DIY / Open Source

| Activity | Time Required | Cost (at $75/hr) |
|----------|--------------|------------------|
| Set up dnstwist | 4 hours | $300 |
| Customize for your brand | 8 hours | $600 |
| Build alerting pipeline | 16 hours | $1,200 |
| Maintain scripts (monthly) | 4 hours | $300 |
| Run weekly scans | 2 hours | $150 |
| Analyze results manually | 4 hours | $300 |
| Collect evidence (screenshots, WHOIS) | 3 hours | $225 |
| Generate reports | 2 hours | $150 |
| **Monthly Total** | **~15 hours** | **~$1,125/month** |
| **Plus opportunity cost** | 15 hours not spent on core business | — |

### Option B: DoppelDown Growth ($79/mo)

| Activity | Time Required | Cost |
|----------|--------------|------|
| Sign up | 2 minutes | $0 |
| Add your brand | 3 minutes | $0 |
| AI runs continuously | 0 hours | Included |
| Review alerts | 15 minutes/week | Included |
| Download takedown reports | 5 minutes | Included |
| **Monthly Total** | **~1 hour** | **$79/month** |

### The ROI
> **DIY costs $1,125/month in labor. DoppelDown costs $79/month. Even if your time is only worth $50/hr, DIY costs $750/month — still 10x more expensive.**

---

## DIY Limitations vs. DoppelDown

| Capability | DIY/Open Source | DoppelDown |
|-----------|-----------------|------------|
| **Continuous monitoring** | ❌ Scripts run when you remember | ✅ 24/7 automated scanning |
| **AI analysis** | ❌ Manual review of every result | ✅ AI scores every threat |
| **Visual similarity** | ❌ Open source can't do this | ✅ AI vision analyzes screenshots |
| **Phishing intent detection** | ❌ Manual guesswork | ✅ AI classifies phishing risk |
| **Evidence collection** | ❌ Manual screenshots, WHOIS lookups | ✅ Automatic, stored forever |
| **Takedown reports** | ❌ You build these yourself | ✅ One-click PDF reports |
| **Alert fatigue management** | ❌ You get everything | ✅ Severity-filtered, smart alerts |
| **Scale** | ❌ Scripts break at 10+ domains | ✅ Handles unlimited brands |
| **Maintenance** | ❌ Your responsibility | ✅ We handle everything |
| **Updates** | ❌ You track new TLDs, techniques | ✅ Always current |

---

## Objection Handling

| Prospect Says | You Say |
|---|---|
| **"We already use dnstwist"** | "Great tool! What happens when it finds 200 typosquats for your brand? DoppelDown adds AI that scores each one — which are actually registered, which have content, which look like phishing. dnstwist generates noise; we filter it to signal." |
| **"My developer can script this in a weekend"** | "They probably can — for basic domain permutation. But what about social media monitoring? Visual AI analysis? Evidence archival? Takedown report generation? A weekend project becomes a maintenance burden. Your developer's time is better spent on your product." |
| **"We have Google Alerts set up"** | "Google Alerts catch mentions, not impersonations. A phishing site can steal from your customers for weeks before anyone mentions it online. We catch the domain the day it's registered." |
| **"What if we just use urlscan.io?"** | "urlscan is great for one-off URL checks. But it's not monitoring — you have to know what to check. We find threats you don't know exist yet." |
| **"We can't justify the budget"** | "At $79/month, that's less than one hour of developer time. Or think of it this way: one successful phishing attack costs an average of $50K in customer trust, fraud liability, and remediation. Would you spend $79 to prevent a $50K problem?" |
| **"We tried DIY and it didn't work well"** | "Exactly — this is why we exist. Most teams start DIY, realize it's a time sink with blind spots, and switch to managed solutions. You're ahead of the curve by recognizing this early." |
| **"We want to own our data"** | "You do — we store evidence and reports, but you can export everything anytime. Our data retention matches your plan tier, and you own the output." |
| **"What about false positives?"** | "AI reduces false positives dramatically. A raw dnstwist list might have 200 domains; AI analysis typically narrows that to 10-20 genuine threats. You spend time on real risks, not noise." |

---

## Honest Assessment: When DIY Makes Sense

**DIY is actually the right choice if:**
- You have a dedicated security team with bandwidth for maintenance
- Your brand monitoring needs are minimal (1-2 brands, low risk)
- You have specific compliance requirements that off-the-shelf tools don't meet
- You enjoy building and maintaining infrastructure (some do!)
- You have zero budget and time is truly free

**DoppelDown is the right choice if:**
- Your team's time has value
- You want comprehensive coverage without building it
- You need AI analysis that open source can't provide
- You want it to "just work" without ongoing maintenance
- You're growing and need something that scales

---

## The "Weekend Project" Trap

```
Week 1: "I'll build this in a weekend"
Week 2: "Just need to add alerting"
Week 3: "The WHOIS API changed, need to update"
Week 4: "What about visual similarity?"
Month 2: "This is taking more time than expected"
Month 3: "Maybe we should just use a service"
Month 6: *Phishing attack happens, DIY system missed it*
```

> **"The best code is the code you don't have to write."**

---

## Questions to Ask

1. **"How many hours per month are you currently spending on brand monitoring?"** → Calculate their actual cost.
2. **"What happens when you're on vacation?"** → DIY has no coverage when you're away.
3. **"How confident are you that your current approach catches everything?"** → Usually they're unsure.
4. **"What's your team's hourly rate?"** → Frame the ROI.
5. **"Have you had any phishing incidents recently?"** → If yes, DIY failed. If no, might just be lucky.

---

## Positioning: Complementary, Not Competitive

Some prospects will use both:
- **DoppelDown** for continuous monitoring, AI analysis, and alerting
- **DIY scripts** for one-off investigations or specific custom checks

This is fine. Position DoppelDown as the foundation that handles 90% of the work, with DIY as the occasional supplement.

---

## Key Message

> "You absolutely *can* build this yourself. The question is: is that the best use of your team's time? DoppelDown costs less than 2 hours of developer time per month. We'll give you results in 5 minutes that would take weeks to build yourself — and they'll be better because we have AI and years of refinement. Focus on building your business. Let us handle brand protection."

---

*DIY prospects are often the best converts because they already understand the problem. Don't argue — empathize, show the math, and let them realize the value.*
