import { formatPrice } from "@/lib/utils";
import PieChart from "@/components/admin/analytics/pie-chart";

interface RevenueByCategoryProps {
  startDate: Date;
  endDate: Date;
}

export default async function RevenueByCategory({
  startDate,
  endDate,
}: RevenueByCategoryProps) {
  // Fetch sales by category data
  const apiUrl = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/analytics/sales`
  );
  apiUrl.searchParams.append("startDate", startDate.toISOString());
  apiUrl.searchParams.append("endDate", endDate.toISOString());

  const response = await fetch(apiUrl, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch sales data");
  }

  const data = await response.json();

  // Get sales by category data
  const salesByCategory = data.salesByCategory || [];

  // Define custom colors for categories
  const categoryColors = [
    "#4f46e5", // Primary blue
    "#ec4899", // Pink
    "#10b981", // Green
    "#f59e0b", // Yellow
    "#6366f1", // Indigo
    "#ef4444", // Red
    "#8b5cf6", // Purple
    "#0ea5e9", // Sky blue
  ];

  // Format data for the pie chart
  const chartData = salesByCategory.map((category: any, index: number) => ({
    label: category.name,
    value: Number(category.revenue) || 0,
    color: categoryColors[index % categoryColors.length],
  }));

  // Calculate total revenue
  const totalRevenue = chartData.reduce(
    (sum: number, item: any) => sum + item.value,
    0
  );

  return (
    <div className="flex flex-col items-center">
      {chartData.length > 0 ? (
        <>
          <PieChart
            data={chartData}
            size={240}
            donut={true}
            donutThickness={60}
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Total Revenue: {formatPrice(totalRevenue)}
          </p>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No category data available for the selected period
        </div>
      )}
    </div>
  );
}
