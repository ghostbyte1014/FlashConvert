# FlashConvert v1.0: Premium Multi-Unit & Scientific Conversion Suite
<<<<<<< HEAD

A lightweight, fast, no-login unit and currency conversion web app.

## Features

- **Unit Conversions**: Length, Mass, Temperature, Speed, Area, Volume, Time, Digital Storage, Pressure, Energy
- **Scientific & Regular Calculator**: Integrated tool for all your mathematical needs
- **Currency Conversions**: Real-time exchange rates with offline support
- **Custom Numeric Keypad**: No mobile keyboard popups
- **PWA Enabled**: Install as a native app, works offline
- **Dark Theme**: Premium dark theme design

## Tech Stack

- React + Vite + TypeScript
- TailwindCSS
- IndexedDB for offline storage
- PWA with Service Worker

## Project Structure

```
flashconvert/
├── src/
│   ├── components/     # React components
│   ├── services/       # API & IndexedDB services
│   ├── utils/          # Conversion utilities
│   ├── App.tsx         # Main app
│   └── index.css       # Global styles
├── public/             # Static assets & PWA icons
├── package.json        # Node dependencies
├── vite.config.ts      # Vite + PWA config
├── TODO.md             # Project tasks
└── README.md           # This file
```

## Quick Start

1. Install dependencies:
   
```bash
npm install
```

2. Start development server:
   
```bash
npm run dev
```

3. Build for production:
   
```bash
npm run build
```

## Deployment (Vercel)

1. Connect repository
2. Build command: `npm run build`
3. Output directory: `dist`

## Offline Support

- Exchange rates are cached in IndexedDB
- App works offline after first load
- Shows "Using offline rates" indicator when offline

## License

MIT
=======
FlashConvert is a fast, no-login web application designed for professionals and students who need instant, accurate conversions. Built as a Progressive Web App (PWA), it offers a native-app feel with offline support and a custom numeric keypad optimized for mobile productivity.
>>>>>>> eef521f07078f22ae9b2311c48627627ebbad2bf
