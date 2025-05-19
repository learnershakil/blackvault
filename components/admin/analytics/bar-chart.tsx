"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DataPoint {
  label: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  height?: number;
  barColor?: string;
  showLabels?: boolean;
  showGrid?: boolean;
  title?: string;
  loading?: boolean;
  maxBars?: number;
  yAxisLabel?: string;
  compareValue?: number;
}

export default function BarChart({
  data,
  height = 300,
  barColor = "#4f46e5",
  showLabels = true,
  showGrid = true,
  title,
  loading = false,
  maxBars = 12,
  yAxisLabel,
  compareValue,
}: BarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height });

  // If we have too many bars, aggregate them
  const displayData =
    data.length > maxBars ? aggregateData(data, maxBars) : data;

  // Update dimensions when window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        setDimensions({
          width: chartRef.current.clientWidth,
          height,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [height]);

  if (loading) {
    return (
      <div
        className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-md"
        style={{ height: `${height}px` }}
      ></div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700"
        style={{ height: `${height}px` }}
      >
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    );
  }

  // Find max value for scaling
  const maxValue = Math.max(
    ...displayData.map((d) => d.value),
    compareValue || 0
  );

  // Function to aggregate data if there are too many bars
  function aggregateData(data: DataPoint[], maxBars: number): DataPoint[] {
    if (data.length <= maxBars) return data;

    const result: DataPoint[] = [];
    const groupSize = Math.ceil(data.length / maxBars);

    for (let i = 0; i < data.length; i += groupSize) {
      const group = data.slice(i, i + groupSize);
      const sum = group.reduce((acc, item) => acc + item.value, 0);
      const avgValue = sum / group.length;

      // Use the first and last label from the group
      const firstLabel = group[0].label;
      const lastLabel = group[group.length - 1].label;

      result.push({
        label: group.length > 1 ? `${firstLabel}-${lastLabel}` : firstLabel,
        value: avgValue,
      });
    }

    return result;
  }

  return (
    <div>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <div ref={chartRef} className="w-full relative">
        {/* Y-axis gridlines */}
        {showGrid && (
          <div className="absolute inset-0" style={{ height: `${height}px` }}>
            {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
              <div
                key={ratio}
                className="absolute w-full border-t border-gray-200 dark:border-gray-700"
                style={{ top: `${height * ratio}px` }}
              />
            ))}
          </div>
        )}

        {/* Comparison line (e.g., for average) */}
        {compareValue !== undefined && (
          <div
            className="absolute w-full border-t-2 border-dashed border-orange-500"
            style={{
              top: `${
                height - (compareValue / maxValue) * height * 0.8 - 10
              }px`,
            }}
          />
        )}

        {/* Bars */}
        <div
          className="flex items-end justify-between h-full pt-8 pb-10"
          style={{ height: `${height}px` }}
        >
          {displayData.map((item, index) => {
            const barHeight = (item.value / maxValue) * 100 * 0.8;

            return (
              <div
                key={index}
                className="flex flex-col items-center"
                style={{
                  width: `${100 / displayData.length}%`,
                  maxWidth: `${100 / displayData.length}%`,
                }}
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Bar tooltip */}
                {hoveredBar === index && (
                  <div className="relative mb-2">
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {item.value.toLocaleString()}
                    </div>
                  </div>
                )}

                {/* The actual bar */}
                <motion.div
                  className="w-[60%] rounded-t"
                  style={{
                    backgroundColor: barColor,
                    height: "0%",
                  }}
                  initial={{ height: "0%" }}
                  animate={{ height: `${barHeight}%` }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  whileHover={{ opacity: 0.85 }}
                />

                {/* X-axis label */}
                {showLabels && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate w-full text-center">
                    {item.label}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Y-axis labels */}
        {showLabels && (
          <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 -ml-2 py-8">
            <span className="translate-y-2">{maxValue.toLocaleString()}</span>
            <span>{(maxValue * 0.5).toLocaleString()}</span>
            <span className="-translate-y-2">0</span>
          </div>
        )}

        {/* Y-axis label */}
        {yAxisLabel && (
          <div className="text-xs text-gray-500 dark:text-gray-400 transform -rotate-90 absolute -left-8 top-1/2">
            {yAxisLabel}
          </div>
        )}
      </div>
    </div>
  );
}
