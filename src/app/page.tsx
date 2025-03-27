'use client';

import React from 'react';
import BMICalculator from './components/BMICalculator';
import BPCalculator from './components/BPCalculator';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Health Metrics Calculator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate your BMI and check your blood pressure category to monitor your health status.
            Get instant results and recommendations based on medical standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="transform hover:scale-[1.02] transition-transform duration-200">
            <BMICalculator />
          </div>
          <div className="transform hover:scale-[1.02] transition-transform duration-200">
            <BPCalculator />
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Note: This calculator is for informational purposes only. Always consult with your healthcare provider for medical advice.</p>
        </div>
      </div>
    </div>
  );
}
