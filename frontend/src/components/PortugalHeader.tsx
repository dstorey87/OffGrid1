import React from 'react';

const PortugalHeader = () => {
  return (
    <>
      {/* Portugal flag accent bar */}
      <div className="portugal-accent w-full"></div>

      {/* Main header */}
      <header className="border-b border-primary/20 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            {/* Logo area with solar and wind icons */}
            <div className="mb-4 inline-flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-lg">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>

              <div className="text-center">
                <h1 className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
                  Our Offgrid Journey Portugal
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sustainable Living & Renewable Energy Resources
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-primary shadow-lg">
                <svg
                  className="h-7 w-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>

            {/* Subtitle with Portuguese text */}
            <p className="mx-auto mb-4 max-w-3xl text-lg text-muted-foreground">
              Descubra soluções sustentáveis para viver off-grid em Portugal
              <br />
              <span className="text-sm">
                Discover sustainable solutions for off-grid living in Portugal
              </span>
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 font-medium text-primary">
                🇵🇹 Portugal Focus
              </span>
              <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 font-medium text-accent">
                ☀️ Energia Solar
              </span>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 font-medium text-primary">
                💨 Energia Eólica
              </span>
              <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1.5 font-medium text-accent">
                💧 Água Sustentável
              </span>
              <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 font-medium text-primary">
                🏡 Vida Off-Grid
              </span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default PortugalHeader;
