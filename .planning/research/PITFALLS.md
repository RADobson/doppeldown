# Pitfalls Research: v1.2 Polish

**Domain:** B2B SaaS Polish (Landing Page Redesign, UI Polish, Dark Mode)
**Researched:** 2026-01-27
**Overall Confidence:** HIGH (verified with multiple 2026 sources)

## Executive Summary

Polish milestones are deceptively dangerous. The risk isn't technical complexity but scope creep, broken workflows, and alienating existing users. Teams frequently underestimate how "just polish" spirals into feature development, how redesigns break learned behaviors, and how dark mode exposes hardcoded assumptions throughout the codebase.

**Critical insight:** Revolutionary redesigns fail more often than evolutionary ones. Users resist change even when designs are objectively better. Success requires incremental rollouts, extensive testing, and preserving functional anchors that users rely on.

---

## Landing Page Pitfalls

### Critical: Redesigning for Existing Customers

**What goes wrong:** Existing customers bookmark or link directly to landing pages. A redesign that changes URLs, CTAs, or navigation breaks their workflows. Worse, redesigning for new acquisition can confuse existing customers trying to access their accounts.

**Why it happens:** Teams focus solely on acquisition metrics and forget existing users interact with the landing page.

**Consequences:**
- Lost customers unable to find login
- Support tickets surge during rollout
- Existing customers see messaging that doesn't apply to them
- Broken inbound links from docs/emails

**Prevention:**
- Maintain URL structure (use redirects if URLs must change)
- Preserve login/dashboard access paths
- Test with existing customer segments, not just prospects
- A/B test gradually (not big-bang rollout)
- Add "existing customer?" shortcuts prominently

**Detection:** Monitor bounce rates and support tickets from logged-in vs logged-out traffic during rollout.

**Phase to address:** Phase 1 (Landing Page) - Add testing plan that includes existing customer flows.

---

### Critical: Design Over Outcomes

**What goes wrong:** Pages that win design awards can still underperform if they lack clarity, proof, or clear next steps. Teams optimize for aesthetics instead of conversion.

**Why it happens:** Designers prioritize visual impact, stakeholders have subjective opinions, and teams lack conversion baseline data.

**Consequences:**
- Lower conversion rates despite "better" design
- Unclear value proposition
- Users bounce because they don't understand what product does
- Wasted redesign effort

**Prevention:**
- Establish conversion baseline BEFORE redesign
- Treat landing page as conversion system, not visual asset
- Test headline/value prop variations first (copy matters more than visuals)
- Include clear proof points and next steps
- Validate with A/B testing against current page

**Detection:** Conversion rate drops or fails to improve post-redesign.

**Phase to address:** Phase 1 (Landing Page) - Set success metrics before design work begins.

---

### High: Buzzword-Heavy Copy

**What goes wrong:** Copy stuffed with "seamless," "AI-powered," "revolutionary," "game-changing" communicates nothing. About 95% of B2B landing pages have this problem. Users can't determine if product solves their actual problem.

**Why it happens:** Teams copy competitor language, avoid specificity, or try to sound impressive rather than clear.

**Prevention:**
- Use specific, concrete language about what product does
- Show don't tell (use screenshots/demos instead of adjectives)
- Test copy with non-technical users
- Remove every buzzword that could apply to any product
- Focus on user problems, not product features

**Detection:** Users say "I don't understand what this does" in testing.

**Phase to address:** Phase 1 (Landing Page) - Content audit before design work.

---

### High: Slow Loading Times

**What goes wrong:** Landing page redesigns often add visual flourishes (gradients, 3D shapes, animations, high-res images) that tank performance. Slow pages increase bounce rate and hurt conversion.

**Consequences:**
- Higher bounce rate
- Lower conversion rate
- Worse SEO rankings
- Poor mobile experience

**Prevention:**
- Set performance budget before design (target load time < 2s)
- Optimize images (WebP, lazy loading, compression)
- Minimize JavaScript for decorative elements
- Test on throttled connections
- Monitor Core Web Vitals

**Detection:** Performance monitoring shows degradation; bounce rate increases on slower connections.

**Phase to address:** Phase 1 (Landing Page) - Performance testing as gate before launch.

---

### Medium: One-Size-Fits-All Content

**What goes wrong:** Single landing page for all roles/industries fails to address critical questions for each decision-maker. A CTO, VP of Finance, and operations lead need different information.

**Why it happens:** Easier to maintain one page than multiple variants.

**Prevention:**
- Create role-specific landing pages if targeting multiple personas
- Use dynamic content based on traffic source
- Test "Who are you?" hero section that directs to tailored sub-pages
- Prioritize primary persona if resources limited

**Detection:** Low engagement from specific traffic segments.

**Phase to address:** Phase 1 (Landing Page) - Define primary persona early; defer multi-persona support to post-v1.2.

---

### Medium: Form Placement Issues

**What goes wrong:** Most B2B landing pages put forms at the top before visitors understand if product solves their problem. Premature friction kills conversion.

**Prevention:**
- Place forms after value proposition and proof points
- Use progressive disclosure (start with low-commitment CTA)
- Test form length (fewer fields usually convert better)
- For high-value offers, forms can be longer

**Detection:** High form abandonment rate, low form completion.

**Phase to address:** Phase 1 (Landing Page) - CTA placement testing.

---

### Low: Rare, Large Redesigns

**What goes wrong:** Teams that treat landing pages as static assets and do infrequent large redesigns see worse results than teams that iterate continuously with weekly/biweekly tests.

**Prevention:**
- Build continuous testing into roadmap
- Start A/B testing immediately post-launch
- Make small, measurable improvements
- Track landing page as living product, not project

**Phase to address:** Post-v1.2 - Establish continuous optimization process.

---

## UI Polish Pitfalls

### Critical: Breaking Existing User Workflows

**What goes wrong:** Redesigns aren't just visual, they're psychological. Users invest in existing workflows, and familiarity often trumps efficiency. Even elegant upgrades fail when learned behaviors are disrupted without clear signposting. When a redesign reshuffles or hides elements behind icons or global menus, the user's internal map breaks, causing them to feel lost and productivity to drop.

**Why it happens:** Teams optimize for new user experience and forget existing users have muscle memory. Design is done in isolation without observing real user workflows.

**Consequences:**
- User backlash and negative feedback
- Support ticket surge
- Productivity drops as users relearn interface
- Power users abandon product
- Churn increases

**Prevention:**
- Map critical user workflows BEFORE redesign
- Preserve "functional anchors" - core interaction patterns users rely on
- Use evolutionary approach (series of small changes) not revolutionary (complete overhaul)
- Beta test with power users first
- Provide in-app migration guides for changed workflows
- Allow gradual rollout with opt-in period

**Detection:** Support tickets about "where did X go?", negative app store reviews, increased session duration without increased outcomes.

**Phase to address:** Phase 2 (UI Polish) - User workflow audit must precede design work.

---

### Critical: Scope Creep (Polish → Features)

**What goes wrong:** "Just polish" milestones spiral into feature development. "While we're redesigning this page, let's add..." becomes the default mindset. Feature creep causes projects to go over budget and extend deadlines.

**Why it happens:** Poor planning, insufficient product strategy, misaligned priorities. Lack of clear scope definition. Stakeholders see design mockups and request additions.

**Consequences:**
- Missed deadlines
- Budget overruns
- Original polish goals get diluted
- Team frustration
- Polish never ships

**Prevention:**
- Written scope of work approved by stakeholders BEFORE work begins
- Explicit "anti-scope" list (what we're NOT doing)
- Treat feature requests as v1.3 backlog items, not v1.2 additions
- Time-box polish work
- Track "just polish" vs "new functionality" ruthlessly
- "It doesn't have to be perfect—it just has to ship"

**Detection:** Timeline slips, design mockups include new elements not in current app, engineers ask "is this polish or a feature?"

**Phase to address:** Phase 0 (Planning) - Define scope boundaries explicitly. Phase 2/3/4 - Gate reviews to prevent scope expansion.

---

### High: Inadequate Regression Testing

**What goes wrong:** A superficial UI migration can break critical workflows if underlying dependencies aren't mapped. One of the biggest risks in mobile app redesign is regression, where previously working functionality breaks or degrades. Changing a button during migration can break an integration or disrupt a cross-application process.

**Why it happens:** Teams test new UI but don't test all existing functionality. Visual changes seem safe but touch business logic. QA focuses on new changes, not existing features.

**Consequences:**
- Previously working features break
- Data corruption
- Integration failures
- Lost revenue
- Emergency rollback required

**Prevention:**
- Automated regression test suite for critical flows
- Manual QA checklist for all existing features
- Test across devices, browsers, themes
- Feature parity checks (redesigned screens still support existing use cases)
- Don't underestimate how tightly coupled UI elements are to backend logic
- Staged rollout with monitoring
- Visual regression testing (automated screenshot comparison)

**Detection:** Bug reports about features that "used to work," integration failures, unexpected errors in logs.

**Phase to address:** Phase 2/3/4 (All polish phases) - Regression testing gate before each release.

---

### High: UI Complexity Through Incremental Changes

**What goes wrong:** Small UI additions accumulate over time, making interface overly complex and difficult to use. Each change seems minor but compound effect is bloat. Microsoft Word 2000 is the classic example.

**Prevention:**
- Audit current UI complexity BEFORE adding polish
- For each element added, remove one element
- Simplify navigation/IA as part of polish
- User test for cognitive load
- Review entire app holistically, not page-by-page

**Detection:** Users report app feels "cluttered" or "overwhelming," tooltips everywhere, increasing time-to-completion for basic tasks.

**Phase to address:** Phase 2 (UI Polish) - Include simplification goals, not just beautification.

---

### Medium: Inconsistent Design System Application

**What goes wrong:** Polish applied inconsistently across app creates jarring experience. Some pages modern, others dated. Design tokens used in some places, hardcoded values in others.

**Prevention:**
- Audit all pages/components before starting
- Prioritize high-traffic areas if can't polish everything
- Document design system clearly
- Use design tokens/CSS variables consistently
- Create component library
- Phase rollout by feature area, not by pattern

**Detection:** Users comment on inconsistency, QA flags mismatched styles, engineers find hardcoded colors.

**Phase to address:** Phase 2 (UI Polish) - Full UI audit in planning; prioritize coverage areas.

---

### Medium: Ignoring Mobile Experience

**What goes wrong:** Polish work focuses on desktop, mobile becomes afterthought. Poor mobile performance even in B2B leads to lost opportunities and lower search visibility.

**Prevention:**
- Mobile-first design approach
- Test on real devices (not just browser emulation)
- Performance testing on throttled connections
- Touch target sizes, tap-friendly interactions

**Detection:** High mobile bounce rate, mobile conversion rate significantly lower than desktop.

**Phase to address:** Phase 1/2 (Landing Page + UI Polish) - Mobile testing mandatory for all changes.

---

### Low: Over-Polishing (Diminishing Returns)

**What goes wrong:** Time to market often matters more than polish. Teams spend weeks on micro-animations and pixel-perfection that users don't notice while delaying launch.

**Prevention:**
- Set "good enough" criteria upfront
- Time-box polish work
- Ship and iterate rather than perfect before launch
- Track diminishing returns on polish effort

**Detection:** Engineers spending days on details users won't notice, stakeholders endlessly tweaking designs.

**Phase to address:** Phase 0 (Planning) - Define "done" criteria that prevent over-polishing.

---

## Dark Mode Pitfalls

### Critical: Pure Black Backgrounds (#000000)

**What goes wrong:** Pure black backgrounds (#000000) look clean in mockups but brutal in real usage. Human eyes don't love extreme contrast over long sessions - pure white text on pure black is like reading glowing chalk on a void, causing edges to halo and fine strokes to blur.

**Why it happens:** Designers assume "dark mode = black background." Looks striking in Figma.

**Consequences:**
- Eye strain for users
- Poor readability, especially for extended sessions
- Text appears to "glow" and blur
- Accessibility complaints

**Prevention:**
- Use dark grey backgrounds (#121212 to #1E1E1E range)
- Softens contrast without losing dark feeling
- Follow Material Design dark theme guidelines
- Test readability with real users for 15+ minute sessions

**Detection:** User complaints about eye strain, readability issues reported in feedback.

**Phase to address:** Phase 4 (Dark Mode) - Establish color palette before implementation.

---

### Critical: Naive Color Inversion

**What goes wrong:** Many designers invert colors naively, leading to illegible text. Simply flipping the palette results in awkward images, illegible icons, and 'ghost' UI elements. True dark mode design is ground-up, intentional process.

**Why it happens:** Fastest implementation approach, seems like it should work.

**Consequences:**
- Illegible text (dark text on dark background)
- Brand colors look wrong
- Images/logos disappear into background
- Icons invisible or hard to see
- Charts and visualizations break

**Prevention:**
- Create brand-specific dark palette (don't just invert)
- Desaturate accent colors to 70-80% saturation
- Test every component individually
- Adjust logo/images for dark backgrounds
- Build separate color palette for dark mode that maintains brand feel

**Detection:** Dark text on dark background, invisible UI elements, user reports of illegibility.

**Phase to address:** Phase 4 (Dark Mode) - Design dark-specific palette, not inverted light palette.

---

### Critical: Hardcoded Color Values

**What goes wrong:** Common pitfalls include assuming background color is always light, hardcoding text colors, and setting hardcoded background color while using default text color. Dark mode exposes every hardcoded assumption throughout codebase.

**Why it happens:** Original code written without dark mode consideration. CSS values hardcoded instead of using variables.

**Consequences:**
- Dark mode partially works but breaks in unexpected places
- Time-consuming hunt through codebase for hardcoded values
- Inconsistent appearance across app
- Major refactoring required

**Prevention:**
- Use CSS variables / design tokens from day one
- Use semantic naming (--surface-0, --text-primary, not --white, --black)
- Audit codebase for hardcoded color values BEFORE dark mode work
- Use linting rules to prevent hardcoded colors
- Most robust: color-scheme: light dark + data-theme="dark/light" + CSS variables

**Detection:** Grep codebase for hex values (#fff, #000, color codes), search for "color:" in CSS.

**Phase to address:** Phase 3 (Supabase Migration) - Refactor to CSS variables as part of migration prep. Phase 4 (Dark Mode) - Variable-based system required before theme work.

---

### High: Drop Shadow Issues

**What goes wrong:** Drop shadows, which are very common in light mode, do not usually work well when theme is dark. Shadows designed for light backgrounds become invisible or produce wrong effect.

**Prevention:**
- Use elevation through color layers (lighter shades for higher elements)
- Replace shadows with subtle borders/gradients
- Invert shadow direction (lighten instead of darken)
- Test shadow visibility in both themes

**Detection:** Visual regression testing shows missing depth/hierarchy in dark mode.

**Phase to address:** Phase 4 (Dark Mode) - Shadow audit and replacement strategy.

---

### High: Typography Readability Issues

**What goes wrong:** Thin or lightweight fonts can hinder readability as they fade into darker backgrounds. Contrast ratios that worked in light mode fail in dark mode.

**Prevention:**
- Use slightly heavier font weights in dark mode
- Increase letter spacing for readability
- Aim for 4.5:1 contrast ratio for body text, 3:1 for large text
- Use off-white text (#E0E0E0 or #C9D1D9) not pure white
- Run contrast checker to verify WCAG AA compliance

**Detection:** Accessibility testing fails, users report text is hard to read.

**Phase to address:** Phase 4 (Dark Mode) - Typography testing for both themes.

---

### High: Inadequate Visual Regression Testing

**What goes wrong:** Dark text rendering on dark background makes it unreadable. Dark mode settings on iOS render differently than Android. Common visual bugs emerge only in dark mode that functional tests don't catch.

**Why it happens:** Teams test functionality but not visual output. Each theme needs separate test baseline.

**Prevention:**
- Maintain separate visual baselines for light and dark themes
- Run visual regression tests for BOTH themes
- Use tools like Percy, Chromatic, Playwright for automated screenshot comparison
- Test on multiple platforms (iOS, Android, browsers)
- Verify smooth transition when toggling themes mid-session
- Check contrast ratios programmatically

**Detection:** Visual bugs reported by users, inconsistent appearance across platforms.

**Phase to address:** Phase 4 (Dark Mode) - Visual regression testing setup before launch.

---

### Medium: Ignoring System Preferences

**What goes wrong:** If you ignore prefers-color-scheme, you're fighting the platform. Browsers expose this user preference because people already told their OS what they like. Forcing theme or not respecting system default alienates users.

**Prevention:**
- Respect prefers-color-scheme by default
- Listen to prefers-color-scheme changes dynamically
- Allow user override (manual toggle)
- Store preference in localStorage
- Sync preference across devices if auth system exists

**Detection:** Users complain about theme not matching system, theme resets on reload.

**Phase to address:** Phase 4 (Dark Mode) - System preference detection as core requirement.

---

### Medium: Cross-Channel Inconsistency

**What goes wrong:** Mobile apps often contain outbound links that open in external browsers - redirecting visitors to light mode web link from dark-themed app could interfere with user experience. Email notifications, docs, marketing site have different theme than app.

**Prevention:**
- Apply dark mode to all user touchpoints
- Pass theme preference in URLs if possible
- Design emails to work in both themes
- Test complete user journey across channels

**Detection:** User feedback about jarring transitions between app and web.

**Phase to address:** Phase 4 (Dark Mode) - Scope must include all user touchpoints, not just main app.

---

### Medium: Desaturation Neglect

**What goes wrong:** Vibrant accent colors that work in light mode become overbearingly bright in dark mode. Colors need desaturation.

**Prevention:**
- Tone vibrant hues down to 70-80% saturation for dark mode
- Desaturated colors prevent overly bright images
- Still maintain effective contrast ratio
- Test brand colors specifically in dark context

**Detection:** Colors feel too bright/harsh in dark mode, eye strain.

**Phase to address:** Phase 4 (Dark Mode) - Color palette design includes desaturation strategy.

---

### Low: Forced Implementation Without User Choice

**What goes wrong:** Forcing dark mode alienates users. Always offer choice.

**Prevention:**
- Provide toggle in settings
- Remember user preference
- Default to system preference but allow override

**Detection:** User complaints about being unable to use light mode.

**Phase to address:** Phase 4 (Dark Mode) - Toggle is core requirement.

---

## Scope Creep Risks

### Specific Risks for v1.2 (Polish Milestone)

**How polish milestones differ from feature milestones:**
- Polish has no obvious "done" signal (can always polish more)
- Stakeholder opinions are more subjective (everyone has design preferences)
- Easy to justify "just one more thing" since it's visual
- Design reveals missing features that "should have been there"
- Technical debt tempting to fix "while we're here"

**Warning Signs:**

1. **Timeline Extensions**
   - "Just need one more week to perfect X"
   - Design iterations exceed 3 rounds
   - Engineers blocked waiting for final designs

2. **Scope Additions**
   - Mockups include elements not in current app
   - "Since we're redesigning the dashboard, let's add analytics"
   - Technical refactoring justified as "necessary for polish"
   - New user flows introduced under guise of "better UX"

3. **Feature Requests Disguised as Polish**
   - "This page needs more information" → new data fetching
   - "Users need to do X here" → new capability
   - "Let's improve onboarding" → tutorial system
   - "Dark mode should remember per-page" → new preference system

4. **Perfectionism**
   - Endless micro-animation tweaking
   - Pixel-pushing instead of shipping
   - A/B testing every small decision
   - "Not ready to show users yet"

**Prevention Strategies:**

1. **Hard Scope Boundaries**
   - Document explicit anti-scope: "v1.2 will NOT include: [list]"
   - Feature requests go to v1.3 backlog automatically
   - Design freeze date in schedule
   - Time-box polish work (if not shippable by date X, defer item)

2. **Objective Criteria**
   - Define "good enough" upfront with examples
   - Use design system/component library to limit decisions
   - Conversion rate improvement target (landing page)
   - Performance budget (load time targets)
   - Accessibility compliance level (WCAG AA)

3. **Incremental Shipping**
   - Ship Phase 1, then Phase 2, then Phase 3 (don't wait for perfect)
   - Each phase has launch gate review
   - User feedback after each phase informs next
   - "Ship to learn" mindset over "ship when perfect"

4. **Stakeholder Management**
   - Weekly demo prevents "big reveal" surprise requests
   - Decision-making framework (who decides what)
   - Defer decisions when possible ("let's see how users react")
   - Shared definition of "polish" vs "feature"

**Mitigation When Scope Creeps:**

- Call it out explicitly: "This is scope creep"
- Quantify impact: "This adds 2 weeks"
- Force tradeoff decision: "We can do X OR stay on schedule, not both"
- Document decision and reasoning
- Reset expectations with stakeholders

**Phase to address:** Phase 0 (Planning) - Establish scope boundaries and gates. Ongoing - vigilance at each phase review.

---

## Phase-Specific Warnings

| Phase | Likely Pitfall | Mitigation |
|-------|---------------|------------|
| **Phase 1: Landing Page** | Design over outcomes; breaking existing customer flows | Set conversion baseline first; test with existing customers |
| **Phase 2: UI Polish** | Scope creep; breaking user workflows | Hard scope boundaries; user workflow audit |
| **Phase 3: Supabase Migration** | Perfect time for scope creep ("while we're refactoring...") | Strict "migration only" policy; new features go to v1.3 |
| **Phase 4: Dark Mode** | Hardcoded colors everywhere; naive inversion | Refactor to CSS variables in Phase 3; design dark-specific palette |
| **All Phases** | Inadequate regression testing; perfectionism delays | Automated regression suite; time-box polish work |

---

## Sources

**Landing Page:**
- [8 Costly B2B Landing Page Mistakes](https://www.exitfive.com/articles/8-reasons-your-b2b-landing-pages-arent-converting)
- [27 Best SaaS Landing Page Examples](https://unbounce.com/conversion-rate-optimization/the-state-of-saas-landing-pages/)
- [Top Landing Page Design Trends for B2B SaaS in 2026](https://www.saashero.net/content/top-landing-page-design-trends/)
- [A/B Testing for B2B Products: Best Practices](https://www.statsig.com/ab-testing-b2b-best-practices)

**Dark Mode:**
- [Best Practices for Dark Mode in Web Design 2026](https://natebal.com/best-practices-for-dark-mode/)
- [Dark Mode Done Right: Best Practices for 2026](https://medium.com/@social_7132/dark-mode-done-right-best-practices-for-2026-c223a4b92417)
- [Dark Mode Design Best Practices in 2026](https://www.tech-rz.com/blog/dark-mode-design-best-practices-in-2026/)
- [How to Test Dark Mode Effectively](https://www.browserstack.com/guide/how-to-test-apps-in-dark-mode)
- [Dark Mode Design: Trends, Myths, and Common Mistakes](https://webwave.me/blog/dark-mode-design-trends)

**UI Polish & Redesign:**
- [How to Redesign a Legacy UI Without Losing Users](https://xbsoftware.com/blog/legacy-app-ui-redesign-mistakes/)
- [How to Redesign an App: A Proven Step-by-Step Guide (2026)](https://volpis.com/blog/comprehensive-guide-to-app-redesign/)
- [UX/UI Migration Strategy For Your Web Application](https://xbsoftware.com/blog/migrating-your-web-app-to-a-new-ui-ux/)
- [Playbook for Redesigning an Existing Application](https://www.fullstack.com/labs/resources/playbooks/redesigning-existing-application)

**Scope Creep:**
- [Feature Creep: What Causes It and How to Avoid It](https://www.shopify.com/partners/blog/feature-creep)
- [The Product Manager's Guide to Feature Creep](https://theproductmanager.com/product-management/feature-creep/)
- [Managing Scope Creep: 6 Steps](https://ripcorddesigns.com/blog-news/managing-scope-creep-6-steps-to-help-keep-your-product-design-on-track)

**Visual Regression Testing:**
- [Visual Regression Testing in Mobile QA: The 2026 Guide](https://www.getpanto.ai/blog/visual-regression-testing-in-mobile-qa)
- [How to Implement Visual Regression Testing for React with Chromatic](https://oneuptime.com/blog/post/2026-01-15-visual-regression-testing-react-chromatic/view)
- [The UI Visual Regression Testing Best Practices Playbook](https://medium.com/@ss-tech/the-ui-visual-regression-testing-best-practices-playbook-dc27db61ebe0)
