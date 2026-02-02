import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'Complete API reference for the DoppelDown brand protection platform.',
}

/* ------------------------------------------------------------------ */
/*  Tiny building-block components – keeps the page self-contained    */
/* ------------------------------------------------------------------ */

function Badge({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'get' | 'post' | 'patch' | 'delete' | 'info' | 'warn' }) {
  const colors: Record<string, string> = {
    default: 'bg-muted text-muted-foreground',
    get: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    post: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
    patch: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    delete: 'bg-red-500/15 text-red-400 border border-red-500/25',
    info: 'bg-sky-500/15 text-sky-400 border border-sky-500/25',
    warn: 'bg-orange-500/15 text-orange-400 border border-orange-500/25',
  }
  return <span className={`inline-block rounded-md px-2 py-0.5 text-xs font-mono font-semibold ${colors[variant]}`}>{children}</span>
}

function Method({ method }: { method: 'GET' | 'POST' | 'PATCH' | 'DELETE' }) {
  const map: Record<string, 'get' | 'post' | 'patch' | 'delete'> = { GET: 'get', POST: 'post', PATCH: 'patch', DELETE: 'delete' }
  return <Badge variant={map[method]}>{method}</Badge>
}

function Endpoint({ method, path }: { method: 'GET' | 'POST' | 'PATCH' | 'DELETE'; path: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-muted/50 border border-border px-4 py-3 font-mono text-sm">
      <Method method={method} />
      <span className="text-foreground">{path}</span>
    </div>
  )
}

function CodeBlock({ children, title }: { children: string; title?: string }) {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      {title && <div className="border-b border-border bg-muted/30 px-4 py-2 text-xs font-mono text-muted-foreground">{title}</div>}
      <pre className="overflow-x-auto bg-muted/20 p-4 text-sm leading-relaxed"><code className="text-foreground/90">{children}</code></pre>
    </div>
  )
}

function ParamTable({ params }: { params: { name: string; type: string; required: boolean; default?: string; description: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Parameter</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Type</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Required</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((p) => (
            <tr key={p.name} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5 font-mono text-xs text-foreground">{p.name}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{p.type}</td>
              <td className="px-4 py-2.5">{p.required ? <Badge variant="warn">Required</Badge> : <span className="text-muted-foreground text-xs">{p.default ? `Default: ${p.default}` : 'Optional'}</span>}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{p.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ErrorTable({ errors }: { errors: { status: number; code?: string; description: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Code</th>
            <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {errors.map((e, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              <td className="px-4 py-2.5 font-mono text-xs text-red-400">{e.status}</td>
              <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{e.code ?? '—'}</td>
              <td className="px-4 py-2.5 text-muted-foreground">{e.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-2xl font-bold text-foreground mb-6 pb-3 border-b border-border">{title}</h2>
      {children}
    </section>
  )
}

function EndpointSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <div id={id} className="scroll-mt-24 space-y-4 rounded-xl border border-border bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {children}
    </div>
  )
}

function Callout({ children, type = 'info' }: { children: React.ReactNode; type?: 'info' | 'warn' }) {
  const styles = {
    info: 'border-sky-500/30 bg-sky-500/5 text-sky-300',
    warn: 'border-amber-500/30 bg-amber-500/5 text-amber-300',
  }
  return <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>{children}</div>
}

/* ------------------------------------------------------------------ */
/*  Sidebar nav data                                                  */
/* ------------------------------------------------------------------ */

const NAV = [
  { label: 'Authentication', href: '#authentication' },
  {
    label: 'Brands', href: '#brands', children: [
      { label: 'List Brands', href: '#list-brands' },
      { label: 'Create Brand', href: '#create-brand' },
      { label: 'Update Brand', href: '#update-brand' },
      { label: 'Upload Logo', href: '#upload-brand-logo' },
      { label: 'Delete Logo', href: '#delete-brand-logo' },
    ]
  },
  {
    label: 'Scans', href: '#scans', children: [
      { label: 'Start Scan', href: '#start-scan' },
      { label: 'Get Scan Status', href: '#get-scan-status' },
      { label: 'Cancel Scan', href: '#cancel-scan' },
      { label: 'Get Scan Quota', href: '#get-scan-quota' },
      { label: 'Start Social Scan', href: '#start-social-scan' },
      { label: 'Delete Scan', href: '#delete-scan' },
    ]
  },
  {
    label: 'Threats', href: '#threats', children: [
      { label: 'Delete Threat', href: '#delete-threat' },
    ]
  },
  {
    label: 'Evidence', href: '#evidence', children: [
      { label: 'Sign Evidence URL', href: '#sign-evidence-url' },
    ]
  },
  {
    label: 'Reports', href: '#reports', children: [
      { label: 'Generate Report', href: '#generate-report' },
      { label: 'List Reports', href: '#list-reports' },
      { label: 'Delete Report', href: '#delete-report' },
    ]
  },
  {
    label: 'Notifications', href: '#notifications', children: [
      { label: 'Get Notifications', href: '#get-notifications' },
      { label: 'Mark Read', href: '#mark-notifications-read' },
    ]
  },
  {
    label: 'Billing', href: '#billing', children: [
      { label: 'Checkout', href: '#create-checkout-session' },
      { label: 'Portal', href: '#create-portal-session' },
      { label: 'Webhook', href: '#stripe-webhook' },
    ]
  },
  {
    label: 'Admin', href: '#admin', children: [
      { label: 'Audit Logs', href: '#get-audit-logs' },
    ]
  },
  {
    label: 'Cron Jobs', href: '#cron-jobs', children: [
      { label: 'Scan Scheduler', href: '#cron-scan' },
      { label: 'Weekly Digest', href: '#cron-digest' },
      { label: 'NRD Monitor', href: '#cron-nrd' },
    ]
  },
  { label: 'Tier Limits', href: '#tier-limits' },
  { label: 'Error Codes', href: '#error-codes' },
]

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-bold tracking-tight">Doppel<span className="text-blue-500">Down</span></a>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium text-muted-foreground">API Reference</span>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="info">v1.0</Badge>
            <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Dashboard →</a>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside className="hidden lg:block sticky top-[73px] h-[calc(100vh-73px)] w-64 shrink-0 overflow-y-auto border-r border-border py-8 pl-6 pr-4">
          <nav className="space-y-1">
            {NAV.map((item) => (
              <div key={item.href}>
                <a href={item.href} className="block rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                  {item.label}
                </a>
                {item.children && (
                  <div className="ml-3 border-l border-border pl-3 mt-0.5 space-y-0.5">
                    {item.children.map((child) => (
                      <a key={child.href} href={child.href} className="block rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                        {child.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 px-6 py-10 lg:px-12 space-y-16">

          {/* Intro */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Complete reference for the DoppelDown brand protection API. All endpoints are served from <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono">https://doppeldown.com/api</code>.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="info">Base URL: https://doppeldown.com/api</Badge>
              <Badge variant="info">Auth: Supabase Session / Bearer Token</Badge>
              <Badge variant="info">Format: JSON</Badge>
            </div>
          </div>

          {/* ============================================================ */}
          {/* AUTHENTICATION                                               */}
          {/* ============================================================ */}
          <Section id="authentication" title="Authentication">
            <div className="space-y-4">
              <p className="text-muted-foreground">
                DoppelDown uses <strong className="text-foreground">Supabase Auth</strong> for authentication. Browser-based requests use session cookies automatically. For programmatic access, include the access token as a Bearer token.
              </p>
              <CodeBlock title="Authorization Header">{`Authorization: Bearer <supabase_access_token>`}</CodeBlock>
              <Callout type="info">
                <strong>Cron endpoints</strong> use a separate shared secret: <code className="text-xs">Authorization: Bearer &lt;CRON_SECRET&gt;</code>
              </Callout>
              <div className="mt-4">
                <h4 className="font-medium text-foreground mb-2">Common Auth Errors</h4>
                <ErrorTable errors={[
                  { status: 401, description: 'Missing or invalid session / token' },
                  { status: 403, description: 'Valid auth but insufficient permissions (e.g. not admin)' },
                ]} />
              </div>
            </div>
          </Section>

          {/* ============================================================ */}
          {/* BRANDS                                                       */}
          {/* ============================================================ */}
          <Section id="brands" title="Brands">
            <div className="space-y-8">

              <EndpointSection id="list-brands" title="List Brands">
                <Endpoint method="GET" path="/api/brands" />
                <p className="text-sm text-muted-foreground">Retrieve all brands owned by the authenticated user, ordered by creation date (newest first).</p>
                <CodeBlock title="Response 200">{`[
  {
    "id": "uuid",
    "user_id": "uuid",
    "name": "Acme Corp",
    "domain": "acme.com",
    "keywords": ["acme", "acmecorp"],
    "social_handles": { "twitter": ["@acmecorp"] },
    "enabled_social_platforms": ["twitter", "instagram"],
    "logo_url": "https://...",
    "status": "active",
    "threat_count": 5,
    "created_at": "2025-01-15T00:00:00Z"
  }
]`}</CodeBlock>
                <CodeBlock title="curl">{`curl -X GET https://doppeldown.com/api/brands \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="create-brand" title="Create Brand">
                <Endpoint method="POST" path="/api/brands" />
                <p className="text-sm text-muted-foreground">Create a new brand to monitor. Domain is auto-normalized (strips protocol, www, paths).</p>
                <ParamTable params={[
                  { name: 'name', type: 'string', required: true, description: 'Brand display name' },
                  { name: 'domain', type: 'string', required: true, description: 'Primary domain (auto-normalized)' },
                  { name: 'keywords', type: 'string[]', required: false, description: 'Additional keywords to monitor' },
                  { name: 'social_handles', type: 'object', required: false, description: 'Map of platform → handle arrays' },
                  { name: 'enabled_social_platforms', type: 'string[]', required: false, description: 'Platforms to scan (max depends on tier)' },
                ]} />
                <ErrorTable errors={[
                  { status: 400, description: 'Missing name or domain' },
                  { status: 403, code: 'BRAND_LIMIT_REACHED', description: 'Plan brand limit exceeded' },
                  { status: 403, code: 'PLATFORM_LIMIT_EXCEEDED', description: 'Too many social platforms for tier' },
                ]} />
                <CodeBlock title="curl">{`curl -X POST https://doppeldown.com/api/brands \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Acme Corp",
    "domain": "https://www.acme.com",
    "keywords": ["acme", "acmecorp"],
    "social_handles": { "twitter": ["@acmecorp"] },
    "enabled_social_platforms": ["twitter", "instagram"]
  }'`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="update-brand" title="Update Brand">
                <Endpoint method="PATCH" path="/api/brands" />
                <p className="text-sm text-muted-foreground">Update an existing brand. Only provided fields are changed. Social handles can be merged or replaced.</p>
                <ParamTable params={[
                  { name: 'brandId', type: 'string', required: true, description: 'Brand UUID to update' },
                  { name: 'name', type: 'string', required: false, description: 'New brand name' },
                  { name: 'domain', type: 'string', required: false, description: 'New primary domain' },
                  { name: 'keywords', type: 'string[]', required: false, description: 'Replacement keywords array' },
                  { name: 'social_handles', type: 'object', required: false, description: 'Social handles (merged by default)' },
                  { name: 'enabled_social_platforms', type: 'string[]', required: false, description: 'Updated enabled platforms' },
                  { name: 'mode', type: 'string', required: false, default: '"merge"', description: '"merge" or "replace" for social_handles' },
                ]} />
                <ErrorTable errors={[
                  { status: 400, description: 'Invalid input or no updates provided' },
                  { status: 403, code: 'PLATFORM_LIMIT_EXCEEDED', description: 'Too many platforms for tier' },
                  { status: 404, description: 'Brand not found or not owned by user' },
                ]} />
                <CodeBlock title="curl">{`curl -X PATCH https://doppeldown.com/api/brands \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "brandId": "uuid-here",
    "keywords": ["acme", "acmecorp", "acme-inc"]
  }'`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="upload-brand-logo" title="Upload Brand Logo">
                <Endpoint method="POST" path="/api/brands/logo" />
                <p className="text-sm text-muted-foreground">Upload a PNG logo for a brand. Max file size: 5 MB.</p>
                <Callout>Content-Type must be <code className="text-xs">multipart/form-data</code>. Only PNG images are accepted.</Callout>
                <ParamTable params={[
                  { name: 'brandId', type: 'string', required: true, description: 'Brand UUID (form field)' },
                  { name: 'logo', type: 'File', required: true, description: 'PNG image file (max 5MB)' },
                ]} />
                <CodeBlock title="Response 200">{`{
  "logo_url": "https://supabase-storage-url/...",
  "storage_path": "brands/{brandId}/logo/{timestamp}-{uuid}-{name}.png"
}`}</CodeBlock>
                <CodeBlock title="curl">{`curl -X POST https://doppeldown.com/api/brands/logo \\
  -H "Authorization: Bearer $TOKEN" \\
  -F "brandId=uuid-here" \\
  -F "logo=@/path/to/logo.png"`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="delete-brand-logo" title="Delete Brand Logo">
                <Endpoint method="DELETE" path="/api/brands/logo" />
                <p className="text-sm text-muted-foreground">Remove a brand&apos;s logo from storage and clear the URL.</p>
                <ParamTable params={[
                  { name: 'brandId', type: 'string', required: true, description: 'Brand UUID' },
                ]} />
                <CodeBlock title="curl">{`curl -X DELETE https://doppeldown.com/api/brands/logo \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "brandId": "uuid-here" }'`}</CodeBlock>
              </EndpointSection>

            </div>
          </Section>

          {/* ============================================================ */}
          {/* SCANS                                                        */}
          {/* ============================================================ */}
          <Section id="scans" title="Scans">
            <div className="space-y-8">

              <EndpointSection id="start-scan" title="Start Scan">
                <Endpoint method="POST" path="/api/scan" />
                <p className="text-sm text-muted-foreground">Queue a new scan for a brand. Enforces manual scan quotas per tier (free: 3 per 7 days, paid: unlimited).</p>
                <ParamTable params={[
                  { name: 'brandId', type: 'string', required: true, description: 'Brand UUID to scan' },
                  { name: 'scanType', type: 'string', required: false, default: '"full"', description: 'full | quick | domain_only | web_only | social_only' },
                ]} />
                <CodeBlock title="Response 200">{`{
  "message": "Scan queued",
  "scanId": "uuid",
  "jobId": "uuid"
}`}</CodeBlock>
                <ErrorTable errors={[
                  { status: 400, description: 'Missing brandId' },
                  { status: 404, description: 'Brand not found' },
                  { status: 409, description: 'Scan already queued or running for this brand' },
                  { status: 429, code: 'QUOTA_EXCEEDED', description: 'Manual scan quota exceeded (includes quota object)' },
                ]} />
                <CodeBlock title="curl">{`curl -X POST https://doppeldown.com/api/scan \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "brandId": "uuid-here", "scanType": "full" }'`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="get-scan-status" title="Get Scan Status">
                <Endpoint method="GET" path="/api/scan?id={scanId}" />
                <p className="text-sm text-muted-foreground">Retrieve details and progress for a specific scan.</p>
                <ParamTable params={[
                  { name: 'id', type: 'string', required: true, description: 'Scan UUID (query parameter)' },
                ]} />
                <CodeBlock title="Response 200">{`{
  "id": "uuid",
  "brand_id": "uuid",
  "scan_type": "full",
  "status": "running",
  "threats_found": 3,
  "domains_checked": 150,
  "pages_scanned": 42,
  "created_at": "2025-01-15T10:00:00Z",
  "completed_at": null,
  "error": null
}`}</CodeBlock>
                <CodeBlock title="curl">{`curl -X GET "https://doppeldown.com/api/scan?id=uuid-here" \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="cancel-scan" title="Cancel Scan">
                <Endpoint method="POST" path="/api/scan/cancel" />
                <p className="text-sm text-muted-foreground">Cancel a queued or running scan. Sets both the scan and its jobs to cancelled/failed status.</p>
                <ParamTable params={[
                  { name: 'scanId', type: 'string', required: true, description: 'Scan UUID to cancel' },
                ]} />
                <CodeBlock title="Response 200">{`{ "message": "Scan cancelled", "scanId": "uuid" }`}</CodeBlock>
                <CodeBlock title="curl">{`curl -X POST https://doppeldown.com/api/scan/cancel \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "scanId": "uuid-here" }'`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="get-scan-quota" title="Get Scan Quota">
                <Endpoint method="GET" path="/api/scan/quota" />
                <p className="text-sm text-muted-foreground">Check the current user&apos;s manual scan quota. Free tier has a 7-day rolling window; paid tiers are unlimited.</p>
                <CodeBlock title="Response 200 (Free tier)">{`{
  "limit": 3,
  "used": 1,
  "remaining": 2,
  "resetsAt": 1705363200000,
  "isUnlimited": false
}`}</CodeBlock>
                <CodeBlock title="Response 200 (Paid tier / Admin)">{`{
  "limit": null,
  "used": 0,
  "remaining": null,
  "resetsAt": null,
  "isUnlimited": true
}`}</CodeBlock>
                <CodeBlock title="curl">{`curl -X GET https://doppeldown.com/api/scan/quota \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="start-social-scan" title="Start Social Scan">
                <Endpoint method="POST" path="/api/scan/social" />
                <p className="text-sm text-muted-foreground">Queue a social-media-only scan targeting specific platforms.</p>
                <ParamTable params={[
                  { name: 'brandId', type: 'string', required: true, description: 'Brand UUID' },
                  { name: 'platforms', type: 'string[]', required: false, default: 'All 8 platforms', description: 'Platforms to scan' },
                ]} />
                <CodeBlock title="Response 200">{`{
  "success": true,
  "message": "Social scan queued",
  "scanId": "uuid",
  "jobId": "uuid",
  "platforms": ["twitter", "instagram", "tiktok"]
}`}</CodeBlock>
                <ErrorTable errors={[
                  { status: 409, description: 'Scan already queued or running for this brand' },
                ]} />
                <CodeBlock title="curl">{`curl -X POST https://doppeldown.com/api/scan/social \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "brandId": "uuid-here",
    "platforms": ["twitter", "instagram", "tiktok"]
  }'`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="delete-scan" title="Delete Scan">
                <Endpoint method="DELETE" path="/api/scans/{id}" />
                <p className="text-sm text-muted-foreground">Permanently delete a scan and cascade-delete all associated threats and evidence files.</p>
                <Callout type="warn">This action is irreversible. All threats and evidence screenshots linked to this scan will be permanently deleted.</Callout>
                <CodeBlock title="Response 200">{`{ "success": true }`}</CodeBlock>
                <CodeBlock title="curl">{`curl -X DELETE https://doppeldown.com/api/scans/uuid-here \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
              </EndpointSection>

            </div>
          </Section>

          {/* ============================================================ */}
          {/* THREATS                                                      */}
          {/* ============================================================ */}
          <Section id="threats" title="Threats">
            <div className="space-y-8">
              <EndpointSection id="delete-threat" title="Delete Threat">
                <Endpoint method="DELETE" path="/api/threats/{id}" />
                <p className="text-sm text-muted-foreground">Permanently delete a threat and its evidence files. Creates an audit log entry.</p>
                <Callout type="warn">Evidence screenshots are removed from storage on a best-effort basis.</Callout>
                <CodeBlock title="Response 200">{`{ "success": true }`}</CodeBlock>
                <CodeBlock title="curl">{`curl -X DELETE https://doppeldown.com/api/threats/uuid-here \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
              </EndpointSection>
            </div>
          </Section>

          {/* ============================================================ */}
          {/* EVIDENCE                                                     */}
          {/* ============================================================ */}
          <Section id="evidence" title="Evidence">
            <div className="space-y-8">
              <EndpointSection id="sign-evidence-url" title="Sign Evidence URL">
                <div className="space-y-2">
                  <Endpoint method="POST" path="/api/evidence/sign" />
                  <Endpoint method="GET" path="/api/evidence/sign?threatId={id}&kind={kind}" />
                </div>
                <p className="text-sm text-muted-foreground">Generate a time-limited signed URL for accessing evidence files (screenshots or HTML snapshots). Supports both GET and POST.</p>
                <ParamTable params={[
                  { name: 'threatId', type: 'string', required: true, description: 'Threat UUID' },
                  { name: 'kind', type: 'string', required: false, default: '"screenshot"', description: '"screenshot" or "html"' },
                  { name: 'index', type: 'number', required: false, default: '0', description: 'Index of the evidence item' },
                  { name: 'expiresIn', type: 'number', required: false, default: '3600', description: 'TTL in seconds (60–86400)' },
                ]} />
                <CodeBlock title="Response 200">{`{
  "signedUrl": "https://supabase-storage/...",
  "expiresIn": 3600,
  "bucket": "evidence",
  "path": "threats/{id}/screenshot-0.png"
}`}</CodeBlock>
                <CodeBlock title="curl (POST)">{`curl -X POST https://doppeldown.com/api/evidence/sign \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "threatId": "uuid-here", "kind": "screenshot", "expiresIn": 7200 }'`}</CodeBlock>
              </EndpointSection>
            </div>
          </Section>

          {/* ============================================================ */}
          {/* REPORTS                                                      */}
          {/* ============================================================ */}
          <Section id="reports" title="Reports">
            <div className="space-y-8">

              <EndpointSection id="generate-report" title="Generate Report">
                <Endpoint method="POST" path="/api/reports" />
                <p className="text-sm text-muted-foreground">Generate a takedown report for threats associated with a brand. Returns a downloadable file.</p>
                <ParamTable params={[
                  { name: 'brandId', type: 'string', required: true, description: 'Brand UUID' },
                  { name: 'threatIds', type: 'string[]', required: false, default: 'All unresolved', description: 'Specific threat UUIDs to include' },
                  { name: 'format', type: 'string', required: false, default: '"html"', description: 'html | text | csv | json' },
                  { name: 'ownerName', type: 'string', required: false, default: 'User email', description: 'Name for "brand owner" field' },
                ]} />
                <Callout>
                  Response is a file download, not JSON. The <code className="text-xs">X-Report-Id</code> header contains the report record UUID.
                </Callout>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Format</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Content-Type</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Extension</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { format: 'html', ct: 'text/html', ext: '.html' },
                        { format: 'text', ct: 'text/plain', ext: '.txt' },
                        { format: 'csv', ct: 'text/csv', ext: '.csv' },
                        { format: 'json', ct: 'application/json', ext: '.txt' },
                      ].map((r) => (
                        <tr key={r.format} className="border-b border-border last:border-0">
                          <td className="px-4 py-2.5 font-mono text-xs text-foreground">{r.format}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.ct}</td>
                          <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{r.ext}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <CodeBlock title="curl">{`curl -X POST https://doppeldown.com/api/reports \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "brandId": "uuid-here",
    "format": "html",
    "ownerName": "Acme Legal Team"
  }' \\
  -o takedown-report.html`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="list-reports" title="List Reports">
                <Endpoint method="GET" path="/api/reports" />
                <p className="text-sm text-muted-foreground">List all generated reports, optionally filtered by brand.</p>
                <ParamTable params={[
                  { name: 'brandId', type: 'string', required: false, description: 'Filter by brand UUID (query parameter)' },
                ]} />
                <CodeBlock title="Response 200">{`[
  {
    "id": "uuid",
    "brand_id": "uuid",
    "threat_ids": ["uuid-1", "uuid-2"],
    "type": "takedown_request",
    "status": "ready",
    "created_at": "2025-01-15T10:00:00Z",
    "brands": { "user_id": "uuid", "name": "Acme Corp" }
  }
]`}</CodeBlock>
                <CodeBlock title="curl">{`curl -X GET "https://doppeldown.com/api/reports?brandId=uuid-here" \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="delete-report" title="Delete Report">
                <Endpoint method="DELETE" path="/api/reports/{id}" />
                <p className="text-sm text-muted-foreground">Delete a report record. Creates an audit log entry.</p>
                <CodeBlock title="Response 200">{`{ "success": true }`}</CodeBlock>
                <CodeBlock title="curl">{`curl -X DELETE https://doppeldown.com/api/reports/uuid-here \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
              </EndpointSection>

            </div>
          </Section>

          {/* ============================================================ */}
          {/* NOTIFICATIONS                                                */}
          {/* ============================================================ */}
          <Section id="notifications" title="Notifications">
            <div className="space-y-8">

              <EndpointSection id="get-notifications" title="Get Notifications">
                <Endpoint method="GET" path="/api/notifications" />
                <p className="text-sm text-muted-foreground">Retrieve up to 50 notifications (newest first) plus the unread count.</p>
                <CodeBlock title="Response 200">{`{
  "notifications": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "type": "threat_detected",
      "title": "New threat found",
      "message": "Suspicious domain acme-corp.xyz detected",
      "read": false,
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "unread_count": 3
}`}</CodeBlock>
                <CodeBlock title="curl">{`curl -X GET https://doppeldown.com/api/notifications \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="mark-notifications-read" title="Mark Notifications Read">
                <Endpoint method="PATCH" path="/api/notifications" />
                <p className="text-sm text-muted-foreground">Mark specific notifications or all notifications as read.</p>
                <ParamTable params={[
                  { name: 'ids', type: 'string[]', required: false, description: 'Specific notification UUIDs to mark read' },
                  { name: 'mark_all_read', type: 'boolean', required: false, description: 'Set true to mark all as read' },
                ]} />
                <Callout>One of <code className="text-xs">ids</code> or <code className="text-xs">mark_all_read</code> must be provided.</Callout>
                <CodeBlock title="curl (mark all)">{`curl -X PATCH https://doppeldown.com/api/notifications \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "mark_all_read": true }'`}</CodeBlock>
                <CodeBlock title="curl (specific IDs)">{`curl -X PATCH https://doppeldown.com/api/notifications \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "ids": ["uuid-1", "uuid-2"] }'`}</CodeBlock>
              </EndpointSection>

            </div>
          </Section>

          {/* ============================================================ */}
          {/* BILLING                                                      */}
          {/* ============================================================ */}
          <Section id="billing" title="Billing (Stripe)">
            <div className="space-y-8">

              <EndpointSection id="create-checkout-session" title="Create Checkout Session">
                <Endpoint method="POST" path="/api/stripe/checkout" />
                <p className="text-sm text-muted-foreground">Start a Stripe Checkout flow to subscribe to a plan. Returns a redirect URL.</p>
                <ParamTable params={[
                  { name: 'plan', type: 'string', required: true, description: '"starter", "professional", or "enterprise"' },
                ]} />
                <CodeBlock title="Response 200">{`{ "url": "https://checkout.stripe.com/c/pay/..." }`}</CodeBlock>
                <ErrorTable errors={[
                  { status: 400, description: 'Invalid plan or Stripe price ID not configured' },
                ]} />
                <CodeBlock title="curl">{`curl -X POST https://doppeldown.com/api/stripe/checkout \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{ "plan": "professional" }'`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="create-portal-session" title="Create Portal Session">
                <Endpoint method="POST" path="/api/stripe/portal" />
                <p className="text-sm text-muted-foreground">Open the Stripe Customer Portal for managing subscriptions, invoices, and payment methods.</p>
                <CodeBlock title="Response 200">{`{ "url": "https://billing.stripe.com/p/session/..." }`}</CodeBlock>
                <ErrorTable errors={[
                  { status: 400, description: 'No subscription found (user has no Stripe customer ID)' },
                ]} />
                <CodeBlock title="curl">{`curl -X POST https://doppeldown.com/api/stripe/portal \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="stripe-webhook" title="Stripe Webhook">
                <Endpoint method="POST" path="/api/stripe/webhook" />
                <p className="text-sm text-muted-foreground">Receives Stripe webhook events. Configured in the Stripe Dashboard — not called directly by clients.</p>
                <Callout>Authenticated via <code className="text-xs">stripe-signature</code> header, not Bearer tokens.</Callout>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Event</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { event: 'checkout.session.completed', action: 'Activates subscription, sets tier' },
                        { event: 'customer.subscription.updated', action: 'Updates subscription status and tier' },
                        { event: 'customer.subscription.deleted', action: 'Resets user to free tier' },
                        { event: 'invoice.payment_failed', action: 'Sets subscription to past_due' },
                      ].map((r) => (
                        <tr key={r.event} className="border-b border-border last:border-0">
                          <td className="px-4 py-2.5 font-mono text-xs text-foreground">{r.event}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{r.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </EndpointSection>

            </div>
          </Section>

          {/* ============================================================ */}
          {/* ADMIN                                                        */}
          {/* ============================================================ */}
          <Section id="admin" title="Admin">
            <div className="space-y-8">
              <EndpointSection id="get-audit-logs" title="Get Audit Logs">
                <Endpoint method="GET" path="/api/admin/audit-logs" />
                <p className="text-sm text-muted-foreground">Retrieve system audit logs. <strong className="text-foreground">Admin only</strong> — requires the <code className="text-xs">is_admin</code> flag on the user record.</p>
                <ParamTable params={[
                  { name: 'entity_type', type: 'string', required: false, description: 'Filter by entity: scan, threat, report' },
                  { name: 'user_id', type: 'string', required: false, description: 'Filter by user UUID' },
                  { name: 'limit', type: 'number', required: false, default: '100', description: 'Results per page (max 500)' },
                  { name: 'offset', type: 'number', required: false, default: '0', description: 'Pagination offset' },
                ]} />
                <CodeBlock title="Response 200">{`{
  "logs": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "user_email": "admin@example.com",
      "action": "DELETE",
      "entity_type": "threat",
      "entity_id": "uuid",
      "metadata": {
        "brand_id": "uuid",
        "threat_type": "typosquat_domain",
        "severity": "high"
      },
      "created_at": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 42,
  "limit": 100,
  "offset": 0
}`}</CodeBlock>
                <ErrorTable errors={[
                  { status: 403, description: 'User is not an admin' },
                ]} />
                <CodeBlock title="curl">{`curl -X GET "https://doppeldown.com/api/admin/audit-logs?entity_type=scan&limit=50" \\
  -H "Authorization: Bearer $TOKEN"`}</CodeBlock>
              </EndpointSection>
            </div>
          </Section>

          {/* ============================================================ */}
          {/* CRON JOBS                                                    */}
          {/* ============================================================ */}
          <Section id="cron-jobs" title="Cron Jobs">
            <Callout>These endpoints are called by an external scheduler (e.g. Vercel Cron) and require <code className="text-xs">Authorization: Bearer &lt;CRON_SECRET&gt;</code>.</Callout>
            <div className="space-y-8 mt-6">

              <EndpointSection id="cron-scan" title="Automated Scan Scheduler">
                <Endpoint method="GET" path="/api/cron/scan" />
                <p className="text-sm text-muted-foreground">Queues automated scans for all active brands based on tier-specific scan frequency. Adds random jitter (0–5 min) to spread load.</p>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Tier</th>
                        <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Scan Frequency</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { tier: 'Free', freq: 'Skipped (manual only)' },
                        { tier: 'Starter', freq: 'Every 24 hours' },
                        { tier: 'Professional', freq: 'Every 6 hours' },
                        { tier: 'Enterprise', freq: 'Every 1 hour' },
                      ].map((r) => (
                        <tr key={r.tier} className="border-b border-border last:border-0">
                          <td className="px-4 py-2.5 font-mono text-xs text-foreground">{r.tier}</td>
                          <td className="px-4 py-2.5 text-muted-foreground">{r.freq}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <CodeBlock title="Response 200">{`{
  "success": true,
  "results": { "queued": 12, "skipped": 5, "errors": [] },
  "timestamp": "2025-01-15T10:00:00Z"
}`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="cron-digest" title="Weekly Digest">
                <Endpoint method="GET" path="/api/cron/digest" />
                <p className="text-sm text-muted-foreground">Sends weekly email digests to users with email alerts enabled. Aggregates threats from the past 7 days per brand (max 10 per brand to avoid email clipping).</p>
                <CodeBlock title="Response 200">{`{
  "success": true,
  "results": { "sent": 8, "skipped": 3, "errors": [] },
  "timestamp": "2025-01-15T10:00:00Z"
}`}</CodeBlock>
              </EndpointSection>

              <EndpointSection id="cron-nrd" title="NRD Monitor">
                <Endpoint method="GET" path="/api/cron/nrd" />
                <p className="text-sm text-muted-foreground">
                  Processes newly registered domains against enterprise brands for typosquatting detection. Max execution time: 5 minutes. Enterprise tier only.
                </p>
                <CodeBlock title="Response 200">{`{
  "success": true,
  "results": {
    "domainsProcessed": 50000,
    "matchesFound": 3,
    "threatsCreated": 1,
    "errors": []
  },
  "processingTimeMs": 45000,
  "timestamp": "2025-01-15T10:00:00Z"
}`}</CodeBlock>
              </EndpointSection>

            </div>
          </Section>

          {/* ============================================================ */}
          {/* TIER LIMITS                                                  */}
          {/* ============================================================ */}
          <Section id="tier-limits" title="Tier Limits Reference">
            <div className="overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">Feature</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Free</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Starter</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Professional</th>
                    <th className="px-4 py-3 text-center font-medium text-muted-foreground">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: 'Brands', free: '1', starter: '3', pro: '10', enterprise: 'Unlimited' },
                    { feature: 'Domain variations / scan', free: '25', starter: '100', pro: '500', enterprise: '2,500' },
                    { feature: 'Social platforms', free: '1', starter: '3', pro: '6', enterprise: '8 (all)' },
                    { feature: 'Automated scan frequency', free: 'Manual only', starter: 'Every 24h', pro: 'Every 6h', enterprise: 'Every 1h' },
                    { feature: 'Manual scans', free: '3 / 7 days', starter: 'Unlimited', pro: 'Unlimited', enterprise: 'Unlimited' },
                    { feature: 'NRD monitoring', free: '✗', starter: '✗', pro: '✗', enterprise: '✓' },
                  ].map((r) => (
                    <tr key={r.feature} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 font-medium text-foreground">{r.feature}</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground">{r.free}</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground">{r.starter}</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground">{r.pro}</td>
                      <td className="px-4 py-2.5 text-center text-muted-foreground">{r.enterprise}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              <strong className="text-foreground">Available social platforms:</strong> twitter, facebook, instagram, linkedin, tiktok, youtube, telegram, discord
            </p>
          </Section>

          {/* ============================================================ */}
          {/* ERROR CODES                                                  */}
          {/* ============================================================ */}
          <Section id="error-codes" title="Error Codes">
            <div className="space-y-6">
              <p className="text-sm text-muted-foreground">All error responses follow this format:</p>
              <CodeBlock>{`{ "error": "Human-readable message", "code": "MACHINE_READABLE_CODE" }`}</CodeBlock>

              <h4 className="font-medium text-foreground">Application Error Codes</h4>
              <ErrorTable errors={[
                { status: 403, code: 'BRAND_LIMIT_REACHED', description: 'User has reached their plan\'s brand limit' },
                { status: 403, code: 'PLATFORM_LIMIT_EXCEEDED', description: 'Too many social platforms selected for tier' },
                { status: 429, code: 'QUOTA_EXCEEDED', description: 'Manual scan quota depleted for the current period' },
              ]} />

              <h4 className="font-medium text-foreground">HTTP Status Codes</h4>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                      <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { status: '200', meaning: 'Success' },
                      { status: '400', meaning: 'Bad request / validation error' },
                      { status: '401', meaning: 'Not authenticated' },
                      { status: '403', meaning: 'Forbidden / tier limit reached' },
                      { status: '404', meaning: 'Resource not found' },
                      { status: '409', meaning: 'Conflict (e.g. duplicate scan)' },
                      { status: '429', meaning: 'Rate limited / quota exceeded' },
                      { status: '500', meaning: 'Internal server error' },
                    ].map((r) => (
                      <tr key={r.status} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 font-mono text-xs text-foreground">{r.status}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{r.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Section>

          {/* Footer */}
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>DoppelDown API Documentation — <a href="https://doppeldown.com" className="text-blue-500 hover:underline">doppeldown.com</a></p>
          </div>

        </main>
      </div>
    </div>
  )
}
