# Braze Banner Carousel Demo

A working reference implementation of a content carousel powered by [Braze Banners](https://www.braze.com/product/cross-channel-messaging). Four Braze Banner placements drive the carousel slides — marketers author the HTML in the Braze dashboard and it renders live in the app with no code changes required.

The project also serves as a developer guide, with a technical architecture walkthrough and a tabbed step-by-step integration tutorial (including a set of Cursor AI prompts).

## Live demo

**http://localhost:3000** after running `npm run dev`.

---

## How it works

| Layer | Detail |
|---|---|
| **Data source** | 4 Braze Banner placements: `carousel_slot_1` – `carousel_slot_4` |
| **Carousel** | Custom React component — no Splide/Swiper/Embla. CSS `translateX` transitions, `useState` for slide index. |
| **SDK integration** | `@braze/web-sdk` v6. Initialize → subscribe → refresh → `insertBanner()` |
| **Rendering** | `braze.insertBanner(banner, el)` injects an iframe into each slot and auto-logs impressions |
| **State management** | React context (`BrazeProvider`) exposes `Record<string, Banner \| null>` to the whole tree |

### SDK lifecycle

```
braze.initialize(apiKey, { baseUrl })
braze.openSession()
braze.subscribeToBannersUpdates(callback)   ← fires with cached data, then on refresh
braze.requestBannersRefresh(placementIds)   ← triggers network fetch
braze.insertBanner(banner, containerEl)     ← renders HTML iframe, auto-logs impression
braze.removeSubscription(id)                ← cleanup on unmount
```

---

## Project structure

```
app/
├── layout.tsx          # Root layout — wraps children with BrazeProvider
├── page.tsx            # Main page: live demo + how-it-works + tabbed guide
└── globals.css         # Braze brand design tokens (colors, radius, font)

components/
├── braze-provider.tsx  # React context provider — SDK init, subscription, refresh
├── banner-carousel.tsx # Carousel component — reads context, calls insertBanner()
└── code-block.tsx      # Syntax-highlighted code display

lib/
└── braze.ts            # SDK initialization helper (guards against double-init)
```

---

## Getting started

### Prerequisites

- Node.js 18+
- A Braze account with Banner placements configured (see [Braze Banners docs](https://www.braze.com/docs))

### 1. Clone and install

```bash
git clone https://github.com/markbiales/carousels.git
cd carousels
npm install
```

### 2. Configure environment variables

Create a `.env.local` file in the project root:

```bash
NEXT_PUBLIC_BRAZE_API_KEY=your-api-key-here
NEXT_PUBLIC_BRAZE_SDK_ENDPOINT=your-sdk-endpoint.braze.com
```

Your API key and SDK endpoint are in the Braze dashboard under **Settings → APIs and Identifiers**.

> `.env.local` is gitignored — never commit credentials.

### 3. Create Banner placements in Braze

In the Braze dashboard, go to **Settings → Banner Placements** and create four placements with these exact IDs:

- `carousel_slot_1`
- `carousel_slot_2`
- `carousel_slot_3`
- `carousel_slot_4`

Design each banner's HTML content in the Braze composer. The SDK delivers the HTML verbatim; `insertBanner()` renders it in an isolated iframe.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The carousel will show a loading state until banners are fetched. With `enableLogging: true` set in `lib/braze.ts`, all SDK activity is visible in the browser console.

---

## Key files

### `lib/braze.ts`

Initializes the Braze SDK once (guarded against double-init in React strict mode) with `allowUserSuppliedJavascript: true`, which is required for Banner HTML to render.

### `components/braze-provider.tsx`

Client component that:
1. Calls `initBraze()` on mount
2. Subscribes to `subscribeToBannersUpdates` for the four placement IDs
3. Calls `requestBannersRefresh` to trigger the initial fetch
4. Exposes the banner map via React context
5. Cleans up the subscription on unmount

### `components/banner-carousel.tsx`

Reads banner data from `BrazeContext`. For the active slide, calls `braze.insertBanner(banner, containerEl)` inside a `useEffect` — this renders the banner HTML into an iframe and automatically logs an impression once it loads. Null and control banners render a placeholder.

---

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [@braze/web-sdk](https://www.npmjs.com/package/@braze/web-sdk) 6.5
- [Tailwind CSS](https://tailwindcss.com) 4
- [Radix UI](https://www.radix-ui.com) (Tabs, and other primitives)
- [TypeScript](https://www.typescriptlang.org) 5.7

---

## Building with Cursor

The site includes a **"Build with Cursor"** tab with a set of ready-to-use prompts for [Cursor](https://cursor.com) Agent mode. These guide the AI through scaffolding the full integration from scratch — useful if you want to adapt this pattern for your own app.
