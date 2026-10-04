# ReelGenie AI

A premium Next.js web application that turns 1 product photo into 5 ready-to-shoot Instagram Reel scripts using Google Gemini AI.

## Quickstart

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup environment variables**
   A `.env.local` file is included in this repository. By default, it runs in **MOCK MODE**, meaning you don't need a real API key to test the UI flow.
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   MOCK_AI=true
   MODEL_LITE=gemini-2.5-flash
   MODEL_PRO=gemini-2.5-pro
   ```
   To use real AI, change `MOCK_AI` to `false` and insert your actual `GEMINI_API_KEY`.

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open the app**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Features & Architecture

- **Next.js App Router**: Used for client-side state management (`page.tsx`) and secure server routes (`/api/analyze` and `/api/generate`).
- **Google Gemini API**: Kept entirely on the server. We use `MODEL_LITE` for cheap and fast vision categorization, and `MODEL_PRO` for high-quality script generation.
- **Mock Engine**: Included natively in the routes to simulate responses within realistic timeframes, perfect for UI development and testing.
- **Framer Motion**: Provides fluid transitions between application states (Landing → Upload → Analyze → Results) to create a premium feel.
- **Design System**: A strict adherence to editorial aesthetics, heavily relying on *Instrument Serif*, *Hanken Grotesk*, and *JetBrains Mono*, with a dark-mode first configuration and blue/gold functional coloring.
