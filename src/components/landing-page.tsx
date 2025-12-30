'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FortressGateIcon } from '@/components/icons';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <FortressGateIcon className="h-6 w-6" />
          <span className="sr-only">FortressGate</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="/login"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Register
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Secure, Streamlined Visitor Management
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    FortressGate provides a robust solution for managing visitor access in high-security environments, ensuring safety and efficiency.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/login">Get Started</Link>
                  </Button>
                </div>
              </div>
              <Image
                data-ai-hint="abstract illustration"
                src="https://images.pexels.com/photos/5952651/pexels-photo-5952651.jpeg"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
