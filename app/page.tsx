import { BannerCarousel } from '@/lib/braze/carousel'
import { CodeBlock } from '@/components/code-block'
import { StepTabs } from '@/components/step-tabs'

const REPO_BASE = 'https://github.com/mark-at-braze/carousels/blob/main'

// ─── Code samples ────────────────────────────────────────────────────────────

const step1Code = `import * as braze from "@braze/web-sdk";

braze.initialize("YOUR-API-KEY", {
  baseUrl: "YOUR-ENDPOINT",
  enableLogging: true,               // optional — remove in production
  allowUserSuppliedJavascript: true, // required for Banner HTML
});

braze.openSession();`

const step2Code = `braze.subscribeToBannersUpdates((banners) => {
  // \`banners\` maps each placement ID to its Banner object (or null).
  // This callback fires whenever Banner content is updated.
  updateYourUI(banners);
});`

const step3Code = `const banner = banners["carousel_slot_1"];
const container = document.getElementById("carousel-slot-1");

if (banner && !banner.isControl && container) {
  // Renders the Banner HTML into an iframe and auto-logs an impression.
  braze.insertBanner(banner, container);
} else if (banner?.isControl) {
  // Hide the container for control-group users.
  container.style.display = "none";
}`

const step4Code = `braze.requestBannersRefresh([
  "carousel_slot_1",
  "carousel_slot_2",
  "carousel_slot_3",
]);`

const step7Code = `import { BannerCarousel } from "./BannerCarousel";

export default function Page() {
  return <BannerCarousel />;
}`

const step5Code = `<!-- One <div> per carousel slot -->
<div id="carousel-slot-1" style="width: 100%; height: 256px;"></div>
<div id="carousel-slot-2" style="width: 100%; height: 256px;"></div>
<div id="carousel-slot-3" style="width: 100%; height: 256px;"></div>`

const step6Code = `"use client";

import { useState, useEffect, useRef } from "react";
import * as braze from "@braze/web-sdk";

const PLACEMENT_IDS = [
  "carousel_slot_1",
  "carousel_slot_2",
  "carousel_slot_3",
];

export function BannerCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState({});
  const slotRefs = useRef([]);

  useEffect(() => {
    braze.subscribeToBannersUpdates((updated) => setBanners({ ...updated }));
    braze.requestBannersRefresh(PLACEMENT_IDS);
  }, []);

  // Call insertBanner() whenever the active slide or banner data changes.
  useEffect(() => {
    const banner = banners[PLACEMENT_IDS[currentSlide]];
    const container = slotRefs.current[currentSlide];
    if (banner && !banner.isControl && container) {
      braze.insertBanner(banner, container);
    }
  }, [currentSlide, banners]);

  const prev = () =>
    setCurrentSlide((s) => (s - 1 + PLACEMENT_IDS.length) % PLACEMENT_IDS.length);
  const next = () =>
    setCurrentSlide((s) => (s + 1) % PLACEMENT_IDS.length);

  return (
    <div style={{ position: "relative", width: "100%", height: 256 }}>
      {PLACEMENT_IDS.map((id, i) => (
        <div
          key={id}
          ref={(el) => { slotRefs.current[i] = el; }}
          style={{ display: i === currentSlide ? "block" : "none", height: "100%" }}
        />
      ))}

      <button onClick={prev}>← Prev</button>
      <button onClick={next}>Next →</button>
    </div>
  );
}`

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 border-b border-border bg-white">
        <div className="mx-auto flex h-14 max-w-[960px] items-center justify-between px-6">
          <a href="https://www.braze.com" target="_blank" rel="noopener noreferrer">
            <img src="/braze-logo.png" alt="Braze" className="h-6 w-auto" />
          </a>
          <div className="flex items-center gap-5">
            <a
              href="https://www.braze.com/docs/developer_guide/banners"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Docs
            </a>
            <a
              href="https://github.com/braze-inc/banners-carousel-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
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
      <section className="hero-section px-6 py-14">
        <div className="mx-auto max-w-[960px]">
          <p className="mb-3 text-sm font-semibold text-primary">Reference Implementation</p>
          <h1 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl">
            Build a carousel with Braze Banners
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
            A working demo and integration guide showing how to combine multiple
            Banner placements into a carousel.
          </p>

          {/* Live carousel demo */}
          <div className="overflow-hidden rounded-xl border border-border bg-white p-3 shadow-sm">
            <BannerCarousel />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[960px] px-6">

        {/* ── Architecture ───────────────────────────────────────────────── */}
        <section className="py-14">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">Overview</p>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">How it works</h2>
          <p className="mb-8 text-muted-foreground">
            Three Banner placements feed three carousel slides. The SDK delivers
            each placement&apos;s HTML, and React renders it — no carousel content
            lives in your codebase.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {([
              ['Marketer-owned content', <>Marketers update carousel slides without code deploys. They create Banner campaigns in Braze, target them to placement IDs, and control content, scheduling, and audience — no engineering ticket required.</>],
              ['Per-slide targeting and A/B testing', <>Each slide can show different content to different users based on Braze audience segments. Control groups are handled automatically by the SDK — no extra logic needed.</>],
              ['Impressions tracked automatically', <><code className="rounded bg-muted px-1.5 py-0.5 font-medium">insertBanner()</code> logs an impression as soon as the Banner iframe loads. There&apos;s no analytics plumbing to wire up — Braze handles it the moment content becomes visible.</>],
              ['Bring your own carousel', <>Braze fills the containers; the carousel UI is entirely yours. Use React state and CSS transitions as this demo does, or drop in Embla, Swiper, or Splide — any approach works.</>],
            ] as [string, React.ReactNode][]).map(([label, body]) => (
              <div key={label} className="rounded-lg border border-border bg-card p-5">
                <p className="mb-1.5 font-semibold text-foreground">{label}</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-border" />

        {/* ── Integration guide ───────────────────────────────────────────── */}
        <section className="py-14">
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">Step-by-step</p>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Add a Banners carousel to your project</h2>
          <p className="mb-10 max-w-[600px] text-muted-foreground">
            Seven steps from zero to a working Braze-powered carousel.
          </p>

          <div className="flex flex-col gap-10">
            <Step n={1} title="Initialize the SDK">
              <StepTabs tabs={[
                {
                  label: "How it works",
                  content: (
                    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                      <p>
                        The SDK must be initialized once before any Braze features can be used.{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">initialize()</code> connects
                        to Braze servers using your API key and endpoint.
                      </p>
                      <p>
                        Set <code className="rounded bg-muted px-1.5 py-0.5 font-medium">enableLogging: true</code> while
                        developing — it surfaces what the SDK is doing in the browser console.
                        Set <code className="rounded bg-muted px-1.5 py-0.5 font-medium">allowUserSuppliedJavascript: true</code> so
                        Banner HTML can execute inside the iframe. Then call{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">openSession()</code> to
                        start tracking the user session.
                      </p>
                      <ProjectLink file="lib/braze/init.ts" />
                    </div>
                  ),
                },
                { label: "Sample code", content: <CodeBlock code={step1Code} language="javascript" /> },
              ]} />
            </Step>

            <Step n={2} title="Subscribe to Banner updates">
              <StepTabs tabs={[
                {
                  label: "How it works",
                  content: (
                    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                      <p>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">subscribeToBannersUpdates()</code> registers
                        a callback that fires whenever Braze delivers new Banner content. The callback
                        receives an object mapping each placement ID to its{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">Banner</code> — or{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">null</code> if the
                        user didn&apos;t qualify for any campaign at that placement.
                      </p>
                      <p>
                        Store the result in state so your UI re-renders automatically when content arrives.
                      </p>
                      <ProjectLink file="lib/braze/provider.tsx" />
                    </div>
                  ),
                },
                { label: "Sample code", content: <CodeBlock code={step2Code} language="javascript" /> },
              ]} />
            </Step>

            <Step n={3} title="Insert Banners and handle control groups">
              <StepTabs tabs={[
                {
                  label: "How it works",
                  content: (
                    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                      <p>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">insertBanner()</code> renders
                        the Banner&apos;s HTML into an isolated iframe inside the container element you
                        provide. Impressions are logged automatically when the iframe loads — no
                        extra analytics code needed.
                      </p>
                      <p>
                        Control groups are part of Braze&apos;s A/B testing system. When{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">banner.isControl</code> is{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">true</code>, the user
                        is in a holdout group and shouldn&apos;t see content. Hide or collapse the
                        container for these users to keep experiment results valid.
                      </p>
                      <ProjectLink file="lib/braze/carousel.tsx" />
                    </div>
                  ),
                },
                { label: "Sample code", content: <CodeBlock code={step3Code} language="javascript" /> },
              ]} />
            </Step>

            <Step n={4} title="Refresh your Banners">
              <StepTabs tabs={[
                {
                  label: "How it works",
                  content: (
                    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                      <p>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">requestBannersRefresh()</code> tells
                        Braze to fetch the latest Banner content for the given placement IDs. Call it
                        once after initializing the SDK so the user gets fresh content at the start
                        of each session.
                      </p>
                      <p>
                        You can also call it at any time — for example, on page navigation — to
                        ensure content stays current without a full page reload.
                      </p>
                      <ProjectLink file="lib/braze/provider.tsx" />
                    </div>
                  ),
                },
                { label: "Sample code", content: <CodeBlock code={step4Code} language="javascript" /> },
              ]} />
            </Step>

            <Step n={5} title="Add containers for your Banners">
              <StepTabs tabs={[
                {
                  label: "How it works",
                  content: (
                    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                      <p>
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">insertBanner()</code> renders
                        content into a DOM element you provide — one per placement. In plain HTML,
                        that&apos;s a <code className="rounded bg-muted px-1.5 py-0.5 font-medium">&lt;div&gt;</code> with
                        an <code className="rounded bg-muted px-1.5 py-0.5 font-medium">id</code> you
                        can look up with{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">document.getElementById()</code>.
                        In a React component, you attach refs directly to JSX elements instead —
                        step 6 shows how.
                      </p>
                      <ProjectLink file="lib/braze/carousel.tsx" />
                    </div>
                  ),
                },
                { label: "Sample code", content: <CodeBlock code={step5Code} language="html" /> },
              ]} />
            </Step>

            <Step n={6} title="Build the carousel UI">
              <StepTabs tabs={[
                {
                  label: "How it works",
                  content: (
                    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                      <p>
                        The carousel is standard UI wired to the Braze data you already have. Track
                        the active slide index with component state, then call{" "}
                        <code className="rounded bg-muted px-1.5 py-0.5 font-medium">braze.insertBanner()</code>{" "}
                        on the newly visible container whenever the slide changes.
                      </p>
                      <p>
                        Each slot container maps to one placement ID — show the active container and
                        hide the rest. Previous/next buttons and dot indicators update the active
                        index; Braze handles everything else. You can use any carousel library or
                        build your own.
                      </p>
                      <p>
                        Because <code className="rounded bg-muted px-1.5 py-0.5 font-medium">insertBanner()</code> is
                        idempotent, you can safely call it again whenever slide state or banner data
                        changes without rendering duplicate iframes.
                      </p>
                      <ProjectLink file="lib/braze/carousel.tsx" />
                    </div>
                  ),
                },
                { label: "Sample code", content: <CodeBlock code={step6Code} language="typescript" /> },
              ]} />
            </Step>

            <Step n={7} title="Render the carousel">
              <StepTabs tabs={[
                {
                  label: "How it works",
                  content: (
                    <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
                      <p>
                        The <code className="rounded bg-muted px-1.5 py-0.5 font-medium">BannerCarousel</code> component
                        is self-contained — it manages its own Braze subscription and refresh internally.
                        Import it and drop it anywhere in your component tree.
                      </p>
                      <ProjectLink file="app/page.tsx" />
                    </div>
                  ),
                },
                { label: "Sample code", content: <CodeBlock code={step7Code} language="typescript" /> },
              ]} />
            </Step>
          </div>
        </section>
      </main>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-[960px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <img src="/braze-logo.png" alt="Braze" className="h-5 w-auto" />
            <span className="text-sm text-muted-foreground">Banners Carousel Demo</span>
          </div>
          <div className="flex gap-5 text-sm text-muted-foreground">
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

// ─── Sub-components ──────────────────────────────────────────────────────────

function ProjectLink({ file }: { file: string }) {
  return (
    <a
      href={`${REPO_BASE}/${file}`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
    >
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden="true">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
      {file}
    </a>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {n}
        </div>
        <div className="step-connector mt-1 grow" />
      </div>
      <div className="min-w-0 flex-1 pb-2">
        <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </div>
    </div>
  )
}