import { BannerCarousel } from '@/lib/braze/carousel'
import { CodeBlock } from '@/components/code-block'

// ─── Code samples ────────────────────────────────────────────────────────────

const initCode = `// lib/braze.ts
import * as braze from "@braze/web-sdk";

let initialized = false;

export function initBraze() {
  if (initialized || typeof window === "undefined") return;
  braze.initialize(process.env.NEXT_PUBLIC_BRAZE_API_KEY!, {
    baseUrl: process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT!,
    enableLogging: true,
    allowUserSuppliedJavascript: true, // required for Banner HTML
  });
  braze.openSession();
  initialized = true;
}

export { braze };`

const providerCode = `// components/braze-provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { initBraze, braze } from "@/lib/braze";
import type { Banner } from "@braze/web-sdk";

const PLACEMENT_IDS = [
  "carousel_slot_1",
  "carousel_slot_2",
  "carousel_slot_3",
  "carousel_slot_4",
];

const BrazeContext = createContext<Record<string, Banner | null>>({});
export const useBrazeContext = () => useContext(BrazeContext);

export default function BrazeProvider({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<Record<string, Banner | null>>({});

  useEffect(() => {
    initBraze();
    const id = braze.subscribeToBannersUpdates(b => setBanners({ ...b }));
    braze.requestBannersRefresh(PLACEMENT_IDS);
    return () => { if (id) braze.removeSubscription(id); };
  }, []);

  return <BrazeContext.Provider value={banners}>{children}</BrazeContext.Provider>;
}`

const carouselCode = `// components/banner-carousel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useBrazeContext, CAROUSEL_PLACEMENT_IDS } from "./braze-provider";
import { braze } from "@/lib/braze";

export function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const banners = useBrazeContext();
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // insertBanner() renders the HTML into an iframe and auto-logs an impression
  useEffect(() => {
    const banner = banners[CAROUSEL_PLACEMENT_IDS[current]];
    const el = slotRefs.current[current];
    if (banner && !banner.isControl && el) {
      braze.insertBanner(banner, el);
    }
  }, [current, banners]);

  return (
    <div className="relative overflow-hidden rounded-lg">
      {CAROUSEL_PLACEMENT_IDS.map((id, i) => (
        <div key={id} className={i === current ? "visible" : "hidden"}>
          <div ref={el => { slotRefs.current[i] = el }} className="h-64 w-full" />
        </div>
      ))}
      {/* navigation arrows + dot indicators */}
    </div>
  );
}`

// ─── Step-by-step tab ────────────────────────────────────────────────────────

const s1Code = `# In the Braze dashboard → Settings → Banner Placements
# Create one placement per carousel slot:

carousel_slot_1
carousel_slot_2
carousel_slot_3
carousel_slot_4

# Design each banner's full HTML content in the Braze composer.
# The SDK delivers the HTML verbatim; insertBanner() renders it in an iframe.`

const s2Code = `npm install @braze/web-sdk

# .env.local
NEXT_PUBLIC_BRAZE_API_KEY=your-api-key
NEXT_PUBLIC_BRAZE_SDK_ENDPOINT=your-sdk-endpoint.braze.com`

const s3Code = `// Wrap your root layout with the provider so all components
// can access live banner data via context.

// app/layout.tsx
import BrazeProvider from "@/components/braze-provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BrazeProvider>{children}</BrazeProvider>
      </body>
    </html>
  );
}`

const s4Code = `// Render the carousel wherever you need it.
// It reads banner data automatically from BrazeContext.

import { BannerCarousel } from "@/components/banner-carousel";

export default function Page() {
  return <BannerCarousel />;
}`

const s5Code = `// insertBanner() handles impression logging automatically.
// For clicks on CTAs rendered outside the iframe, call:
const banner = braze.getBanner("carousel_slot_1");
if (banner) braze.logBannerClick(banner);

// Optionally refresh banners on a timer:
setInterval(() => braze.requestBannersRefresh(PLACEMENT_IDS), 60_000);`

// ─────────────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-[800px] items-center justify-between px-6">
          <a href="https://www.braze.com" target="_blank" rel="noopener noreferrer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/braze-logo.png" alt="Braze" className="h-7 w-auto" />
          </a>
          <div className="flex items-center gap-6">
            <a
              href="https://www.braze.com/docs/user_guide/message_building_by_channel/banners"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              User Docs
            </a>
            <a
              href="https://www.braze.com/docs/developer_guide/banners"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Developer Guide
            </a>
            <a
              href="https://github.com/braze-inc/banners-carousel-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-[800px] px-6 py-12">

        {/* ── Live Demo ──────────────────────────────────────────────────── */}
        <section className="mb-16">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-foreground">
            Braze Banners Carousel Demo
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            How to build a web carousel using Banners and multiple placements
          </p>
          <BannerCarousel />
          <div className="mt-6 rounded-xl border border-accent bg-accent/20 px-5 py-4">
            <p className="text-sm leading-relaxed text-foreground/80">
              <strong>About this demo:</strong> Braze Banners are individual content placements — each one targets a single slot on your page. This sample project shows how you can combine <strong>multiple Banner placements</strong> together to build a full carousel experience. Each slide maps to its own placement ID, giving marketers independent control over every slide&apos;s content, targeting, and scheduling — all without a code deploy.
            </p>
          </div>
        </section>

        {/* ── How It Works ───────────────────────────────────────────────── */}
        <section className="mb-16">
          <h2 className="mb-1 text-2xl font-extrabold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mb-8 text-muted-foreground">
            A technical overview of the architecture and SDK integration.
          </p>

          {/* Architecture overview */}
          <div className="mb-8 rounded-xl border border-border bg-muted/40 p-6">
            <h3 className="mb-4 text-base font-bold uppercase tracking-widest text-primary">
              Architecture
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: 'Data source',
                  body: 'Four Braze Banner placements — carousel_slot_1 through carousel_slot_4 — each map to one carousel slide. Marketers author the full banner HTML in the Braze dashboard; the SDK delivers it verbatim.',
                },
                {
                  label: 'React or a library — your choice',
                  body: 'The carousel UI is decoupled from Braze. You can build it directly in React using useState and CSS transitions (as this demo does), or drop in any library — Embla, Swiper, Splide, etc. Braze just fills the slide containers.',
                },
                {
                  label: 'Context provider',
                  body: 'BrazeProvider wraps the app and exposes a Record<string, Banner | null> via React context. It initializes the SDK, subscribes to updates, and requests a refresh — all on mount.',
                },
                {
                  label: 'iframe rendering',
                  body: 'braze.insertBanner(banner, el) injects each banner into an isolated iframe. Impressions are logged automatically once the iframe loads. No extra tracking code needed.',
                },
              ].map(({ label, body }) => (
                <div key={label} className="rounded-lg border border-border bg-background p-4">
                  <p className="mb-1 text-sm font-semibold text-foreground">{label}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* SDK lifecycle */}
          <h3 className="mb-3 text-base font-bold text-foreground">SDK lifecycle</h3>
          <div className="mb-8 flex flex-col gap-0">
            {[
              { fn: 'braze.initialize(apiKey, { baseUrl })', note: 'Initializes the SDK. Call once on the client — guard with a flag to prevent double-init in React strict mode.' },
              { fn: 'braze.openSession()', note: 'Starts a user session. Required before Banners can be targeted and delivered.' },
              { fn: 'braze.subscribeToBannersUpdates(callback)', note: 'Registers a callback that fires immediately with any cached data, then again when fresh banners arrive. Returns a subscription ID for cleanup.' },
              { fn: 'braze.requestBannersRefresh(placementIds)', note: 'Triggers a network fetch for the specified placement IDs. When the response arrives, the subscriber callback fires with the updated map.' },
              { fn: 'braze.insertBanner(banner, containerEl)', note: 'Renders the banner HTML into an iframe inside containerEl and auto-logs an impression once the iframe loads.' },
              { fn: 'braze.removeSubscription(id)', note: 'Unsubscribes the callback on component unmount to prevent memory leaks.' },
            ].map(({ fn, note }, i, arr) => (
              <div key={fn} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  {i < arr.length - 1 && <div className="mt-1 w-px grow bg-border" />}
                </div>
                <div className="pb-5">
                  <code className="text-sm font-semibold text-primary">{fn}</code>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Code: full implementation */}
          <h3 className="mb-3 text-base font-bold text-foreground">Full implementation</h3>
          <div className="flex flex-col gap-4">
            <CodeBlock code={initCode} language="typescript" />
            <CodeBlock code={providerCode} language="typescript" />
            <CodeBlock code={carouselCode} language="typescript" />
          </div>
        </section>

        {/* ── Step-by-step guide ─────────────────────────────────────────── */}
        <section>
          <h2 className="mb-1 text-2xl font-extrabold tracking-tight text-foreground">
            Add it to your project
          </h2>
          <p className="mb-8 text-muted-foreground">
            Step-by-step guide to integrating Braze Banners into your own app.
          </p>

          <div className="flex flex-col gap-10">

            <Step n={1} title="Create Banner placements in Braze">
              <p>
                In the Braze dashboard, go to <strong>Settings → Banner Placements</strong> and
                create one placement per carousel slot. Give each a unique ID — these are the
                strings your SDK will use to fetch content.
              </p>
              <CodeBlock code={s1Code} language="bash" />
            </Step>

            <Step n={2} title="Install the SDK and set env vars">
              <p>
                Install <code className="rounded bg-muted px-1.5 py-0.5 text-sm">@braze/web-sdk</code> and
                add your API key and SDK endpoint to <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.env.local</code>.
                Never commit these to source control — add <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.env.local</code> to <code className="rounded bg-muted px-1.5 py-0.5 text-sm">.gitignore</code>.
              </p>
              <CodeBlock code={s2Code} language="bash" />
            </Step>

            <Step n={3} title="Add BrazeProvider to your root layout">
              <p>
                The provider initializes the SDK on the client, subscribes to banner updates, and
                exposes banner data to the entire component tree via React context. Wrap your{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm">RootLayout</code> children with it.
              </p>
              <CodeBlock code={s3Code} language="typescript" />
            </Step>

            <Step n={4} title="Render the carousel">
              <p>
                Drop <code className="rounded bg-muted px-1.5 py-0.5 text-sm">&lt;BannerCarousel /&gt;</code> anywhere on the page.
                It reads from context automatically — no props needed. Each slide calls{' '}
                <code className="rounded bg-muted px-1.5 py-0.5 text-sm">insertBanner()</code> when it
                becomes active, which renders the HTML and logs the impression.
              </p>
              <CodeBlock code={s4Code} language="typescript" />
            </Step>

            <Step n={5} title="Impressions, clicks, and refresh">
              <p>
                Impression tracking is automatic via <code className="rounded bg-muted px-1.5 py-0.5 text-sm">insertBanner()</code>.
                For clicks on CTAs outside the iframe, use <code className="rounded bg-muted px-1.5 py-0.5 text-sm">logBannerClick()</code>.
                Optionally poll for fresh content on a timer.
              </p>
              <CodeBlock code={s5Code} language="typescript" />
            </Step>

          </div>
        </section>
      </main>
    </div>
  )
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {n}
        </div>
        <div className="mt-2 w-px grow bg-border" />
      </div>
      <div className="pb-2 min-w-0 flex-1">
        <h3 className="mb-3 text-lg font-bold text-foreground">{title}</h3>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/90">
          {children}
        </div>
      </div>
    </div>
  )
}

