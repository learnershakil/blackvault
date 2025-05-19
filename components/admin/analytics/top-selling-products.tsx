import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import BarChart from "@/components/admin/analytics/bar-chart";
import DataTable, { DataColumn } from "@/components/admin/analytics/data-table";

interface TopSellingProductsProps {
  startDate: Date;
  endDate: Date;
  limit?: number;
}

export default async function TopSellingProducts({
  startDate,
  endDate,
  limit = 5,
}: TopSellingProductsProps) {
  // Fetch product data from API
  const apiUrl = new URL(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/analytics/products`
  );
  apiUrl.searchParams.append("startDate", startDate.toISOString());
  apiUrl.searchParams.append("endDate", endDate.toISOString());

  const response = await fetch(apiUrl, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch product data");
  }

  const data = await response.json();

  // Get top selling products
  const topProducts = data.topSellingProducts.slice(0, limit);

  // Format data for the bar chart
  const chartData = topProducts.map((product: any) => ({
    label:
      product.name.length > 20
        ? product.name.substring(0, 20) + "..."
        : product.name,
    value: Number(product.units_sold) || 0,
  }));

  // Define columns for the data table
  const columns: DataColumn[] = [
    {
      header: "Product",
      accessorKey: "name",
      format: (value) => (
        <div className="flex items-center">
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      header: "SKU",
      accessorKey: "sku",
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Units Sold",
      accessorKey: "units_sold",
      align: "right",
      format: (value) => Number(value).toLocaleString(),
    },
    {
      header: "Revenue",
      accessorKey: "revenue",
      align: "right",
      format: (value) => formatPrice(Number(value)),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Bar chart for visualization */}
      <div className="h-64">
        <BarChart
          data={chartData}
          height={240}
          barColor="var(--primary-600)"
          yAxisLabel="Units Sold"
        />
      </div>

      {/* Data table for detailed view */}
      <DataTable
        data={topProducts}
        columns={columns}
        rowsPerPage={limit}
        onRowClick={(row) =>
          (window.location.href = `/admin/products/${row.id}`)
        }
      />
    </div>
  );
}
