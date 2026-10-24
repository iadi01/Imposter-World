import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error("[Imposter World Error]", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" },
      { title: "Imposter World | Play the Imposter Game Online Free" },
      {
        name: "description",
        content:
          "Play Imposter World, a free online multiplayer imposter word game with friends. Discover secret words, give drawing and voice clues, deduce the bluffer, and catch the imposter without downloading an app.",
      },
      { name: "keywords", content: "imposter game, imposter game online, play imposter online, imposter game with friends, imposter word game, free imposter game" },
      { property: "og:site_name", content: "Imposter World" },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Imposter World — Play Multiplayer Imposter Game Online" },
      { property: "og:description", content: "Join friends, give clever clues, interrogate bluffers, and catch the classroom imposter online for free." },
      { property: "og:image", content: "https://imposter-world.onrender.com/classroom-bg.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Imposter World — Online Imposter Party Game" },
      { name: "twitter:description", content: "Play the nostalgic classroom notebook multiplayer imposter game with friends." },
      { name: "twitter:image", content: "https://imposter-world.onrender.com/classroom-bg.jpg" },
      { name: "google-site-verification", content: "lCqNkkCEBBU4MDc48vu3_ZwiS8Ml0cFtmn8JyQ6iDIA" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Kalam:wght@400;700&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "apple-touch-icon", href: "/detective.png" },
    ],
    scripts: [
      {
        src: "https://www.googletagmanager.com/gtag/js?id=G-DPETXW891Q",
        async: true,
      },
      {
        children: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-DPETXW891Q');`,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebSite",
              "@id": "https://imposter-world.onrender.com/#website",
              "url": "https://imposter-world.onrender.com/",
              "name": "Imposter World",
              "description": "Free Online Multiplayer Imposter Word Game with Friends",
              "inLanguage": "en-US",
            },
            {
              "@type": "WebApplication",
              "@id": "https://imposter-world.onrender.com/#app",
              "name": "Imposter World",
              "url": "https://imposter-world.onrender.com/",
              "applicationCategory": "GameApplication",
              "operatingSystem": "Any (web browser)",
              "description": "A multiplayer imposter word game to play online with friends.",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
            },
            {
              "@type": "VideoGame",
              "@id": "https://imposter-world.onrender.com/#game",
              "name": "Imposter World",
              "url": "https://imposter-world.onrender.com/",
              "description":
                "Multiplayer classroom notebook party game where players receive secret words, give subtle clues, and deduce who the imposter is.",
              "genre": ["Party Game", "Word Game", "Social Deduction", "Multiplayer"],
              "gamePlatform": ["Web Browser", "Mobile Browser"],
              "numberOfPlayers": {
                "@type": "QuantitativeValue",
                "minValue": 3,
                "maxValue": 14,
              },
              "image": "https://imposter-world.onrender.com/detective.png",
            },
            {
              "@type": "FAQPage",
              "@id": "https://imposter-world.onrender.com/#faq",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "What is the Imposter Game online?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                      "The Imposter Game is a viral social deduction word game where every player in the room receives the same secret word, except one hidden player who is the imposter. Players take turns giving subtle one-word, drawing, or voice clues to prove they know the secret word without revealing it to the imposter. At the end of the round, players debate and vote to unmask the bluffer.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "What is the difference between imposter vs impostor?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                      "Both 'imposter' and 'impostor' are valid spellings of the exact same noun meaning a pretender or deceiver. 'Impostor' is the classical historical Latin spelling, while 'imposter' is the modern standard used in digital culture, search engines, and viral party games like Imposter World and Among Us.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "What does being an imposter mean in the word game?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                      "In Imposter World, the imposter is a player who either receives no word or a subtly different decoy word. The imposter must deduce the true secret word from other players' clues and bluff their own clues convincingly to avoid being voted out.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "How to play Imposter online with friends for free without downloading an app?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                      "Open Imposter World in any browser on your phone, tablet, or laptop. Tap 'Create Room', choose your game settings, and share the room code or 1-click invite link with up to 14 friends. No downloads, installations, or signups are required.",
                  },
                },
                {
                  "@type": "Question",
                  "name": "Can I play Imposter World on a single device offline (Pass and Play)?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text":
                      "Yes! Imposter World includes a full offline Pass & Play mode. Up to 14 players can share one phone or tablet, secretly inspecting their assigned word using a private reveal shield before starting an in-person classroom discussion.",
                  },
                },
              ],
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="lCqNkkCEBBU4MDc48vu3_ZwiS8Ml0cFtmn8JyQ6iDIA" />
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-DPETXW891Q" />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-DPETXW891Q');`,
          }}
        />
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
