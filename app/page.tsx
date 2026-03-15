import { BannerCarousel } from '@/lib/braze/carousel'
import { CodeBlock } from '@/components/code-block'

// ─── Code samples ────────────────────────────────────────────────────────────

const providerCode = `// lib/braze/provider.tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { initBraze, braze } from "./init";
import type { Banner } from "@braze/web-sdk";

export const CAROUSEL_PLACEMENT_IDS = [
  "carousel_slot_1",
  "carousel_slot_2",
  "carousel_slot_3",
  "carousel_slot_4",
];

const BrazeContext = createContext<{ banners: Record<string, Banner | null> }>({
  banners: {},
});

export const useBrazeContext = () => useContext(BrazeContext);

export default function BrazeProvider({ children }: { children: React.ReactNode }) {
  const [banners, setBanners] = useState<Record<string, Banner | null>>({});

  useEffect(() => {
    initBraze();
    const sub = braze.subscribeToBannersUpdates((updated) => {
      setBanners({ ...updated });
    });
    braze.requestBannersRefresh(CAROUSEL_PLACEMENT_IDS);
    return () => { if (sub) braze.removeSubscription(sub); };
  }, []);

  return (
    <BrazeContext.Provider value={{ banners }}>
      {children}
    </BrazeContext.Provider>
  );
}`

const carouselCode = `// lib/braze/carousel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useBrazeContext, CAROUSEL_PLACEMENT_IDS } from "./provider";
import { braze } from "./init";

export function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const { banners } = useBrazeContext();
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);

  // insertBanner() renders HTML into an iframe and auto-logs an impression
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
        <div key={id} className={i === current ? "block" : "hidden"}>
          <div ref={(el) => { slotRefs.current[i] = el; }} className="h-64 w-full" />
        </div>
      ))}
      {/* navigation arrows + dot indicators */}
    </div>
  );
}`

// ─── Step-by-step code samples ───────────────────────────────────────────────

const step1Code = `# In the Braze dashboard → Settings → Banner Placements
# Create one placement per carousel slot:

carousel_slot_1
carousel_slot_2
carousel_slot_3
carousel_slot_4

# Each placement maps to one carousel slide.
# Marketers design the HTML in the Braze composer —
# the SDK delivers it verbatim.`

const step2Code = `npm install @braze/web-sdk

# .env.local (never commit this)
NEXT_PUBLIC_BRAZE_API_KEY=your-api-key
NEXT_PUBLIC_BRAZE_SDK_ENDPOINT=your-sdk-endpoint.braze.com`

const step3Code = `// app/layout.tsx
import BrazeProvider from "@/lib/braze/provider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <BrazeProvider>{children}</BrazeProvider>
      </body>
    </html>
  );
}`

const step4Code = `// app/page.tsx
import { BannerCarousel } from "@/lib/braze/carousel";

export default function Page() {
  return <BannerCarousel />;
}`

const step5Code = `// Impressions are tracked automatically by insertBanner().
// For clicks on external CTAs, call logBannerClick():
const banner = braze.getBanner("carousel_slot_1");
if (banner) braze.logBannerClick(banner);

// Optionally refresh content on a timer:
setInterval(() => {
  braze.requestBannersRefresh(PLACEMENT_IDS);
}, 60_000);`

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#1a0066]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between px-6">
          <a href="https://www.braze.com" target="_blank" rel="noopener noreferrer">
            <img src="/braze-logo.png" alt="Braze" className="h-6 w-auto brightness-0 invert" />
          </a>
          <div className="flex items-center gap-5">
            <a
              href="https://www.braze.com/docs/developer_guide/banners"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Docs
            </a>
            <a
              href="https://github.com/braze-inc/banners-carousel-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="hero-gradient px-6 pb-16 pt-16 text-white">
        <div className="relative z-10 mx-auto max-w-[960px]">
          <div className="mb-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Reference Implementation
            </div>
            <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              Build a carousel with<br />Braze Banners
            </h1>
            <p className="max-w-[540px] text-lg leading-relaxed text-white/75">
              A working demo and integration guide showing how to combine multiple
              Banner placements into a carousel. Each slide is an independent
              placement — marketers control the content, targeting, and scheduling
              without a code deploy.
            </p>
          </div>

          {/* Live carousel demo */}
          <div className="overflow-hidden rounded-xl border border-white/15 bg-black/20 p-3 shadow-2xl backdrop-blur-sm">
            <BannerCarousel />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[960px] px-6">

        {/* ── Architecture ───────────────────────────────────────────────── */}
        <section className="py-16">
          <p className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">
            Architecture
          </p>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-foreground">
            How it works
          </h2>
          <p className="mb-8 max-w-[600px] text-muted-foreground">
            Four Banner placements feed four carousel slides. The SDK delivers
            each placement&apos;s HTML, and React renders it — no carousel content
            lives in your codebase.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                icon: '⬡',
                label: 'One placement per slide',
                body: 'Each carousel slot maps to a Banner placement ID (carousel_slot_1 through carousel_slot_4). Marketers author the full HTML per slide in the Braze composer.',
              },
              {
                icon: '⚛',
                label: 'Framework-agnostic pattern',
                body: 'The carousel UI is decoupled from Braze. Build it in React with useState and CSS transitions (as this demo does), or drop in Embla, Swiper, Splide — Braze just fills the containers.',
              },
              {
                icon: '◈',
                label: 'Context provider',
                body: 'BrazeProvider wraps the app and exposes a Record<string, Banner | null> via React context. It initializes the SDK, subscribes to banner updates, and requests a refresh on mount.',
              },
              {
                icon: '▣',
                label: 'Iframe rendering + auto-tracking',
                body: 'braze.insertBanner(banner, el) renders each banner in an isolated iframe. Impressions are logged automatically when the iframe loads — no extra tracking code required.',
              },
            ].map(({ icon, label, body }) => (
              <div key={label} className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-primary/20 hover:bg-accent/30">
                <span className="mb-2 block text-lg text-primary">{icon}</span>
                <p className="mb-1 text-sm font-bold text-foreground">{label}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-border" />

        {/* ── SDK lifecycle ───────────────────────────────────────────────── */}
        <section className="py-16">
          <p className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">
            SDK Integration
          </p>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-foreground">
            Lifecycle
          </h2>
          <p className="mb-8 max-w-[600px] text-muted-foreground">
            Six SDK calls power the entire flow — from initialization to cleanup.
          </p>

          <div className="flex flex-col gap-0">
            {[
              { fn: 'braze.initialize(apiKey, opts)', note: 'Initialize the SDK once on the client. Guard with a flag to prevent double-init in React strict mode.' },
              { fn: 'braze.openSession()', note: 'Start a user session. Required before Banners can be targeted and delivered.' },
              { fn: 'braze.subscribeToBannersUpdates(cb)', note: 'Register a callback that fires immediately with cached data, then again when fresh banners arrive. Returns a subscription ID.' },
              { fn: 'braze.requestBannersRefresh(ids)', note: 'Trigger a network fetch for the given placement IDs. When the response arrives, the subscriber callback fires with the updated map.' },
              { fn: 'braze.insertBanner(banner, el)', note: 'Render the banner HTML into an iframe inside the container element. Impression tracking is automatic.' },
              { fn: 'braze.removeSubscription(id)', note: 'Unsubscribe the callback on component unmount to prevent memory leaks.' },
            ].map(({ fn, note }, i, arr) => (
              <div key={fn} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  {i < arr.length - 1 && <div className="step-connector mt-1 grow" />}
                </div>
                <div className="pb-6">
                  <code className="text-sm font-semibold text-primary">{fn}</code>
                  <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">{note}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Source code reference */}
          <div className="mt-4 space-y-4">
            <h3 className="text-base font-bold text-foreground">Source: Provider &amp; Carousel</h3>
            <CodeBlock code={providerCode} language="typescript" />
            <CodeBlock code={carouselCode} language="typescript" />
          </div>
        </section>

        <hr className="border-border" />

        {/* ── Integration guide ───────────────────────────────────────────── */}
        <section className="py-16">
          <p className="mb-1 text-sm font-bold uppercase tracking-widest text-primary">
            Step-by-step
          </p>
          <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-foreground">
            Add it to your project
          </h2>
          <p className="mb-10 max-w-[600px] text-muted-foreground">
            Five steps from zero to a working Braze-powered carousel.
          </p>

          <div className="flex flex-col gap-10">
            <Step n={1} title="Create Banner placements in Braze">
              <p>
                In the Braze dashboard, navigate to <strong>Settings → Banner Placements</strong> and
                create one placement per carousel slot. Each placement ID maps to one slide —
                marketers design the HTML content in the Braze composer.
              </p>
              <CodeBlock code={step1Code} language="bash" />
            </Step>

            <Step n={2} title="Install the SDK">
              <p>
                Add <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium">@braze/web-sdk</code> and
                configure your API key and SDK endpoint
                in <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium">.env.local</code>.
              </p>
              <CodeBlock code={step2Code} language="bash" />
            </Step>

            <Step n={3} title="Wrap your app with BrazeProvider">
              <p>
                The provider initializes the SDK, subscribes to banner updates, and
                exposes banner data to the entire component tree via React context.
              </p>
              <CodeBlock code={step3Code} language="typescript" />
            </Step>

            <Step n={4} title="Render the carousel">
              <p>
                Drop <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium">&lt;BannerCarousel /&gt;</code> anywhere
                on the page. It reads from context automatically — no props needed. Each slide
                calls <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium">insertBanner()</code> when
                it becomes active.
              </p>
              <CodeBlock code={step4Code} language="typescript" />
            </Step>

            <Step n={5} title="Analytics and refresh">
              <p>
                Impression tracking is automatic
                via <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium">insertBanner()</code>.
                For clicks on CTAs rendered outside the iframe,
                use <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-medium">logBannerClick()</code>.
                Optionally poll for fresh content.
              </p>
              <CodeBlock code={step5Code} language="typescript" />
            </Step>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-muted/50 px-6 py-10">
        <div className="mx-auto flex max-w-[960px] flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <img src="/braze-logo.png" alt="Braze" className="h-5 w-auto" />
            <span className="text-sm text-muted-foreground">Banners Carousel Demo</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="https://www.braze.com/docs/developer_guide/banners" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
              Banners Docs
            </a>
            <a href="https://www.braze.com/docs/developer_guide/banners/placements" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
              Placements Guide
            </a>
            <a href="https://github.com/braze-inc/banners-carousel-demo" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">
              Source on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Step sub-component ──────────────────────────────────────────────────────

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {n}
        </div>
        <div className="step-connector mt-2 grow" />
      </div>
      <div className="min-w-0 flex-1 pb-2">
        <h3 className="mb-3 text-lg font-bold text-foreground">{title}</h3>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-foreground/90">
          {children}
        </div>
      </div>
    </div>
  )
}
