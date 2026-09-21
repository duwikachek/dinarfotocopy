"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

interface ChartProps {
  data: { day: string; orders: number }[];
}

export function AdminChart({ data }: ChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} barSize={24}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,13%,91%)" vertical={false} />
        <XAxis
          dataKey="day"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "hsl(220,10%,55%)", fontFamily: "inherit" }}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 11, fill: "hsl(220,10%,55%)", fontFamily: "inherit" }}
          allowDecimals={false}
          width={24}
        />
        <Tooltip
          cursor={{ fill: "hsl(220,14%,96%)" }}
          contentStyle={{
            background: "white",
            border: "1px solid hsl(220,13%,91%)",
            borderRadius: "8px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            fontSize: "12px",
            fontFamily: "inherit",
          }}
          formatter={(val: any) => [`${val ?? 0} pesanan`, ""]}
        />
        <Bar dataKey="orders" fill="hsl(224,12%,12%)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
