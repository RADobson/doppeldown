#!/usr/bin/env node

/**
 * DoppelDown Setup Script
 *
 * This script guides you through setting up DoppelDown for deployment.
 * It will help you configure:
 * 1. Supabase (database & auth)
 * 2. Stripe (payments)
 * 3. Environment variables
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve))

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

const log = {
  info: (msg) => console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  step: (num, msg) => console.log(`\n${colors.bright}${colors.blue}Step ${num}:${colors.reset} ${msg}\n`)
}

async function main() {
  console.log(`
${colors.bright}╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║   ${colors.cyan}DoppelDown Setup Wizard${colors.reset}${colors.bright}                                  ║
║   Brand Protection & Phishing Detection SaaS                  ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝${colors.reset}
`)

  const config = {
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseServiceKey: '',
    stripePublishableKey: '',
    stripeSecretKey: '',
    stripeWebhookSecret: '',
    appUrl: 'http://localhost:3000'
  }

  // Step 1: Supabase Setup
  log.step(1, 'Supabase Setup')
  console.log(`First, you need to create a Supabase project:

1. Go to ${colors.cyan}https://supabase.com${colors.reset}
2. Create a new project (free tier is fine to start)
3. Go to Project Settings > API
4. Copy the following values:
`)

  config.supabaseUrl = await question('Enter your Supabase Project URL: ')
  config.supabaseAnonKey = await question('Enter your Supabase anon/public key: ')
  config.supabaseServiceKey = await question('Enter your Supabase service_role key: ')

  console.log(`
${colors.yellow}IMPORTANT:${colors.reset} Now run the database schema:
1. Go to your Supabase dashboard
2. Click on "SQL Editor" in the sidebar
3. Create a new query
4. Copy the contents of ${colors.cyan}supabase/schema.sql${colors.reset}
5. Run the query

Press Enter when you've completed this step...`)
  await question('')

  // Step 2: Stripe Setup
  log.step(2, 'Stripe Setup')
  console.log(`Next, set up Stripe for payments:

1. Go to ${colors.cyan}https://stripe.com${colors.reset}
2. Create an account (or log in)
3. Go to Developers > API keys
4. Copy your keys (use test keys first):
`)

  config.stripePublishableKey = await question('Enter your Stripe Publishable Key: ')
  config.stripeSecretKey = await question('Enter your Stripe Secret Key: ')

  console.log(`
Now create your subscription products in Stripe:
1. Go to Products in your Stripe dashboard
2. Create 3 products with the following prices:
   - Starter: $49/month
   - Professional: $99/month
   - Enterprise: $249/month
3. Copy each product's Price ID

Press Enter when you've created the products...`)
  await question('')

  const starterPriceId = await question('Enter Starter plan Price ID (price_xxx): ')
  const proPriceId = await question('Enter Professional plan Price ID (price_xxx): ')
  const enterprisePriceId = await question('Enter Enterprise plan Price ID (price_xxx): ')

  // Step 3: App URL
  log.step(3, 'Application URL')
  console.log(`For local development, use: http://localhost:3000
For production, enter your domain (e.g., https://doppeldown.yourdomain.com)
`)

  const appUrlInput = await question('Enter your app URL [http://localhost:3000]: ')
  config.appUrl = appUrlInput || 'http://localhost:3000'

  // Step 4: Create .env file
  log.step(4, 'Creating Environment File')

  const envContent = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${config.supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${config.supabaseAnonKey}
SUPABASE_SERVICE_ROLE_KEY=${config.supabaseServiceKey}

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=${config.stripePublishableKey}
STRIPE_SECRET_KEY=${config.stripeSecretKey}
STRIPE_WEBHOOK_SECRET=${config.stripeWebhookSecret || 'whsec_your_webhook_secret'}

# Stripe Price IDs
STRIPE_STARTER_PRICE_ID=${starterPriceId}
STRIPE_PRO_PRICE_ID=${proPriceId}
STRIPE_ENTERPRISE_PRICE_ID=${enterprisePriceId}

# App Configuration
NEXT_PUBLIC_APP_URL=${config.appUrl}

# Email Configuration (Optional - for alerts)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your_email@gmail.com
# SMTP_PASS=your_app_password
# EMAIL_FROM=alerts@yourdomain.com

# OpenAI Configuration (Optional - for AI analysis)
# OPENAI_API_KEY=your_openai_api_key
# VISION_PROVIDER=openai
# OPENAI_VISION_MODEL=gpt-4o-mini
# OPENAI_INTENT_MODEL=gpt-4o-mini
# OPENAI_TIMEOUT_MS=15000
# OPENAI_INTENT_ENABLED=true
# OPENAI_VISION_ENABLED=true
# PHISHING_INTENT_MAX_CHARS=4000
`

  const envPath = path.join(__dirname, '..', '.env.local')
  fs.writeFileSync(envPath, envContent)
  log.success(`Created ${envPath}`)

  // Step 5: Stripe Webhook (for production)
  log.step(5, 'Stripe Webhook Setup (for production)')
  console.log(`
When you deploy to production, set up a Stripe webhook:

1. Go to Developers > Webhooks in Stripe
2. Add endpoint: ${config.appUrl}/api/stripe/webhook
3. Select events:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_failed
4. Copy the webhook signing secret
5. Add it to your production environment as STRIPE_WEBHOOK_SECRET
`)

  // Final instructions
  console.log(`
${colors.bright}${colors.green}════════════════════════════════════════════════════════════════${colors.reset}
${colors.bright}                    Setup Complete!${colors.reset}
${colors.bright}${colors.green}════════════════════════════════════════════════════════════════${colors.reset}

${colors.bright}Next steps:${colors.reset}

1. Install dependencies:
   ${colors.cyan}npm install${colors.reset}

2. Start the development server:
   ${colors.cyan}npm run dev${colors.reset}

3. Open ${colors.cyan}http://localhost:3000${colors.reset} in your browser

4. Sign up for an account and add your first brand!

${colors.bright}For deployment to Vercel:${colors.reset}

1. Push your code to GitHub
2. Connect to Vercel: ${colors.cyan}https://vercel.com/new${colors.reset}
3. Add all environment variables from .env.local
4. Deploy!

${colors.bright}Marketing Tips to Get Customers:${colors.reset}

1. Post on ProductHunt, IndieHackers, HackerNews
2. Create content about brand protection on LinkedIn
3. Reach out to startup founders and marketing agencies
4. Set up Google Ads targeting "brand protection" keywords
5. Offer a generous free trial (14 days)
6. Partner with domain registrars or hosting companies

${colors.yellow}Estimated Revenue:${colors.reset}
- 10 customers at $99/month = $990/month
- Focus on the Professional tier for best margins

Good luck with your SaaS! 🚀
`)

  rl.close()
}

main().catch(console.error)
