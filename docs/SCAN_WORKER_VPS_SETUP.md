# DoppelDown — Scan Worker on Oracle Ampere VPS (Setup)

DoppelDown uses a background worker to process `scan_jobs` rows. Without the worker, scans stay **queued** forever.

Worker source:
- `scripts/scan-worker.ts`

The worker needs **service-role** access because it updates `scan_jobs`, `scans`, `threats`, uploads evidence, etc.

---

## 1) Provision the VPS
Assume Ubuntu 22.04 on Oracle Ampere.

Install essentials:
```bash
sudo apt-get update
sudo apt-get install -y git curl ca-certificates
```

Install Node (recommended: Node 20+):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

---

## 2) Clone repo
```bash
git clone https://github.com/RADobson/doppeldown.git
cd doppeldown
```

---

## 3) Configure environment variables (REQUIRED)
Create a `.env` file (or export vars in your service manager):

Minimum required for the worker to run:
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Recommended additional vars (for full scan features):
- Threat intel keys: `VIRUSTOTAL_API_KEY`, `URLSCAN_API_KEY`, `ABUSEIPDB_API_KEY`, etc.
- OpenAI analysis: `OPENAI_API_KEY` (optional)

Example:
```bash
cat > .env <<'EOF'
NEXT_PUBLIC_SUPABASE_URL=https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_key>

SCAN_WORKER_POLL_MS=5000
SCAN_JOB_STALE_MINUTES=30
WORKER_ID=oracle-vps-1

# optional
OPENAI_API_KEY=
SERPAPI_API_KEY=
VIRUSTOTAL_API_KEY=
URLSCAN_API_KEY=
ABUSEIPDB_API_KEY=
EOF
```

---

## 4) Install dependencies
```bash
npm ci
```

---

## 5) Run the worker
### Foreground (quick test)
```bash
node scripts/scan-worker.ts
```
You should see:
- `Scan worker started: <WORKER_ID>`

### Production (recommended): systemd
Install a service:

```bash
sudo tee /etc/systemd/system/doppeldown-scan-worker.service > /dev/null <<'EOF'
[Unit]
Description=DoppelDown Scan Worker
After=network.target

[Service]
Type=simple
WorkingDirectory=/home/ubuntu/doppeldown
EnvironmentFile=/home/ubuntu/doppeldown/.env
ExecStart=/usr/bin/node /home/ubuntu/doppeldown/scripts/scan-worker.ts
Restart=always
RestartSec=3

# Hardening (optional)
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now doppeldown-scan-worker
sudo systemctl status doppeldown-scan-worker --no-pager
```

Logs:
```bash
journalctl -u doppeldown-scan-worker -f
```

---

## 6) Verify it’s working
In Supabase SQL editor (or via admin tooling), check:
- `scan_jobs.status` should move from `queued` → `running` → `completed`
- `scan_jobs.locked_by` and `started_at` should populate

---

## Common failure modes
- **Missing env vars**: worker exits immediately.
- **Service role key invalid**: worker can’t update tables / RLS blocks.
- **No outbound internet**: threat intel calls fail.
- **Long-running scans**: increase VPS resources / reduce scan concurrency (future enhancement).
