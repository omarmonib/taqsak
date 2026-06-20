# 🌤 Taqsak (طقسك)

**Your weather, anywhere.** A modern, bilingual (Arabic/English) weather forecast web app built with Next.js 16, TypeScript, and Tailwind CSS.

🔗 **Live demo:** [taqsak.vercel.app](https://taqsak.vercel.app)

---

## ✨ Features

- 🌍 **Multi-language** — English, Arabic, French, Spanish with full RTL/LTR support
- 🌗 **Dark / Light mode**
- 🔍 **Smart search** — search by city, country, or province with Arabic local names
- 📍 **Geolocation** — one-tap detection of your current location
- 🌡️ **°C / °F toggle**
- ☁️ **Current weather** — temperature, feels like, humidity, wind, visibility, pressure, sunrise/sunset
- ☀️ **UV Index & Heat Index** — powered by Open-Meteo (no API key required)
- 📊 **Interactive charts** — temperature trend and wind/humidity (Recharts)
- ⏰ **Hourly forecast** (24h) and **7-day forecast**
- 🗺️ **Interactive map** — click anywhere to get weather for that location, with precipitation/clouds/wind/temperature overlay layers (Leaflet + OpenStreetMap)
- 📌 **Favorites** — save locations to localStorage
- 🆚 **Compare locations** — view up to 4 cities side by side
- 🕐 **Recent searches**
- 🏠 **Homepage hero** — branding, feature highlights, popular city quick-access
- 📱 **PWA support** — installable on mobile and desktop
- 🎨 **Weather-reactive animated backgrounds**
- 🔎 **SEO friendly**

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Charts | Recharts |
| Maps | Leaflet + OpenStreetMap |
| Weather data | [OpenWeatherMap API](https://openweathermap.org/api) |
| UV Index | [Open-Meteo](https://open-meteo.com) (free, no key required) |
| Icons | Lucide React |
| Package manager | pnpm |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A free [OpenWeatherMap API key](https://home.openweathermap.org/users/sign_up)

### Installation

```bash
# Clone the repository
git clone https://github.com/omarmonib/taqsak.git
cd taqsak

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

Add your API key to `.env.local`:

```env
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

### Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for production

```bash
pnpm build
pnpm start
```

---

## 📁 Project Structure

```
taqsak/
├── app/                  # Next.js App Router pages & layout
├── components/
│   ├── home/             # Hero, recent searches
│   ├── layout/            # Header, search bar, favorites, footer
│   ├── weather/           # Current weather, forecasts, charts, map
│   └── states/            # Loading, error, empty states
├── hooks/                 # Custom React hooks (weather, theme, language, etc.)
├── lib/                    # API calls, i18n, utilities
├── types/                  # TypeScript type definitions
└── public/                 # Static assets, PWA manifest
```

---

## 🌐 APIs Used

- **[OpenWeatherMap](https://openweathermap.org/api)** — current weather, 5-day/3-hour forecast, geocoding
- **[Open-Meteo](https://open-meteo.com)** — UV index (free, no API key)
- **[OpenStreetMap](https://www.openstreetmap.org)** — map tiles via Leaflet

---

## 📦 Deployment

This project is deployed on [Vercel](https://vercel.com). To deploy your own:

```bash
pnpm dlx vercel
```

Don't forget to add `NEXT_PUBLIC_OPENWEATHER_API_KEY` in your Vercel project's Environment Variables settings.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- Weather data by [OpenWeatherMap](https://openweathermap.org) and [Open-Meteo](https://open-meteo.com)
- Map tiles by [OpenStreetMap](https://www.openstreetmap.org) contributors
- Icons by [Lucide](https://lucide.dev)

---

<p align="center">Made with ❤️ for multilingual weather lovers</p>