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
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  TrendingUp,
  CreditCard,
  Target,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Expense } from "@/types/expense";
import { formatCurrency, cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DashboardProps {
  expenses: Expense[];
  budget: number;
  onEditBudget: () => void;
}

const PIE_COLORS = [
  "#0ea5e9",
  "#38bdf8",
  "#7dd3fc",
  "#0284c7",
  "#0369a1",
  "#075985",
];

const BAR_COLORS = ["#0ea5e9", "#38bdf8", "#7dd3fc", "#bae6fd", "#e0f2fe"];

export const Dashboard = ({
  expenses,
  budget,
  onEditBudget,
}: DashboardProps) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = useMemo(
    () =>
      expenses.filter((exp) => {
        const d = new Date(exp.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      }),
    [expenses, currentMonth, currentYear],
  );

  const totalMonthly = useMemo(
    () => monthlyExpenses.reduce((acc, cur) => acc + cur.amount, 0),
    [monthlyExpenses],
  );

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    monthlyExpenses.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [monthlyExpenses]);

  const chartData = useMemo(
    () => [...categoryTotals].sort((a, b) => b.value - a.value),
    [categoryTotals],
  );

  const budgetProgress = budget > 0 ? (totalMonthly / budget) * 100 : 0;
  const isOverBudget = totalMonthly > budget;

  const highestCategory = useMemo(() => {
    if (!categoryTotals.length) return null;
    return categoryTotals.reduce((prev, cur) =>
      prev.value > cur.value ? prev : cur,
    );
  }, [categoryTotals]);

  return (
    <div className="space-y-6">
      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Monthly Spending */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-sky-50 rounded-xl">
              <CreditCard className="text-sky-500" size={20} />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-gray-400">
              <Calendar size={12} />
              {new Date().toLocaleString("default", { month: "long" })}
            </span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Monthly spending</p>
          <p className="text-3xl font-semibold text-gray-900">
            {formatCurrency(totalMonthly)}
          </p>
        </motion.div>

        {/* Budget Progress */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className={cn(
                "p-2.5 rounded-xl",
                isOverBudget ? "bg-rose-50" : "bg-sky-50",
              )}
            >
              <Target
                className={cn(isOverBudget ? "text-rose-500" : "text-sky-500")}
                size={20}
              />
            </div>
            <button
              onClick={onEditBudget}
              className="text-xs font-medium text-sky-500 hover:text-sky-700 transition-colors"
            >
              Edit budget
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-1">
            Budget goal: {formatCurrency(budget)}
          </p>
          <div className="flex items-center justify-between mb-3">
            <p className="text-3xl font-semibold text-gray-900">
              {Math.min(100, Math.round(budgetProgress))}%
            </p>
            {isOverBudget && (
              <span className="flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                <AlertCircle size={12} />
                Exceeded
              </span>
            )}
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, budgetProgress)}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={cn(
                "h-full rounded-full",
                isOverBudget ? "bg-rose-500" : "bg-sky-500",
              )}
            />
          </div>
        </motion.div>

        {/* Top Category */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-amber-50 rounded-xl">
              <TrendingUp className="text-amber-500" size={20} />
            </div>
            <span className="text-xs font-medium text-gray-400">Insights</span>
          </div>
          <p className="text-sm text-gray-500 mb-1">Top category</p>
          <p className="text-3xl font-semibold text-gray-900 truncate">
            {highestCategory ? highestCategory.name : "No data"}
          </p>
          <p className="text-sm text-gray-400 mt-1">
            {highestCategory
              ? `${formatCurrency(highestCategory.value)} this month`
              : "Start tracking expenses"}
          </p>
        </motion.div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.24 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[360px] flex flex-col"
        >
          <h3 className="text-base font-semibold text-gray-900 mb-6">
            Category mix
          </h3>
          <div className="flex-1 w-full">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">
                No data yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ left: 8, right: 32, top: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={false}
                    stroke="rgba(0,0,0,0.06)"
                  />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{
                      fontSize: 12,
                      fontWeight: 500,
                      fill: "var(--color-muted, #94a3b8)",
                    }}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(14,165,233,0.05)" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      background: "#fff",
                      fontSize: 13,
                    }}
                    formatter={(value: unknown) =>
                      formatCurrency(Number(value))
                    }
                  />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={BAR_COLORS[index % BAR_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Donut Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.32 }}
          className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm min-h-[360px] flex flex-col"
        >
          <h3 className="text-base font-semibold text-gray-900 mb-6">
            Budget split
          </h3>
          <div className="flex-1 w-full flex items-center justify-center relative">
            {chartData.length === 0 ? (
              <span className="text-sm text-gray-400">No data yet</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={72}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(0,0,0,0.08)",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      background: "#fff",
                      fontSize: 13,
                    }}
                    formatter={(value: unknown) =>
                      formatCurrency(Number(value))
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
            {/* Centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                Spent
              </span>
              <span className="text-2xl font-semibold text-gray-900">
                {formatCurrency(totalMonthly)}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
