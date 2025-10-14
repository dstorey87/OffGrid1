import { ThemeToggle } from '@/components/theme-toggle';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto px-4 py-16">
        <div className="absolute right-4 top-4">
          <ThemeToggle />
        </div>
        
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-5xl font-bold tracking-tight">
            Welcome to <span className="text-primary">OffGrid Platform</span>
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground">
            A powerful multi-site platform with AI capabilities, content management, and
            monetization built-in.
          </p>

          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/directory"
              className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
            >
              <h2 className="mb-2 text-2xl font-semibold">Directory</h2>
              <p className="text-muted-foreground">
                Browse our comprehensive directory of resources
              </p>
            </Link>

            <Link
              href="/calculators"
              className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
            >
              <h2 className="mb-2 text-2xl font-semibold">Calculators</h2>
              <p className="text-muted-foreground">
                Use our advanced calculation tools
              </p>
            </Link>

            <Link
              href="/chat"
              className="rounded-lg border bg-card p-6 transition-colors hover:bg-accent"
            >
              <h2 className="mb-2 text-2xl font-semibold">AI Chat</h2>
              <p className="text-muted-foreground">
                Get instant AI-powered assistance
              </p>
            </Link>
          </div>

          <div className="mt-12 rounded-lg border bg-card p-8">
            <h3 className="mb-4 text-2xl font-semibold">Platform Features</h3>
            <ul className="space-y-2 text-left text-muted-foreground">
              <li>✅ Next.js 15 with TypeScript and Tailwind CSS</li>
              <li>✅ WordPress Multisite CMS with custom plugins</li>
              <li>✅ FastAPI AI service integration</li>
              <li>✅ Dark mode support</li>
              <li>✅ Monetization ready with Stripe</li>
              <li>✅ Docker orchestration</li>
              <li>✅ Kubernetes manifests (coming soon)</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
