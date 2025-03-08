"use client";

import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Your Nepal Adventure?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Connect with expert local guides and create memories that last a
          lifetime
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" variant="secondary">
            Find a Guide
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white/10"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
}
