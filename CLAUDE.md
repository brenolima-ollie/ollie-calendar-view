# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is an **automated calendar view system** for managing ~60 product launches and campaigns across 7 operations (Ollie BR/MX/CO/CL/EU, Noma Beauty, Joomi Beauty). The system features 100% automatic synchronization from Google Sheets to a Next.js static site deployed on Vercel.

**Live Site:** https://ollie-calendar-view.vercel.app

## Architecture

### Data Flow (100% Automatic)

```
Google Sheets (collaborative editing)
         ↓ (public CSV export)
GitHub Actions (runs every 5 minutes)
         ↓ (fetch-from-sheets.py)
app/data.json (generated)
         ↓ (git commit if changes detected)
Vercel Auto-Deploy (~2 min)
         ↓
Live Site Updated
```

**Total time from edit to live:** 5-7 minutes

### Key Components

1. **fetch-from-sheets.py** - Python script that:
   - Extracts SHEET_ID and GID from Google Sheets URL using regex
   - Downloads public CSV export (no authentication required)
   - Generates automatic IDs based on date (YYYYMMDD-NNN format)
   - Removes "Owner" column for privacy
   - Converts to JSON for Next.js consumption
   - Handles datetime serialization properly

2. **.github/workflows/update-from-sheets.yml** - GitHub Actions workflow:
   - Cron: `*/5 * * * *` (every 5 minutes)
   - Uses conditional commit (only commits if data changed)
   - Requires secrets: `GOOGLE_SHEETS_URL` and `PAT_TOKEN`

3. **Next.js App** - Static site with:
   - Client-side rendering (`"use client"`)
   - Month-based navigation
   - Color-coded by geography/brand
   - Real-time stats calculation

## Common Commands

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Build for production (outputs to /out)
npm start            # Preview production build
npm run lint         # Run ESLint
```

### Data Sync

**Local testing of sync script:**
```bash
# Set environment variable and run
export SHEETS_URL="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?gid=YOUR_GID"
python fetch-from-sheets.py

# Verify output
cat app/data.json
```

**Manual trigger GitHub Actions:**
- Go to: https://github.com/brenolima-ollie/ollie-calendar-view/actions
- Select "Update Calendar from Google Sheets"
- Click "Run workflow"

## Data Structure

### Google Sheets Columns (Required)

| Column | Type | Example | Notes |
|--------|------|---------|-------|
| Data | Date (YYYY-MM-DD) | 2026-01-15 | Required for ID generation |
| Nome | Text | Hidratante Labial | Product/campaign name |
| Geografia | Dropdown | Ollie BR, Ollie MX, Noma BR, Joomi BR, etc. | Used for color coding |
| Tipo | Dropdown | Lançamento, Campanha, Nova Operação | Event type |
| Esforço | Dropdown | P, M, G | Effort level (Pequeno, Médio, Grande) |
| Status | Dropdown | 🟢 Live, 🟡 Em Dev, 🔴 Crítico, ⏳ Backlog, etc. | Current status |
| Notas | Text | "Aguardando estoque" | Optional notes |

**Note:** "Owner" column is automatically removed from the output JSON for privacy.

### Generated JSON Structure

```typescript
interface CalendarEvent {
  ID: string;          // Auto-generated: YYYYMMDD-NNN
  Data: string;        // YYYY-MM-DD
  Nome: string;
  Geografia: string;
  Tipo: string;
  Esforço: string;
  Status: string;
  Notas: string;
}
```

## Important Implementation Details

### Google Sheets GID Extraction

The script supports **non-default tabs** by extracting the `gid` parameter:

```python
# Handles URLs like:
# https://docs.google.com/spreadsheets/d/SHEET_ID/edit?gid=842080294
gid_match = re.search(r'gid=([0-9]+)', SHEETS_URL)
GID = gid_match.group(1) if gid_match else '0'
```

**CSV Export URL format:**
```
https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv&gid={GID}
```

### GitHub Actions Git Strategy

**IMPORTANT:** The workflow uses a simple checkout and push strategy:

```yaml
- uses: actions/checkout@v3
  with:
    ref: main  # Always fetches latest
```

**Do NOT add `git pull` steps** - they cause "unstaged changes" errors in scheduled runs. The checkout with `ref: main` already ensures the latest version.

### Vercel Integration

- Vercel auto-deploys on every push to `main`
- No configuration needed beyond initial GitHub connection
- Static export uses `output: 'export'` in next.config.js

## Color Coding by Geography

Colors are defined in `tailwind.config.ts` and used in components:

```typescript
const COLORS: Record<string, string> = {
  "Ollie BR": "#E7002A",   // Red
  "Ollie MX": "#FF502C",   // Orange
  "Ollie CO": "#C9A0DC",   // Purple
  "Ollie EU": "#75AADB",   // Blue
  "Ollie CL": "#F8BBD9",   // Pink
  "Noma BR": "#F5E6D3",    // Nude/Beige
  "Joomi BR": "#FFB6C1",   // Pink
  "Ollie CB": "#4CAF50",   // Green (cross-border)
};
```

To add new geographies, update both `tailwind.config.ts` and component files.

## Troubleshooting

### Workflow Fails with "rejected push"

**Do NOT add `git pull --rebase`** - this was already tried and causes issues.

The correct fix is already in place:
- Checkout uses `ref: main` to get latest
- Push directly to `origin main`
- If rare conflicts occur, workflow will retry in 5 minutes

### HTTP 400 from Google Sheets

Check that:
1. Sheet is shared with "Anyone with link" = Viewer
2. `GOOGLE_SHEETS_URL` includes the correct `gid` parameter
3. The tab you want to sync is not hidden/protected

### Data not updating on site

1. Check GitHub Actions runs: https://github.com/brenolima-ollie/ollie-calendar-view/actions
2. Verify last successful run timestamp
3. Check Vercel deployments dashboard
4. Note: Total delay is 5-7 minutes (5 min cron + 2 min Vercel deploy)

## Files to NOT Modify

- `app/data.json` - Auto-generated by GitHub Actions (changes will be overwritten)
- `.github/workflows/update-from-sheets.yml` - Critical automation (test changes carefully)

## Documentation References

- **DEVELOPMENT-LOG.md** - Complete development history with all problems/solutions
- **GOOGLE-SHEETS-SETUP.md** - Step-by-step Google Sheets configuration
- **IDEAL-PROMPT.md** - Reference for similar projects (what prompt would have saved time)
- **README-SYNC.md** - Alternative sync methods (mostly obsolete)

## Limitations

1. **5-minute delay** - GitHub Actions cron runs every 5 minutes (not instant)
2. **No real-time collaboration indicators** - Site shows final state, not who's editing
3. **1000 row limit** - Script doesn't paginate (current usage ~60 events)
4. **Public CSV required** - Google Sheets must be viewable by anyone with link

## Tech Stack

- **Next.js 16** - App Router with React Server Components
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Vercel** - Hosting and deployment
- **GitHub Actions** - Automation
- **Python 3.10 + Pandas** - Data processing
