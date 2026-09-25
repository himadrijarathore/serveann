# 🍲 ServeAnn: Rescue Food, Nourish Lives

ServeAnn is an AI-powered food rescue platform built to bridge the gap between food waste and food insecurity. It seamlessly connects restaurants, event organizers, and generous donors with local shelters and volunteer drivers in real-time.

![ServeAnn Banner](https://serveann.vercel.app/favicon.ico) <!-- Placeholder, can be replaced with actual screenshot -->

**Live Deployment:** [https://serveann.vercel.app](https://serveann.vercel.app)

## 🚀 The Problem & Solution
Tons of perfectly good food is wasted daily at hotels and events because there is no fast, reliable logistical network to transport it to NGOs before it spoils. 

**ServeAnn solves this with a 3-step process:**
1. **📸 Snap & Share:** Donors take a photo of surplus food. Our AI instantly estimates the weight, detects the food type, categorizes it (veg/non-veg), and calculates a safe consumption window.
2. **🤖 Smart Matching:** Our matching engine automatically finds the nearest eligible shelter based on distance (within 25km), available capacity, and dietary rules (e.g., matching vegetarian food only to veg-only ashrams).
3. **🚗 Swift Delivery:** Volunteer drivers receive real-time dispatch alerts, claim the route, and deliver the food, earning "Impact Points" for meals served and CO₂ saved.

## 🏗️ System Architecture

### Tech Stack
* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** [TailwindCSS v4](https://tailwindcss.com/) (Custom Indian-inspired theme palette)
* **State Management:** [Zustand](https://github.com/pmndrs/zustand) (with `localStorage` persistence for the hackathon MVP)
* **Deployment:** [Vercel](https://vercel.com)

### Core Modules
* `lib/store.ts`: Centralized Zustand store handling Auth, Data (Donations, Matches, Users), and Impact calculations (currently using localStorage for the hackathon demo).
* `lib/matching.ts`: The geospatial and capacity-aware matching algorithm.
* `lib/vision.ts`: Computer Vision utility for categorizing Indian cuisine, estimating weight, and calculating expiry hours (runs in heuristic fallback mode for the demo).
* `app/dashboard/`: Role-based protected routes (Donor, Shelter, Driver dashboards).

## 🏃‍♂️ Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/himadrijarathore/serveann.git
   cd serveann
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🔑 Demo Credentials
The app comes pre-seeded with synthetic data. Use these to log in and test the different dashboards (Password for all is `demo123`):
* **Donor:** `donor@serveann.com`
* **Shelter:** `shelter@serveann.com`
* **Driver:** `driver@serveann.com`

## 🎨 Design System
ServeAnn features a custom Indian-heritage aesthetic, utilizing:
* **Typography:** *Playfair Display* (Regal serif headings) and *Lato* (Clean body text).
* **Colors:** Marigold (Saffron), Peacock Blue, Kumkum Red, and Antique Gold.
* **Motifs:** CSS-based Mughal architectural arches (`.indian-arch`) and SVG block-print/mandala backgrounds.

---
*Made with ❤️ for India.*
