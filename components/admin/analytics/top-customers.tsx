"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

const topCustomers = [
  {
    id: 1,
    name: "Alex Johnson",
    email: "alex@example.com",
    spent: 1249.99,
    orders: 12,
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@example.com",
    spent: 998.5,
    orders: 8,
  },
  {
    id: 3,
    name: "James Wilson",
    email: "james@example.com",
    spent: 876.25,
    orders: 7,
  },
  {
    id: 4,
    name: "Sarah Brown",
    email: "sarah@example.com",
    spent: 752.1,
    orders: 6,
  },
  {
    id: 5,
    name: "David Lee",
    email: "david@example.com",
    spent: 645.3,
    orders: 5,
  },
];

export default function TopCustomers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Customers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topCustomers.map((customer) => (
            <div
              key={customer.id}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 bg-primary-100 text-primary-800">
                  <span className="text-sm">{customer.name.charAt(0)}</span>
                </Avatar>
                <div>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.email}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">${customer.spent.toFixed(2)}</p>
                <p className="text-sm text-gray-500">
                  {customer.orders} orders
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
