"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

interface DataPoint {
  label: string;
  value: number;
}

interface LineChartProps {
  data: DataPoint[];
  height?: number;
  lineColor?: string;
  fillColor?: string;
  showLabels?: boolean;
  showGrid?: boolean;
  title?: string;
  loading?: boolean;
  yAxisLabel?: string;
  xAxisLabel?: string;
}

export default function LineChart({
  data,
  height = 300,
  lineColor = "#4f46e5",
  fillColor = "rgba(79, 70, 229, 0.1)",
  showLabels = true,
  showGrid = true,
  title,
  loading = false,
  yAxisLabel,
  xAxisLabel,
}: LineChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update dimensions when window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (chartRef.current) {
        setDimensions({
          width: chartRef.current.clientWidth,
          height: height,
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
  const maxValue = Math.max(...data.map((d) => d.value));

  // Calculate points for SVG path
  const getPoints = () => {
    if (dimensions.width === 0 || data.length <= 1) return "";

    const pointWidth = dimensions.width / (data.length - 1);

    // Generate points for the path
    return data
      .map((point, i) => {
        const x = i * pointWidth;
        const y =
          dimensions.height -
          (point.value / maxValue) * dimensions.height * 0.8 -
          10;
        return `${x},${y}`;
      })
      .join(" ");
  };

  // Get path for area under the graph
  const getAreaPath = () => {
    if (dimensions.width === 0 || data.length <= 1) return "";

    const pointWidth = dimensions.width / (data.length - 1);

    // Start at the bottom left
    let path = `M0,${dimensions.height} `;

    // Add each point
    data.forEach((point, i) => {
      const x = i * pointWidth;
      const y =
        dimensions.height -
        (point.value / maxValue) * dimensions.height * 0.8 -
        10;
      path += `L${x},${y} `;
    });

    // Close the path by going to bottom right and back to start
    path += `L${dimensions.width},${dimensions.height} L0,${dimensions.height}`;

    return path;
  };

  return (
    <div>
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <div ref={chartRef} className="w-full relative">
        <div style={{ height: `${height}px` }} className="relative">
          {/* Y-Axis gridlines */}
          {showGrid && dimensions.height > 0 && (
            <div className="absolute inset-0">
              {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
                <div
                  key={ratio}
                  className="absolute w-full border-t border-gray-200 dark:border-gray-700"
                  style={{ top: `${dimensions.height * ratio}px` }}
                />
              ))}
            </div>
          )}

          {/* Chart */}
          {dimensions.width > 0 && (
            <svg width="100%" height="100%" className="overflow-visible">
              {/* Fill area under the line */}
              <motion.path
                d={getAreaPath()}
                fill={fillColor}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />

              {/* Line */}
              <motion.polyline
                points={getPoints()}
                fill="none"
                stroke={lineColor}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Data points */}
              {data.map((point, i) => {
                const pointWidth = dimensions.width / (data.length - 1);
                const x = i * pointWidth;
                const y =
                  dimensions.height -
                  (point.value / maxValue) * dimensions.height * 0.8 -
                  10;

                return (
                  <g
                    key={i}
                    onMouseEnter={() => setHoveredPoint(i)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  >
                    <motion.circle
                      cx={x}
                      cy={y}
                      r={hoveredPoint === i ? 6 : 4}
                      fill="white"
                      stroke={lineColor}
                      strokeWidth="2"
                      initial={{ r: 0 }}
                      animate={{ r: hoveredPoint === i ? 6 : 4 }}
                      transition={{ duration: 0.2 }}
                    />

                    {/* Tooltip */}
                    {hoveredPoint === i && (
                      <g>
                        <rect
                          x={x - 45}
                          y={y - 35}
                          width="90"
                          height="24"
                          rx="4"
                          fill="rgba(0,0,0,0.8)"
                        />
                        <text
                          x={x}
                          y={y - 20}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                        >
                          {point.value.toLocaleString()}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          )}

          {/* Y-axis labels */}
          {showLabels && dimensions.height > 0 && (
            <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-xs text-gray-500 dark:text-gray-400 -ml-2">
              <span className="translate-y-2">{maxValue.toLocaleString()}</span>
              <span>{(maxValue * 0.5).toLocaleString()}</span>
              <span className="-translate-y-2">0</span>
            </div>
          )}
        </div>

        {/* X-Axis labels */}
        {showLabels && dimensions.width > 0 && (
          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            {data.length > 12
              ? data
                  .filter((_, i) => i % Math.ceil(data.length / 6) === 0)
                  .map((point, i) => <span key={i}>{point.label}</span>)
              : data.map((point, i) => <span key={i}>{point.label}</span>)}
          </div>
        )}

        {/* Axis labels */}
        <div className="flex justify-between mt-4">
          {yAxisLabel && (
            <div className="text-xs text-gray-500 dark:text-gray-400 transform -rotate-90 absolute -left-8 top-1/2">
              {yAxisLabel}
            </div>
          )}
          {xAxisLabel && (
            <div className="text-xs text-gray-500 dark:text-gray-400 w-full text-center mt-4">
              {xAxisLabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
