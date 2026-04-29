# StudioNow Talent Search Prototype

Minimal internal talent search prototype built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## What it does

- Shows one homepage with a large natural-language search box.
- Reads talent records from the Supabase `talent` table.
- Displays parsed filters so the user can see how the search was interpreted.
- Shows clean result cards with:
  - `display_name`
  - `primary_role`
  - `secondary_roles`
  - `location_search`
  - `budget_tier`
  - `review_label`
  - `worked_with_us`
  - `portfolio_url`
  - `summary`
- Does not include auth, editing, or intake flows yet.

## Supabase setup

Create a local env file:

```bash
cp .env.example .env.local
```

Set the values:

```bash
SUPABASE_URL=https://vbuokocemgvkrgbzgvgv.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_TALENT_TABLE=StudioNowRolo
```

The anon key is available in the Supabase dashboard under Project Settings, then API. The app only uses the anon key from the server-side API route. This project is configured for your existing `StudioNowRolo` table; if you later create a table or view named `talent`, set `SUPABASE_TALENT_TABLE=talent`. Make sure the table allows read access for this prototype, usually with a select policy if Row Level Security is enabled.

If the API connects but returns `0` rows while the Supabase Table Editor shows data, Row Level Security is hiding the rows from the anon key. For a local internal demo, you can add the server-only service role key to `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret
```

Do not commit the service role key or expose it in browser code.

## Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful commands

```bash
npm run lint
npm run build
```

## GitHub notes

The app is ready to commit. Do not commit `.env.local` or downloaded source spreadsheets. The included `.gitignore` keeps env files, build output, dependencies, and local data exports out of Git.

Suggested first commit:

```bash
git add .
git commit -m "Create Supabase talent search prototype"
```

## Deploy to Vercel

This is the simplest way to put the app on the web for StudioNow teammates.

### 1. Push the repo to GitHub

Create a GitHub repo, then from this folder:

```bash
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Import the repo into Vercel

In Vercel:

1. Click **Add New...**
2. Click **Project**
3. Import the GitHub repo
4. Keep the default framework as **Next.js**
5. Set the root directory to `rolodex-app` if Vercel imports the parent folder instead of this app folder

### 3. Add environment variables in Vercel

Add these in **Project Settings → Environment Variables**:

```bash
SUPABASE_URL=https://vbuokocemgvkrgbzgvgv.supabase.co
SUPABASE_TALENT_TABLE=StudioNowRolo
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret
SUPABASE_ANON_KEY=your-anon-key
```

For the current prototype, `SUPABASE_SERVICE_ROLE_KEY` is what lets the deployed server read the rolodex reliably.

### 4. Deploy

After adding the env vars:

1. Click **Deploy**
2. Wait for the build to finish
3. Open the generated Vercel URL

### 5. Share carefully

Right now the app has no user auth and the deployed server can read the rolodex using the service role key. That means anyone who can access the app URL can use the prototype. Share it only internally unless you add auth or a password gate first.
