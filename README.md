# 🚌 MBTA Vehicle Tracker
A simple web app to track MBTA buses in real time. You can see vehicle positions, status (like stopped or moving), and filter them by route and trip. Cocok banget buat belajar integrasi API + UI interaktif.

## 🚀 Features

- Real-time vehicle tracking
- Filter vehicles by route and trip
- Pagination support
- Responsive design
- Loading indicators & error messages for better UX

## ⚙️ Tech Stack

- React + TypeScript
- Tailwind CSS
- React Toastify for notifications
- Vite for build tooling

## Installation

Make sure you have:
- Node.js v14+
- npm v6+

1. Clone the repository:

```bash
git clone [your-repository-url]
cd vehicleTracker
```

2. Install dependencies:

```bash
npm install
```

## Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Building for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Page components
├── services/      # API and service functions
└── types/         # TypeScript type definitions
```

## Contributing
Wanna contribute or play around?
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/cool-feature`)
3. Commit your changes (`git commit -m 'Add some cool feature'`)
4. Push to the branch (`git push origin feature/cool-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - use it however you like.

## Thanks to

- MBTI for the open API
- All contributors who have helped with the project
