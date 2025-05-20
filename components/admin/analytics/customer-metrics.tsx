"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Sample data - In a real application, this would come from an API
const data = [
  {
    name: "New",
    count: 125,
    retention: 0,
  },
  {
    name: "Returning",
    count: 86,
    retention: 65,
  },
  {
    name: "Loyal",
    count: 42,
    retention: 78,
  },
  {
    name: "VIP",
    count: 14,
    retention: 92,
  },
];

export default function CustomerMetrics() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Customer Metrics</CardTitle>
        <p className="text-sm text-muted-foreground">
          Customer acquisition and retention analysis
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="count"
                name="Customer Count"
                fill="#8884d8"
              />
              <Bar
                yAxisId="right"
                dataKey="retention"
                name="Retention Rate %"
                fill="#82ca9d"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium">Total Customers</p>
            <p className="text-2xl font-bold">267</p>
          </div>
          <div>
            <p className="text-sm font-medium">Avg. Retention</p>
            <p className="text-2xl font-bold">71%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
