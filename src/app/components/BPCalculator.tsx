'use client';

import React, { useState } from 'react';

interface BPResult {
  category: string;
  color: string;
  description: string;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

const BPCalculator: React.FC = () => {
  const [systolic, setSystolic] = useState<string>('');
  const [diastolic, setDiastolic] = useState<string>('');
  const [result, setResult] = useState<BPResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  const getRecommendations = (category: string): string[] => {
    switch (category) {
      case 'Normal':
        return [
          'Maintain a balanced diet rich in fruits and vegetables',
          'Stay physically active with regular exercise',
          'Manage stress through relaxation techniques',
          'Get regular check-ups with your healthcare provider'
        ];
      case 'Elevated':
        return [
          'Reduce sodium intake in your diet',
          'Increase physical activity to at least 150 minutes per week',
          'Practice stress management techniques',
          'Monitor your blood pressure regularly',
          'Consider lifestyle changes to prevent progression'
        ];
      case 'High Blood Pressure (Stage 1)':
        return [
          'Consult your healthcare provider for a treatment plan',
          'Reduce sodium intake to less than 2,300mg per day',
          'Increase physical activity and maintain a healthy weight',
          'Limit alcohol consumption',
          'Quit smoking if applicable',
          'Take prescribed medications as directed'
        ];
      case 'High Blood Pressure (Stage 2)':
        return [
          'Seek immediate medical attention',
          'Take prescribed medications as directed',
          'Follow a strict low-sodium diet',
          'Monitor blood pressure multiple times daily',
          'Avoid strenuous activities until cleared by a doctor',
          'Keep a log of your blood pressure readings'
        ];
      default:
        return [];
    }
  };

  const calculateBP = () => {
    setIsCalculating(true);
    setError('');
    setResult(null);

    if (!systolic || !diastolic) {
      setError('Please enter both systolic and diastolic values');
      setIsCalculating(false);
      return;
    }

    const systolicNum = parseInt(systolic);
    const diastolicNum = parseInt(diastolic);

    if (isNaN(systolicNum) || isNaN(diastolicNum)) {
      setError('Please enter valid numbers');
      setIsCalculating(false);
      return;
    }

    if (systolicNum <= 0 || diastolicNum <= 0) {
      setError('Blood pressure values must be positive numbers');
      setIsCalculating(false);
      return;
    }

    if (systolicNum < diastolicNum) {
      setError('Systolic pressure must be greater than diastolic pressure');
      setIsCalculating(false);
      return;
    }

    if (systolicNum > 300 || diastolicNum > 200) {
      setError('Please enter realistic blood pressure values');
      setIsCalculating(false);
      return;
    }

    // Determine BP category and color
    let category: string;
    let color: string;
    let description: string;
    let riskLevel: 'low' | 'medium' | 'high';

    if (systolicNum < 120 && diastolicNum < 80) {
      category = 'Normal';
      color = 'text-green-500';
      description = 'Your blood pressure is within the normal range. Keep maintaining a healthy lifestyle!';
      riskLevel = 'low';
    } else if (systolicNum < 130 && diastolicNum < 80) {
      category = 'Elevated';
      color = 'text-yellow-500';
      description = 'Your blood pressure is slightly elevated. Consider lifestyle changes to prevent hypertension.';
      riskLevel = 'medium';
    } else if (systolicNum < 140 || diastolicNum < 90) {
      category = 'High Blood Pressure (Stage 1)';
      color = 'text-orange-500';
      description = 'You have Stage 1 hypertension. Consult your healthcare provider for lifestyle changes and possible medication.';
      riskLevel = 'medium';
    } else {
      category = 'High Blood Pressure (Stage 2)';
      color = 'text-red-500';
      description = 'You have Stage 2 hypertension. Immediate medical attention is recommended.';
      riskLevel = 'high';
    }

    const recommendations = getRecommendations(category);

    setTimeout(() => {
      setResult({
        category,
        color,
        description,
        recommendations,
        riskLevel
      });
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Blood Pressure Calculator</h2>
        <p className="text-gray-600">Check your blood pressure category</p>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Systolic Pressure
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Enter systolic pressure"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-600">mmHg</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Diastolic Pressure
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Enter diastolic pressure"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-600">mmHg</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={calculateBP}
          disabled={isCalculating}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? 'Calculating...' : 'Calculate BP Category'}
        </button>

        {result && (
          <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Results</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category:</span>
                <span className={`text-xl font-bold ${result.color}`}>{result.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Risk Level:</span>
                <span className={`text-lg font-semibold ${
                  result.riskLevel === 'low' ? 'text-green-500' :
                  result.riskLevel === 'medium' ? 'text-yellow-500' :
                  'text-red-500'
                }`}>
                  {result.riskLevel.charAt(0).toUpperCase() + result.riskLevel.slice(1)}
                </span>
              </div>
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <p className="text-gray-700 leading-relaxed">
                  {result.description}
                </p>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2 text-gray-800">Recommendations:</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span className="text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-semibold mb-3 text-gray-800">Blood Pressure Categories</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Normal</span>
            <span className="text-green-500 font-medium">&lt; 120/80 mmHg</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Elevated</span>
            <span className="text-yellow-500 font-medium">120-129/&lt; 80 mmHg</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">High BP (Stage 1)</span>
            <span className="text-orange-500 font-medium">130-139/80-89 mmHg</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">High BP (Stage 2)</span>
            <span className="text-red-500 font-medium">≥ 140/90 mmHg</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BPCalculator; 