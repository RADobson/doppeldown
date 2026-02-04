# Admin: Model API Credits Dashboard

This page shows **remaining credits / balances** for model providers, and is **restricted** to users with email domains:
- `@dobsondevelopment.com.au`
- `@doppeldown.com`

## Where it lives
- UI: `/dashboard/admin/model-usage`
- API: `/api/admin/model-usage`

## Access control
- Sidebar link "Admin" only appears for allowed email domains.
- API route is server-guarded and returns 401/redirect for non-allowed users.

## Providers supported
### OpenAI
- Uses: `https://api.openai.com/v1/dashboard/billing/credit_grants`
- Requires env: `OPENAI_API_KEY`

### OpenRouter
- Uses: `https://openrouter.ai/api/v1/credits`
- Requires env: `OPENROUTER_API_KEY`

### Anthropic / Moonshot
- Some account types don’t expose a stable public "remaining credits" endpoint.
- The dashboard will show a "console-only" note unless/until we add a verified endpoint.
- Env placeholders supported:
  - `ANTHROPIC_API_KEY`
  - `MOONSHOT_API_KEY` or `KIMI_API_KEY`

## Production setup (Vercel)
Add env vars in **Vercel → Project → Settings → Environment Variables**:
- `OPENAI_API_KEY`
- `OPENROUTER_API_KEY` (if using OpenRouter)
- (Optional) `ANTHROPIC_API_KEY`
- (Optional) `MOONSHOT_API_KEY` / `KIMI_API_KEY`

Redeploy after adding env vars.

## Notes
- This dashboard intentionally does **not** expose keys to the browser.
- It fetches balances server-side and renders a simple summary UI.
