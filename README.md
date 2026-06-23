# LLM Dashboard

A web dashboard for tracking and comparing leading large language models by **benchmark performance** across programming, reasoning, and tool use. It ships with a curated snapshot of 43 notable models and can refresh selected benchmark scores live from public leaderboards and APIs.

Built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4**, **shadcn/ui**, and **Recharts**.

---

## Features

- **Ranked leaderboard** of 43 models with sortable columns and an overall composite score.
- **Category scores** computed from raw benchmarks — System Programming, Web Programming, Reasoning, and Tool Use — plus a blended overall score.
- **Filtering & search** across providers and model attributes.
- **Detail drawer** per model showing the full benchmark grid and metadata.
- **Live data refresh** that pulls fresh scores from four sources and re-computes category scores on demand.

### How scoring works

Each model carries a set of raw benchmark scores. Category scores are weighted averages (see `src/lib/scoring.ts`):

| Category | Benchmarks (weight) |
|---|---|
| System Programming | MultiPL-E (0.5), HumanEval-X (0.3), SWE-bench Pro (0.2) |
| Web Programming | SWE-bench (0.55), LiveCodeBench (0.3), HumanEval (0.15) |
| Reasoning | GPQA Diamond (0.4), MATH AIME (0.35), MMLU-Pro (0.25) |
| Tool Use | BFCL v3 (0.45), MCP-Bench (0.35), τ²-bench (0.2) |
| **Overall** | Programming (0.35), Reasoning (0.35), Tool Use (0.30) |

Missing benchmarks are skipped and weights are renormalized over what's available.

---

## Tech stack

- **Framework:** Next.js 16 (App Router, standalone output, Turbopack build)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Charts:** Recharts
- **Runtime:** Node.js 22

---

## Getting started

### Prerequisites

- Node.js **22+** (or Docker)
- npm

### 1. Clone the repository

```bash
git clone https://github.com/csnakke/llm-dashboard.git
cd llm-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure API keys (optional, for live refresh)

Create a `.env.local` file in the project root (see [API keys](#api-keys) below). The app runs fine **without** keys — it serves the bundled snapshot and the two key-gated sources are simply skipped during a refresh.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Available scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

---

## API keys

The dashboard works out of the box with no keys. Two of the four live-data sources require an API key to refresh their benchmark fields; the other two are public and need no auth.

| Source | Auth | Env variable | Updates |
|---|---|---|---|
| **BFCL** | none | — | `bfcl_v3` |
| **Hugging Face / OpenEvals** | none | — | `swebench`, `swebench_pro`, `gpqa_diamond`, `mmlu_pro`, `math_aime` |
| **LLM Stats** | API key | `LLM_STATS_API_KEY` | `livecodebench` |
| **Artificial Analysis** | API key | `ARTIFICIAL_ANALYSIS_API_KEY` | `tau2_bench`, `livecodebench` |

### Where to add them

Create a file named **`.env.local`** in the project root:

```dotenv
LLM_STATS_API_KEY=your_llm_stats_key_here
ARTIFICIAL_ANALYSIS_API_KEY=your_artificial_analysis_key_here
```

> ⚠️ **`.env.local` is gitignored** (via the `.env*` rule) and must never be committed. Keep your real keys out of version control. If a key is ever exposed, rotate it with the provider.

### Where to get the keys

- **LLM Stats** — `https://llm-stats.com` (API access; sent as `Authorization: Bearer <key>`).
- **Artificial Analysis** — `https://artificialanalysis.ai` (API access; sent as the `x-api-key` header; rate limit ~1000 requests/day).

If a key is missing, that source is skipped on refresh and the rest still update — refreshes degrade gracefully rather than failing.

---

## Live data refresh

Model data is served from a snapshot at `src/data/models.json`. The API route at `src/app/api/models/route.ts` exposes:

- **`GET /api/models`** — returns the bundled snapshot (no network calls).
- **`POST /api/models`** — fetches all four sources concurrently (`Promise.allSettled`), merges matched scores, re-computes category scores, and returns the updated models plus a per-source summary and any errors.

The merge logic lives in `src/lib/live-data/index.ts`; each source has its own fetcher in `src/lib/live-data/`. Note that Artificial Analysis runs after LLM Stats, so its `livecodebench` value takes precedence where both provide one.

---

## Running with Docker

A multi-stage `Dockerfile` and `docker-compose.yml` are included. The compose file injects your keys at runtime via `env_file: .env.local` — they are **not** baked into the image.

```bash
# Build and start in the background
docker compose up --build -d
```

The app is then available at [http://localhost:3000](http://localhost:3000).

- **Compose project name:** `llm-dashboard`
- **Container name:** `llm-dashboard`

```bash
docker compose logs -f      # tail logs
docker compose ps           # status
docker compose down         # stop and remove
```

---

## Project structure

```
src/
├── app/
│   ├── api/models/route.ts     # GET snapshot, POST live refresh
│   ├── layout.tsx              # root layout + metadata
│   └── page.tsx                # dashboard page
├── components/
│   ├── table/                  # leaderboard table, rows, cells, sortable headers
│   ├── filters/                # filter bar
│   ├── drawer/                 # per-model detail drawer + benchmark grid
│   ├── layout/                 # header
│   └── ui/                     # shadcn/ui primitives
├── data/models.json            # 43-model snapshot (source of truth)
├── hooks/                      # useModels, useFilter, useSort
├── lib/
│   ├── scoring.ts              # category & overall score computation
│   ├── constants.ts            # formatting helpers
│   └── live-data/              # bfcl, huggingface, llm-stats, artificial-analysis, index
└── types/models.ts             # Model, BenchmarkScores, CategoryScores, API types
```

---

## Notes

- A few benchmark fields are snapshot-only (no public live source wired): `humaneval`, `humaneval_x`, `multipl_e`, `mcp_bench`.
- The Docker image uses Next.js standalone output and copies `src/data` into the runtime so the snapshot is available at runtime.
