# Rajasthan Admission Copilot

Rajasthan-focused admission guidance platform with a React frontend, Vercel serverless API routes, Supabase/Postgres storage, and an OpenAI-powered conversational assistant.

## What is implemented
- Existing college explorer, comparison and responsive UI.
- `POST /api/chat`: server-side AI responses; optionally retrieves published knowledge records from Supabase and instructs the model to disclose missing evidence.
- `POST /api/predict`: compares a student's entered rank with stored historical cutoff rows, filtered by counselling, branch, city and annual fee.
- `supabase/schema.sql`: database tables for admission knowledge and college/program cutoff records.
- Secret keys remain server-side; do not put them in `VITE_*` variables.

## Important accuracy note
This repository does **not** include a verified, automatically refreshed admission dataset. The existing `src/data/colleges.ts` entries are explicitly sample data and must not be presented as official cutoff or fee records. The live predictor uses Supabase rows and may return no results until a maintainer imports verified records. The chatbot is AI-generated; source-grounded answers require published knowledge records. Neither feature guarantees admission or replaces the official counselling portal.

## Setup

### 1. Create Supabase database
1. Create a project in Supabase.
2. Open SQL Editor and run `supabase/schema.sql`.
3. In `admission_knowledge`, insert verified source material and set `is_published = true` only after checking the official document, publication date and applicable academic year.
4. In `college_programs`, insert cutoff rows only from an official allotment/cutoff document. Preserve the counselling process, round, category/quota, year and source URL. Do not mix JEE/JoSAA, REAP, BITSAT or DCE admission merit systems.

### 2. Configure local environment
Copy `.env.example` to `.env.local` for local Vercel development. Fill in:
- `OPENAI_API_KEY`: server-side API key.
- `OPENAI_MODEL`: optional model override (defaults to `gpt-4.1-mini`).
- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: server-side service role key. **Never expose or commit this key.**

For Vercel, add the same variables under Project Settings → Environment Variables, then redeploy. Do not commit `.env.local`.

### 3. Run and test
```bash
npm install
npm run dev
```
The frontend is Vite-based. To test the Vercel `/api/*` functions locally, use Vercel CLI (`vercel dev`) after installing the project's dependencies and setting environment variables. A plain `vite` dev server does not execute Vercel serverless functions.

Test endpoints:
- `POST /api/chat` body: `{"message":"What documents are required?"}`
- `POST /api/predict` body: `{"rank":25000,"branch":"CSE","city":"Jaipur","budget":200000,"counselling":"REAP"}`

## Official sources to curate and verify
Use the current process-specific source; do not assume one admission portal covers every course:
- Rajasthan Department of College Education: https://hte.rajasthan.gov.in/HTE/30981
- DCE online admissions portal: https://dceapp.rajasthan.gov.in/
- Department of Technical Education admissions: https://hte.rajasthan.gov.in/DepartmentofTechnicalEducation/31012
- HTE admission notifications: https://hte.rajasthan.gov.in/HTE/30980

Official pages and schedules can change. Record the source URL and academic year for every imported row, and periodically review whether it remains current.

## Deployment checklist
- [ ] Supabase schema applied.
- [ ] Server-side environment variables set in Vercel.
- [ ] At least one tested, verified knowledge record published.
- [ ] Cutoff records imported with year, round/category/quota and official source URL.
- [ ] AI chat tested with source-backed and unknown-answer questions.
- [ ] Predictor tested for empty database, invalid inputs and filters.
- [ ] Review API rate limits, abuse protection and monitoring before public production use.
