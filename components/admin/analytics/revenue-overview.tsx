import { formatPrice } from "@/lib/utils";
import LineChart from "@/components/admin/analytics/line-chart";
import StatsComparison from "@/components/admin/analytics/stats-comparison";

interface RevenueOverviewProps {
  startDate: Date;
  endDate: Date;
}

export default async function RevenueOverview({
  startDate,
  endDate,
}: RevenueOverviewProps) {
  // Calculate previous period for comparison
  const periodLength = endDate.getTime() - startDate.getTime();
  const previousStartDate = new Date(startDate.getTime() - periodLength);
  const previousEndDate = new Date(endDate.getTime() - periodLength);

  // Fetch revenue data from the API
  const apiUrl = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/analytics/sales`
  );
  apiUrl.searchParams.append("startDate", startDate.toISOString());
  apiUrl.searchParams.append("endDate", endDate.toISOString());
  apiUrl.searchParams.append("period", "daily");

  const response = await fetch(apiUrl, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch revenue data");
  }

  const data = await response.json();

  // Format sales data for the chart
  const chartData = data.salesData.map((item: any) => ({
    label: item.date?.split("-").slice(1).join("/") || item.week || item.month,
    value: Number(item.revenue) || 0,
  }));

  // Metrics comparison
  const currentMetrics = data.currentPeriodMetrics;
  const previousMetrics = data.previousPeriodMetrics;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsComparison
          title="Revenue"
          currentValue={currentMetrics.revenue}
          previousValue={previousMetrics.revenue}
          formatter={(value) => formatPrice(value)}
        />
        <StatsComparison
          title="Orders"
          currentValue={currentMetrics.orders}
          previousValue={previousMetrics.orders}
        />
        <StatsComparison
          title="Average Order Value"
          currentValue={currentMetrics.averageOrderValue}
          previousValue={previousMetrics.averageOrderValue}
          formatter={(value) => formatPrice(value)}
        />
        <StatsComparison
          title="Customers"
          currentValue={currentMetrics.customers}
          previousValue={previousMetrics.customers}
        />
      </div>

      <div className="h-80">
        <LineChart
          data={chartData}
          height={320}
          lineColor="var(--primary-600)"
          fillColor="var(--primary-50)"
          yAxisLabel="Revenue"
        />
      </div>
    </div>
  );
}
