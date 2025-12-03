"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from "recharts";
import { API_BASE_URL } from "@/app/services/apiClient";
import Cookies from "js-cookie";

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  status: "active" | "inactive" | "archived";
}

export default function AnalyticsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/products`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        });
        const data = await res.json();
        setProducts(data?.data || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  if (loading) {
    return <div className="p-4 text-center text-muted-foreground">Loading analytics...</div>;
  }

  const truncateName = (name: string) => (name.length > 10 ? `${name.slice(0, 10)}...` : name);

  // Top 10 by Price
  const topPrice = [...products].sort((a, b) => b.price - a.price).slice(0, 10);

  // Top 10 by Quantity
  const topQuantity = [...products].sort((a, b) => b.quantity - a.quantity).slice(0, 10);

  // Product Status Distribution
  const statusCounts = products.reduce((acc: Record<string, number>, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
  }));

  const STATUS_COLORS = ["#A333E2", "#eab308",  "#ef4444"]; 

  return (
    <ScrollArea className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vertical Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Products by Price</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPrice} layout="vertical" margin={{ left: 50, right: 20 }}>
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={120}
                  tickFormatter={truncateName}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    return [value, props.payload.name]; // show full name in tooltip
                  }}
                />
                <Bar dataKey="price" fill="#C133E4" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Products by Quantity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={topQuantity} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={60}
                  tickFormatter={truncateName}
                />
                <YAxis />
                <Tooltip
                  formatter={(value, name, props) => [value, props.payload.name]}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="quantity" stroke="#B733E4" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Product Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name} (${entry.value})`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}