# Demo Tracking System Overview

This demo system lets you test affiliate link tracking and conversion logging without real partners. It is modular and easy to extend.

## Components

1. **/api/track** (GET): Logs a click for a given `linkId` to the `demo_clicks` table in Supabase, then redirects to `/demo-convert?linkId=...`.
2. **/api/convert** (POST): Logs a conversion for a given `linkId` to the `demo_conversions` table in Supabase.
3. **/app/demo-link.js**: Page to generate demo tracking links (hardcoded or custom `linkId`).
4. **/app/demo-convert.js**: Page to simulate a conversion after a click (calls `/api/convert`).
5. **/app/demo-dashboard.js**: Page to view all clicks and conversions for a given `linkId`.

## Usage Flow

1. Go to `/demo-link` and generate a tracking link.
2. Click the generated link (opens `/api/track?linkId=...`).
3. You are redirected to `/demo-convert?linkId=...`. Click the button to simulate a conversion.
4. Go to `/demo-dashboard` and enter your `linkId` to see all clicks and conversions.

## Notes
- All demo data is stored in `demo_clicks` and `demo_conversions` tables in Supabase.
- No changes are made to production logic or partner data.
- All code is commented and modular for easy extension by Claude Sonnet 4, Grok Code Fast 1, or others.

---

**API Endpoints:**
- `/api/track?linkId=demo1` (GET)
- `/api/convert` (POST, body: `{ linkId: "demo1" }`)

**Pages:**
- `/demo-link` (link generator)
- `/demo-convert` (conversion simulation)
- `/demo-dashboard` (view results)

---

For questions or extension, see code comments or ask GitHub Copilot.
