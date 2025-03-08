"use client";

import { Mountain, Shield, Globe, Heart } from "lucide-react";

const features = [
  {
    icon: Mountain,
    title: "Expert Local Guides",
    description:
      "Connect with certified Himalayan trekking experts, cultural interpreters, and adventure specialists.",
  },
  {
    icon: Shield,
    title: "Safe Adventures",
    description:
      "All guides are verified, licensed, and trained in safety protocols and emergency response.",
  },
  {
    icon: Globe,
    title: "Cultural Immersion",
    description:
      "Experience authentic Nepalese culture with guides who know local traditions and customs.",
  },
  {
    icon: Heart,
    title: "Community Impact",
    description:
      "Support local communities through responsible tourism and direct guide partnerships.",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">
            Why Choose Nepal Guide Connect
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the Himalayas with confidence through our network of
            verified local guides
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
