# Loom Frontend

React + TypeScript dashboard for Loom. Uploads a CSV once, holds the full
`/analyze` response in memory, and renders KPIs, charts, an executive
summary, and a searchable feedback explorer — no further backend calls.

See [`../CLAUDE.md`](../CLAUDE.md) and
[`../Loom_Source_of_Truth.md`](../Loom_Source_of_Truth.md) for the product spec.

## Stack

- React 19 + TypeScript, Vite
- Tailwind CSS v4 (CSS-variable design tokens, light/dark)
- Recharts for charts
- Hand-built shadcn-style primitives (`components/ui/`) — cva + Tailwind, no external UI runtime
- Color system follows the dataviz color-by-job method: fixed-order categorical hues for
  categories (never cycled), reserved status colors for sentiment/urgency (they're status
  fields, not arbitrary series). Validated with the dataviz skill's contrast/CVD checks.

## Structure

```
src/
├── api/          fetch wrapper for POST /analyze
├── components/
│   ├── ui/        Button, Card, Badge, Input, Select, Table primitives
│   └── charts/    category/theme/sentiment/urgency charts
├── hooks/         useAnalyze (upload state machine), useDebouncedValue
├── lib/           cn() helper, taxonomy → color mapping
├── pages/         Dashboard (the single view)
└── types/         taxonomy.ts + api.ts, mirroring the backend schemas exactly
```

## Setup

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL if the backend isn't on localhost:8000
npm run dev
```

Requires the backend running (see `../backend/README.md`) for real data — the
UI itself has no fallback/mock mode.

## Scripts

- `npm run dev` — dev server
- `npm run build` — typecheck + production build
- `npm run lint` — oxlint
