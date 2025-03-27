'use client';

import React, { useState, useEffect } from 'react';

interface BMIResult {
  bmi: number;
  category: string;
  color: string;
  bodyFatPercentage?: number;
  idealWeight?: {
    min: number;
    max: number;
  };
}

type WeightUnit = 'kg' | 'lbs';
type HeightUnit = 'cm' | 'ft' | 'in';
type Gender = 'male' | 'female';

const BMICalculator: React.FC = () => {
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('kg');
  const [heightUnit, setHeightUnit] = useState<HeightUnit>('cm');
  const [gender, setGender] = useState<Gender>('male');
  const [age, setAge] = useState<string>('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isCalculating, setIsCalculating] = useState(false);

  // Reset height when unit changes
  useEffect(() => {
    if (height) {
      const heightNum = parseFloat(height);
      if (!isNaN(heightNum)) {
        let newHeight = heightNum;
        if (heightUnit === 'ft') {
          newHeight = heightNum * 30.48; // Convert to cm
        } else if (heightUnit === 'in') {
          newHeight = heightNum * 2.54; // Convert to cm
        }
        setHeight(newHeight.toFixed(1));
      }
    }
  }, [heightUnit]);

  // Reset weight when unit changes
  useEffect(() => {
    if (weight) {
      const weightNum = parseFloat(weight);
      if (!isNaN(weightNum)) {
        let newWeight = weightNum;
        if (weightUnit === 'lbs') {
          newWeight = weightNum * 0.453592; // Convert to kg
        }
        setWeight(newWeight.toFixed(1));
      }
    }
  }, [weightUnit]);

  const convertToMetric = (value: number, unit: WeightUnit | HeightUnit): number => {
    switch (unit) {
      case 'lbs':
        return value * 0.453592; // lbs to kg
      case 'ft':
        return value * 30.48; // ft to cm
      case 'in':
        return value * 2.54; // in to cm
      default:
        return value;
    }
  };

  const calculateBodyFatPercentage = (bmi: number, age: number, gender: Gender): number => {
    // Using the Deurenberg equation
    const bodyFat = (1.2 * bmi) + (0.23 * age) - (3.8 * (gender === 'male' ? 1 : 0)) - 5.4;
    return parseFloat(bodyFat.toFixed(1));
  };

  const calculateIdealWeight = (heightInCm: number, gender: Gender): { min: number; max: number } => {
    // Using the Devine formula
    const heightInInches = heightInCm / 2.54;
    let idealWeight = 50 + 2.3 * (heightInInches - 60);
    if (gender === 'female') {
      idealWeight = 45.5 + 2.3 * (heightInInches - 60);
    }
    return {
      min: Math.round(idealWeight * 0.9),
      max: Math.round(idealWeight * 1.1)
    };
  };

  const calculateBMI = () => {
    setIsCalculating(true);
    setError('');
    setResult(null);

    if (!weight || !height || !age) {
      setError('Please enter all required values');
      setIsCalculating(false);
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    if (isNaN(weightNum) || isNaN(heightNum) || isNaN(ageNum)) {
      setError('Please enter valid numbers');
      setIsCalculating(false);
      return;
    }

    if (weightNum <= 0 || heightNum <= 0 || ageNum <= 0) {
      setError('All values must be positive numbers');
      setIsCalculating(false);
      return;
    }

    if (ageNum < 18 || ageNum > 120) {
      setError('Please enter a valid age between 18 and 120');
      setIsCalculating(false);
      return;
    }

    // Convert to metric units for calculation
    const weightInKg = convertToMetric(weightNum, weightUnit);
    const heightInCm = convertToMetric(heightNum, heightUnit);
    const heightInMeters = heightInCm / 100;
    const bmi = weightInKg / (heightInMeters * heightInMeters);

    // Calculate additional metrics
    const bodyFatPercentage = calculateBodyFatPercentage(bmi, ageNum, gender);
    const idealWeight = calculateIdealWeight(heightInCm, gender);

    // Determine BMI category and color
    let category: string;
    let color: string;

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-500';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      color = 'text-green-500';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-yellow-500';
    } else {
      category = 'Obese';
      color = 'text-red-500';
    }

    setTimeout(() => {
      setResult({
        bmi: parseFloat(bmi.toFixed(1)),
        category,
        color,
        bodyFatPercentage,
        idealWeight
      });
      setIsCalculating(false);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">BMI Calculator</h2>
        <p className="text-gray-600">Calculate your Body Mass Index</p>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Age
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
              placeholder="Enter age"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Weight
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Enter weight"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
                  className="bg-transparent border-none text-gray-600 focus:outline-none cursor-pointer"
                >
                  <option value="kg">kg</option>
                  <option value="lbs">lbs</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Height
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                placeholder="Enter height"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value as HeightUnit)}
                  className="bg-transparent border-none text-gray-600 focus:outline-none cursor-pointer"
                >
                  <option value="cm">cm</option>
                  <option value="ft">ft</option>
                  <option value="in">in</option>
                </select>
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
          onClick={calculateBMI}
          disabled={isCalculating}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCalculating ? 'Calculating...' : 'Calculate BMI'}
        </button>

        {result && (
          <div className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 animate-fade-in">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Your Results</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">BMI Score:</span>
                <span className={`text-3xl font-bold ${result.color}`}>{result.bmi}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Category:</span>
                <span className={`text-lg font-semibold ${result.color}`}>{result.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Body Fat %:</span>
                <span className="text-xl font-semibold text-blue-500">{result.bodyFatPercentage}%</span>
              </div>
              <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
                <h4 className="font-semibold mb-2 text-gray-800">Ideal Weight Range:</h4>
                <p className="text-gray-600">
                  {result.idealWeight?.min} - {result.idealWeight?.max} kg
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h4 className="font-semibold mb-3 text-gray-800">BMI Categories</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Underweight</span>
            <span className="text-blue-500 font-medium">&lt; 18.5</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Normal Weight</span>
            <span className="text-green-500 font-medium">18.5 - 24.9</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Overweight</span>
            <span className="text-yellow-500 font-medium">25 - 29.9</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Obese</span>
            <span className="text-red-500 font-medium">≥ 30</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator; 