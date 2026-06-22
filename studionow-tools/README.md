# StudioNow Dashboard

Internal StudioNow dashboard for launching current and upcoming tools in a
single workspace.

Current tools:

- Rolodex: approved StudioNow talent, partners, companies, and internal notes
- StudioNow Producer: agentic script writer running on Railway
- Trainer: planned gold-corpus curation workflow

## Local Development

```bash
cd /Users/eli/Downloads/StudioNow/studionow-hub
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

## Deployment

This is a standalone Next.js app. Deploy it as its own Vercel project, or push it
to a StudioNow-owned GitHub repo and import that repo into Vercel.

No environment variables are required right now.

## Tool Links

Tool links are hard-coded in [app/page.tsx](/Users/eli/Downloads/StudioNow/studionow-hub/app/page.tsx):

- `https://studionowrolodex.vercel.app/`
- `https://studionow-producer-production.up.railway.app/`
- Trainer placeholder, not yet linked
