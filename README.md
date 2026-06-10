# Ballot Brief

A voter research web app for exploring congressional candidates' public records — voting history, sponsored legislation, cosponsorships, leadership roles, and the candidates most relevant to a voter's locality.

**Research before you vote.**

## Features

- **Candidate directory** — Browse and search current members of Congress by name, state, chamber, and party.
- **Personalized voter profile** — Save state, House district, ZIP code, and issue priorities locally in the browser.
- **My races dashboard** — Automatically narrows federal candidates to the voter's senators and U.S. House district.
- **Candidate comparison** — Compare two candidates side by side and jump into their full records.
- **Voting records** — House roll-call votes from the Congress.gov API (118th Congress onward).
- **Legislation** — Bills a candidate sponsored or cosponsored, with links to bill detail pages.
- **Member profiles** — Party, district, leadership roles, contact info, and tenure.
- **State/local election path** — A dedicated local-races page documents the data model and integration steps needed for exact local ballots.

## Data sources

Live data comes from the official [Congress.gov API](https://api.congress.gov/). Sign up for a free API key at [api.congress.gov/sign-up](https://api.congress.gov/sign-up/).

**Known limitations:**

- House roll-call votes are available via Congress.gov; Senate roll-call votes are not yet exposed in the API.
- This MVP uses live **federal Congress** data. The profile model and `/local-races` page prepare the app for state/local data integration.

Without an API key, the app runs in **demo mode** with sample data so you can explore the UI.

## Getting started

```bash
npm install
cp .env.example .env.local
# Add your CONGRESS_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Key routes:

- `/members` — national exploratory browsing
- `/profile` — save locality and issue priorities in browser storage
- `/dashboard` — personalized "my races" view
- `/compare` — side-by-side candidate comparison
- `/local-races` — state/local race support plan

## Tech stack

- [Next.js](https://nextjs.org/) 16 (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- Congress.gov API v3

## Project structure

```
src/
  app/              # Pages (home, members, bills, profile, dashboard, compare)
  components/       # UI components
  lib/
    congress-api.ts # Congress.gov API client
    demo-data.ts    # Sample data for demo mode
    member-utils.ts # Filtering and formatting helpers
    profile-storage.ts # Browser profile persistence
    types.ts        # Shared TypeScript types
```

## Roadmap ideas

- Senate vote ingestion (when Congress.gov adds API support, or via official Senate data)
- Address-to-district lookup and state/local candidate coverage
- Vote topic filters and party-alignment summaries
- Authenticated accounts so a saved voter profile follows users across devices
- Ballot measure research

## License

MIT
