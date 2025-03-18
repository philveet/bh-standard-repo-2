"use client"

import React from "react";
import { ArrowRightIcon } from "lucide-react";

export function HeroSection() {
  return (
    <section className="py-20 text-center">
      <div className="max-w-3xl mx-auto">
        <h1
          className="text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 text-transparent bg-clip-text"
        >
          Coming Soon
        </h1>
        <p
          className="text-xl text-gray-600 dark:text-gray-400 mb-8"
        >
          This space will soon be transformed into an amazing web application.
          We&apos;re working hard to bring you something special.
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center transition-colors"
          >
            Get Notified
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </button>
          <button
            className="px-6 py-3 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Learn More
          </button>
        </div>
      </div>
      <div className="mt-16 relative">
        <div
          className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent z-10"
        ></div>
        <img
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Developer workspace"
          className="w-full h-64 object-cover rounded-lg shadow-lg opacity-50 dark:opacity-30"
        />
      </div>
    </section>
  );
}
