# StudioNow Tools

Small Next.js hub for StudioNow internal tools.

Current sections:
- Rolodex
- Script Creator
- AI Guidelines
- System Map
- Feedback Loop

## Local development

```bash
cd /Users/eli/Downloads/StudioNow/StudioNowRolo/rolodex-app/studionow-tools
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run lint
npm run build
```

## Deploy to Vercel

1. Push this folder to its own GitHub repo, or import it from a monorepo with the root directory set to `rolodex-app/studionow-tools`.
2. In Vercel, create a new project from that repo.
3. Confirm the framework is detected as `Next.js`.
4. If this lives inside a larger repo, set the **Root Directory** to:

```text
rolodex-app/studionow-tools
```

5. Deploy.

This app currently has no environment variables.

## Notes

- `next.config.ts` pins `turbopack.root` so builds do not get confused by higher-level lockfiles.
- Tool links are currently hard-coded in `app/page.tsx`.
