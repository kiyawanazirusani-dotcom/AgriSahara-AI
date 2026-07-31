# AgriSahara AI

AgriSahara AI is an AI-powered farming assistant that helps African farmers detect crop diseases from photos, receive simple farming advice in Hausa and English, and improve harvests using Google's Gemini AI.

Built for the **Build with Gemini XPRIZE**.

## What it does

1. **Leaf Scanner** — a farmer photographs a crop leaf (maize, millet, cowpea, sorghum, etc.). The photo is sent live to the Google Gemini API, which identifies visible disease/pest/deficiency signs, explains the likely cause, and suggests concrete next steps — in Hausa or English.
2. **Ask the Assistant** — a simple chat where a farmer can ask any farming question (planting season, soil, rainfall, pest control) and get a short, plain-language answer from Gemini.

The app is a static site (HTML/CSS/JS) that calls the **Gemini API directly from the farmer's device** — there is no backend server. This keeps hosting free (GitHub Pages) and means every diagnosis shown is a real, live model call, not a canned demo response.

## Running it locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Push these files (`index.html`, `style.css`, `app.js`) to the `main` branch of this repo.
2. Go to **Settings → Pages** in the GitHub repo.
3. Under "Build and deployment", set **Source: Deploy from a branch**, branch: `main`, folder: `/ (root)`.
4. Save. Your site will be live at `https://<username>.github.io/<repo-name>/` within a minute or two.

## Getting a Gemini API key

The app asks each user for their own free Gemini API key on first visit (stored only in their browser's local storage, never sent anywhere except Google's API):

1. Go to https://aistudio.google.com/apikey
2. Sign in with a Google account and click "Create API key".
3. Paste the key into the AgriSahara AI prompt when it appears.

## Honesty note

This is an early-stage, real (not simulated) tool: diagnoses come from live Gemini calls on the actual uploaded photo, and the app clearly says "not certain" when the model isn't confident, rather than guessing. No user numbers, revenue, or results are claimed anywhere in this project beyond what can be verified.

## License

MIT
