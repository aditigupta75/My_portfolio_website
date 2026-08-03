# Aditi Gupta — Portfolio

Static one-page portfolio (`index.html`) plus a single Vercel Serverless
Function (`api/contact.js`) that powers the contact form. No build step,
no framework — this is intentional so it deploys in minutes and stays
easy to edit by hand.

## Project structure

```
.
├── index.html          ← the whole site (HTML/CSS/JS in one file)
├── api/
│   └── contact.js       ← serverless function for the contact form
├── package.json
├── .env.example          ← copy to .env.local for local testing
└── README.md
```

## 1. Before you deploy — fill in real content

Search the file for these and replace them:

| What | Where | Replace with |
|---|---|---|
| `↓ Resume (add file)` link (`href="#"`) | nav | Link to an actual hosted PDF, e.g. `/resume.pdf` (drop the file in this folder) |
| `Code (private — pending publication)` | Hardware case study | Real repo link, or leave as-is if it genuinely can't be public |
| `Code ↗` / `Demo ↗` placeholders | project cards | Real GitHub repo / live demo links |
| `og:url` meta tag | `<head>` | Your real Vercel URL once you have it |

Every placeholder link uses the CSS class `ph-link` (dashed amber
underline) so they're easy to `grep 'ph-link' index.html` and find.

## 2. Set up the contact form backend (Resend)

The form POSTs to `/api/contact`, which sends you an email via
[Resend](https://resend.com) (free tier: 3,000 emails/month, no credit
card for testing).

1. Sign up at resend.com, verify your sending domain (or use their
   shared `onboarding@resend.dev` sender while testing).
2. Grab an API key from the Resend dashboard.
3. You'll set it as an environment variable in Vercel — see step 4 below.

If you'd rather not stand up an email backend at all, delete the
`<form class="contact-form">` block and the `/api` folder, and rely on
the `mailto:` links already in the footer — the site works fine either way.

## 3. Deploy to Vercel

```bash
npm install -g vercel   # one-time
cd path/to/this/folder
vercel                  # first deploy — follow the prompts
vercel --prod           # promote to your production URL
```

Or without the CLI: push this folder to a GitHub repo, then
"Import Project" on vercel.com and select the repo — no build
settings needed, Vercel detects the static `index.html` and the
`api/` function automatically.

## 4. Add environment variables

In the Vercel dashboard → your project → **Settings → Environment
Variables**, add:

```
RESEND_API_KEY   = re_xxxxxxxxxxxx
CONTACT_TO_EMAIL = ag0484363@gmail.com
```

Redeploy after adding them (Vercel → Deployments → ⋯ → Redeploy).

## 5. Custom domain (optional, but recommended)

Vercel → Settings → Domains → add `yourname.com` (or a free
`yourname.vercel.app` subdomain works fine too — just avoid the
default random `xyz123.vercel.app` string if you can, since a
recognizable URL reads as more professional on a resume/LinkedIn).
