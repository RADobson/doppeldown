# DoppelDown: User Research & Feedback Strategy
*Version 1.0 | Prepared: 2026-02-05*
*Companion document to: CUSTOMER_ACQUISITION_GROWTH_STRATEGY.md, LAUNCH_PLAN.md, OPERATIONAL_READINESS.md*

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Research Philosophy & Principles](#2-research-philosophy--principles)
3. [Research Lifecycle Framework](#3-research-lifecycle-framework)
4. [Method 1: User Interviews](#4-method-1-user-interviews)
5. [Method 2: Surveys & Micro-Surveys](#5-method-2-surveys--micro-surveys)
6. [Method 3: Usability Testing](#6-method-3-usability-testing)
7. [Method 4: Behavioral Analytics](#7-method-4-behavioral-analytics)
8. [Method 5: Customer Feedback Loops](#8-method-5-customer-feedback-loops)
9. [Method 6: Competitive & Market Intelligence](#9-method-6-competitive--market-intelligence)
10. [Synthesis & Insight Repository](#10-synthesis--insight-repository)
11. [From Insight to Action: The Decision Framework](#11-from-insight-to-action-the-decision-framework)
12. [Metrics & Measurement](#12-metrics--measurement)
13. [Tooling & Infrastructure](#13-tooling--infrastructure)
14. [Team & Responsibilities](#14-team--responsibilities)
15. [Quarterly Research Roadmap](#15-quarterly-research-roadmap)
16. [Budget & Resource Planning](#16-budget--resource-planning)
17. [Templates & Scripts](#17-templates--scripts)
18. [Appendix: Quick-Start Checklist](#18-appendix-quick-start-checklist)

---

## 1. Executive Summary

### Why This Matters

DoppelDown occupies a unique market position: the **only self-serve, transparent-pricing brand protection tool** for SMBs. That positioning was derived from competitive analysis, not from validated user behavior. Before scaling acquisition (content, ads, partnerships), DoppelDown needs a systematic mechanism to:

1. **Validate assumptions** about what SMBs actually need (not what we think they need)
2. **Discover unmet needs** that neither DoppelDown nor competitors are addressing
3. **Optimize the product experience** from first scan to paid conversion
4. **Build a feedback-driven culture** where every product decision traces back to evidence
5. **Reduce churn** by identifying friction and dissatisfaction before customers leave

### The Core Insight Loop

```
         ┌─────────────────────────────────────────────┐
         │                                             │
         ▼                                             │
    ┌─────────┐     ┌──────────┐     ┌──────────┐     │
    │ OBSERVE │────▶│ ANALYZE  │────▶│  DECIDE  │     │
    │         │     │          │     │          │     │
    │Interview│     │Synthesize│     │Prioritize│     │
    │Survey   │     │Pattern   │     │Ship or   │     │
    │Analytics│     │match     │     │park      │     │
    │Test     │     │Quantify  │     │          │     │
    └─────────┘     └──────────┘     └────┬─────┘     │
                                          │           │
                                          ▼           │
                                    ┌──────────┐      │
                                    │   ACT    │      │
                                    │          │      │
                                    │Build     │──────┘
                                    │Ship      │ (measure impact,
                                    │Iterate   │  loop back)
                                    └──────────┘
```

### What This Strategy Delivers

| Outcome | How We Get There | Timeline |
|---------|------------------|----------|
| Validated product-market fit signal | Founder interviews + conversion analytics | Months 1-3 |
| Optimized signup → first scan → "aha" flow | Usability testing + funnel analytics | Months 2-4 |
| Data-backed feature prioritization | Insight repository + scoring framework | Ongoing from Month 1 |
| Early churn warning system | In-app feedback + behavioral triggers | Months 3-6 |
| NPS baseline and trajectory | Quarterly NPS survey | From Month 3 |
| Persona validation/refinement | Interview program + segmented analytics | Months 1-6 |

---

## 2. Research Philosophy & Principles

### Guiding Principles

**1. Talk to Users Before Building Features**
No feature ships without evidence of demand. "A customer asked for it" is anecdotal. "7 of our 12 interviewed customers independently described this pain point" is evidence.

**2. Quantify What You Observe**
Qualitative research (interviews, usability tests) reveals *what* and *why*. Quantitative research (analytics, surveys) reveals *how many* and *how often*. Both are necessary; neither is sufficient alone.

**3. Continuous Over Campaign-Based**
Research is not a one-time project. It's a continuous input to product development. Every week should produce at least one user insight.

**4. Be Skeptical of Feature Requests**
Users describe problems in terms of solutions ("I want an export button"). The researcher's job is to uncover the underlying need ("I need to share threat data with my IT vendor"). The solution to the real need may be completely different from the feature request.

**5. Bias Toward Speed and Scrappiness**
A 20-minute Zoom call with a customer teaches more than a 6-week research project. Start rough, refine later. Perfect research methodologies are the enemy of timely insights.

**6. Close the Loop — Always**
Users who give feedback must see that feedback acted upon. This is the single highest-leverage retention and advocacy behavior. "You told us X was frustrating. We fixed it. Here's what changed." This email is worth more than any marketing campaign.

### Research Maturity Model

DoppelDown is at Stage 0-1. This strategy designs for progressive maturity:

```
STAGE 0: Ad Hoc                    ← Current state
├── No systematic research
├── Feedback via email/chat only
└── Decisions based on assumption

STAGE 1: Foundational              ← Target by Month 3
├── Regular user interviews (2-4/month)
├── Basic analytics instrumented
├── In-app feedback widget
└── Monthly insight synthesis

STAGE 2: Structured                ← Target by Month 6
├── Quarterly NPS + CSAT surveys
├── Usability testing on major features
├── Behavioral analytics with funnels + cohorts
├── Insight repository with tagging
└── Feature prioritization uses research data

STAGE 3: Integrated                ← Target by Month 12
├── Research informs every sprint
├── Automated feedback triggers
├── Churn prediction from behavioral signals
├── Closed-loop feedback system
├── Customer advisory board active
└── Research-driven product roadmap
```

---

## 3. Research Lifecycle Framework

### The Double Diamond Applied to DoppelDown

Each research question follows a structured lifecycle:

```
PHASE 1: DISCOVER          PHASE 2: DEFINE           PHASE 3: DEVELOP          PHASE 4: DELIVER
(Diverge)                  (Converge)                (Diverge)                 (Converge)

"What's happening?"        "What matters most?"      "What could we do?"       "What will we ship?"

• User interviews          • Insight synthesis        • Solution ideation       • A/B testing
• Behavioral data          • Affinity mapping         • Prototype/mockup        • Staged rollout
• Support ticket mining    • Prioritization matrix    • Concept testing         • Impact measurement
• Competitive intel        • Opportunity scoring      • Usability testing       • Feedback collection
• Survey exploration       • Research brief           • Technical feasibility   • Iteration
```

### Research Cadence Calendar

| Frequency | Activity | Owner | Output |
|-----------|----------|-------|--------|
| **Weekly** | 1-2 user conversations (interview, call, or test) | Founder | Raw notes → insight repo |
| **Weekly** | Analytics review (funnels, retention, feature usage) | Founder/Eng | Dashboard snapshot |
| **Bi-weekly** | Support ticket & feedback review | Founder | Themed summaries |
| **Monthly** | Insight synthesis meeting (review all inputs) | Founder | Monthly research brief |
| **Quarterly** | NPS survey + trend analysis | Founder | NPS report + action plan |
| **Quarterly** | Comprehensive usability test (major flows) | Founder | Usability findings report |
| **Bi-annually** | Persona review and refresh | Founder | Updated personas |
| **Annually** | Strategic research project (market study, new segment) | Founder | Strategic research report |

---

## 4. Method 1: User Interviews

### Why Interviews Are the Highest-Priority Method

For a pre-PMF/early-PMF product like DoppelDown, nothing replaces direct conversation with users. Analytics tell you *what* happened; interviews tell you *why* — and what users wish would happen instead.

### Interview Program Design

#### A. Discovery Interviews (Pre-Launch & Ongoing)

**Purpose:** Validate assumptions about target personas, understand the problem space, discover unmet needs.

**Who to Interview:**

| Segment | Target Per Quarter | Recruitment Channel |
|---------|-------------------|---------------------|
| SMB owners who've experienced brand impersonation | 4-6 | LinkedIn, Reddit, referrals |
| MSP/MSSP owners or service managers | 3-5 | Richard's network, r/msp, LinkedIn |
| Marketing/brand managers | 3-4 | LinkedIn, marketing communities |
| E-commerce brand operators | 2-3 | Shopify communities, LinkedIn |
| People who evaluated but didn't buy a competitor | 2-3 | LinkedIn, G2 review authors |

**Interview Structure (45-60 minutes):**

```
1. WARM-UP (5 min)
   "Tell me about your business and your role."
   
2. PROBLEM EXPLORATION (15 min)
   "Have you ever had someone impersonate your brand?"
   "How did you find out?"
   "What did you do about it?"
   "What was the business impact?"
   "How do you currently monitor for brand threats?"
   
3. SOLUTION EXPLORATION (10 min)
   "Have you looked into brand protection tools?"
   "What did you find? What put you off?"
   "What would the ideal solution look like for you?"
   "How would you measure if it was working?"
   
4. PRICING & VALUE (10 min)
   "What would you expect to pay for this?"
   "How do you currently budget for security/brand tools?"
   "At what price does this become an obvious yes?"
   "At what price does this become too expensive to consider?"
   
5. PRODUCT WALKTHROUGH (if appropriate) (10 min)
   Show DoppelDown, observe reactions
   "What stands out to you?"
   "What's confusing?"
   "Would you sign up right now? Why/why not?"
   
6. WRAP-UP (5 min)
   "Anything else about brand protection I should have asked?"
   "Can I follow up in a few weeks?"
   "Would you recommend anyone else I should talk to?" (snowball)
```

**Critical Rules for Discovery Interviews:**
- Never pitch during an interview. You are there to listen.
- Ask about past behavior, not hypothetical futures ("What did you do?" not "Would you do X?")
- Follow the energy — if someone gets animated about a topic, explore it
- Record and transcribe (with permission) — tools like Otter.ai or Grain
- Send a thank-you + summary within 24 hours

#### B. Customer Interviews (Post-Signup)

**Purpose:** Understand why people signed up, what they're experiencing, what's working and what's not.

**Trigger Points for Customer Interviews:**

| Trigger | When | What to Learn |
|---------|------|---------------|
| New signup (within 72 hours) | After first scan completes | First impressions, expectations vs reality, intent |
| Upgrade to paid | Within 1 week of upgrade | What triggered the upgrade? What value did they see? |
| 30-day mark | 30 days post-signup | Are they getting ongoing value? What's missing? |
| Downgrade or cancel | Within 48 hours of cancellation | Why? What would have kept them? Recoverable? |
| Support ticket (complex) | After resolution | Was the issue systemic? Are others experiencing this? |
| Power user identified | When usage data shows high engagement | What are they doing that others aren't? Can we replicate? |

**Customer Interview Structure (30 minutes):**

```
1. CONTEXT (5 min)
   "What does your business do?"
   "What made you try DoppelDown?"
   "Where did you first hear about us?"
   
2. EXPERIENCE (10 min)
   "Walk me through what happened when you first signed up."
   "What was the first scan like? What did you expect?"
   "How often do you check the dashboard?"
   "What's the most valuable thing DoppelDown does for you?"
   "What's the most frustrating thing about using DoppelDown?"
   
3. OUTCOMES (10 min)
   "Has DoppelDown found any threats you didn't know about?"
   "What did you do with that information?"
   "How would you describe DoppelDown to a colleague?"
   "Is it worth what you're paying? More? Less?"
   
4. FUTURE (5 min)
   "What would make DoppelDown 10x more valuable to you?"
   "What would make you cancel?"
   "Anything you wish you'd known before signing up?"
```

#### C. Churned User Interviews

**Purpose:** Understand why users left. This is the most painful but most valuable research.

**Recruitment:** Email within 48 hours of cancellation. Offer a $25 Amazon gift card for 15 minutes.

**Churned User Interview Structure (15-20 minutes):**

```
1. "What originally brought you to DoppelDown?" (2 min)
2. "What was your experience like?" (5 min)
3. "What made you decide to cancel?" (5 min)
   - Probe: Was it the product, the price, the results, or something else?
   - Probe: Did you switch to something else? What?
4. "What would have kept you?" (3 min)
5. "Any advice for us?" (2 min)
```

### Interview Analysis Framework

After each interview, create a structured note:

```markdown
## Interview: [Name/ID] — [Date]
**Persona:** [Sarah/Dave/Alex/James/Michelle]
**Company:** [Size, industry]
**Stage:** [Prospect/Free user/Paid user/Churned]
**Channel:** [How they found us]

### Key Quotes
- "[Direct quote that captures an insight]"
- "[Direct quote about a pain point]"

### Pain Points Mentioned
- [ ] [Pain point 1]
- [ ] [Pain point 2]

### Feature Requests / Wishes
- [ ] [Request 1 — underlying need: ...]
- [ ] [Request 2 — underlying need: ...]

### Surprises / Unexpected Findings
- [Anything that challenged our assumptions]

### Satisfaction Signal
- NPS-like: [1-10 recommendation likelihood]
- Retention risk: [Low / Medium / High]

### Tags
#persona-dave #pain-reporting #feature-api #churn-risk-low
```

### Interview Volume Targets

| Phase | Monthly Target | Focus |
|-------|---------------|-------|
| Pre-launch (now) | 6-8 discovery interviews | Persona validation, problem validation |
| Month 1-3 (launch) | 4-6 mixed (discovery + customer) | Onboarding experience, first-value time |
| Month 3-6 (traction) | 6-8 mixed (customer + churned) | Retention, upgrade triggers, churn reasons |
| Month 6-12 (scale) | 4-6 strategic interviews | Expansion use cases, new personas, pricing |

---

## 5. Method 2: Surveys & Micro-Surveys

### Survey Strategy

Surveys complement interviews by providing quantitative breadth. While interviews tell you *why* 3 users are frustrated, surveys tell you *how many* of your 100 users share that frustration.

### A. NPS (Net Promoter Score) Survey

**Purpose:** Track overall customer satisfaction and loyalty over time. Primary leading indicator of retention and word-of-mouth growth.

**Frequency:** Quarterly (avoid survey fatigue; monthly is too aggressive for a small user base)

**Implementation:**

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  How likely are you to recommend DoppelDown      │
│  to a colleague? (0-10)                          │
│                                                  │
│  ○ 0  ○ 1  ○ 2  ○ 3  ○ 4  ○ 5  ○ 6  ○ 7  ○ 8  ○ 9  ○ 10  │
│  ────────────────────────────────────────────────│
│  Not at all likely              Extremely likely │
│                                                  │
│  ┌──────────────────────────────────────────────┐│
│  │ What's the biggest reason for your score?    ││
│  │                                              ││
│  │ [Free text field]                            ││
│  └──────────────────────────────────────────────┘│
│                                                  │
│  [Submit]                                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Delivery:** In-app modal for active users; email for inactive users.

**Analysis:**
- Score: **Promoters (9-10)** minus **Detractors (0-6)** = NPS
- Segment by plan tier, persona, tenure, feature usage
- Free-text responses coded thematically and fed into insight repository
- Target: NPS > 30 by Month 6, > 50 by Month 12

**Follow-Up Actions by Score:**

| Score | Category | Action |
|-------|----------|--------|
| 9-10 | Promoter | Thank them. Ask for a testimonial/review. Invite to referral program. |
| 7-8 | Passive | Ask: "What would make it a 9 or 10?" Follow up with specific improvements. |
| 0-6 | Detractor | Personal outreach within 24 hours. Schedule a call. Attempt recovery. |

### B. CSAT (Customer Satisfaction) Surveys

**Purpose:** Measure satisfaction with specific interactions or features, not overall product.

**Trigger Points:**

| Trigger | Survey Question | Format |
|---------|----------------|--------|
| After first scan completes | "How was your first scan experience?" | ⭐⭐⭐⭐⭐ (1-5) + free text |
| After viewing a threat report | "How useful was this threat report?" | 👍 / 👎 + "What would make it better?" |
| After resolving a support ticket | "How was your support experience?" | ⭐⭐⭐⭐⭐ (1-5) + free text |
| After upgrading to paid plan | "What made you decide to upgrade?" | Multiple choice + free text |
| 7 days after signup (if not converted) | "What's holding you back from upgrading?" | Multiple choice + free text |

### C. In-App Micro-Surveys (Contextual)

**Purpose:** Capture feedback at the moment of experience, when context is fresh. These are the highest-signal surveys because they're tied to actual product usage.

**Implementation: 1-2 question popups triggered by behavior**

```
Micro-Survey 1: Post-Scan Reaction
────────────────────────────────
Trigger: 30 seconds after first scan results load
Show once per user

"Did these scan results match what you expected?"
○ Better than expected
○ About what I expected  
○ Worse than expected
○ I'm not sure what I'm looking at

[Optional: "Tell us more..." free text]
────────────────────────────────

Micro-Survey 2: Feature Discovery
────────────────────────────────
Trigger: User visits Evidence Collection for the first time
Show once per user

"How important is evidence collection for your use case?"
○ Critical — this is the main reason I'm here
○ Useful — nice to have
○ Not important to me
○ I don't understand what this does

────────────────────────────────

Micro-Survey 3: Upgrade Gate
────────────────────────────────
Trigger: User hits a plan limit (e.g., brand limit reached)
Show once per limit type per user

"You've reached the limit on your current plan."
"What would you most want if you upgraded?"
□ Monitor more brands
□ More frequent scans
□ Social media monitoring
□ PDF reports
□ API access
□ Priority support
□ Other: [free text]

────────────────────────────────

Micro-Survey 4: Cancellation Reason
────────────────────────────────
Trigger: User clicks "Cancel subscription"
Required before cancellation completes

"We're sorry to see you go. What's the main reason?"
○ Too expensive for the value I'm getting
○ Didn't find enough threats (tool seems unnecessary)
○ Too complicated to use
○ Missing a feature I need: [text]
○ Switching to a different tool: [text]
○ My situation changed (closing business, etc.)
○ Other: [text]

"Would anything change your mind?"
○ Lower price (what price? [field])
○ A specific feature: [text]
○ Better onboarding/training
○ No, my mind is made up

────────────────────────────────

Micro-Survey 5: "Aha" Moment Capture
────────────────────────────────
Trigger: User marks a threat as "confirmed" for the first time
Show once per user

"You just confirmed your first real threat. 
How does this make you feel about DoppelDown?"
○ 🔥 This is exactly what I needed
○ 👍 Useful, glad I found it
○ 😐 Expected — nothing surprising
○ 🤷 Not sure this is worth paying for

────────────────────────────────
```

### D. Pre-Launch Market Validation Survey

**Purpose:** Validate pricing, features, and positioning with the target market before (or alongside) launch.

**Distribution:** LinkedIn (organic post + targeted messages), Reddit (r/smallbusiness, r/ecommerce, r/cybersecurity), email list.

**Target: 50-100 responses**

```
DOPPELDOWN MARKET VALIDATION SURVEY
(5 minutes, anonymous)

1. What is your primary role?
   ○ Business owner/founder
   ○ Marketing/brand manager
   ○ IT/Security professional
   ○ MSP/MSSP (managed services)
   ○ Other: [text]

2. How many employees does your company have?
   ○ 1-10
   ○ 11-50
   ○ 51-200
   ○ 201-1000
   ○ 1000+

3. Has your brand ever been impersonated online?
   (Fake website, phishing email, fake social account, etc.)
   ○ Yes, it's happened
   ○ I suspect so but I'm not sure
   ○ No
   ○ I don't know — I've never checked

4. How do you currently monitor for brand impersonation?
   □ Google Alerts
   □ Manual searches
   □ A paid brand protection tool (which? [text])
   □ My IT team handles it
   □ I don't monitor at all
   □ Other: [text]

5. How much does your business currently spend on 
   brand protection per year?
   ○ $0
   ○ $1-$500
   ○ $500-$5,000
   ○ $5,000-$25,000
   ○ $25,000+

6. If a tool could scan for brand impersonation threats 
   and generate takedown-ready evidence, how valuable 
   would that be to your business?
   ○ Extremely valuable (would pay for it today)
   ○ Valuable (would seriously consider)
   ○ Somewhat valuable (interesting but not urgent)
   ○ Not valuable (not a priority)

7. Van Westendorp pricing:
   a. At what price would this be so cheap you'd 
      question its quality? $[field]/mo
   b. At what price would this be a great deal? $[field]/mo
   c. At what price would this start to feel expensive 
      but still worth it? $[field]/mo
   d. At what price would this be too expensive to 
      consider? $[field]/mo

8. What features would be most important? (Rank 1-6)
   [ ] Domain monitoring (typosquatting, lookalike domains)
   [ ] Phishing page detection
   [ ] Social media fake account detection
   [ ] Evidence collection & takedown reports
   [ ] Automated takedown assistance
   [ ] API access for integration

9. Would you prefer:
   ○ Self-serve (sign up, scan, see results — no sales call)
   ○ Guided (a person walks me through setup)
   ○ Managed (someone handles everything for me)

10. [Optional] Leave your email to get early access 
    and a free brand scan: [email field]
```

### Survey Design Principles

| Principle | Application |
|-----------|-------------|
| **Keep it short** | In-app: 1-2 questions max. Email: 5-10 questions max. Never more than 5 minutes. |
| **Ask about behavior, not hypotheticals** | "What did you do?" beats "What would you do?" |
| **Avoid leading questions** | ❌ "How much did you love the new dashboard?" ✅ "How would you rate the new dashboard?" |
| **Always include free text** | The quantitative options capture known categories. Free text captures what you didn't think to ask. |
| **Sample appropriately** | Don't survey your entire user base every time. Segment and rotate. |
| **Close the loop** | After acting on survey results, tell respondents. "You said X. We shipped Y." |

---

## 6. Method 3: Usability Testing

### Why Usability Testing Matters for DoppelDown

DoppelDown's core value proposition is **self-serve onboarding** — users must be able to sign up, scan, and understand results without talking to anyone. If the UI is confusing, unclear, or slow, the entire business model breaks. Usability testing is the mechanism that ensures the self-serve promise actually works.

### Testing Types

#### A. Moderated Usability Testing (Primary)

**Format:** 1-on-1 session over Zoom. Researcher watches user attempt tasks, asks follow-up questions.

**When to Use:**
- Before launching major features
- When analytics show a funnel drop-off but you don't know why
- When you need deep understanding of user mental models

**Session Structure (45-60 minutes):**

```
1. SETUP (5 min)
   - Welcome, consent form, recording permission
   - "Think aloud" instruction: "Tell me what you're thinking 
     as you use the product. There are no right or wrong answers. 
     We're testing the product, not you."

2. BACKGROUND (5 min)
   - "Tell me about your business."
   - "What do you currently do about brand protection?"

3. TASK SCENARIOS (30-40 min)
   Present tasks one at a time. Observe. Don't help unless stuck >2min.

4. DEBRIEF (5-10 min)
   - "What was your overall impression?"
   - "What was the easiest part? Hardest?"
   - "Would you sign up for this? Why/why not?"
   - System Usability Scale (SUS) questionnaire
```

**Core Task Scenarios for DoppelDown:**

```
TASK 1: Signup & First Scan
─────────────────────────
"Imagine you just heard about DoppelDown and want to 
check if anyone is impersonating your brand. Please 
start from the homepage and do what feels natural."

OBSERVE:
- Where do they click first?
- Do they understand the value prop on the landing page?
- How long does signup take?
- Do they get stuck on any form fields?
- Do they successfully start a scan?
- How do they react to scan progress (loading state)?

TASK 2: Interpret Scan Results
─────────────────────────────
"Your scan is complete. Please look at the results 
and tell me what you're seeing."

OBSERVE:
- Do they understand the threat categories?
- Can they distinguish high vs low risk?
- Do they click into individual threats?
- Do they understand what action to take?
- Any confusion about terminology?

TASK 3: View & Use Evidence
───────────────────────────
"You've found a suspicious domain. You want to 
gather evidence to take it down. What would you do?"

OBSERVE:
- Can they find the evidence collection feature?
- Do they understand what the evidence includes?
- Can they figure out how to use it for a takedown?
- Do they find the report generation?

TASK 4: Understand Pricing & Upgrade
───────────────────────────────────
"You're on the free plan and want to understand 
what you'd get by upgrading. Please explore."

OBSERVE:
- Can they find the pricing page/comparison?
- Do they understand tier differences?
- Is the value of upgrading clear?
- Any price sensitivity reactions?
- Where would they click to upgrade?

TASK 5: Add a New Brand (if applicable)
─────────────────────────────────────
"You want to monitor a second brand. How would you do that?"

OBSERVE:
- Can they find the brand management feature?
- Is the multi-brand concept clear?
- Do they understand brand limit is plan-dependent?
```

**Scoring Each Task:**

| Metric | How to Measure |
|--------|---------------|
| **Task success** | Completed / Completed with difficulty / Failed |
| **Time on task** | Stopwatch (benchmark: first scan < 5 minutes) |
| **Error count** | Wrong clicks, backtracking, confusion |
| **Satisfaction** | Post-task rating: "How easy was that?" (1-7) |
| **Think-aloud insights** | Qualitative notes from verbalization |

#### B. Unmoderated Usability Testing

**Format:** Users complete tasks independently via a testing platform. No researcher present. Good for larger sample sizes and geographic diversity.

**When to Use:**
- Validating a fix for a known issue
- Testing minor UI changes (A/B testing alternative)
- When you need 10+ test sessions quickly

**Tools:** Maze, UserTesting, Lookback, or Hotjar user testing

**Task Design:** Same scenarios as moderated, but with clearer written instructions and embedded questions after each task.

#### C. First-Click Testing

**Format:** Show a screenshot or prototype. Ask "Where would you click to [do X]?" Measure where users click first.

**When to Use:**
- Testing navigation and information architecture
- Evaluating new landing page designs
- Quick validation of layout changes

**Key DoppelDown First-Click Tests:**

| Test | Screen | Question |
|------|--------|----------|
| Homepage CTA | Landing page | "Where would you click to check if your brand is being impersonated?" |
| Navigation | Dashboard | "Where would you go to see your scan results?" |
| Upgrade path | Dashboard | "Where would you click to see pricing options?" |
| Threat action | Threat detail page | "What would you click to take action on this threat?" |

#### D. Guerrilla Testing (Fast & Cheap)

**Format:** 5-10 minute test with anyone available. Show the product, give one task, observe. Can be done over coffee, at a meetup, or via quick Zoom.

**When to Use:**
- Rapid sanity checking before shipping
- When you need 3-5 quick reactions today, not next week
- Testing fundamental comprehension (do people even understand what this product does?)

**DoppelDown Guerrilla Test Script (5 min):**

```
1. Show the landing page for 10 seconds. Close it.
   "What does this product do?"
   
2. Show it again. "Who do you think this is for?"

3. "If you were worried about brand impersonation, 
    would you try this? Why/why not?"

4. "What would you expect to happen after signing up?"

5. "What questions do you still have?"
```

### Usability Testing Cadence

| Phase | Frequency | Type | Focus |
|-------|-----------|------|-------|
| Pre-launch | 3-5 moderated sessions | Moderated | End-to-end signup flow, landing page comprehension |
| Month 1-3 | 2-3 sessions/month | Mixed | Onboarding, first scan, results comprehension |
| Month 3-6 | 2 sessions/month | Mixed | Feature-specific (reports, evidence, multi-brand) |
| Month 6-12 | 2-3 sessions/quarter | Moderated + Unmoderated | Major feature launches, redesigns |

### Usability Benchmarks

Track these metrics over time to measure product improvement:

| Metric | Pre-Launch Target | Month 6 Target | Month 12 Target |
|--------|------------------|----------------|-----------------|
| **Time to first scan** | < 5 min | < 3 min | < 2 min |
| **First scan completion rate** | > 70% | > 85% | > 90% |
| **SUS Score** | > 60 (OK) | > 70 (Good) | > 80 (Excellent) |
| **Task success rate (core tasks)** | > 60% | > 80% | > 90% |
| **"I understand what this does" (landing page)** | > 70% | > 85% | > 95% |

---

## 7. Method 4: Behavioral Analytics

### Analytics Strategy

Analytics are the always-on research method. They don't tell you *why* users do what they do, but they precisely quantify *what* they do, at scale, in real time.

### Analytics Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     DATA COLLECTION                       │
├──────────────┬──────────────┬──────────────┬─────────────┤
│  Page Views  │   Events     │  User Props  │  Revenue    │
│  (GA4)       │  (custom)    │  (segments)  │  (Stripe)   │
└──────┬───────┴──────┬───────┴──────┬───────┴──────┬──────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌──────────────────────────────────────────────────────────┐
│                    DATA LAYER                             │
│  GA4 + Mixpanel/PostHog/Amplitude (choose one)           │
│  + Stripe revenue data                                    │
│  + Supabase user/scan data                               │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   ANALYSIS LAYER                          │
├──────────────┬──────────────┬──────────────┬─────────────┤
│  Funnels     │  Cohorts     │  Retention   │  Segments   │
│              │              │  Curves      │             │
└──────────────┴──────────────┴──────────────┴─────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────┐
│                   ACTION LAYER                            │
├──────────────┬──────────────┬──────────────┬─────────────┤
│  Dashboards  │  Alerts      │  Reports     │  Triggers   │
│  (weekly)    │  (anomalies) │  (monthly)   │  (in-app)   │
└──────────────┴──────────────┴──────────────┴─────────────┘
```

### Recommended Analytics Stack

| Tool | Purpose | Cost | Priority |
|------|---------|------|----------|
| **Google Analytics 4** | Already integrated. Page views, acquisition, basic behavior. | Free | ✅ Already done |
| **PostHog** (recommended) | Product analytics: events, funnels, cohorts, session replay, feature flags, surveys. Open-source with generous free tier. | Free (up to 1M events/mo) | 🔴 Implement Month 1 |
| **Stripe Dashboard** | Revenue analytics, MRR, churn, upgrades. | Free (included) | ✅ Already available |
| **Supabase Analytics** | Database-level queries for custom analysis. | Free (included) | ✅ Already available |
| **Hotjar** (alternative) | Session recordings, heatmaps, feedback widgets. | Free (up to 35 sessions/day) | 🟡 Consider Month 2 |

**Why PostHog over Mixpanel/Amplitude:**
- Open-source and self-hostable (important for a security product)
- Generous free tier (1M events/month)
- Built-in session replay, feature flags, and surveys (replaces 3 tools)
- Privacy-friendly (EU hosting option, no 3rd-party data sharing)
- Good fit for security-conscious brand narrative

### Event Taxonomy

Define a consistent event naming convention. Everything in `snake_case`, grouped by domain.

**Core Events to Instrument:**

```
ACQUISITION & ACTIVATION
─────────────────────────
landing_page_viewed              {source, utm_campaign, utm_source}
pricing_page_viewed              {source}
signup_started                   {source, plan}
signup_completed                 {plan, method: email|google|github}
onboarding_step_completed        {step: 1|2|3|4, step_name}
onboarding_completed             {duration_seconds}
onboarding_abandoned             {last_step, duration_seconds}

CORE PRODUCT USAGE
──────────────────
brand_added                      {brand_name_hash, brand_count}
scan_started                     {scan_type: domain|web|social|full, brand_id}
scan_completed                   {scan_type, threats_found, duration_seconds}
scan_failed                      {scan_type, error_type}
threat_viewed                    {threat_type, risk_level}
threat_confirmed                 {threat_type, risk_level}
threat_dismissed                 {threat_type, risk_level, reason}
evidence_viewed                  {threat_id, evidence_type}
evidence_collected               {threat_id, evidence_type}
report_generated                 {format: pdf|csv|html, threats_count}
report_downloaded                {format}
alert_received                   {channel: email|in_app, alert_type}
alert_clicked                    {channel, alert_type}

ENGAGEMENT & RETENTION
─────────────────────
dashboard_viewed                 {brands_count, threats_count}
session_started                  {user_tenure_days, plan}
feature_discovered               {feature_name, discovery_method}
settings_changed                 {setting_name}
help_accessed                    {help_type: docs|chat|email}

MONETIZATION
────────────
pricing_compared                 {current_plan, viewed_plan}
upgrade_started                  {from_plan, to_plan, trigger}
upgrade_completed                {from_plan, to_plan, trigger}
downgrade_started                {from_plan, to_plan}
downgrade_completed              {from_plan, to_plan, reason}
cancellation_started             {plan, tenure_days, reason}
cancellation_completed           {plan, tenure_days, reason}
cancellation_recovered           {plan, recovery_method}
payment_failed                   {plan, failure_reason}
payment_recovered                {plan, days_overdue}
```

### Key Funnels to Build

#### Funnel 1: Acquisition → Activation (Most Critical)

```
Landing Page Visit
    │
    ├── [xx%] Pricing Page View
    │       │
    │       └── [xx%] Signup Started
    │               │
    │               ├── [xx%] Signup Completed
    │               │       │
    │               │       ├── [xx%] First Brand Added
    │               │       │       │
    │               │       │       └── [xx%] First Scan Started
    │               │       │               │
    │               │       │               └── [xx%] First Scan Completed
    │               │       │                       │
    │               │       │                       └── [xx%] "Aha" Moment
    │               │       │                           (first threat confirmed)
    │               │       │
    │               │       └── [xx%] Abandoned (no brand added)
    │               │
    │               └── [xx%] Signup Abandoned
    │
    └── [xx%] Bounced (left without navigating)
```

**Benchmark targets:**
- Landing → Signup: > 5%
- Signup → First Scan: > 70%
- First Scan → Aha Moment: > 30%
- Overall Landing → Aha: > 1%

#### Funnel 2: Free → Paid Conversion

```
Active Free User (≥ 2 sessions)
    │
    ├── [xx%] Hits Plan Limit (brand/scan/feature)
    │       │
    │       └── [xx%] Views Pricing / Upgrade Page
    │               │
    │               ├── [xx%] Starts Checkout
    │               │       │
    │               │       ├── [xx%] Completes Payment
    │               │       │
    │               │       └── [xx%] Abandons Checkout
    │               │
    │               └── [xx%] Leaves Pricing Page
    │
    ├── [xx%] Sees Upgrade Prompt (in-app)
    │       │
    │       └── [xx%] Clicks Through to Upgrade
    │
    └── [xx%] Never Engages with Upgrade Path
```

**Benchmark targets:**
- Free → Paid (overall): > 5% (Month 3), > 10% (Month 12)
- Checkout start → Complete: > 60%

#### Funnel 3: Retention & Engagement (Weekly)

```
Returning User (Week N+1)
    │
    ├── [xx%] Views Dashboard
    │       │
    │       ├── [xx%] Starts New Scan
    │       │
    │       ├── [xx%] Reviews Existing Threats
    │       │
    │       └── [xx%] Only Views Dashboard, Takes No Action
    │
    ├── [xx%] Clicks Email Alert
    │       │
    │       └── [xx%] Takes Action on Alerted Threat
    │
    └── [xx%] Does Not Return
```

### Cohort Analysis

Track user cohorts by signup month to understand retention trends:

```
RETENTION TABLE (% of cohort returning in week N)

           W1    W2    W3    W4    W8    W12   W24
Jan '26    65%   45%   38%   32%   22%   18%   12%
Feb '26    70%   50%   42%   36%   --    --    --
Mar '26    72%   55%   48%   --    --    --    --
                                ↑
              (Each row should improve as product improves)
```

**Target retention curves:**
- Week 1: > 60%
- Week 4: > 30%
- Week 12: > 20% (indicates PMF for free users)
- Paid users: Week 12 retention > 80%

### Behavioral Segments

Create analytics segments to compare behavior:

| Segment | Definition | Why It Matters |
|---------|------------|----------------|
| **Activated** | Completed first scan + viewed results | Core activation metric |
| **Aha'd** | Confirmed at least one real threat | Key moment of value realization |
| **Power users** | 3+ sessions/week, 2+ scans/month | Model behavior to replicate |
| **At-risk** | No login in 14+ days (paid users) | Churn prediction |
| **Upgrade-ready** | Hit 2+ plan limits, visited pricing 2+ times | Sales/nudge targets |
| **Champions** | NPS 9-10 + referral given | Advocacy program candidates |

### Automated Behavioral Triggers

Set up automated responses based on behavioral signals:

| Trigger | Condition | Action |
|---------|-----------|--------|
| **Activation stalled** | Signup but no scan within 48 hours | Email: "Ready to scan your brand?" with 1-click scan link |
| **Aha moment** | First threat confirmed | In-app celebration + "Upgrade to monitor continuously" |
| **Usage drop** | Paid user, no login in 14 days | Email: "Here's what's happened with your brand this month" (summary report) |
| **Expansion ready** | Using 90%+ of plan limits | In-app: "You're getting close to your limit. See upgrade options" |
| **Churn risk** | Paid user + no scan in 30 days + no alert opens | Personal email from founder: "Hey, noticed you haven't been in for a while..." |
| **Payment failure** | Stripe payment fails | Dunning email sequence (3 emails over 14 days) |
| **Power user** | 10+ scans, 5+ threats confirmed | Personal outreach: interview request + case study ask |

### Weekly Analytics Review Checklist

```markdown
## Weekly Analytics Review — [Date]

### Traffic & Acquisition
- [ ] Total visitors this week: [x] (vs last week: [x])
- [ ] Top traffic sources: [list]
- [ ] Signup conversion rate: [x]% (target: >5%)
- [ ] New signups: [x]

### Activation & Engagement
- [ ] First scan completion rate: [x]% (target: >70%)
- [ ] Time to first scan: [x] min (target: <5 min)
- [ ] DAU/WAU ratio: [x]% (target: >25%)
- [ ] Feature usage distribution: [chart]

### Monetization
- [ ] Free → Paid conversion: [x]% (target: >5%)
- [ ] MRR: $[x] (vs last week: $[x])
- [ ] New paid customers: [x]
- [ ] Churned customers: [x]
- [ ] Net revenue retention: [x]%

### Health Signals
- [ ] Support tickets: [x] (trending up/down?)
- [ ] Scan failure rate: [x]% (target: <5%)
- [ ] Any anomalies or notable patterns?

### Top Insight This Week
[One sentence capturing the most important thing learned]

### Action Items
- [ ] [Action based on data]
- [ ] [Action based on data]
```

---

## 8. Method 5: Customer Feedback Loops

### Always-On Feedback Channels

Beyond structured research, DoppelDown needs always-on channels where users can give feedback whenever they want.

### A. In-App Feedback Widget

**Implementation:** A persistent but unobtrusive feedback button (bottom-right corner) on every page of the dashboard.

```
┌──────────────────────────────────────────┐
│                                          │
│         [DoppelDown Dashboard]           │
│                                          │
│                                          │
│                                          │
│                                          │
│                                          │
│                              ┌───────┐   │
│                              │  💬   │   │
│                              │Feedback│   │
│                              └───────┘   │
└──────────────────────────────────────────┘

Click → 

┌──────────────────────────────┐
│  How can we improve?         │
│                              │
│  ○ 🐛 Bug report            │
│  ○ 💡 Feature request       │
│  ○ 🤔 Something's confusing │
│  ○ 😍 Something's great     │
│  ○ 💬 Other                 │
│                              │
│  ┌──────────────────────────┐│
│  │ Tell us more...          ││
│  │                          ││
│  │                          ││
│  └──────────────────────────┘│
│                              │
│  □ Include screenshot        │
│  □ OK to follow up via email │
│                              │
│  [Submit Feedback]           │
│                              │
└──────────────────────────────┘
```

**Tool:** PostHog Surveys (if using PostHog), or Canny, or custom-built.

### B. Feature Request Board (Public)

**Purpose:** Let users suggest and vote on features. Reduces duplicate requests, creates transparency about what's planned, and makes users feel heard.

**Tool:** Canny (free for up to 100 tracked users) or a simple GitHub Discussions board.

**Structure:**

```
FEATURE REQUEST BOARD (canny.io/doppeldown or similar)

Categories:
├── 🔍 Detection & Scanning
├── 📊 Reports & Analytics
├── 🔔 Alerts & Notifications
├── 🤝 Integrations
├── 💰 Pricing & Plans
└── 🎨 UI & Experience

Each request shows:
- Title
- Description
- Vote count (other users can upvote)
- Status: Under Review | Planned | In Progress | Shipped | Won't Do
- Official response from DoppelDown
```

**Rules:**
- Respond to every request within 48 hours (even if just "Thanks, we're reviewing this")
- Update status when it changes
- When shipping a requested feature, notify all voters: "You asked, we built it"
- "Won't Do" is acceptable — explain why honestly

### C. Support-as-Research

Every support interaction is a research opportunity. Structure support to capture insights:

**Support Ticket Tagging:**

```
Tags applied to every support ticket:

CATEGORY:          SEVERITY:         PRODUCT AREA:
- bug              - critical         - onboarding
- feature-request  - major            - scanning
- confusion        - minor            - results
- pricing          - cosmetic         - reports
- billing                            - billing
- how-to                             - settings
- integration                        - alerts
- other                              - landing-page
```

**Monthly Support Analysis:**
- Top 5 issues by frequency
- Trending issues (new this month)
- Feature requests extracted from support
- Common confusion points (→ feed to usability testing)
- Resolution time trends

### D. Customer Advisory Board (Month 6+)

**Purpose:** A curated group of 5-10 engaged customers who provide regular, structured feedback on product direction.

**Composition:**
- 2-3 SMB owners (Sarah persona)
- 2-3 MSP/MSSP users (Dave persona)
- 1-2 marketing/brand managers (Alex persona)
- 1-2 e-commerce operators (Michelle persona)

**Structure:**
- Quarterly 60-minute virtual meetup
- Each session covers: What we shipped, what we're planning, open Q&A
- Members get early access to new features
- Members are named in annual "Thank You" (with permission)
- Consider offering a permanent discount or free month as recognition

**Benefits:**
- Deep, nuanced feedback from invested users
- Early warning on product direction mistakes
- Strong advocates who feel ownership of the product
- Source of testimonials and case studies

### E. Review Monitoring

Monitor and respond to all public reviews:

| Platform | When to Set Up | Action |
|----------|---------------|--------|
| G2 | Month 3+ | Encourage reviews from happy customers. Respond to all reviews within 48h. |
| Capterra | Month 3+ | Same as G2. Cross-post reviews. |
| Product Hunt | Launch day | Respond to every comment. Follow up with reviewers. |
| Reddit mentions | Ongoing | Set up Google Alerts or use a social listening tool. |
| Twitter/X mentions | Ongoing | Monitor @mentions and brand keywords. |

### F. Exit Intent & Micro-Moments

Capture feedback at specific micro-moments beyond cancellation:

| Moment | Trigger | Question |
|--------|---------|----------|
| **Pricing page exit** | Mouse leaves pricing page (desktop) | "Was our pricing clear? Anything confusing?" |
| **Failed scan** | Scan returns an error | "Sorry about that. What were you trying to do?" |
| **Empty results** | Scan returns 0 threats | "No threats found! Is this what you expected, or did you expect us to find something?" |
| **Long session** | User spends > 10 min without scanning | "Looking for something? We can help." (chat prompt) |
| **Return after absence** | First login in 30+ days | "Welcome back! Anything we should improve?" |

---

## 9. Method 6: Competitive & Market Intelligence

### Ongoing Competitive Research

User research doesn't happen in a vacuum. Understanding what competitors are doing (and how users perceive them) feeds directly into product and positioning decisions.

### A. Competitor User Research

**Purpose:** Learn from competitors' users without their expensive research budgets.

**Methods:**

| Method | How | Frequency |
|--------|-----|-----------|
| **G2/Capterra review mining** | Read all reviews of BrandShield, Red Points, Bolster, etc. Extract themes: what users love, hate, and wish for. | Monthly |
| **Reddit/community monitoring** | Search r/cybersecurity, r/msp, r/smallbusiness for threads about brand protection tools. | Weekly |
| **"Switched from" interviews** | When a user mentions they tried a competitor, ask detailed questions about that experience. | Opportunistic |
| **Competitor free trials** | Sign up for competitor trials (where available) and document the experience. | Quarterly |
| **LinkedIn competitor analysis** | Monitor competitor company pages for feature announcements, positioning changes. | Weekly |

**Competitive Review Mining Template:**

```markdown
## Competitor Review Analysis: [Competitor Name]
Date: [Date]
Source: [G2 / Capterra / Reddit]
Reviews analyzed: [N]

### What Users Love
- [Theme 1] — mentioned [N] times
  - Representative quote: "[quote]"
- [Theme 2] — mentioned [N] times

### What Users Hate
- [Theme 1] — mentioned [N] times
  - Representative quote: "[quote]"
- [Theme 2] — mentioned [N] times

### Feature Gaps Mentioned
- [Gap 1] — mentioned [N] times
- [Gap 2] — mentioned [N] times

### Pricing Sentiment
- [Expensive / Fair / Cheap]
- Notable quotes about pricing

### Implications for DoppelDown
- [Opportunity or threat]
- [Feature to consider or avoid]
```

### B. Market Signal Monitoring

Track broader market signals that affect user needs:

| Signal | Source | Frequency | Why It Matters |
|--------|--------|-----------|----------------|
| Phishing attack trends | ACSC, FBI IC3, PhishTank | Monthly | Validates demand, informs content |
| Brand impersonation news | Google Alerts, industry news | Weekly | Content opportunities, sales triggers |
| Regulatory changes | ACSC, NIST, ISO updates | Monthly | Compliance-driven demand |
| Technology changes | AI/security publications | Monthly | Feature opportunities and threats |
| Competitor fundraising/M&A | Crunchbase, TechCrunch | Monthly | Competitive landscape shifts |

---

## 10. Synthesis & Insight Repository

### The Insight Repository

All research inputs funnel into a single, searchable repository. This is the institutional memory that prevents repeating research and ensures insights are acted upon.

### Repository Structure

```
doppeldown/research/
├── COMPETITIVE_ANALYSIS.md              (already exists)
├── insights/
│   ├── README.md                        (how to use this repo)
│   ├── INSIGHT_INDEX.md                 (master list, searchable)
│   ├── interviews/
│   │   ├── 2026-02-INT001-sarah-smb.md
│   │   ├── 2026-02-INT002-dave-msp.md
│   │   └── ...
│   ├── usability/
│   │   ├── 2026-03-UT001-signup-flow.md
│   │   └── ...
│   ├── surveys/
│   │   ├── 2026-03-NPS-Q1.md
│   │   └── ...
│   ├── analytics/
│   │   ├── 2026-02-weekly-review.md
│   │   └── ...
│   └── synthesis/
│       ├── 2026-Q1-research-brief.md
│       └── ...
```

### Insight Card Format

Every significant finding gets an insight card:

```markdown
## INSIGHT-[YYYY]-[NNN]: [One-line title]
**Date:** [Date discovered]
**Source:** [Interview/Survey/Analytics/Usability/Support/Competitive]
**Confidence:** [High/Medium/Low] (based on evidence strength)
**Personas Affected:** [Sarah, Dave, Alex, James, Michelle]
**Product Area:** [Onboarding/Scanning/Results/Reports/Billing/Landing]

### Finding
[2-3 sentence description of the insight]

### Evidence
- [Source 1]: [Quote or data point]
- [Source 2]: [Quote or data point]
- [Source 3]: [Quote or data point]

### Implications
- [What this means for the product]
- [What this means for positioning]
- [What this means for content]

### Recommended Action
- [ ] [Specific action 1]
- [ ] [Specific action 2]

### Status
[New / Under Review / Actioned / Parked]

### Tags
#onboarding #confusion #persona-sarah #high-impact
```

### Monthly Synthesis Meeting

**Purpose:** Review all research inputs from the past month, identify patterns, and prioritize actions.

**Agenda (60 minutes):**

```
1. VOLUME CHECK (5 min)
   - Interviews conducted: [N]
   - Survey responses: [N]  
   - Support tickets analyzed: [N]
   - Analytics reviewed: [Y/N]
   
2. TOP INSIGHTS (20 min)
   - Present top 3-5 new insights
   - Cross-reference with existing insights
   - Assign confidence levels
   
3. PATTERN RECOGNITION (15 min)
   - What themes are recurring?
   - What's new this month?
   - Any surprises that challenge assumptions?
   
4. PRIORITIZATION (15 min)
   - Use scoring framework (see Section 11)
   - Decide: Act now / Plan for next quarter / Park
   
5. ACTION ITEMS (5 min)
   - Assign owners and deadlines
   - Schedule follow-up research if needed
```

---

## 11. From Insight to Action: The Decision Framework

### Insight Scoring Matrix

Not every insight warrants action. Use this scoring framework to prioritize:

```
IMPACT SCORE (1-5):
How much does this affect user outcomes?
5 = Blocks activation or causes churn
4 = Significant friction in core flow
3 = Moderate inconvenience
2 = Minor annoyance
1 = Cosmetic / nice-to-have

FREQUENCY SCORE (1-5):
How many users does this affect?
5 = >50% of users
4 = 25-50% of users
3 = 10-25% of users
2 = 5-10% of users
1 = <5% of users

EVIDENCE STRENGTH (1-5):
How confident are we?
5 = Multiple sources, quantitative + qualitative
4 = Strong from one source type + corroborated
3 = Clear signal from one source
2 = Suggestive but limited data
1 = Single anecdote

EFFORT ESTIMATE (1-5, inverted — 5 = easiest):
5 = < 1 day of work
4 = 1-3 days
3 = 1-2 weeks
2 = 2-4 weeks
1 = > 1 month

PRIORITY SCORE = Impact × Frequency × Evidence × Effort
Max = 625 | Action threshold: > 100
```

**Decision Rules:**

| Score Range | Action |
|-------------|--------|
| **> 200** | Act immediately. This is a critical finding. |
| **100-200** | Plan for next sprint/cycle. Important but not urgent. |
| **50-100** | Backlog. Revisit quarterly. |
| **< 50** | Park. May not warrant action. |

### Insight → Feature Pipeline

```
INSIGHT CAPTURED
    │
    ▼
INSIGHT SCORED (Impact × Frequency × Evidence × Effort)
    │
    ├── Score > 200 → IMMEDIATE ACTION
    │                   │
    │                   ├── Is it a bug? → Fix this sprint
    │                   ├── Is it UX confusion? → Redesign + test
    │                   └── Is it a missing feature? → Spec + build
    │
    ├── Score 100-200 → PLANNED ACTION
    │                   │
    │                   └── Add to next cycle's planning
    │
    ├── Score 50-100 → BACKLOG
    │                   │
    │                   └── Review quarterly
    │
    └── Score < 50 → PARKED
                        │
                        └── Revisit if new evidence surfaces
```

### Closing the Loop with Users

**The most important step in the entire research process.** When you act on user feedback, tell them.

**Templates:**

```
EMAIL: Feature Request Shipped
──────────────────────────────
Subject: You asked for [X] — we built it 🎉

Hi [Name],

A few weeks ago, you told us that [pain point / request].

We listened. Starting today, DoppelDown now [description of change].

[Screenshot or quick link]

Thanks for helping us make DoppelDown better. 
Your feedback directly shaped this feature.

— Richard, Founder

P.S. Got more ideas? I'm always listening: richard@doppeldown.com
──────────────────────────────

EMAIL: Bug Fix Notification
──────────────────────────────
Subject: We fixed the issue you reported

Hi [Name],

You reported that [bug description]. Sorry about that — 
we take every bug seriously.

This is now fixed. [Brief explanation of what changed.]

Thanks for flagging it. Users like you help us 
build a better product.

— Richard
──────────────────────────────

IN-APP: Changelog Entry
──────────────────────────────
🆕 [Feature Name]
You asked, we built it. [Description.]
Based on feedback from [N] users who told us [theme].
──────────────────────────────
```

---

## 12. Metrics & Measurement

### Research Program KPIs

Track the health and effectiveness of the research program itself:

| Metric | Target (Month 3) | Target (Month 12) |
|--------|-------------------|---------------------|
| **User conversations / month** | 4-6 | 6-8 |
| **Survey response rate** | > 20% | > 30% |
| **Insight cards created / month** | 5-10 | 10-20 |
| **Insights actioned / quarter** | 3-5 | 8-12 |
| **Days from insight to action** (median) | < 30 days | < 14 days |
| **Closed-loop emails sent** | Match actions | Match actions |
| **NPS response rate** | > 30% | > 40% |
| **NPS score** | > 20 | > 50 |

### Product Health Metrics (Research-Informed)

| Metric | Current | Month 3 | Month 6 | Month 12 |
|--------|---------|---------|---------|----------|
| **Time to first scan** | Unknown | < 5 min | < 3 min | < 2 min |
| **Activation rate** (signup → first scan) | Unknown | > 60% | > 75% | > 85% |
| **Free → Paid conversion** | Unknown | > 3% | > 7% | > 12% |
| **Monthly churn (paid)** | Unknown | < 10% | < 7% | < 5% |
| **NPS** | N/A | > 20 | > 35 | > 50 |
| **CSAT (post-scan)** | N/A | > 3.5/5 | > 4.0/5 | > 4.2/5 |
| **SUS Score** | N/A | > 60 | > 70 | > 80 |
| **Support ticket volume / user** | N/A | Baseline | -20% | -40% |
| **Feature adoption rate** (new features) | N/A | > 30% | > 40% | > 50% |

### Leading vs Lagging Indicators

| Leading Indicator (Predict the Future) | Lagging Indicator (Measure the Past) |
|----------------------------------------|--------------------------------------|
| Activation rate trending up | MRR growth |
| NPS trending up | Churn rate decreasing |
| Time to first scan decreasing | Free → paid conversion improving |
| Support tickets about confusion decreasing | SUS score improving |
| Feature usage breadth increasing | Revenue per user increasing |
| Referrals given per user increasing | Organic traffic growing |

---

## 13. Tooling & Infrastructure

### Recommended Tool Stack

| Function | Tool | Cost | Priority | Notes |
|----------|------|------|----------|-------|
| **Product Analytics** | PostHog | Free (1M events/mo) | 🔴 Month 1 | Events, funnels, cohorts, session replay |
| **Web Analytics** | Google Analytics 4 | Free | ✅ Done | Traffic, acquisition channels |
| **In-App Feedback** | PostHog Surveys or Canny | Free tier | 🔴 Month 1 | Micro-surveys, feedback widget |
| **Feature Requests** | Canny or GitHub Discussions | Free / $0 | 🟡 Month 2 | Public voting board |
| **User Interviews** | Zoom + Otter.ai | $17/mo (Otter) | 🔴 Month 1 | Recording + auto-transcription |
| **Survey Distribution** | Typeform or Google Forms | Free | 🟡 Month 2 | Market surveys, NPS via email |
| **Session Recording** | PostHog (built-in) | Free | 🔴 Month 1 | Watch actual user sessions |
| **Insight Repository** | Markdown files in repo | Free | 🔴 Month 1 | Low-overhead, version-controlled |
| **Task Tracking** | GitHub Issues or Linear | Free | 🟡 Month 2 | Link insights to tasks |
| **Revenue Analytics** | Stripe Dashboard + Baremetrics | Free / $58/mo | 🟢 Month 3+ | MRR, churn, LTV analytics |
| **Email Automation** | Loops, Resend, or Customer.io | Free tier | 🟡 Month 2 | Behavioral triggers, drip sequences |

**Total cost at launch: ~$17/month** (Otter.ai for transcription; everything else is free tier)

### PostHog Implementation Plan

PostHog is the recommended analytics backbone. Here's the implementation sequence:

```
WEEK 1: Foundation
├── Create PostHog project (cloud, free tier)
├── Install posthog-js in Next.js app
├── Configure user identification (Supabase user ID)
├── Set up basic pageview tracking
└── Enable session recording (sample 50% of sessions)

WEEK 2: Core Events
├── Instrument signup flow events
├── Instrument scan flow events  
├── Instrument threat interaction events
├── Instrument billing/upgrade events
└── Set up user properties (plan, tenure, brand count)

WEEK 3: Analysis
├── Build Acquisition → Activation funnel
├── Build Free → Paid conversion funnel
├── Create behavioral segments
├── Set up first dashboard
└── Configure first micro-survey (post-scan)

WEEK 4: Triggers & Alerts
├── Set up anomaly alerts (conversion drop, error spike)
├── Configure behavioral trigger emails
├── Enable feature flags for A/B testing readiness
└── First weekly analytics review
```

---

## 14. Team & Responsibilities

### Current State: Solo Founder

DoppelDown is (initially) a one-person operation. The research strategy must be executable by a solo founder without becoming a full-time job.

### Time Budget: Research Activities

| Activity | Time/Week | When |
|----------|-----------|------|
| 1-2 user conversations | 1-2 hours | Schedule in calendar, protect this time |
| Weekly analytics review | 30 min | Monday morning ritual |
| Support ticket + feedback review | 30 min | Friday afternoon |
| Monthly synthesis | 2 hours | Last Friday of the month |
| Quarterly NPS + analysis | 4 hours | Once per quarter |
| Quarterly usability test | 4-6 hours | Once per quarter |
| **Total** | **~3-4 hours/week** | |

This is ~10% of a work week. Non-negotiable. The alternative is building features no one wants.

### Scaling the Research Function

| Stage | Research Model | When |
|-------|---------------|------|
| **Solo** | Founder does everything. Use templates to stay efficient. | Months 1-6 |
| **First hire assists** | Customer success / support person also captures research insights. Use structured tagging. | Months 6-12 |
| **Dedicated research** | Part-time or contract UX researcher for quarterly deep dives. | Month 12+ |
| **Research team** | Full-time UX researcher + data analyst. | If/when MRR > $30K |

### AI-Assisted Research (Leverage Available Now)

Use AI tools to multiply research capacity:

| Task | AI Application | Tool |
|------|---------------|------|
| Interview transcription | Auto-transcribe and summarize | Otter.ai, Grain |
| Theme extraction | Analyze transcripts for patterns | Claude, ChatGPT |
| Survey analysis | Categorize free-text responses | Claude + spreadsheet |
| Competitive review mining | Summarize G2/Capterra reviews | Claude |
| Insight drafting | Generate insight cards from raw notes | Claude |
| Analytics interpretation | Explain funnel data in plain language | PostHog AI (built-in) |

---

## 15. Quarterly Research Roadmap

### Q1 2026 (Months 1-3): Foundation

**Theme: "Do people actually want this, and can they use it?"**

```
MONTH 1 (February):
├── Conduct 6-8 discovery interviews (persona validation)
│   └── 3 SMB owners, 2 MSPs, 2 marketing managers, 1 e-commerce
├── Distribute market validation survey (target: 50+ responses)
├── Implement PostHog (basic events + session recording)
├── Set up in-app feedback widget
├── Conduct 3 guerrilla usability tests on landing page
└── Establish insight repository structure

MONTH 2 (March):
├── Conduct 4-6 customer interviews (early signups)
├── Run first moderated usability test (signup → first scan flow)
├── Analyze Van Westendorp pricing data from survey
├── First weekly analytics review cycle begins
├── Set up cancellation micro-survey
├── Build first analytics dashboard (acquisition → activation funnel)
└── Publish first monthly research brief

MONTH 3 (April):
├── Conduct 4-6 interviews (mix of customers + churned)
├── Launch first NPS survey (baseline measurement)
├── Run usability test on results/threat interpretation
├── Analyze behavioral data: time-to-first-scan, activation rate
├── Mine competitor reviews (BrandShield, Red Points, Bolster)
├── Implement first behavioral email trigger (activation stall)
└── Q1 synthesis: What did we learn? What changes?
```

**Q1 Deliverables:**
- Validated (or revised) customer personas
- Pricing validation data
- Baseline NPS score
- Activation funnel baseline metrics
- Top 10 ranked insights with action priorities
- First monthly research briefs (×3)

### Q2 2026 (Months 4-6): Optimization

**Theme: "How do we improve conversion, retention, and satisfaction?"**

```
MONTH 4 (May):
├── Interview 4-6 customers (focus on upgrade triggers + churn reasons)
├── A/B test landing page based on usability findings
├── Implement CSAT surveys (post-scan, post-support)
├── Set up feature request board (Canny)
├── Analyze cohort retention curves
├── Deep dive: Why do free users not convert?
└── Monthly research brief

MONTH 5 (June):
├── Interview 4-6 users (focus on power users: what are they doing right?)
├── Usability test: reports + evidence collection flow
├── Analyze feature usage data: what's used vs what's ignored?
├── Competitive teardown: test competitor free trials
├── Implement upgrade-ready behavioral triggers
├── Start planning Customer Advisory Board
└── Monthly research brief

MONTH 6 (July):
├── NPS Survey #2 (track trend)
├── Interview 4-6 users (MSP partners + e-commerce segment deep dive)
├── Comprehensive usability test of major flows
├── Persona refresh based on 6 months of data
├── Set up Customer Advisory Board (recruit members)
├── Build churn prediction model (behavioral signals)
├── Q2 synthesis: Research-driven roadmap for Q3-Q4
└── 6-month retrospective on research program effectiveness
```

**Q2 Deliverables:**
- Optimized signup/onboarding flow (data-driven changes)
- NPS trend (Q1 vs Q2)
- CSAT baselines for key touchpoints
- Public feature request board live
- Customer Advisory Board recruited
- Churn analysis report with actionable findings
- Updated personas with behavioral data

### Q3 2026 (Months 7-9): Scaling Insights

**Theme: "How do we scale what works and explore new opportunities?"**

```
├── Customer Advisory Board: First meeting
├── Segmented research: deep dives by persona
├── International user research (UK, US market differences)
├── Integration research: what tools do users want us to connect to?
├── NPS Survey #3
├── Scaled unmoderated usability testing
├── Referral program research: what motivates advocates?
├── New persona exploration: IT consultants, compliance officers
├── Q3 synthesis
```

### Q4 2026 (Months 10-12): Maturation

**Theme: "How do we build research into our DNA?"**

```
├── Annual user research report (comprehensive findings)
├── Research-driven 2027 product roadmap
├── NPS Survey #4 (annual trend)
├── Customer Advisory Board: Q4 meeting
├── Evaluate hiring dedicated researcher
├── Automated insight generation pipeline
├── Competitive landscape annual refresh
├── Pricing research for potential new tier
├── Q4 synthesis + annual retrospective
```

---

## 16. Budget & Resource Planning

### Year 1 Research Budget

| Category | Tool/Activity | Monthly Cost | Annual Cost | Priority |
|----------|--------------|-------------|-------------|----------|
| **Analytics** | PostHog (free tier) | $0 | $0 | 🔴 |
| **Analytics** | GA4 | $0 | $0 | ✅ Done |
| **Transcription** | Otter.ai Pro | $17 | $200 | 🔴 |
| **Surveys** | Typeform/Google Forms | $0 | $0 | 🟡 |
| **Feature Board** | Canny (free tier) | $0 | $0 | 🟡 |
| **Session Recording** | PostHog (included) | $0 | $0 | 🔴 |
| **Interview Incentives** | Gift cards (churned users) | ~$50 | ~$600 | 🟡 |
| **Usability Testing** | Zoom (free tier) | $0 | $0 | 🔴 |
| **Revenue Analytics** | Baremetrics (Month 6+) | $58 | ~$400 | 🟢 |
| **Email Automation** | Loops/Resend (free tier) | $0 | $0 | 🟡 |
| | | | | |
| **TOTAL YEAR 1** | | | **~$1,200** | |

**Note:** This is intentionally lean. The most valuable research (interviews, analytics, support mining) costs nothing but time. Upgrade tools only when free tiers are outgrown.

### Cost Per Insight Benchmark

| Method | Setup Cost | Ongoing Cost | Insights/Month | Cost/Insight |
|--------|-----------|-------------|----------------|-------------|
| User interviews | $0 + time | ~$17/mo (transcription) | 4-8 | ~$2-4 |
| In-app surveys | $0 (PostHog) | $0 | 5-15 | $0 |
| Analytics | $0 (PostHog) | $0 | 3-5 | $0 |
| Usability testing | $0 (Zoom) | Time only | 2-4 | $0 |
| Support mining | $0 | Time only | 2-5 | $0 |
| Competitive intel | $0 | Time only | 1-3 | $0 |

---

## 17. Templates & Scripts

### A. Interview Recruitment Email

```
Subject: Quick chat about brand protection? ($25 gift card)

Hi [Name],

I'm Richard, founder of DoppelDown — we're building a brand 
protection tool for businesses that can't afford the $50K/year 
enterprise solutions.

I'm talking to [business owners / MSPs / marketers] to understand 
how they think about protecting their brand online. I'd love 
25 minutes of your time.

No sales pitch. Just genuine curiosity about your experience.

As a thank you, I'll send you a $25 Amazon gift card + a free 
brand scan that shows if anyone is impersonating your brand.

Would any of these times work?
[Calendly link with 3-4 slots]

Thanks,
Richard
```

### B. Post-Interview Thank You

```
Subject: Thanks for the chat, [Name]!

Hi [Name],

Really appreciate you taking the time today. Your perspective 
on [specific insight from the conversation] was eye-opening.

As promised, here's your $25 Amazon gift card: [link]

And here's a link to scan your brand for free: [link]
(No account needed — takes 2 minutes)

If anything else comes to mind about brand protection, 
I'm always happy to hear it: richard@doppeldown.com

Talk soon,
Richard

P.S. If you know anyone else who might have thoughts on this, 
I'd love an introduction.
```

### C. NPS Follow-Up by Segment

```
PROMOTER (9-10) FOLLOW-UP:
──────────────────────────
Subject: You made our day 😊 Quick favor?

Hi [Name],

You recently rated DoppelDown a [score]/10. That means a lot 
to a small team like ours.

Would you be open to one (or both) of these?

1. Leave a quick review on G2: [link] (~2 min)
2. Tell us in 1-2 sentences what you'd say to recommend 
   DoppelDown to a colleague (we might use it as a testimonial 
   with your permission)

Either way — thanks for being an awesome user.

— Richard

DETRACTOR (0-6) FOLLOW-UP:
──────────────────────────
Subject: I want to make this right

Hi [Name],

You recently rated DoppelDown a [score]/10. I take that seriously, 
and I want to understand what we're getting wrong.

Would you be open to a 10-minute call this week? I want to hear 
directly what would make DoppelDown better for you.

No agenda, no pitch — just listening.

[Calendly link]

Or if you'd prefer to write it out: just reply to this email.

— Richard, Founder
```

### D. Usability Test Consent Form

```
USABILITY TESTING CONSENT

Study: DoppelDown Product Usability Test
Researcher: Richard [Last Name], DoppelDown

By participating, you agree that:
- This session will be recorded (screen + audio)
- Recordings are used only for product improvement
- Your personal information will not be shared publicly
- You may stop at any time for any reason
- This is a test of the product, not of you
- There are no right or wrong answers

Your participation is voluntary and greatly appreciated.

□ I consent to participate and be recorded
Name: _______________
Date: _______________
```

### E. Weekly Analytics Review Template

```markdown
## Weekly Analytics Review — Week of [Date]

### 📊 Traffic & Acquisition
| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| Unique visitors | | | |
| Signup conversion rate | | | |
| New signups | | | |
| Top acquisition channel | | | |

### 🚀 Activation & Engagement
| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| First scan completion rate | | | |
| Avg time to first scan | | | |
| DAU | | | |
| WAU | | | |
| Threats confirmed | | | |

### 💰 Monetization
| Metric | This Week | Last Week | Trend |
|--------|-----------|-----------|-------|
| MRR | | | |
| New paid customers | | | |
| Churned customers | | | |
| Free → Paid conversion | | | |

### 🔍 Notable Observations
- [Observation 1]
- [Observation 2]

### 🎯 Top Insight This Week
[One sentence: the most important thing learned]

### ✅ Actions
- [ ] [Action 1]
- [ ] [Action 2]
```

### F. Monthly Research Brief Template

```markdown
## Monthly Research Brief — [Month Year]

### Research Volume
- User interviews conducted: [N]
- Survey responses collected: [N]
- Usability tests run: [N]
- Support tickets analyzed: [N]
- Insights created: [N]
- Insights actioned: [N]

### Top 5 Insights This Month

#### 1. [INSIGHT-YYYY-NNN]: [Title]
**Impact: [H/M/L] | Frequency: [H/M/L] | Confidence: [H/M/L]**
[2-3 sentence summary]
**Action:** [What we're doing about it]

#### 2. [Title]
...

#### 3. [Title]
...

#### 4. [Title]
...

#### 5. [Title]
...

### Key Metrics Movement
| Metric | Start of Month | End of Month | Target | Status |
|--------|---------------|-------------|--------|--------|
| NPS | | | >30 | 🟢🟡🔴 |
| Activation rate | | | >70% | 🟢🟡🔴 |
| Free → Paid | | | >5% | 🟢🟡🔴 |
| Time to first scan | | | <5 min | 🟢🟡🔴 |

### Persona Observations
- **Sarah (SMB):** [What we learned about this persona]
- **Dave (MSP):** [What we learned]
- **Alex (Brand Mgr):** [What we learned]

### Open Questions for Next Month
1. [Question we still need to answer]
2. [Question we still need to answer]

### Research Plan for Next Month
- [ ] [Planned activity 1]
- [ ] [Planned activity 2]
- [ ] [Planned activity 3]
```

---

## 18. Appendix: Quick-Start Checklist

### Week 1: Get Started (4-6 hours total)

- [ ] **Set up PostHog** — Create account, install SDK, enable session recording
- [ ] **Create insight repository** — Set up folder structure in `doppeldown/research/insights/`
- [ ] **Schedule 3 discovery interviews** — Reach out to Richard's network
- [ ] **Add feedback widget** — Even a simple `mailto:` link in the dashboard footer
- [ ] **Run 1 guerrilla test** — Show the landing page to someone for 10 seconds, ask what it does

### Week 2: Build the Habit (3-4 hours)

- [ ] **Conduct first 2-3 interviews** — Use discovery interview script from Section 4
- [ ] **Instrument core events** — Signup, first scan, results viewed, upgrade click
- [ ] **Set up weekly analytics review** — Block 30 minutes every Monday
- [ ] **Write first 2-3 insight cards** — From interviews + any existing user feedback

### Week 3: Expand Coverage (3-4 hours)

- [ ] **Distribute market validation survey** — LinkedIn + Reddit + email
- [ ] **Build acquisition → activation funnel** — In PostHog
- [ ] **Add cancellation micro-survey** — Required before cancellation
- [ ] **Run first moderated usability test** — Signup → first scan flow

### Week 4: Systematize (3-4 hours)

- [ ] **Conduct first weekly analytics review** — Use template from Section 17
- [ ] **Publish first monthly research brief** — Synthesize everything from the month
- [ ] **Set up first behavioral trigger** — "Activation stalled" email
- [ ] **Plan next month's research** — Schedule interviews, plan usability tests

### Ongoing: The Research Rhythm

```
EVERY WEEK:
├── 1-2 user conversations
├── 30 min analytics review (Monday)
├── 30 min support/feedback review (Friday)
└── Update insight repository

EVERY MONTH:
├── Monthly research brief
├── Update insight index
├── Review and reprioritize backlog
└── Plan next month's research

EVERY QUARTER:
├── NPS survey + analysis
├── Usability test of major flows
├── Persona review
├── Customer Advisory Board meeting (from Month 6)
└── Quarterly synthesis + roadmap impact
```

---

## Summary: The DoppelDown Research Advantage

Most startups at DoppelDown's stage do zero systematic user research. They build what feels right, launch, and wonder why users don't convert. DoppelDown's competitive advantage isn't just transparent pricing and self-serve onboarding — it's the discipline to continuously listen, learn, and adapt.

**The minimum viable research program costs $17/month and 3-4 hours/week.** That's the cheapest insurance policy against building the wrong thing.

**Three rules to live by:**

1. **Never go a week without talking to a user.** Analytics are necessary but insufficient. Conversations reveal what dashboards can't.

2. **Always close the loop.** Users who feel heard become advocates. Users who feel ignored become detractors. The feedback email after shipping a requested feature is worth more than any ad campaign.

3. **Let evidence beat opinion.** When there's disagreement about what to build, the answer is always "let's find out" — not "I think" or "I feel." The insight repository is the arbiter.

---

*This strategy is a living document. Update it as the research program matures and new methods prove their value. The best research strategy is one that actually gets executed.*
