"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DataPoint {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: DataPoint[];
  size?: number;
  title?: string;
  loading?: boolean;
  showLegend?: boolean;
  donut?: boolean;
  donutThickness?: number;
}

export default function PieChart({
  data,
  size = 220,
  title,
  loading = false,
  showLegend = true,
  donut = false,
  donutThickness = 60,
}: PieChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  // Default colors if not specified
  const defaultColors = [
    "#4f46e5", // Primary blue
    "#ec4899", // Pink
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#6366f1", // Indigo
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#0ea5e9", // Sky blue
    "#14b8a6", // Teal
    "#f97316", // Orange
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center space-y-4">
        {title && <h3 className="text-lg font-medium">{title}</h3>}
        <div
          className="rounded-full bg-gray-100 dark:bg-gray-800 animate-pulse"
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-4">
        {title && <h3 className="text-lg font-medium">{title}</h3>}
        <div
          className="rounded-full flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
          style={{
            width: `${size}px`,
            height: `${size}px`,
          }}
        >
          <p className="text-gray-500 dark:text-gray-400">No data</p>
        </div>
      </div>
    );
  }

  // Calculate total for percentages
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Calculate slices
  let currentAngle = 0;
  const radius = size / 2;
  const slices = data.map((item, index) => {
    const color = item.color || defaultColors[index % defaultColors.length];
    const percentage = (item.value / total) * 100;
    const angle = (percentage / 100) * 360;

    // Calculate SVG arc parameters
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const largeArcFlag = angle > 180 ? 1 : 0;

    // Calculate outer points
    const outerStartX = radius + radius * Math.cos(startAngleRad);
    const outerStartY = radius + radius * Math.sin(startAngleRad);
    const outerEndX = radius + radius * Math.cos(endAngleRad);
    const outerEndY = radius + radius * Math.sin(endAngleRad);

    // For donut chart, calculate inner points as well
    let path;

    if (donut) {
      const innerRadius = radius - donutThickness;
      const innerStartX = radius + innerRadius * Math.cos(endAngleRad);
      const innerStartY = radius + innerRadius * Math.sin(endAngleRad);
      const innerEndX = radius + innerRadius * Math.cos(startAngleRad);
      const innerEndY = radius + innerRadius * Math.sin(startAngleRad);

      path = [
        `M ${outerStartX} ${outerStartY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
        `L ${innerStartX} ${innerStartY}`,
        `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerEndX} ${innerEndY}`,
        "Z",
      ].join(" ");
    } else {
      path = [
        `M ${radius} ${radius}`,
        `L ${outerStartX} ${outerStartY}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY}`,
        "Z",
      ].join(" ");
    }

    // Calculate position for hover label
    const midAngleRad = (startAngle + angle / 2 - 90) * (Math.PI / 180);
    const labelRadius = radius * 0.6;
    const labelX = radius + labelRadius * Math.cos(midAngleRad);
    const labelY = radius + labelRadius * Math.sin(midAngleRad);

    return {
      path,
      color,
      percentage,
      label: item.label,
      value: item.value,
      labelX,
      labelY,
      midAngle: startAngle + angle / 2,
    };
  });

  return (
    <div className="flex flex-col items-center">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}

      <div className="relative">
        {/* The Chart */}
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {slices.map((slice, i) => (
            <motion.path
              key={i}
              d={slice.path}
              fill={slice.color}
              strokeWidth={hoveredSlice === i ? 2 : 0}
              stroke="#fff"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: i * 0.05,
                duration: 0.5,
                ease: "easeOut",
              }}
              onMouseEnter={() => setHoveredSlice(i)}
              onMouseLeave={() => setHoveredSlice(null)}
            />
          ))}

          {/* Donut hole */}
          {donut && (
            <circle
              cx={radius}
              cy={radius}
              r={radius - donutThickness}
              fill="white"
              className="dark:fill-gray-800"
            />
          )}

          {/* Show total in the middle for donut charts */}
          {donut && (
            <text
              x={radius}
              y={radius}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-lg font-medium fill-gray-800 dark:fill-white"
            >
              {total.toLocaleString()}
            </text>
          )}

          {/* Hover labels */}
          {hoveredSlice !== null && (
            <g>
              <circle
                cx={slices[hoveredSlice].labelX}
                cy={slices[hoveredSlice].labelY}
                r="20"
                fill="rgba(0,0,0,0.7)"
              />
              <text
                x={slices[hoveredSlice].labelX}
                y={slices[hoveredSlice].labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="white"
                fontSize="12"
              >
                {slices[hoveredSlice].percentage.toFixed(1)}%
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2 place-items-start">
          {data.map((item, i) => (
            <div
              key={i}
              className="flex items-center space-x-2"
              onMouseEnter={() => setHoveredSlice(i)}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div
                className="w-3 h-3 rounded-sm flex-shrink-0"
                style={{
                  backgroundColor:
                    item.color || defaultColors[i % defaultColors.length],
                }}
              />
              <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-32">
                {item.label}
              </span>
              <span className="text-sm font-medium">
                {Math.round((item.value / total) * 100)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
