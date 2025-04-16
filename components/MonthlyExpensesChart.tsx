"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { Transaction } from "@/lib/types";

interface MonthlyExpensesChartProps {
  transactions: Transaction[];
}

export default function MonthlyExpensesChart({ transactions }: MonthlyExpensesChartProps) {
  const monthlyData = useMemo(() => {
    const data: { [key: string]: number } = {};
    
    transactions.forEach((transaction) => {
      const monthKey = format(transaction.date, "MMM yyyy");
      data[monthKey] = (data[monthKey] || 0) + transaction.amount;
    });

    return Object.entries(data)
      .map(([month, total]) => ({
        month,
        total,
      }))
      .sort((a, b) => {
        const [monthA, yearA] = a.month.split(" ");
        const [monthB, yearB] = b.month.split(" ");
        return new Date(`${monthA} 1, ${yearA}`).getTime() - new Date(`${monthB} 1, ${yearB}`).getTime();
      });
  }, [transactions]);

  if (monthlyData.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        No data to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`$${value.toFixed(2)}`, "Total"]}
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: 'var(--radius)',
          }}
        />
        <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}