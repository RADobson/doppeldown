# Architecture Patterns: AI Integration for Brand Protection Pipeline

**Domain:** Brand protection SaaS with AI threat analysis
**Researched:** 2026-01-23
**Confidence:** HIGH

## Recommended Architecture

### Overall System Structure

```
[Domain/Web/Social Scanner]
    ↓ captures screenshots
[Screenshot Storage]
    ↓ triggers
[AI Analysis Queue] ← async processing layer
    ↓ batch processes
[Vision API Service] (GPT-4 Vision / Claude Vision)
    ↓ returns results
[AI Analysis Results Storage]
    ↓ enriches
[Threat Records] → [Dashboard Display]
```

**Key principle:** Decouple screenshot capture from AI analysis. Screenshots are captured synchronously during scan, AI analysis runs asynchronously in background with batching for cost control.

### Component Boundaries

| Component | Responsibility | Communicates With | Data Flow Direction |
|-----------|---------------|-------------------|---------------------|
| **Screenshot Capture** | Capture page renders after domain/web scan | Evidence Collector, Supabase Storage | → Screenshots |
| **AI Analysis Queue** | Buffer screenshots for batch processing | Screenshot Storage, AI Analysis Service | Bidirectional |
| **AI Analysis Service** | Call Vision APIs with batched screenshots | Vision API, Cache Layer | → Analysis Results |
| **Cache Layer** | Store AI analysis by screenshot hash | AI Analysis Service, Supabase | Bidirectional |
| **Threat Enrichment** | Merge AI results into threat records | Threat Records, AI Results | → Enriched Threats |
| **Dashboard** | Display AI-scored threats | Threat Records | ← Enriched Threats |

## Data Flow

### Screenshot-to-AI Pipeline

**Phase 1: Capture (Existing Flow)**
```
1. Scan initiated → domain/web/social scanning
2. For each detected threat:
   - Screenshot captured (Puppeteer/API)
   - Stored in Supabase Storage
   - Threat record created with screenshot_url
   - Evidence.screenshots array populated
3. Scan completes, returns immediately
```

**Phase 2: AI Analysis (New Flow)**
```
1. After screenshot capture:
   - Calculate screenshot hash (for deduplication)
   - Check cache for existing analysis
   - If cached: use cached result (90% cost savings)
   - If not cached: add to AI analysis queue

2. AI Queue Worker (background process):
   - Polls queue every N seconds
   - Batches pending screenshots (5-10 at a time)
   - Calls Vision API with batch
   - Stores results in cache + threat records

3. Vision API Call:
   - Input: Screenshot + brand reference image + prompt
   - Prompt: "Compare these images. Score visual similarity (0-100)
             and assess phishing indicators (login forms, urgency language)"
   - Output: { similarity_score, phishing_indicators, threat_level }

4. Result Storage:
   - Update threat record with AI analysis
   - Cache result by screenshot hash
   - Trigger alert if high-severity threshold crossed
```

**Data Model Extension**
```typescript
interface Threat {
  // ... existing fields
  ai_analysis?: {
    similarity_score: number        // 0-100, how visually similar to brand
    phishing_indicators: string[]   // ["login_form", "urgency_language"]
    threat_level: "critical" | "high" | "medium" | "low"
    analyzed_at: string
    analysis_provider: "openai" | "anthropic"
    cached: boolean
  }
  ai_analysis_status?: "pending" | "processing" | "completed" | "failed"
}
```

## Patterns to Follow

### Pattern 1: Async AI Processing with Fire-and-Forget
**What:** Screenshot capture returns immediately, AI analysis happens in background
**When:** AI calls are slow (2-5 sec per image) and expensive ($0.003-0.01 per image)
**Why:** User doesn't wait, costs controlled through batching

**Implementation:**
```typescript
// In runScan() after screenshot capture
async function runScan(...) {
  // ... existing domain/web scanning

  for (const threat of threats) {
    // Capture screenshot (existing)
    const screenshot = await captureScreenshot(threat.url)

    // Store screenshot (existing)
    const screenshotUrl = await uploadToStorage(screenshot)

    // Create threat record with pending AI analysis
    threat.screenshot_url = screenshotUrl
    threat.ai_analysis_status = 'pending'

    // Queue for AI analysis (non-blocking)
    await queueAIAnalysis(threat.id, screenshotUrl)
  }

  // Return immediately, AI analysis continues in background
}

// Background worker
async function processAIQueue() {
  const pending = await getPendingAnalysis(limit: 10)

  // Batch process
  const results = await batchAnalyzeScreenshots(pending)

  // Update threat records
  for (const result of results) {
    await updateThreatWithAI(result.threatId, result.analysis)
  }
}
```

**Sources:**
- [Asynchronous Processing and Message Queues in Agentic AI](https://ranjankumar.in/why-asynchronous-processing-queues-are-the-backbone-of-agentic-ai)
- [Long-Running Tasks with Next.js](https://dev.to/bardaq/long-running-tasks-with-nextjs-a-journey-of-reinventing-the-wheel-1cjg)

### Pattern 2: Semantic Caching by Screenshot Hash
**What:** Cache AI analysis results by screenshot content hash, not URL
**When:** Same phishing page appears on multiple domains
**Why:** 40-60% cache hit rate reduces costs by 90% per cached request

**Implementation:**
```typescript
async function analyzeScreenshot(threatId: string, screenshotUrl: string) {
  // Calculate perceptual hash (tolerates minor differences)
  const imageHash = await calculatePerceptualHash(screenshotUrl)

  // Check cache
  const cached = await getCachedAnalysis(imageHash)
  if (cached) {
    return { ...cached, cached: true, cost: '$0.0003' } // 90% cheaper
  }

  // Call Vision API
  const analysis = await callVisionAPI(screenshotUrl)

  // Cache result
  await cacheAnalysis(imageHash, analysis, ttl: '30 days')

  return { ...analysis, cached: false, cost: '$0.003-0.01' }
}
```

**Cache Storage:**
```sql
CREATE TABLE ai_analysis_cache (
  image_hash TEXT PRIMARY KEY,
  similarity_score INT,
  phishing_indicators JSONB,
  threat_level TEXT,
  analyzed_at TIMESTAMPTZ,
  provider TEXT,
  expires_at TIMESTAMPTZ
);
```

**Sources:**
- [AI API Pricing Guide 2026: Cost Optimization](https://anyapi.ai/blog/ai-api-pricing-guide-2026-cost-comparison-and-how-to-optimize-your-spending)
- [OpenAI Cost Optimization: 14 Strategies](https://www.cloudzero.com/blog/openai-cost-optimization/)

### Pattern 3: Multimodal Analysis Prompt Structure
**What:** Combine screenshot, brand reference, and structured prompt for accurate analysis
**When:** Calling Vision API (GPT-4 Vision or Claude Vision)
**Why:** Structured prompts get consistent, parseable responses

**Prompt Template:**
```typescript
const VISUAL_SIMILARITY_PROMPT = `
You are analyzing a potentially fraudulent website screenshot for brand protection.

TASK: Compare the suspicious screenshot to the legitimate brand reference and assess threat level.

BRAND REFERENCE: [Attach brand's official homepage screenshot]
SUSPICIOUS SITE: [Attach captured screenshot]

Analyze for:
1. Visual Similarity (0-100):
   - Logo similarity
   - Color scheme match
   - Layout similarity
   - Typography match

2. Phishing Indicators:
   - Login/password forms present
   - Urgency language ("act now", "verify", "suspended")
   - Payment/credential requests
   - Fake security badges
   - Typos/poor grammar

3. Threat Assessment:
   - CRITICAL: High visual similarity + credential harvesting
   - HIGH: Moderate similarity + phishing indicators
   - MEDIUM: Some similarity, unclear intent
   - LOW: Minimal similarity or unrelated content

Return JSON:
{
  "similarity_score": <0-100>,
  "phishing_indicators": ["indicator1", "indicator2"],
  "threat_level": "critical|high|medium|low",
  "confidence": <0-100>,
  "reasoning": "Brief explanation"
}
`
```

**Sources:**
- [A Multimodal Phishing Website Detection System Using Explainable AI](https://www.mdpi.com/2504-4990/8/1/11)
- [Intelligent Visual Similarity-Based Phishing Websites Detection](https://www.mdpi.com/2073-8994/12/10/1681)

### Pattern 4: Progressive Enhancement of Existing Pipeline
**What:** Add AI analysis as enhancement layer, not replacement
**When:** Existing rule-based scanning already works
**Why:** Fail gracefully if AI unavailable, maintain existing functionality

**Build Order:**
```
Phase 1: AI Analysis Core
├── Add ai_analysis fields to Threat type
├── Implement Vision API service layer
├── Create simple queue (database table)
└── Background worker that processes queue

Phase 2: Caching Layer
├── Add screenshot hash calculation
├── Create cache table
└── Check cache before API calls

Phase 3: Integration
├── Hook AI queue into existing runScan()
├── Update dashboard to show AI scores
└── Enhance threat display with similarity badges

Phase 4: Optimization
├── Batch API calls (5-10 screenshots)
├── Rate limiting and retry logic
└── Cost monitoring and budget alerts
```

**Sources:**
- [How AI Augments Brand Protection Software](https://www.zerofox.com/blog/ai-brand-protection-software/)
- [Brand Protection Software Best Practices](https://www.netcraft.com/blog/the-comprehensive-guide-to-brand-protection-7-proven-ways-to-protect-your-brand-in-2026)

## Anti-Patterns to Avoid

### Anti-Pattern 1: Synchronous AI Analysis in Scan Request
**What:** Calling Vision API during initial scan request, making user wait
**Why bad:**
- Each Vision API call takes 2-5 seconds
- Scanning 10 threats = 20-50 second wait time
- API routes timeout on Vercel (10-300 sec limits)
- Poor user experience

**Instead:** Fire-and-forget async processing with status updates

**Sources:**
- [Running background jobs in Next.js](https://github.com/vercel/next.js/discussions/33989)
- [How to Run background jobs on Vercel](https://zackproser.com/blog/how-to-run-background-jobs-on-vercel-without-a-queue)

### Anti-Pattern 2: Analyzing Every Screenshot Without Deduplication
**What:** Calling Vision API for identical screenshots on different domains
**Why bad:**
- Phishing kits reuse same template across domains
- 10 identical pages = $0.10 when it should cost $0.01
- Wastes 90% of API budget

**Instead:** Perceptual hash caching with 30-day TTL

### Anti-Pattern 3: Single Screenshot Without Brand Reference
**What:** Analyzing suspicious screenshot in isolation
**Why bad:**
- AI has no comparison baseline
- Results inconsistent across brands
- Can't measure "similarity" without reference

**Instead:** Always include brand's official screenshot as reference image

**Sources:**
- [Visual Similarity-Based Phishing Detection](https://ieeexplore.ieee.org/document/8254506/)

### Anti-Pattern 4: Blocking Entire Scan on AI Failures
**What:** Scan fails if Vision API times out or errors
**Why bad:**
- Third-party API reliability out of your control
- Users expect scan results even if AI unavailable
- Breaks existing functionality

**Instead:** AI analysis optional/additive, mark as `ai_analysis_status: 'failed'` and continue

## Scalability Considerations

| Concern | At 100 threats/day | At 1K threats/day | At 10K threats/day |
|---------|-------------------|-------------------|-------------------|
| **Screenshot Storage** | Supabase Storage (free tier) | Supabase Storage (~$25/mo) | Consider S3 + CloudFront |
| **AI API Costs** | $3-10/day with caching | $30-100/day with caching | $300-1K/day, negotiate bulk pricing |
| **Queue Processing** | Database table + cron job | Redis queue + worker process | BullMQ + multiple workers |
| **Cache Hit Rate** | 40-50% (new users) | 60-70% (established) | 75%+ (mature product) |
| **API Rate Limits** | OpenAI: 500 req/min | May need rate limiter | Enterprise tier or multiple keys |

**Cost Breakdown (with caching):**
- OpenAI GPT-4 Vision: $0.01 per image (first analysis), $0.001 cached
- Anthropic Claude Vision: $0.003 per image, $0.0003 cached
- Expected cache hit rate: 60% after 1 month
- Effective cost per analysis: ~$0.004 (OpenAI), ~$0.0015 (Anthropic)

**Recommendation:** Start with Anthropic Claude Vision for 2x cost savings, switch to OpenAI if accuracy better.

## Implementation Recommendations

### Immediate (Phase 1)
1. **Add AI analysis fields to Threat model** - extend TypeScript types and Supabase schema
2. **Create Vision API service module** - abstract API calls behind service interface
3. **Implement simple queue** - Supabase table with `pending`, `processing`, `completed` statuses
4. **Background worker via cron** - Vercel cron or external scheduler calls `/api/cron/ai-analysis`

### Short-term (Phase 2)
5. **Implement screenshot hashing** - use `perceptual-hash` npm package
6. **Add cache table** - store results with 30-day TTL
7. **Batch API calls** - process 5-10 screenshots per API request (Vision APIs support multiple images)
8. **Dashboard display** - show similarity score and threat level badges

### Long-term (Phase 3+)
9. **Move to Redis queue** - when processing >100 threats/hour
10. **Add cost monitoring** - track API spend per user/brand
11. **A/B test providers** - compare OpenAI vs Anthropic accuracy
12. **Fine-tune prompts** - iterate based on false positive rates

## Technology Choices

| Category | Recommended | Alternative | Why Recommended |
|----------|-------------|-------------|-----------------|
| **Vision API** | Anthropic Claude Vision | OpenAI GPT-4 Vision | 2x cheaper, sufficient accuracy |
| **Queue (MVP)** | Supabase table + Vercel cron | BullMQ + Redis | Simpler for <1K threats/day |
| **Queue (Scale)** | BullMQ + Upstash Redis | AWS SQS | Better Next.js integration |
| **Caching** | Supabase table with TTL | Redis | Simpler, already using Supabase |
| **Image Hashing** | `sharp` + `perceptual-hash` | Custom algorithm | Battle-tested libraries |
| **Storage** | Supabase Storage | AWS S3 | Already integrated |

## Build Order

Recommended sequence for integrating AI analysis:

**Week 1: Foundation**
1. Extend Threat model with AI fields
2. Create Vision API service wrapper
3. Implement queue table and worker
4. Test with single screenshot end-to-end

**Week 2: Optimization**
5. Add screenshot hashing and cache
6. Implement batching (5-10 images/call)
7. Update dashboard with AI scores
8. Add error handling and retries

**Week 3: Polish**
9. Fine-tune prompts based on results
10. Add cost tracking and alerts
11. Implement brand reference screenshot upload
12. Performance testing and optimization

## Sources

### Vision AI Architecture
- [Vision AI: Image and visual AI tools | Google Cloud](https://cloud.google.com/vision)
- [MCP Gateways: AI Agent Architecture in 2026](https://composio.dev/blog/mcp-gateways-guide)
- [OpenAI's Vision API Guide](https://platform.openai.com/docs/guides/vision)

### Async Processing
- [Asynchronous Processing and Message Queues in Agentic AI](https://ranjankumar.in/why-asynchronous-processing-queues-are-the-backbone-of-agentic-ai)
- [Long-Running Tasks with Next.js](https://dev.to/bardaq/long-running-tasks-with-nextjs-a-journey-of-reinventing-the-wheel-1cjg)
- [Running background jobs in Next.js](https://github.com/vercel/next.js/discussions/33989)

### Cost Optimization
- [AI API Pricing Guide 2026: Cost Comparison](https://anyapi.ai/blog/ai-api-pricing-guide-2026-cost-comparison-and-how-to-optimize-your-spending)
- [OpenAI Cost Optimization: 14 Strategies](https://www.cloudzero.com/blog/openai-cost-optimization/)
- [Gemini API Pricing 2026](https://www.aifreeapi.com/en/posts/gemini-api-pricing-2026)

### Phishing Detection
- [A Multimodal Phishing Website Detection System Using Explainable AI](https://www.mdpi.com/2504-4990/8/1/11)
- [Intelligent Visual Similarity-Based Phishing Websites Detection](https://www.mdpi.com/2073-8394/12/10/1681)
- [AI-Powered Phishing Detection Strategies for 2026](https://www.uscsinstitute.org/cybersecurity-insights/blog/ai-powered-phishing-detection-and-prevention-strategies-for-2026)

### Brand Protection
- [How AI Augments Brand Protection Software](https://www.zerofox.com/blog/ai-brand-protection-software/)
- [Brand Protection Guide 2026](https://www.netcraft.com/blog/the-comprehensive-guide-to-brand-protection-7-proven-ways-to-protect-your-brand-in-2026)
- [Brand Intelligence Protects Your Brand | Recorded Future](https://www.recordedfuture.com/products/brand-intelligence)

---
*Architecture research completed 2026-01-23*
