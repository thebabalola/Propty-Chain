# ProptyChain Frontend

A modern, blockchain-powered real estate marketplace built with Next.js 15 and TypeScript.

## Features

- 🏠 **Property Listings** - Browse verified properties with NFT titles
- 💎 **NFT Integration** - Blockchain-verified property ownership
- 👥 **Community Reviews** - Real reviews from verified users
- 🔒 **Smart Escrow** - Secure transactions with smart contracts
- 🏆 **Achievement System** - Soulbound NFT badges for contributions
- 🌙 **Dark/Light Mode** - Theme-aware UI with smooth transitions

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Animations**: CSS animations and transitions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
# Navigate to frontend directory
cd ProptyChain-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Project Structure

```
app/
├── dashboard/          # User dashboard
├── marketplace/        # Property marketplace
├── property/[id]/      # Property details
├── admin/             # Admin panel
├── badges/            # Achievement badges
└── page.tsx           # Home page

components/
├── ui/                # Reusable UI components
├── property-card.tsx  # Property card component
└── shared-navigation.tsx # Navigation component
```

## Pages

- **Home** (`/`) - Landing page with hero section
- **Marketplace** (`/marketplace`) - Browse all properties
- **Dashboard** (`/dashboard`) - User dashboard and profile
- **Property Details** (`/property/[id]`) - Individual property view
- **Admin** (`/admin`) - Admin panel
- **Badges** (`/badges`) - Achievement system

## Design System

### Colors
- **Forest Night** - Primary dark color
- **Ivory Mist** - Light text color
- **Antique Gold** - Accent color
- **Olive Slate** - Secondary color

### Theme Support
- Dark mode (default)
- Light mode support
- Smooth theme transitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is part of the ProptyChain ecosystem.
