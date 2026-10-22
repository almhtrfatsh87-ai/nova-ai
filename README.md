# NOVA AI — Netlify + Gemini starter

## What is included
- `index.html`: NOVA AI Arabic RTL frontend.
- `netlify/functions/chat.mjs`: server-side Gemini chat function.
- `netlify.toml`: Netlify publish and Functions configuration.

## 1) Create a Gemini API key
1. Open https://aistudio.google.com/app/apikey
2. Sign in with your Google account.
3. Create an API key in Google AI Studio.
4. Keep the key private. Do not paste it into `index.html`, GitHub, or this chat.

Gemini's free tier has model and usage limits and may change. Check:
https://ai.google.dev/gemini-api/docs/pricing

## 2) Add the key to Netlify
1. Open your site in Netlify.
2. Go to **Site configuration / Environment variables** (or **Project configuration / Environment variables**).
3. Add a variable:
   - Key: `GEMINI_API_KEY`
   - Value: paste your Google AI Studio key
   - Scope: Functions (or all scopes if your plan does not offer scope selection)
4. Save, then trigger a new deploy.

## 3) Deploy the project
Deploy the *contents* of this folder as the site root using a Git-connected Netlify site or Netlify CLI.
A plain HTML drag-and-drop deploy may publish the page but does not reliably configure serverless Functions; use Git integration or the Netlify CLI for this project.

If using Netlify CLI:
- Install Node.js (LTS).
- Run `npm install -g netlify-cli`
- In this folder run `netlify login`
- Run `netlify deploy --prod`

## Important
- The Gemini key is read only by the Netlify Function and is never sent to the browser.
- The included chat is a starter integration, not a complete public SaaS security layer.
- Before opening the endpoint to the public, add authentication, per-user rate limits, abuse protection, and monitoring. Free API quotas are limited and not guaranteed.
- The app does not save conversations to a database yet; chat history lives only in the current browser tab.
