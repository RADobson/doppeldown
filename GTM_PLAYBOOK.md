# DoppelDown Go-To-Market Playbook
*Last updated: 2026-02-03*

---

## The One-Line Strategy

**Be the Stripe of brand protection: transparent pricing, self-serve onboarding, and a free tier — in a market where every competitor hides behind "Contact Sales" at $15K–$250K+/year.**

---

## Table of Contents

1. [First 10 Customers Strategy](#1-first-10-customers-strategy)
2. [First 30 Days Launch Plan](#2-first-30-days-launch-plan)
3. [Content Marketing Strategy](#3-content-marketing-strategy)
4. [LinkedIn Strategy](#4-linkedin-strategy)
5. [Product Hunt Launch Plan](#5-product-hunt-launch-plan)
6. [Reddit & Community Strategy](#6-reddit--community-strategy)
7. [Partnership Opportunities](#7-partnership-opportunities)
8. [Email Outreach Templates](#8-email-outreach-templates)
9. [Pricing Page as a Marketing Asset](#9-pricing-page-as-a-marketing-asset)
10. [Key Metrics to Track](#10-key-metrics-to-track)

---

## 1. First 10 Customers Strategy

### The Goal
10 paying customers in 30 days. Target: 5 at Professional ($99/mo), 5 at Starter ($49/mo) = ~$745 MRR.

### Who to Target (Ranked by Likelihood to Convert)

**Tier 1 — Warm Network (Days 1–10)**
These are people who already trust Richard. They don't need to be sold on Richard — just on the problem.

| Target | Why They Convert | Who Specifically |
|--------|-----------------|-----------------|
| MSP/MSSP contacts | They resell security tools to clients daily. They *get it* instantly. | 3–5 MSP owners/managers Richard knows from vendor work |
| Cybersecurity peers who run side businesses | They understand the threat AND have a brand to protect | Former colleagues, LinkedIn connections with side projects |
| Small business owners Richard knows personally | Friends, family, gym owner, accountant, tradie with a website | Anyone with a .com.au and a business worth protecting |
| Richard's current employer's partners/clients (carefully) | They already trust Richard's judgment on security | Only if appropriate and non-competitive |

**Tier 2 — Warm-ish (Days 10–20)**
One degree removed. Introductions from Tier 1 or recognizable from industry events.

| Target | Why They Convert | How to Reach |
|--------|-----------------|-------------|
| Australian e-commerce brands ($1M–$20M revenue) | Constant phishing targets, can't afford BrandShield | LinkedIn research → warm intro or cold DM |
| FinTech startups (Series A–B) | Regulators are pushing brand monitoring requirements | CTO/CISO LinkedIn outreach |
| Digital marketing agencies (5–50 people) | They manage 10–50 client brands, brand safety is a value-add | Agency owner LinkedIn DM |
| SaaS companies with recognizable brands | Domain squatting is a constant headache | Founder/CTO outreach |

**Tier 3 — Cold but High-Intent (Days 20–30)**
People actively searching for solutions and getting sticker-shocked by competitors.

| Target | Why They Convert | How to Reach |
|--------|-----------------|-------------|
| People Googling "brand protection pricing" | They're in buying mode and angry about "Contact Sales" | SEO + Google Ads (later) |
| Companies that just got phished | Urgent need, fast decision | Monitor news, reach out on LinkedIn |
| Businesses with expiring competitor contracts | Looking for alternatives at renewal | Hard to find, but ask during conversations |

### The Warm Outreach Script (for Tier 1)

**Phone call or voice message — not a text wall. Richard's voice = credibility.**

> "Hey [Name], it's Richard. Quick one for you — I've been building something on the side that I think is right up your alley.
>
> You know how brand impersonation and phishing is getting worse every year? Most businesses either ignore it or pay $50K+ a year for enterprise tools. I built a SaaS that does it for $49 a month, self-serve, you can sign up and see results in 5 minutes.
>
> I'd love for you to kick the tires on it. Free tier, no commitment. If it finds threats against [their brand], I reckon you'll want the paid version. Can I send you the link?"

**Key principles:**
- Lead with the problem, not the product
- Mention the price gap immediately ("$50K vs. $49")
- Make it zero-risk ("free tier, no commitment")
- Ask for permission to send the link, don't just spam it

### The Follow-Up (if they sign up for free)

Wait 48 hours after they sign up. Then:

> "Hey [Name], did you get a chance to run a scan? I noticed [specific thing about their brand — e.g., 'there are 3 domain variations registered that you probably don't own']. Happy to walk you through the results if useful."

**This is critical:** Don't just say "how's it going?" — show them you checked their results and found something specific. This proves the product works and creates urgency.

### Converting Free → Paid

The free tier is the hook. Conversion happens when:
1. **They see real threats** — The scan finds actual suspicious domains or impersonation signals
2. **They want daily monitoring** — Free is weekly digest; paid is real-time alerts
3. **They want more brands** — Free covers 1 domain; businesses have multiple
4. **They want takedown help** — Free detects; paid helps you act

**Never hard-sell.** The product sells itself if it finds threats. If it doesn't find threats, the customer isn't the right fit yet.

---

## 2. First 30 Days Launch Plan

### Pre-Launch (Days -7 to 0)
*Before telling anyone. Get the house in order.*

| Day | Action | Owner | Time |
|-----|--------|-------|------|
| -7 | Provision Supabase + Stripe (test mode) | Richard | 30 min |
| -7 | Deploy to Vercel, smoke test full user flow | Ernie | 1 hr |
| -6 | Run DoppelDown's own scan against 5 test brands — verify results are real, useful, and not embarrassing | Both | 1 hr |
| -6 | Fix any scan quality issues found during testing | Ernie | 2–4 hr |
| -5 | Switch Stripe to live mode, test $1 charge, refund | Richard | 15 min |
| -5 | Buy domain (doppeldown.com or .io), configure DNS | Richard | 30 min |
| -4 | Set up Google Analytics, Plausible, or PostHog for usage tracking | Ernie | 30 min |
| -4 | Set up a simple customer support email (support@doppeldown.com) | Richard | 15 min |
| -3 | Write and publish the 3 blog posts to the live site | Ernie | 1 hr |
| -3 | Create a /pricing page optimized for SEO (see Section 9) | Ernie | 2 hr |
| -2 | Prepare LinkedIn announcement post (see Section 4) | Richard | 30 min |
| -2 | Prepare Product Hunt listing draft (see Section 5) | Richard | 1 hr |
| -1 | Richard signs up as a real user, adds his own brand, verifies entire flow works | Richard | 30 min |
| -1 | Draft 5 warm outreach messages for Tier 1 contacts | Richard | 30 min |

### Week 1: Soft Launch (Days 1–7)
*Warm network only. No public announcement. Goal: 3–5 signups, 1–2 paid.*

| Day | Action | Why |
|-----|--------|-----|
| 1 (Mon) | Send warm outreach to 5 closest contacts (phone/voice, not email) | Personal touch converts 10x better than mass email |
| 1 | Respond to every signup within 1 hour with a personal message | First impression. Be the founder who gives a shit |
| 2 | Follow up with anyone who hasn't signed up. "Did you get the link?" | People are busy, not uninterested |
| 2 | Review first scan results for all signups. Prepare personalized findings | Specifics sell. "We found 4 suspicious domains" beats "sign up" |
| 3 | Send personalized results to each signup: "Here's what we found for [brand]" | This is the conversion moment |
| 3 | Ask 2 MSP contacts: "Would your clients benefit from this?" | Planting the reseller seed |
| 4 | Send warm outreach to next 5 contacts | Expand the circle |
| 5 | First LinkedIn post: soft, personal, not salesy (see Section 4) | Signals to your network that you're building something |
| 6–7 | Weekend: Review all feedback. What confused people? What excited them? | Iterate fast. Fix friction before going wider |

### Week 2: Wider Warm Launch (Days 8–14)
*Expand to Tier 2. Start content. Goal: 5–10 signups, 3–5 paid.*

| Day | Action | Why |
|-----|--------|-----|
| 8 (Mon) | Second LinkedIn post: share a real (anonymized) finding from Week 1 | Social proof. "We found X threats across our first users" |
| 8 | Send Tier 2 outreach: 10 LinkedIn DMs to targeted prospects | Move beyond friends. These are acquaintances + industry peers |
| 9 | Publish blog post #1: "5 Signs Your Brand Is Being Targeted by Phishing" | Content engine starts. Share on LinkedIn after posting |
| 10 | Cross-post blog to LinkedIn as an article (not just a link) | LinkedIn favors native content |
| 11 | Email outreach: 10 cold emails to e-commerce brands in Australia (see Section 8) | Testing cold messaging |
| 12 | Ask every paying customer: "Who else do you know who'd benefit?" | Referrals are the best leads |
| 13–14 | Review + iterate. Which messages got responses? Which didn't? | Double down on what works |

### Week 3: Go Public (Days 15–21)
*Content push + community seeding. Goal: 15–20 total signups, 5–8 paid.*

| Day | Action | Why |
|-----|--------|-----|
| 15 (Mon) | Publish blog post #2: "How to Protect Your Brand from Domain Squatting" | SEO + credibility |
| 15 | Post to Reddit r/smallbusiness: "I built a tool..." (see Section 6) | Reddit hates ads, loves tools built by real people |
| 16 | Third LinkedIn post: "Why I built DoppelDown" — the founder story | People buy from people, not products |
| 17 | LinkedIn engagement day: comment on 20 cybersecurity posts, don't pitch DoppelDown | Build visibility. Be helpful, not salesy |
| 18 | Post to r/cybersecurity: educational content, not a product pitch | Position as an expert, link in comments only if asked |
| 19 | Send 15 more cold emails | Keep pipeline moving |
| 20–21 | Prep for Product Hunt launch | Maker page, assets, hunter outreach |

### Week 4: Product Hunt + Scale (Days 22–30)
*Big push. Goal: 25+ total signups, 10 paid customers, $745+ MRR.*

| Day | Action | Why |
|-----|--------|-----|
| 22 (Mon) | Publish blog post #3: "The True Cost of Brand Impersonation" | All 3 blog posts live, building SEO authority |
| 23 | Product Hunt launch (Tuesday — see Section 5 for details) | Tuesdays are the best PH launch day |
| 23 | LinkedIn blast: "We launched on Product Hunt today!" | Rally your network to upvote |
| 23 | Post to Hacker News: "Show HN: DoppelDown — Brand protection at $49/mo" | HN loves transparent pricing disruption stories |
| 24 | Follow up on all PH/HN comments. Respond to every single one | Founders who engage get more upvotes and respect |
| 25 | Email outreach to MSPs/MSSPs with partner pitch (see Section 7) | Partnership pipeline starts |
| 26 | LinkedIn post: Share PH results + customer quote (if available) | Momentum breeds momentum |
| 27 | Reach out to 3 Australian cybersecurity journalists/bloggers | Earned media attempt |
| 28–30 | Retrospective: What worked? What didn't? Update this playbook | |

---

## 3. Content Marketing Strategy

### The Content Moat

DoppelDown has a massive content opportunity because **no competitor publishes useful content about brand protection for SMBs.** They all target enterprise security teams. The entire conversation around "how to protect your brand" for smaller businesses is an open field.

### Existing Blog Posts (Ready to Publish)

| # | Title | Primary Keyword | Funnel Stage |
|---|-------|----------------|--------------|
| 1 | "5 Signs Your Brand Is Being Targeted by Phishing Attacks" | brand phishing detection | Awareness |
| 2 | "How to Protect Your Brand from Domain Squatting and Phishing in 2026" | brand protection domain squatting | Consideration |
| 3 | "The True Cost of Brand Impersonation: Why SMBs Can't Afford to Ignore It" | brand impersonation cost | Decision |

**Publishing cadence:** One per week during Weeks 2–4 of launch.

### Content Calendar: Next 12 Posts (Months 2–4)

These are ranked by SEO value and conversion potential:

| Priority | Title | Target Keyword | Why It Matters |
|----------|-------|---------------|---------------|
| 🔴 1 | "Brand Protection Pricing: What Every Option Actually Costs in 2026" | brand protection pricing | **The money post.** Everyone Googles this, nobody answers it. Own this keyword. |
| 🔴 2 | "DoppelDown vs. BrandShield: Comparison for SMBs" | brandshield alternative | Capture frustrated enterprise shoppers |
| 🔴 3 | "DoppelDown vs. Red Points: Which Is Right for Your Business?" | red points alternative / red points pricing | Same as above — different competitor |
| 🟡 4 | "Free Brand Monitoring Tools: What Works and What Doesn't" | free brand monitoring | Captures top-of-funnel "free" seekers → funnel to free tier |
| 🟡 5 | "How Australian SMBs Are Fighting Back Against Brand Impersonation" | brand protection Australia | Local SEO, builds authority in home market |
| 🟡 6 | "What Is Domain Squatting? A Small Business Owner's Guide" | what is domain squatting | High-volume educational keyword |
| 🟡 7 | "Phishing Takedown: How to Get a Fake Site Removed (Step by Step)" | phishing takedown process | Highly practical, earns trust, shows expertise |
| 🟢 8 | "Brand Protection for E-Commerce: The 2026 Playbook" | brand protection e-commerce | Vertical-specific content for a key target segment |
| 🟢 9 | "Why Brand Protection Shouldn't Cost $50,000 a Year" | brand protection cost | Thought leadership, reinforces positioning |
| 🟢 10 | "The MSP's Guide to Offering Brand Protection as a Service" | brand protection MSP | Content for the partner channel |
| 🟢 11 | "DMARC, SPF, and DKIM: How Email Authentication Protects Your Brand" | DMARC brand protection | Technical SEO, builds authority |
| 🟢 12 | "I Scanned 100 Australian Brands for Phishing Threats: Here's What I Found" | brand phishing Australia | Data-driven content, highly shareable, PR-worthy |

### Content Distribution Playbook

Every blog post gets distributed 5 ways:

1. **Publish on DoppelDown blog** — canonical URL, SEO-optimized
2. **Repost as LinkedIn article** — full text, not just a link (LinkedIn prioritizes native content)
3. **Share key insight as a LinkedIn post** — pull the most provocative stat or insight, 3–5 sentence post
4. **Post to relevant Reddit subreddit** — only if genuinely helpful, never "check out my product"
5. **Include in email newsletter** — once you have 50+ signups, start a monthly digest

### The "Brand Protection Pricing" Post (Priority #1)

This single post could drive more traffic than everything else combined. Here's why:

- Every buyer Googles "brand protection pricing" before purchasing
- Every competitor's page says "Contact Sales" — Google has no good answer
- DoppelDown can be THE answer: a comprehensive pricing comparison with transparent numbers
- This post becomes a top-of-funnel magnet that converts visitors who are already in buying mode

**Structure for this post:**
1. Table comparing every competitor's estimated pricing (use ranges from competitive analysis)
2. Explain why most companies hide pricing (sales-led model, custom quotes, enterprise minimums)
3. Show DoppelDown's pricing transparently
4. Include a "how to choose" framework based on company size and needs
5. CTA: "Or just sign up for free and see for yourself"

---

## 4. LinkedIn Strategy

### Why LinkedIn Is the #1 Channel

Richard's cybersecurity network is the single most valuable asset for DoppelDown's launch. Here's why:

- **Cybersecurity professionals are the buyers** (or influence the buying decision)
- **MSPs/MSSPs are the resellers** — they're all on LinkedIn
- **Richard has existing credibility** — he's not a random stranger pitching
- **LinkedIn's algorithm favors personal stories from individuals** (not company pages)

### Profile Optimization (Do This Before Posting Anything)

**Headline:** Change to something like:
> `Cybersecurity Sales Engineer | Building DoppelDown — Brand Protection for SMBs at $49/mo`

**About section:** Add 2–3 lines about DoppelDown at the end of existing bio:
> *On the side, I'm building DoppelDown — a self-serve brand protection platform. Think enterprise-grade phishing detection at startup-friendly prices. Check it out: [link]*

**Featured section:** Pin the DoppelDown launch post and best blog post.

### The 4-Post LinkedIn Launch Sequence

**Post 1: The Teaser (Day 5 of launch)**

> I've been a cybersecurity sales engineer for [X] years. I've watched companies pay $50,000+ a year for brand protection tools.
>
> And I've watched small businesses — the ones who can't afford six-figure contracts — get absolutely hammered by phishing and impersonation attacks.
>
> So I built something.
>
> More soon. 👀

*Goal: Generate curiosity. No link, no pitch. Just a signal.*

**Post 2: The Reveal (Day 8)**

> Last week I soft-launched DoppelDown — a brand protection tool that does what the $50K/year enterprise tools do, for $49/month.
>
> In the first week, we scanned [X] brands and found [Y] suspicious domains, [Z] potential phishing sites, and [W] social media impersonation accounts.
>
> Here's the thing that blew my mind: one small business owner had NO IDEA there were 6 domains registered that looked almost identical to theirs. Someone was setting up a phishing campaign against their customers.
>
> They caught it in 5 minutes. For free.
>
> If you run a business — or advise businesses on security — I'd love for you to try it: [link]
>
> Free tier, no credit card, no sales call. You'll see your first results in under 5 minutes.

*Goal: Social proof + concrete results + easy CTA.*

**Post 3: The Story (Day 16)**

> Why I built DoppelDown:
>
> In my day job, I see companies spend $200K/year on brand protection. And I see small businesses get told "sorry, you're too small for us" by every vendor in the space.
>
> Every. Single. Competitor. Hides their pricing behind "Contact Sales."
>
> I checked 9 competitors. Not one publishes their prices. The cheapest enterprise contract starts around $15K/year. Most are $50K–$250K+.
>
> That's insane for a small business that just wants to know if someone is impersonating them.
>
> So I built the tool I wish existed: transparent pricing ($49–$249/mo), self-serve, sign up and see results in minutes.
>
> If you're an MSP, MSSP, or manage client brands — this could be something you offer to clients without the enterprise markup.
>
> [link]

*Goal: Founder story + competitive positioning + MSP pitch.*

**Post 4: The Proof (Day 23 — Product Hunt day)**

> We just launched DoppelDown on Product Hunt 🚀
>
> [Screenshot of Product Hunt listing]
>
> In 3 weeks:
> - [X] brands monitored
> - [Y] threats detected
> - [Z] paying customers
> - $0 in marketing spend
>
> Every single customer came from conversations with people I know.
>
> If you've ever been frustrated by enterprise security vendors with hidden pricing and 6-month sales cycles — this is the alternative.
>
> Would love your support: [PH link]
>
> And if you have 5 minutes, try the free tier and let me know what you think. Honest feedback > upvotes.

*Goal: Social proof + PH launch support + authenticity.*

### Ongoing LinkedIn Cadence

After the launch sequence, aim for **3 posts per week:**

| Day | Post Type | Example |
|-----|----------|---------|
| Monday | Insight/Education | "Here's how to check if someone registered a lookalike domain for your brand (free, takes 30 seconds)" |
| Wednesday | Industry commentary | "Another [company] phishing campaign in the news. Here's what SMBs can learn from it." |
| Friday | Personal/Behind-the-scenes | "Week [X] of building DoppelDown: what I learned about [topic]" |

### LinkedIn Engagement Strategy

**Don't just post. Engage.**

- Comment on 5–10 cybersecurity posts per day (genuine insights, not "great post!")
- Engage with MSP/MSSP content specifically — these are your distribution partners
- When someone posts about getting phished or brand abuse, DM them (don't pitch publicly)
- Join and contribute to LinkedIn Groups: Australian cybersecurity, MSP communities, SMB security

### LinkedIn DM Scripts

**For cybersecurity peers:**
> Hey [Name], hope you're well. I've been working on something I think you'd find interesting from a security angle — a self-serve brand protection tool aimed at SMBs. Think BrandShield but $49/mo instead of $50K/year. Would love your honest take if you've got 5 mins to check it out: [link]

**For MSP/MSSP owners:**
> Hey [Name], I'm building a brand protection platform (DoppelDown) that I think could fit neatly into your security stack as a value-add for clients. Self-serve, transparent pricing, free tier to try. Would you be open to a quick chat about whether this is something your clients would use?

**For business owners:**
> Hey [Name], noticed you're running [company]. Quick question — do you know if anyone has registered domains similar to yours? It's one of the most common phishing vectors for [their industry]. I built a free tool that checks this in about 2 minutes if you want to try it: [link]

---

## 5. Product Hunt Launch Plan

### Why Product Hunt

- DoppelDown is the *exact* kind of product PH loves: transparent pricing disruption, self-serve, founder-built
- PH audience = startup founders, SaaS buyers, tech early adopters — all potential customers
- A good PH launch provides lasting SEO value (PH pages rank well)
- It's free

### Pre-Launch Preparation (Days -14 to -1)

**Create the Maker Profile:**
- Sign up on Product Hunt with Richard's personal account
- Fill out maker profile completely: photo, bio, link to DoppelDown
- Follow 20–30 people in the cybersecurity/SaaS space on PH

**Find a Hunter (Optional but Helpful):**
- A well-known hunter adds credibility and sends notifications to their followers
- Reach out to hunters who've posted cybersecurity or SaaS tools
- If you can't find one, self-hunting is fine — the product speaks for itself

**Prepare Assets:**
- **Tagline:** "Brand protection that doesn't cost $50K/year. Free to try."
- **Description (short):** "DoppelDown detects phishing sites, impersonation domains, and social media fakes targeting your brand. Enterprise-grade AI detection at $49/mo — with a free tier. The only brand protection tool with transparent pricing and self-serve onboarding."
- **Description (longer — for the PH page):**

> Every brand protection tool charges $15K–$250K/year and hides behind "Contact Sales."
>
> DoppelDown is different:
> ✅ Transparent pricing: $49–$249/mo (on the website, no sales call)
> ✅ Free tier: monitor 1 brand, no credit card
> ✅ Self-serve: sign up and see your first scan in 5 minutes
> ✅ AI-powered: domain variations, phishing detection, social impersonation, risk scoring
>
> Built by a cybersecurity engineer who got tired of watching SMBs get told "you're too small" by every vendor in the space.
>
> Try it free → [link]

- **Images:** 4–5 screenshots showing dashboard, scan results, pricing page, threat detail
- **Video (optional but high-impact):** 60-second Loom walkthrough: "sign up → add brand → see results"
- **Logo:** Clear, high-res on transparent background
- **First Comment (maker comment):** Write this in advance — it should tell the story

**Maker's First Comment (draft):**

> Hey PH! 👋 I'm Richard, a cybersecurity sales engineer from Australia.
>
> I built DoppelDown because I was frustrated. In my day job, I watch companies spend $50K–$250K/year on brand protection. Meanwhile, small businesses get hammered by phishing and domain squatting with zero affordable options.
>
> I checked every competitor. Not one publishes pricing. Not one has self-serve signup. The minimum contract starts at ~$15K/year.
>
> DoppelDown starts at $49/mo (and has a free tier).
>
> Here's what it does:
> - Scans for domains that look like yours (typosquatting, homoglyphs, TLD variations)
> - Detects phishing sites impersonating your brand
> - Monitors social media for fake accounts
> - Checks for email infrastructure abuse (O365 spoofing)
> - AI-powered risk scoring and evidence collection
>
> It's not trying to replace the $200K enterprise tools. It's for the millions of businesses that those tools ignore.
>
> Would love your feedback — what's missing? What would make you sign up?

### Launch Day Tactics

**Launch on Tuesday at 12:01 AM PT (6:01 PM AEST)**
- Tuesdays have the best PH engagement (Monday launches compete with weekend backlog; Wednesday+ loses steam)
- 12:01 AM PT gives the full 24 hours

**Launch Day Timeline (AEST):**

| Time (AEST) | Action |
|-------------|--------|
| 6:00 PM | Submit to PH, publish maker comment |
| 6:15 PM | LinkedIn post: "We just launched on Product Hunt! 🚀" |
| 6:30 PM | DM 10 close contacts: "We launched! Would love your support: [PH link]" |
| 7:00 PM | Post to Twitter/X if you have an audience there |
| 9:00 PM | Check PH ranking, respond to all comments |
| 11:00 PM | Engage with anyone who's commented |
| Next AM | Morning push: "Still live on PH! Here's what people are saying: [screenshot]" |
| All day | Respond to EVERY comment on PH within 30 minutes |

**Post-Launch (Days +1 to +7):**
- Share final results on LinkedIn: "We hit #[X] on Product Hunt!"
- Update the PH listing with any user quotes/feedback
- Follow up with everyone who commented on PH — these are warm leads
- Add "Featured on Product Hunt" badge to website

---

## 6. Reddit & Community Strategy

### The Rules of Reddit Marketing

1. **Never pitch directly.** Reddit will destroy you.
2. **Be genuinely helpful first.** Provide value, link only when relevant.
3. **Use your personal account, not a brand account.** People trust humans, not logos.
4. **Match the culture of each subreddit.** r/cybersecurity is technical. r/smallbusiness is practical.
5. **Comment karma > post karma.** Build reputation by commenting before you ever post.

### Target Subreddits

| Subreddit | Audience | Approach |
|-----------|----------|----------|
| r/cybersecurity (1.2M+) | Security professionals | Educational posts, technical insights. Never pitch. Mention DoppelDown only if directly relevant |
| r/smallbusiness (1.5M+) | SMB owners | "I built a tool to help with [problem]" — this sub loves bootstrapped founders |
| r/SaaS (100K+) | SaaS builders | Share the business journey, not the product. "Building a B2B SaaS in cybersecurity — lessons learned" |
| r/Entrepreneur (3M+) | Business builders | Founder story angle. "I'm a sales engineer building a SaaS on the side" |
| r/startups (1M+) | Early-stage founders | Product feedback requests work well here |
| r/sysadmin (900K+) | IT admins at SMBs | Technical angle: "How do you monitor for brand impersonation?" — start a discussion |
| r/msp (200K+) | MSPs | "Looking for feedback on a brand protection tool for MSP partners" — MSPs love evaluating new tools |
| r/AusFinance / r/australia | Australians | Local angle when relevant |

### Reddit Post Templates

**r/smallbusiness — The "I Built This" Post:**

> Title: I'm a cybersecurity engineer and I built a brand protection tool for small businesses — would love your feedback
>
> Body: I've worked in cybersecurity for [X] years and one thing that always frustrated me is that brand protection tools start at $15K–$250K/year. Every single competitor hides pricing behind "Contact Sales."
>
> Small businesses are the most targeted by phishing and domain squatting, but they're the ones who can't afford protection.
>
> So I built DoppelDown — it's a self-serve tool that scans for domains impersonating your brand, phishing sites, fake social accounts, and email spoofing. Starts at $49/mo with a free tier.
>
> I'd genuinely love feedback from actual small business owners:
> 1. Is this a problem you've dealt with?
> 2. What would make you actually pay for this?
> 3. What's missing?
>
> Happy to give free extended trials to anyone here who wants to test it. [link]

**r/cybersecurity — The Educational Post:**

> Title: I analyzed the brand protection market — every vendor hides pricing. Here's what they actually charge.
>
> Body: [Summary of competitive pricing analysis from the blog post]
>
> I found this interesting from a market dynamics perspective. The entire industry is built on opaque, sales-driven pricing models. The cheapest option I found is ~$15K/year.
>
> For context, I'm building a self-serve alternative (DoppelDown, $49/mo) — but this post isn't about that. I'm genuinely curious: for those of you who've evaluated or used these tools, did the pricing surprise you? How do you handle brand protection for smaller clients?

**r/msp — The Partner Post:**

> Title: Brand protection as an MSP service — anyone offering this?
>
> Body: Hey all, I'm a cybersecurity sales engineer and I'm building a brand protection SaaS (DoppelDown). I'm exploring whether MSPs would be interested in offering brand monitoring as a value-add to their clients.
>
> The idea: you'd monitor your client's domains for impersonation, phishing, and social media fakes. Flag threats as part of your security management.
>
> Current tools in this space are $30K–$250K/year enterprise contracts — not MSP-friendly at all. We're at $49–$249/mo with a free tier.
>
> Questions for the community:
> 1. Is brand protection something your clients ask about?
> 2. Would you bundle this into your security stack?
> 3. What margin would you need on a reseller deal?
>
> Happy to set up partner accounts for anyone who wants to evaluate it.

### Ongoing Reddit Strategy

- **Weekly:** Spend 20 minutes commenting on relevant threads in target subreddits (NOT promoting DoppelDown — just being helpful about brand protection, phishing, cybersecurity)
- **Bi-weekly:** Post one piece of content to one subreddit (rotate between subs)
- **Monitor:** Set up Google Alerts for "brand protection" and "phishing protection" on Reddit — join conversations where people are asking for help
- **Never repeat:** Don't post the same content to multiple subreddits. Customize for each audience.

---

## 7. Partnership Opportunities

### The MSP/MSSP Channel (Highest Priority)

**Why MSPs are gold for DoppelDown:**
- They manage security for 10–100+ clients each
- They're always looking for tools that generate recurring revenue
- They buy on value-per-client margin, not absolute price
- Richard's network is full of MSP contacts

**The MSP Partner Pitch:**

> Subject: Brand protection as a managed service — new revenue line for MSPs
>
> Hey [Name],
>
> I'm building DoppelDown — a brand protection platform that I think fits perfectly into the MSP security stack.
>
> Here's the pitch in 30 seconds:
>
> **The problem:** Your clients' brands are being impersonated through fake domains, phishing sites, and social media accounts. Most brand protection tools cost $30K–$250K/year — not viable for SMB clients.
>
> **The opportunity:** DoppelDown does the same detection for $49–$249/mo. You mark it up 2–3x, bundle it into your security package, and you've got a new $100–$500/mo/client revenue stream with zero delivery overhead.
>
> **What I need from you:** 30 minutes to demo it and get your honest feedback on whether your clients would use this.
>
> **What's in it for you:** I'll set up a partner account with [X] free brands so you can evaluate with real clients. If it works, we'll set up a reseller arrangement with [20–30%] margin.
>
> Worth a quick chat?

**MSP Partner Program Structure (Keep it Simple at Launch):**

| Element | Details |
|---------|---------|
| Partner discount | 20% off list price (they keep the spread to their client) |
| OR referral commission | 20% of first-year revenue per referred customer |
| Free evaluation | 3 brands monitored free for 60 days |
| Co-branded reports | Partner's logo on threat reports sent to clients (future feature) |
| Partner dashboard | Manage multiple client brands from one account (future feature) |
| Support | Direct Slack/email access to Richard for partner issues |

**Don't over-engineer the partner program.** At launch, a handshake deal and a discount code is enough. Formalize later.

### Marketing Agencies

**Why agencies:**
- They manage brand reputation for clients
- Brand protection is a natural extension of brand management
- They'd add DoppelDown scans to their client reports
- Lower-touch than MSPs — they just want a dashboard to show clients

**How to find them:**
- Search LinkedIn for "digital marketing agency owner" in Australia
- Look for agencies that specifically mention "brand management" or "online reputation"
- Check agency directories (Clutch.co, GoodFirms) for brand/reputation specialists

**The agency pitch:** Similar to MSP pitch, but framed as "protect your clients' brand equity, not just build it."

### Domain Registrars & Web Hosting

**Long-term play:** Bundle DoppelDown with domain purchases.
- "You just bought mybrand.com. Want to monitor for squatters? $5/mo add-on."
- This is a volume game — not Day 1, but plant the seed
- Targets: Crazy Domains (Australian), VentraIP, Namecheap partnership program

### Cybersecurity Vendors & Distributors

**Richard's existing relationships are key here.** Any vendor or distributor he works with could become a referral partner.

- **SIEM/SOAR vendors:** DoppelDown alerts integrate into their platform (API)
- **Email security vendors:** Complement their email protection with domain/web monitoring
- **Cyber insurance brokers:** Brand monitoring as a risk-reduction requirement

---

## 8. Email Outreach Templates

### Warm Email (For People Richard Knows)

**Subject:** Quick question about [their company]

> Hey [First Name],
>
> Hope you're well. Quick one — I've been building a side project that I think you'd either use yourself or know someone who would.
>
> It's called DoppelDown — brand protection SaaS. Basically, it scans for fake domains, phishing sites, and social media accounts impersonating your brand. Think BrandShield or Netcraft, but $49/mo instead of $50K/year.
>
> I ran a quick check on [their company domain] and [either: "found a few interesting things I'd love to show you" OR "it looks clean, but ongoing monitoring is where the real value is"].
>
> Would you be up for a 10-minute look? There's a free tier, so zero risk to try it.
>
> [link]
>
> Cheers,
> Richard

### Cold Email — E-Commerce Brand

**Subject:** Someone might be impersonating [their brand] — free check

> Hi [First Name],
>
> I'm reaching out because [their brand] is exactly the type of business that gets targeted by domain squatting and phishing.
>
> We built DoppelDown specifically for businesses like yours — it monitors for fake domains, phishing sites, and social media impersonation. We're the only brand protection tool with transparent pricing ($49–$249/mo) and a free tier. Every competitor charges $15K–$250K/year.
>
> I'd love to run a free scan on [their domain] and share what we find. No strings attached — if there are no threats, I'll tell you that too.
>
> Would a quick scan be useful?
>
> Richard
> Founder, DoppelDown
> [website]

**Follow-up (3 days later, no response):**

> Hi [First Name],
>
> Just bumping this — I ran a preliminary check on [their domain] and found [X domain variations / X potential issues] worth looking at.
>
> Happy to share the details if you've got 2 minutes. Here's the free scan: [link]
>
> Richard

### Cold Email — SaaS / Tech Company

**Subject:** Your brand is more exposed than you think

> Hi [First Name],
>
> Random question: do you know how many domains have been registered that look similar to [their domain]?
>
> For most SaaS companies, the answer is 5–20+ — and at least a few are being used for phishing or customer impersonation.
>
> I built DoppelDown to solve this. It's brand protection for businesses that can't (or don't want to) spend $50K/year on enterprise tools.
>
> - Self-serve signup, results in 5 minutes
> - $49/mo (or free to start)
> - AI-powered domain, phishing, and social media monitoring
>
> Would it be useful if I ran a free scan and sent you what I find?
>
> Richard
> DoppelDown.com

### Cold Email — MSP/MSSP

**Subject:** New revenue line: brand protection for your clients at $49/mo

> Hi [First Name],
>
> I'm a fellow cybersecurity professional building a brand protection platform (DoppelDown) that I think could be a great fit for MSPs.
>
> Here's the gap: your clients' brands are being targeted by phishing and domain impersonation. The existing tools (BrandShield, Netcraft, ZeroFox) cost $30K–$250K/year — impossible to sell to SMB clients.
>
> DoppelDown does the core detection for $49–$249/mo:
> - Domain squatting and typosquatting detection
> - Phishing site identification
> - Social media impersonation monitoring
> - Email infrastructure abuse checks (O365 spoofing)
>
> You could mark this up and offer it as part of your managed security package. I'm offering MSP partners a 20% discount and free evaluation with 3 client brands.
>
> Worth a 15-minute chat to see if it fits your stack?
>
> Richard
> DoppelDown.com

### The "Found Something" Email (Most Effective)

**This is the highest-converting email you can send.** Before reaching out to anyone, run a free scan on their domain. If you find anything — even domain variations that *might* be suspicious — lead with that.

**Subject:** Found 4 domains impersonating [their company] — wanted you to know

> Hi [First Name],
>
> This might seem random, but I ran your domain ([their domain]) through my brand protection tool and found a few things:
>
> - [domain-variation-1].com — registered [date], hosting active
> - [domain-variation-2].net — registered [date], MX records configured (possible email phishing)
> - [domain-variation-3].com — similar visual layout to your site
> - 2 social media accounts using your brand name
>
> Might be nothing. Might be worth investigating.
>
> I built DoppelDown specifically to catch this stuff early. Happy to give you a free account to monitor your brand ongoing.
>
> [link]
>
> Richard

**Why this works:** You're providing immediate, specific, *free* value. You're not asking for anything. You're showing them a problem they didn't know they had. The product demo is built into the outreach.

---

## 9. Pricing Page as a Marketing Asset

### The SEO Opportunity

"Brand protection pricing" and "brand protection cost" are keywords with:
- Moderate search volume (buyers actively searching)
- Almost zero good content (because competitors don't publish prices)
- High commercial intent (people searching this are ready to buy)
- Low competition (nobody is trying to rank for these terms)

**DoppelDown's pricing page should be the single best page on the internet for understanding brand protection costs.**

### Pricing Page Structure

**URL:** `/pricing`
**Title tag:** `Brand Protection Pricing | Plans from $49/mo | DoppelDown`
**Meta description:** `Transparent brand protection pricing. Free tier, $49–$249/mo paid plans. Compare with enterprise alternatives ($15K–$250K/year). No sales calls, no hidden costs.`

**Page layout:**

```
[Hero Section]
"Brand Protection That Doesn't Require a Sales Call"
"From free to $249/mo. That's it. No hidden costs, no 'Contact Sales' runarounds."

[Pricing Cards — 4 Tiers]
Free / Starter $49 / Professional $99 / Business $249
(Detailed feature comparison table below cards)

[Comparison Section — THE SEO GOLD]
"How DoppelDown Compares to Enterprise Brand Protection"
(Full comparison table with competitor names and estimated costs)

[FAQ Section — Long-Tail SEO]
- "How much does brand protection cost?"
- "What's the cheapest brand protection tool?"
- "Do I need brand protection for my small business?"
- "What's included in the free tier?"
- "Can I cancel anytime?"
- "How does DoppelDown compare to BrandShield?"
- "Is there a setup fee?"

[CTA]
"Still not sure? Try the free tier. No credit card required."
```

### The Competitor Comparison Table (SEO Magnet)

This table should live on the pricing page AND as a standalone blog post:

| Feature | DoppelDown Free | DoppelDown Starter | DoppelDown Pro | BrandShield | Red Points | Netcraft | ZeroFox |
|---------|----------------|-------------------|----------------|-------------|------------|----------|---------|
| Price | $0 | $49/mo | $99/mo | ~$30K+/yr | ~$15K+/yr | ~$25K+/yr | ~$30K+/yr |
| Self-serve signup | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Public pricing | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Domain monitoring | ✅ (1) | ✅ (3) | ✅ (10) | ✅ | ✅ | ✅ | ✅ |
| Phishing detection | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Social monitoring | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Takedown assistance | ❌ | Basic | Full | Full managed | Full managed | Full managed | Full managed |
| Free tier | ✅ | — | — | ❌ | ❌ | ❌ | ❌ |
| Minimum commitment | None | Monthly | Monthly | Annual contract | Annual contract | Annual contract | Annual contract |

### Additional SEO Pages to Create

Each of these becomes a landing page that captures competitor search traffic:

| Page | URL | Target Keyword |
|------|-----|---------------|
| DoppelDown vs BrandShield | `/compare/brandshield` | brandshield alternative, brandshield pricing |
| DoppelDown vs Red Points | `/compare/red-points` | red points alternative, red points pricing |
| DoppelDown vs Bolster | `/compare/bolster` | bolster.ai alternative, bolster pricing |
| DoppelDown vs Netcraft | `/compare/netcraft` | netcraft alternative, netcraft brand protection pricing |
| DoppelDown vs ZeroFox | `/compare/zerofox` | zerofox alternative, zerofox pricing |
| Brand Protection for SMBs | `/brand-protection-small-business` | brand protection small business |
| Brand Protection Pricing Guide | `/brand-protection-pricing-guide` | brand protection pricing, brand protection cost |

**Each comparison page follows the same template:**
1. Brief intro: "Looking for a [Competitor] alternative?"
2. Side-by-side feature comparison table
3. Key differences (pricing, self-serve, contract terms)
4. "Who is [Competitor] best for?" (be fair — they're better for enterprise)
5. "Who is DoppelDown best for?" (SMBs, startups, agencies, MSPs)
6. CTA: Try DoppelDown free

---

## 10. Key Metrics to Track

### North Star Metric

**Monthly Recurring Revenue (MRR)**

Everything else feeds into this. But MRR alone doesn't tell you if you're healthy. Track the layers below it.

### Dashboard: The 10 Metrics That Matter

Track these weekly. Put them in a simple spreadsheet or Notion database until you outgrow it.

| # | Metric | Target (Month 1) | Target (Month 3) | How to Track |
|---|--------|------------------|------------------|-------------|
| 1 | **MRR** | $500 | $2,000 | Stripe dashboard |
| 2 | **Total signups (free + paid)** | 25 | 100 | Supabase user count |
| 3 | **Free → Paid conversion rate** | 15% | 20% | Paid users / total signups |
| 4 | **Paid customers** | 5–10 | 20–30 | Stripe active subscriptions |
| 5 | **Churn rate (monthly)** | <10% | <5% | Cancelled / total at start of month |
| 6 | **Scans run per user** | 3+ in first week | 5+ in first month | Supabase scan_jobs table |
| 7 | **Threats detected per brand** | N/A (depends on brand) | Track average | Supabase threats table |
| 8 | **Time to first scan** | <10 min after signup | <5 min | Track signup → first scan timestamps |
| 9 | **Website visitors** | 500 | 2,000 | Google Analytics / Plausible |
| 10 | **Outreach response rate** | 30% (warm), 5% (cold) | Improve by 2x | Track in spreadsheet |

### Funnel Metrics

```
Website Visitors → Signups → First Scan → Activated → Paid → Retained
                     ↓           ↓            ↓          ↓        ↓
                   Track:     Track:       Track:     Track:   Track:
                   Conv %    % who scan   % who see  Conv %    Churn
                   (>5%)     in day 1     threats    (>15%)    (<5%/mo)
                             (>60%)       (>40%)
```

**Key drop-off points to monitor:**
1. **Visitor → Signup:** Is the landing page converting? (Target: >5%)
2. **Signup → First Scan:** Are users completing onboarding? (Target: >60% same day)
3. **First Scan → Activated:** Did the scan find threats? (If not, product issue)
4. **Activated → Paid:** Are they seeing enough value to pay? (Target: >15%)
5. **Paid → Retained:** Are they staying? (Target: <5% monthly churn)

### Content & Channel Metrics

| Channel | Metric | Target |
|---------|--------|--------|
| LinkedIn posts | Impressions per post | 1,000+ |
| LinkedIn posts | Engagement rate | >3% |
| LinkedIn DMs | Response rate | >25% |
| Blog posts | Organic traffic per post (month 3+) | 100+ visits/mo |
| Blog posts | Time on page | >3 min |
| Product Hunt | Upvotes | 100+ |
| Product Hunt | Signups from PH | 25+ |
| Reddit | Post upvotes | 50+ |
| Reddit | Signups from Reddit | 10+ |
| Cold email | Open rate | >40% |
| Cold email | Reply rate | >5% |
| Cold email | Signup rate | >2% |

### Weekly Review Template

Every Sunday, spend 20 minutes reviewing:

```markdown
## Week [X] Review — [Date]

### Numbers
- MRR: $___
- New signups this week: ___
- New paid customers: ___
- Churn: ___
- Website visitors: ___

### What Worked
- [Best performing outreach/content/channel this week]

### What Didn't Work
- [Lowest performing effort]

### Customer Feedback
- [Quotes, complaints, feature requests]

### Next Week Focus
- [ ] Top 3 actions for next week
```

### When to Celebrate 🎉

| Milestone | What It Means |
|-----------|--------------|
| First signup | Someone cares |
| First paid customer | You have a business |
| $500 MRR | 10 customers believe in this |
| $1,000 MRR | Product-market fit signal |
| $5,000 MRR | Quit-your-job territory is visible |
| $10,000 MRR | You've built a real SaaS business |
| 100 customers | Word of mouth kicks in |
| First inbound customer (no outreach) | The marketing machine is working |
| First MSP partner deal | Distribution unlocked |

---

## Appendix: Quick-Reference Cheat Sheet

### Richard's Daily GTM Routine (30 min/day)

| Time | Action | Duration |
|------|--------|----------|
| Morning | Check new signups, respond to any within 1 hour | 5 min |
| Morning | Send 2–3 outreach messages (warm or cold) | 10 min |
| Lunch | Comment on 3–5 LinkedIn posts in cybersecurity/MSP space | 10 min |
| Evening | Review metrics, respond to any customer messages | 5 min |

**Weekly additions:**
- Monday: Write or publish 1 LinkedIn post
- Wednesday: Send 5–10 cold emails
- Friday: One community post (Reddit, HN, or forum)
- Sunday: 20-minute weekly review

### The Pitch in Different Lengths

**One sentence:**
> "DoppelDown is brand protection for $49/mo — the only tool with transparent pricing in a market where everyone charges $50K+/year."

**30 seconds:**
> "Every brand protection tool costs $15K–$250K/year and makes you talk to a sales rep. DoppelDown does the same AI-powered detection — phishing sites, fake domains, social impersonation — for $49 a month with a free tier. Sign up, add your brand, and see threats in 5 minutes. No sales call."

**2 minutes:**
> "If someone registers a domain that looks like your business and uses it to phish your customers, how would you know? Most businesses wouldn't — not until a customer complains, or worse.
>
> Enterprise companies pay $50K–$250K a year for tools that monitor this. Small and mid-size businesses? They get told 'you're too small for us' by every vendor.
>
> I built DoppelDown to fix that. It's brand protection SaaS at $49–$249/mo with a free tier. Self-serve, no sales call, results in 5 minutes.
>
> We scan for domain squatting, phishing sites, social media impersonation, and email infrastructure abuse. AI-powered risk scoring tells you what's worth worrying about. And we're the only tool in the entire market with transparent pricing on the website.
>
> I'm looking for early customers who want to protect their brand without signing a six-figure contract. Want to try it?"

---

*This playbook is a living document. Update it weekly based on what's actually working.*
