"use client";

import React from "react";

interface DonutChartProps {
  data: {
    label: string;
    value: number;
    color: string;
  }[];
  size?: number;
  thickness?: number;
  gap?: number;
}

export function DonutChart({ data, size = 160, thickness = 20, gap = 2 }: DonutChartProps) {
  const total = data.reduce((acc, item) => acc + item.value, 0);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  
  let currentOffset = 0;
  
  // Adjusted circumference to account for gaps
  // To keep it simple, we use stroke-dasharray and stroke-dashoffset
  
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {data.map((item, index) => {
            if (item.value <= 0) return null;
            
            const percentage = item.value / total;
            const strokeLength = percentage * circumference;
            const gapLength = gap > 0 ? gap : 0;
            
            // Adjust stroke length to leave room for gaps
            const adjustedStrokeLength = Math.max(0, strokeLength - gapLength);
            
            const dashArray = `${adjustedStrokeLength} ${circumference - adjustedStrokeLength}`;
            const dashOffset = -currentOffset;
            
            currentOffset += strokeLength;
            
            return (
              <circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={thickness}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                className="transition-all duration-1000 ease-out"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Inner content if needed */}
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-on-surface-variant font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
