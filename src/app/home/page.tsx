"use client"

import React from "react";
import { HeroSection } from "(components)/hero-section";
import { FeatureCard } from "(components)/feature-card";
import { RocketIcon, CodeIcon, GlobeIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />

      <section className="py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            Future Features
          </h2>
          <p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            This space will soon be filled with amazing functionality. Here&apos;s
            what you can expect:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <RocketIcon className="h-10 w-10 text-indigo-500" />
            }
            title="Fast Performance"
            description="Lightning-quick load times and smooth interactions for the best user experience."
          />

          <FeatureCard
            icon={
              <CodeIcon className="h-10 w-10 text-indigo-500" />
            }
            title="Modern Technology"
            description="Built with the latest frameworks and tools for maintainability and scalability."
          />

          <FeatureCard
            icon={
              <GlobeIcon className="h-10 w-10 text-indigo-500" />
            }
            title="Responsive Design"
            description="Perfectly optimized for all devices, from mobile phones to large desktop screens."
          />
        </div>
      </section>
    </div>
  );
}
