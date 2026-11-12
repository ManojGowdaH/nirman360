# NIRMANH360 website

Marketing and legal site for NIRMANH360, a construction materials and equipment marketplace starting in Bengaluru. The site is a Next.js app prepared for Vercel and the domain `https://nirman360.in`.

The mobile product is a separate Flutter and Supabase application. This repository does not contain that app. Website forms do not pretend a message was sent unless a server inbox accepts it.

## What is included

- Nine public routes: home, about, services, partners, contact, FAQ, privacy policy, account deletion and terms.
- A desktop 3D hero built from original geometry. Phones, reduced-motion and low-memory browsers get the photographic scene instead.
- Partner, contact and account-deletion forms with server-side validation.
- SEO metadata, `sitemap.xml`, `robots.txt` and organisation structured data without ratings or reviews.
- Security headers, origin checks and a small in-memory rate limit on the form routes.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Local setup

```bash
npm install
copy .env.example .env.local
npm run dev
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

Leave unknown contact details blank. Do not invent an email address, phone number, legal name or Play Store URL.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm test` | Validation tests |

## Environment variables

Public variables are readable in the browser. Server variables must never use the `NEXT_PUBLIC_` prefix.

| Name | Where | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public | Canonical site URL. Default `https://nirman360.in`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Public | Shown only when it is a valid email. |
| `NEXT_PUBLIC_PRIVACY_EMAIL` | Public | Privacy contact. Falls back to the contact email. |
| `NEXT_PUBLIC_CONTACT_PHONE` | Public | Shown only when digits are present. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Public | 10-digit Indian mobile, or a full number. Used for `wa.me`. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Public | HTTPS profile URL. |
| `NEXT_PUBLIC_LINKEDIN_URL` | Public | HTTPS profile URL. |
| `NEXT_PUBLIC_FACEBOOK_URL` | Public | HTTPS profile URL. |
| `NEXT_PUBLIC_GOOGLE_PLAY_URL` | Public | Must be `https://play.google.com/...` or the app block stays on Coming soon. |
| `NEXT_PUBLIC_LEGAL_NAME` | Public | Registered business name. |
| `NEXT_PUBLIC_BUSINESS_ADDRESS` | Public | Registered address. |
| `NEXT_PUBLIC_IN_APP_ACCOUNT_DELETION` | Public | `true` only after the Flutter app has a working in-app deletion control. |
| `SUPABASE_URL` | Server | Project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Service role. Bypasses row level security. Never expose it to the client or the mobile app. |
| `LEADS_WEBHOOK_URL` | Server | HTTPS endpoint used when Supabase is not configured. |
| `LEADS_WEBHOOK_SECRET` | Server | Sent as `Authorization: Bearer ...` when set. |
| `IP_HASH_SALT` | Server | Salt for the network-address hash stored with a request. |

If both Supabase and the webhook are set, Supabase is used.

## Forms

`POST /api/contact`, `POST /api/partners` and `POST /api/delete-account` validate JSON on the server. They reject cross-origin posts, oversized bodies and bursts of requests.

Responses:

- `ACCEPTED` — the configured inbox stored or accepted the request. A deletion acceptance means the request was recorded, not that the account was deleted.
- `NOT_CONFIGURED` — nothing was stored. The page says so.
- `INVALID`, `RATE_LIMITED`, `UNAVAILABLE` — the page shows a failure, not a success.

A hidden honeypot field named `website` is discarded without storage. It is there to ignore automated posts.

The exact database and deletion workflow is in [docs/BACKEND.md](docs/BACKEND.md).

## App screenshots

Put PNG, JPEG or WebP files in `public/screenshots`. The app section shows the first file in alphabetical order. Until a file is added, the phone frame says that application screens are not published yet.

## Hero visuals

Desktop browsers that can afford it render an original Three.js site model: a backhoe, excavator, dump truck, crane, materials and a concrete frame. No third-party GLB is shipped, because a commercially licensed model set was not available. Licensed `.glb` files can later be placed in `public/models` and wired into `components/HeroScene.tsx`.

Category and industry photographs are original images made for this project. Review them before a public launch, including any incidental likeness to branded machinery. They are not a claim of partnership with an equipment manufacturer.

## Deploy on Vercel

1. Push the project to the Git host Vercel will read.
2. Import the repository as a Next.js project. The framework preset is enough. No custom build command is required.
3. Add the environment variables above in Project Settings → Environment Variables. Put the service-role key only in the server environment.
4. Deploy.
5. Confirm `https://<your-deployment>/privacy-policy` and `https://<your-deployment>/delete-account` load without signing in.
6. Submit each form once. Without credentials, the UI must say that nothing was submitted. With credentials, confirm a row or webhook delivery, then confirm the deletion copy still says the account was not deleted.

### Domain `nirman360.in`

In the Vercel project, open Settings → Domains and add `nirman360.in` and `www.nirman360.in`.

At the DNS host:

- Apex (`nirman360.in`): `A` record `76.76.21.21`, or the `ALIAS` / `ANAME` Vercel shows in the domain panel.
- `www`: `CNAME` to `cname.vercel-dns.com`.

Use the records Vercel displays if they differ. Vercel provisions HTTPS. Set `NEXT_PUBLIC_SITE_URL=https://nirman360.in` and redeploy so canonical URLs match the domain. Redirect `www` to the apex, or the other way around, in the Vercel domain settings. Pick one canonical host.

## Legal review required

The privacy policy and terms are drafts written to match this website and the described marketplace. They are not legal advice and they are not a compliance certificate.

Before publication for a store listing or as binding terms:

- Add the legal business name, registered address and privacy contact.
- Have counsel review both documents against the Digital Personal Data Protection Act, 2023, the rules in force, and the app’s actual data practices.
- Align the Play Console Data safety form with the policy. Do not declare collection the app does not perform, and do not omit collection the app does perform.
- Replace the proposed Bengaluru jurisdiction sentence if counsel chooses a different venue.

## Google Play

See [GOOGLE_PLAY_COMPLIANCE_CHECKLIST.md](GOOGLE_PLAY_COMPLIANCE_CHECKLIST.md). This site does not claim that Google Play has approved the app.

## Tests run in this workspace

These are the checks that were actually run. Lighthouse was not run, so the performance, accessibility, best-practices and SEO scores in the brief are targets, not measured results.

- `npm test`: 5 validation tests passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed. All nine pages, the sitemap, robots file and three form routes were generated.
- Every public route returned HTTP 200 from the production server.
- A valid contact or deletion post with no inbox configured returned `503 NOT_CONFIGURED` and did not report success.
- An invalid partner post returned `400` with field errors.
- A cross-origin post returned `403`.
- At 1440px the page did not scroll horizontally and the desktop hero mounted a full-width WebGL canvas. At 390px the canvas was replaced by the photograph and horizontal overflow was 0.
- The mobile menu opened, and the homepage FAQ accordion expanded.
- Submitting an empty partner form showed the field errors and did not claim the enquiry was sent.

## Remaining setup

- Publish the official email, phone, WhatsApp number, social profiles, legal name and registered address.
- Add a real Play Store URL only after the listing exists.
- Apply `supabase/schema.sql` or point `LEADS_WEBHOOK_URL` at a private receiver, then test a real submission.
- Implement and test account deletion against the Flutter app’s user records before telling users that deletion is completed. The website only records the request.
- Ship an in-app deletion control, then set `NEXT_PUBLIC_IN_APP_ACCOUNT_DELETION=true`.
- Add real app screenshots to `public/screenshots`.
- Review the photographs and, if you acquire them, replace the procedural hero with licensed GLB models.
- Run Lighthouse against the deployed HTTPS URL. Local scores are not a production result.
