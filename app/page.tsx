import { BannerCarousel } from '@/components/banner-carousel'
import { CodeBlock } from '@/components/code-block'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

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

// ─── Cursor tab ──────────────────────────────────────────────────────────────

const cursorPrompt1 = `I want to add a Braze Banner carousel to this Next.js app.
The carousel should show 4 slides, each powered by a Braze Banner placement:
carousel_slot_1, carousel_slot_2, carousel_slot_3, carousel_slot_4.

Please install @braze/web-sdk and set up a lib/braze.ts file that:
- Initializes the SDK with NEXT_PUBLIC_BRAZE_API_KEY and NEXT_PUBLIC_BRAZE_SDK_ENDPOINT
- Guards against double-initialization
- Sets allowUserSuppliedJavascript: true`

const cursorPrompt2 = `Create a BrazeProvider component in components/braze-provider.tsx that:
- Is a "use client" React context provider
- Calls initBraze() on mount
- Subscribes to braze.subscribeToBannersUpdates() for the 4 carousel placement IDs
- Calls braze.requestBannersRefresh() to fetch the latest banners
- Exposes the banners (Record<string, Banner | null>) via React context
- Cleans up the subscription on unmount

Then wrap the root layout's children with <BrazeProvider>.`

const cursorPrompt3 = `Create a BannerCarousel component in components/banner-carousel.tsx that:
- Reads banner data from BrazeContext using a useBrazeContext() hook
- Tracks the current slide index with useState
- For the active slide, calls braze.insertBanner(banner, containerEl) inside a useEffect
  so the banner HTML renders in an iframe and impressions are logged automatically
- Shows a loading placeholder while banners are fetching
- Shows a "no banner configured" placeholder for null/control banners
- Has previous/next arrow buttons and dot indicator navigation`

const cursorPrompt4 = `Add this to the .env.local file:
NEXT_PUBLIC_BRAZE_API_KEY=<your key>
NEXT_PUBLIC_BRAZE_SDK_ENDPOINT=<your endpoint>

Then render <BannerCarousel /> on the main page and start the dev server.
Confirm the carousel is fetching from Braze by checking the browser console
(enableLogging: true will show SDK activity).`

// ─────────────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-white">
        <div className="mx-auto flex h-16 max-w-[800px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="32" height="32" rx="6" fill="#3608D7"/>
              <path d="M16 7v18M9.5 10.5l13 11M9.5 21.5l13-11" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="text-xl font-extrabold tracking-tight text-foreground">braze</span>
            <span className="ml-1 rounded-full bg-accent px-2.5 py-0.5 text-xs font-semibold text-primary">Banner Carousel</span>
          </div>
          <a
            href="https://www.braze.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get Started
          </a>
        </div>
      </nav>

      <main className="mx-auto max-w-[800px] px-6 py-12">

        {/* ── Live Demo ──────────────────────────────────────────────────── */}
        <section className="mb-16">
          <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-foreground">
            Braze Banner Carousel
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Four Braze Banner placements rendered live in a custom React carousel.
          </p>
          <BannerCarousel />
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
                  label: 'No carousel library',
                  body: 'The carousel is a custom React component. CSS transform: translateX transitions drive slide animations. useState tracks the active index. No Splide, Swiper, or Embla dependency.',
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

        {/* ── Tabbed guide ───────────────────────────────────────────────── */}
        <section>
          <h2 className="mb-1 text-2xl font-extrabold tracking-tight text-foreground">
            Add it to your project
          </h2>
          <p className="mb-6 text-muted-foreground">
            Two ways to get started — manually or with an AI coding assistant.
          </p>

          <Tabs defaultValue="manual">
            <TabsList className="mb-6 h-10 w-full rounded-full bg-muted p-1 sm:w-auto">
              <TabsTrigger value="manual" className="rounded-full px-5 text-sm font-semibold">
                Step by step
              </TabsTrigger>
              <TabsTrigger value="cursor" className="rounded-full px-5 text-sm font-semibold">
                Build with Cursor
              </TabsTrigger>
            </TabsList>

            {/* ── Tab 1: Manual ── */}
            <TabsContent value="manual">
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
            </TabsContent>

            {/* ── Tab 2: Cursor ── */}
            <TabsContent value="cursor">
              <div className="mb-6 rounded-xl border border-accent bg-accent/30 px-5 py-4">
                <p className="text-sm leading-relaxed text-foreground/90">
                  <strong>Cursor</strong> is an AI-powered code editor that can write, refactor, and
                  wire up integrations from natural-language descriptions. The prompts below guide
                  it through building the full Braze Banners carousel from scratch. Paste each into
                  Cursor&apos;s chat (Agent mode) in order.
                </p>
              </div>

              <div className="flex flex-col gap-10">

                <CursorStep n={1} title="Describe the integration">
                  <p>
                    Open your project in Cursor and start a new Agent chat. Give it the big picture
                    so it understands the shape of the feature before touching any files.
                  </p>
                  <PromptBlock prompt={cursorPrompt1} />
                </CursorStep>

                <CursorStep n={2} title="Generate the provider">
                  <p>
                    Ask Cursor to scaffold the context provider. It will create the file, write the
                    subscription logic, and handle cleanup automatically.
                  </p>
                  <PromptBlock prompt={cursorPrompt2} />
                </CursorStep>

                <CursorStep n={3} title="Build the carousel component">
                  <p>
                    Prompt Cursor to create the carousel. Be explicit about{' '}
                    <code className="rounded bg-muted px-1.5 py-0.5 text-sm">insertBanner()</code> so it
                    uses the SDK&apos;s built-in iframe rendering rather than{' '}
                    <code className="rounded bg-muted px-1.5 py-0.5 text-sm">dangerouslySetInnerHTML</code>.
                  </p>
                  <PromptBlock prompt={cursorPrompt3} />
                </CursorStep>

                <CursorStep n={4} title="Wire it up and verify">
                  <p>
                    Give Cursor your credentials and ask it to finish the integration. With{' '}
                    <code className="rounded bg-muted px-1.5 py-0.5 text-sm">enableLogging: true</code>, the
                    Braze SDK logs all network activity to the browser console — you can confirm
                    banners are being fetched without needing campaigns live.
                  </p>
                  <PromptBlock prompt={cursorPrompt4} />
                </CursorStep>

              </div>
            </TabsContent>
          </Tabs>
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

function CursorStep({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-sm font-bold text-primary">
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

function PromptBlock({ prompt }: { prompt: string }) {
  return (
    <div className="rounded-xl border border-border bg-foreground/[0.03] p-4">
      <div className="mb-2 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cursor prompt</span>
      </div>
      <pre className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{prompt}</pre>
    </div>
  )
}
