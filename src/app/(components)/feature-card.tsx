"use client"

import React from "react";

export function FeatureCard({ icon, title, description }) {
  return (
    <div
      className="p-6 border border-gray-200 dark:border-gray-800 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
    >
      <div className="mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}
