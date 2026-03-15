# Braze Banners Carousel Demo

A working reference implementation and developer guide for building a content carousel powered by [Braze Banners](https://www.braze.com/docs/developer_guide/banners). Four Banner placements drive the carousel slides — marketers author the HTML in the Braze dashboard and it renders live in the app with no code changes required.

## How it works

Each carousel slide maps to its own Banner placement ID (`carousel_slot_1` through `carousel_slot_4`). The Braze SDK fetches each placement's HTML content and `insertBanner()` renders it into an isolated iframe with automatic impression tracking. Marketers get independent control over every slide's content, targeting, and scheduling — all without a code deploy.

### SDK lifecycle

```
braze.initialize(apiKey, { baseUrl })        ← Initialize once; guard against double-init
braze.openSession()                          ← Start a user session
braze.subscribeToBannersUpdates(callback)    ← Fires with cached data, then on refresh
braze.requestBannersRefresh(placementIds)    ← Triggers network fetch
braze.insertBanner(banner, containerEl)      ← Renders HTML iframe, auto-logs impression
braze.removeSubscription(id)                 ← Cleanup on unmount
```

## Project structure

```
app/
├── layout.tsx              Root layout — wraps children with BrazeProvider
├── page.tsx                Main page: live demo, architecture, integration guide
└── globals.css             Braze brand design tokens

lib/
├── utils.ts                Tailwind merge utility
└── braze/
    ├── index.ts            Barrel exports
    ├── init.ts             SDK initialization (guarded against double-init)
    ├── provider.tsx        React context provider — init, subscribe, refresh
    └── carousel.tsx        Carousel component — reads context, calls insertBanner()

components/
└── code-block.tsx          Syntax-highlighted code display
```

## Getting started

### Prerequisites

- Node.js 18+
- A Braze account with Banner placements configured ([docs](https://www.braze.com/docs/developer_guide/banners))

### 1. Clone and install

```bash
git clone https://github.com/braze-inc/banners-carousel-demo.git
cd banners-carousel-demo
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

In the Braze dashboard, go to **Settings → Banner Placements** and create four placements:

- `carousel_slot_1`
- `carousel_slot_2`
- `carousel_slot_3`
- `carousel_slot_4`

Design each banner's HTML content in the Braze composer. The SDK delivers the HTML verbatim; `insertBanner()` renders it in an isolated iframe.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The carousel will show a loading state until banners are fetched. With `enableLogging: true` in `lib/braze/init.ts`, SDK activity is visible in the browser console.

## Key files

### `lib/braze/init.ts`

Initializes the Braze SDK once with `allowUserSuppliedJavascript: true` (required for Banner HTML to render). Guarded against double-init in React strict mode.

### `lib/braze/provider.tsx`

Client component that initializes the SDK on mount, subscribes to `subscribeToBannersUpdates` for the four placement IDs, calls `requestBannersRefresh`, exposes the banner map via React context, and cleans up the subscription on unmount.

### `lib/braze/carousel.tsx`

Reads banner data from `BrazeContext`. For the active slide, calls `braze.insertBanner(banner, containerEl)` inside a `useEffect` — this renders the banner HTML into an iframe and automatically logs an impression. Null and control banners render a placeholder.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [React](https://react.dev) 19
- [@braze/web-sdk](https://www.npmjs.com/package/@braze/web-sdk) 6.5
- [Tailwind CSS](https://tailwindcss.com) 4
- [TypeScript](https://www.typescriptlang.org) 5.7

## License

MIT
