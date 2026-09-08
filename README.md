# Angular Training Capstone

A small Angular app that lists every country in the world, lets you search/filter them,
and shows the current weather for a selected country's capital city.

Built with Angular 21 (standalone components + signals) and Angular Material.

## Features

- **Countries page** (`/`)
  - Loads automatically on page view (no button click needed)
  - Angular Material **table** showing Name, Region, Capital, and Population (in millions, 1 decimal place)
  - Angular Material **autocomplete** search field — type to filter, or pick a suggestion; the table filters live as you type
  - Click any row to view the weather for that country's capital
  - Errors (e.g. failed API call) are shown via Angular Material **Snackbar** with a "Retry" action, not a browser alert
  - Fully responsive (desktop table view, horizontally scrollable on small screens)
- **Weather page** (`/weather?country=...&capital=...`)
  - Geocodes the capital city, then fetches its current weather
  - Shows Country & City, current date/time (in the capital's local time), and current temperature in Celsius
- **404 page** — shown for any unknown route, styled as a mock terminal/CLI error
- Angular Material theming applied app-wide (dark theme, red/rose palette)

## APIs used

| Purpose | Endpoint |
|---|---|
| List of countries | `https://worldfactbook.io/api/v1/countries` |
| Geocode a capital city | `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1` |
| Current weather for coordinates | `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,weather_code` |

No API keys are required for any of these.

## Getting started

```bash
npm install
ng serve
```

Then open `http://localhost:4200`.

## Running tests

```bash
ng test
```

## Building for production

```bash
ng build
```

Output goes to `dist/angular-training-capstone`.

## Deploying to Netlify

1. Push this repository to GitHub and make sure it's **public**.
2. Go to [app.netlify.com/signup](https://app.netlify.com/signup) and sign up with your GitHub account.
3. Click **Add new site → Import an existing project**, choose GitHub, and select this repository.
4. Set the build settings:
   - **Build command:** `ng build`
   - **Publish directory:** `dist/angular-training-capstone/browser`
5. Deploy. Netlify will give you a public URL (e.g. `https://your-site-name.netlify.app`).
6. Because this is a single-page app with client-side routing, add a `_redirects` file (already included in `public/_redirects`) so deep links and page refreshes don't 404 on Netlify.

## Project structure

```
src/app/
├── core/
│   ├── models/        # Country & Weather API response types
│   └── services/      # CountryService, WeatherService
├── pages/
│   ├── countries/      # Main page — Material table + autocomplete
│   ├── weather/        # Capital city weather page
│   └── not-found/      # 404 page
├── app.routes.ts
└── app.config.ts
```
