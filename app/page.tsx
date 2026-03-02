import { BannerCarousel } from '@/components/banner-carousel'
import { CodeBlock } from '@/components/code-block'

const bannerSlides = [
  {
    id: 'placement-1',
    title: 'Banner Placement 1: Feature Announcement',
    description:
      'Discover our latest feature that helps you streamline your workflow and boost productivity.',
    ctaText: 'Learn More',
    backgroundColor: 'oklch(0.96 0.01 250)',
  },
  {
    id: 'placement-2',
    title: 'Banner Placement 2: Onboarding Tip',
    description:
      'Get started quickly with our step-by-step guide. Complete your profile to unlock all features.',
    ctaText: 'Get Started',
    backgroundColor: 'oklch(0.96 0.01 140)',
  },
  {
    id: 'placement-3',
    title: 'Banner Placement 3: Special Offer',
    description:
      'Limited time offer: Upgrade to Pro and get 3 months free. Don\'t miss out on exclusive benefits.',
    ctaText: 'Upgrade Now',
    backgroundColor: 'oklch(0.96 0.015 60)',
  },
  {
    id: 'placement-4',
    title: 'Banner Placement 4: Event Reminder',
    description:
      'Join us for our upcoming webinar on advanced automation techniques. Reserve your spot today.',
    ctaText: 'Register',
    backgroundColor: 'oklch(0.96 0.01 320)',
  },
]

const step1Code = `// 1. In Braze Dashboard:
// Create four Banner placements:
// - "home_feature_banner"
// - "home_onboarding_banner"
// - "home_offer_banner"
// - "home_event_banner"

// Configure each placement with:
// - Title (text field)
// - Description (text field)
// - CTA Text (text field)
// - CTA Action (URL or deep link)`

const step2Code = `import * as braze from "@braze/web-sdk";

// Initialize the Braze SDK
braze.initialize("YOUR_API_KEY", {
  baseUrl: "YOUR_SDK_ENDPOINT",
  enableLogging: true,
});

// Open session
braze.openSession();`

const step3Code = `// Subscribe to Banner updates
const placements = [
  "home_feature_banner",
  "home_onboarding_banner",
  "home_offer_banner",
  "home_event_banner"
];

const bannerData: Record<string, any> = {};

placements.forEach(placementId => {
  braze.subscribeToBannerUpdates((banners) => {
    const banner = banners.find(b => b.placementId === placementId);
    if (banner) {
      bannerData[placementId] = {
        title: banner.extras?.title || "",
        description: banner.extras?.description || "",
        ctaText: banner.extras?.ctaText || "",
        ctaAction: banner.clickAction || ""
      };
    }
  });
});

// Request refresh
braze.requestBannersRefresh([...placements]);`

const step4Code = `interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  ctaText?: string;
  ctaAction?: () => void;
  backgroundColor: string;
}

// Map Braze Banner data to carousel slides
const slides: CarouselSlide[] = placements
  .map((placementId, index) => {
    const banner = bannerData[placementId];
    if (!banner) return null;

    return {
      id: placementId,
      title: banner.title,
      description: banner.description,
      ctaText: banner.ctaText,
      ctaAction: () => {
        // Handle CTA click - open URL or trigger action
        window.location.href = banner.ctaAction;
      },
      backgroundColor: getBackgroundColor(index)
    };
  })
  .filter(Boolean) as CarouselSlide[];`

const step5Code = `// Track impressions when slide is visible
function trackBannerImpression(placementId: string) {
  const banner = braze.getBanner(placementId);
  if (banner) {
    banner.logImpression();
  }
}

// Track clicks when CTA is clicked
function trackBannerClick(placementId: string) {
  const banner = braze.getBanner(placementId);
  if (banner) {
    banner.logClick();
  }
}

// Call trackBannerImpression when each slide becomes visible
// Call trackBannerClick when user clicks the CTA button

// Refresh banners periodically (optional)
setInterval(() => {
  braze.requestBannersRefresh([...placements]);
}, 60000); // Refresh every 60 seconds`

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="mx-auto flex h-16 max-w-[800px] items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary" />
            <span className="text-lg font-semibold text-foreground">Braze Banner Carousel</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-[800px] px-6 py-12">
        {/* Section 1: Live Demo */}
        <section className="mb-16">
          <div className="mb-6">
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-foreground">
              Live Carousel Demo
            </h1>
            <p className="text-lg text-muted-foreground">
              A working example of four Braze Banner placements in a carousel component.
            </p>
          </div>
          <BannerCarousel slides={bannerSlides} />
        </section>

        {/* Section 2: Developer Instructions */}
        <section>
          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold tracking-tight text-foreground">
              How to Build a Banner Carousel with Braze
            </h2>
            <p className="text-lg text-muted-foreground">
              Follow these steps to integrate Braze Banners into a carousel component in your
              application.
            </p>
          </div>

          {/* Step 1 */}
          <div className="mb-10">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                1
              </span>
              <h3 className="text-2xl font-semibold text-foreground">
                Define Banner Placements in Braze
              </h3>
            </div>
            <div className="ml-11">
              <p className="mb-4 leading-relaxed text-foreground/90">
                In your Braze dashboard, create four Banner placements for your carousel. Each
                placement should have a unique ID and contain the content fields you'll need to
                display: title, description, CTA text, and CTA action (URL or deep link).
              </p>
              <CodeBlock code={step1Code} language="typescript" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="mb-10">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                2
              </span>
              <h3 className="text-2xl font-semibold text-foreground">
                Initialize the Braze Web SDK
              </h3>
            </div>
            <div className="ml-11">
              <p className="mb-4 leading-relaxed text-foreground/90">
                Install and initialize the Braze Web SDK in your application. You'll need your API
                key and SDK endpoint from the Braze dashboard. Make sure to open a session to start
                receiving Banner data.
              </p>
              <CodeBlock code={step2Code} language="typescript" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="mb-10">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                3
              </span>
              <h3 className="text-2xl font-semibold text-foreground">
                Fetch Banner Content for Each Placement
              </h3>
            </div>
            <div className="ml-11">
              <p className="mb-4 leading-relaxed text-foreground/90">
                Subscribe to Banner updates for each placement ID. When Banners are refreshed,
                your callback will receive the latest content. Store the Banner data in a way
                that's easy to map to your carousel slides.
              </p>
              <CodeBlock code={step3Code} language="typescript" />
            </div>
          </div>

          {/* Step 4 */}
          <div className="mb-10">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                4
              </span>
              <h3 className="text-2xl font-semibold text-foreground">
                Map Placement Content to Carousel Slides
              </h3>
            </div>
            <div className="ml-11">
              <p className="mb-4 leading-relaxed text-foreground/90">
                Transform the Banner data from Braze into the format your carousel component
                expects. Map each placement to a slide with the appropriate title, description, CTA
                button, and styling.
              </p>
              <CodeBlock code={step4Code} language="typescript" />
            </div>
          </div>

          {/* Step 5 */}
          <div className="mb-10">
            <div className="mb-4 flex items-baseline gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                5
              </span>
              <h3 className="text-2xl font-semibold text-foreground">
                Handle Refresh and Display Tracking
              </h3>
            </div>
            <div className="ml-11">
              <p className="mb-4 leading-relaxed text-foreground/90">
                Implement impression and click tracking for analytics. Log an impression when a
                slide becomes visible, and log a click when the user interacts with the CTA.
                Optionally, set up periodic refreshes to fetch updated Banner content from Braze.
              </p>
              <CodeBlock code={step5Code} language="typescript" />
            </div>
          </div>

          {/* Summary */}
          <div className="mt-12 rounded-lg border border-border bg-muted/50 p-6">
            <h4 className="mb-3 text-lg font-semibold text-foreground">Summary</h4>
            <p className="leading-relaxed text-foreground/90">
              You now have a fully functional Banner carousel powered by Braze! This setup allows
              your marketing team to update Banner content in real-time through the Braze dashboard
              without requiring code changes. The carousel automatically displays the latest
              campaigns, tracks engagement, and provides a seamless in-app messaging experience.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
