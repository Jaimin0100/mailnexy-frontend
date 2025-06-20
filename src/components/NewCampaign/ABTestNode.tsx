'use client';

import { useFormContext } from "react-hook-form";

export default function ABTestNode() {
  const { register } = useFormContext();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Split Percentage (Variant A)
        </label>
        <input
          type="number"
          min="1"
          max="99"
          {...register("splitPercentage", { valueAsNumber: true })}
          className="w-full border border-gray-300 rounded-lg p-2"
          placeholder="50"
        />
        <p className="text-xs text-gray-500 mt-1">
          Percentage of contacts that will go to Variant A (remainder go to Variant B)
        </p>
      </div>
    </div>
  );
}