import LineChart from "@/components/admin/analytics/line-chart";

interface RevenueChartProps {
  startDate: Date;
  endDate: Date;
  period: "daily" | "weekly" | "monthly";
}

export default async function RevenueChart({
  startDate,
  endDate,
  period,
}: RevenueChartProps) {
  // Fetch revenue data from the API
  const apiUrl = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/analytics/sales`
  );
  apiUrl.searchParams.append("startDate", startDate.toISOString());
  apiUrl.searchParams.append("endDate", endDate.toISOString());
  apiUrl.searchParams.append("period", period);

  const response = await fetch(apiUrl, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch revenue data");
  }

  const data = await response.json();

  // Format sales data for the chart
  const revenueData = data.salesData.map((item: any) => ({
    label: getFormattedLabel(item, period),
    value: Number(item.revenue) || 0,
  }));

  const ordersData = data.salesData.map((item: any) => ({
    label: getFormattedLabel(item, period),
    value: Number(item.orders) || 0,
  }));

  // Helpers to format dates based on period
  function getFormattedLabel(item: any, period: string): string {
    if (period === "daily" && item.date) {
      // For daily, show as MM/DD
      const dateParts = item.date.split("-");
      return `${dateParts[1]}/${dateParts[2]}`;
    }

    if (period === "weekly" && item.week) {
      // For weekly, show as Week of MM/DD
      const weekParts = item.week.split("-");
      const weekNumber = weekParts[1];
      // This is an approximation, ideally would parse the ISO week properly
      return `Week ${weekNumber}`;
    }

    if (period === "monthly" && item.month) {
      // For monthly, show as MMM YYYY
      const monthParts = item.month.split("-");
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const month = parseInt(monthParts[1]) - 1;
      return `${monthNames[month]} ${monthParts[0]}`;
    }

    return item.date || item.week || item.month || "Unknown";
  }

  return (
    <div className="space-y-6">
      <div className="h-80">
        <LineChart
          data={revenueData}
          height={320}
          lineColor="var(--primary-600)"
          fillColor="var(--primary-50)"
          yAxisLabel="Revenue"
          xAxisLabel={`Time (${period})`}
          title="Revenue Over Time"
        />
      </div>
    </div>
  );
}
