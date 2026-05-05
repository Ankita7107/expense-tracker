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
  Pie
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  CreditCard, 
  Target, 
  AlertCircle,
  Calendar
} from "lucide-react";
import { Expense, Category } from "@/types/expense";
import { formatCurrency, cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DashboardProps {
  expenses: Expense[];
  budget: number;
  onEditBudget: () => void;
}

export const Dashboard = ({ expenses, budget, onEditBudget }: DashboardProps) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const date = new Date(exp.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
  }, [expenses, currentMonth, currentYear]);

  const totalMonthly = useMemo(() => {
    return monthlyExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }, [monthlyExpenses]);

  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    monthlyExpenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [monthlyExpenses]);

  const chartData = useMemo(() => {
    return categoryTotals.sort((a, b) => b.value - a.value);
  }, [categoryTotals]);

  const budgetProgress = (totalMonthly / budget) * 100;
  const isOverBudget = totalMonthly > budget;

  const highestCategory = useMemo(() => {
    if (categoryTotals.length === 0) return null;
    return categoryTotals.reduce((prev, current) => (prev.value > current.value) ? prev : current);
  }, [categoryTotals]);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Monthly Total Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-sky-900/40 p-8 rounded-[2rem] shadow-soft border border-sky-100/50 dark:border-sky-800/50 hover:border-sky-300 dark:hover:border-sky-400 transition-all group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 dark:bg-sky-800/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-sky-50 dark:bg-sky-800/40 text-sky-600 dark:text-sky-300 rounded-2xl group-hover:rotate-12 transition-transform">
                <CreditCard size={24} />
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-sky-400 dark:text-sky-500 uppercase tracking-widest">
                <Calendar size={14} />
                {new Date().toLocaleString('default', { month: 'long' })}
              </div>
            </div>
            <p className="text-sm font-semibold text-sky-500/80 dark:text-sky-400/80 mb-1">Monthly Spending</p>
            <h3 className="text-4xl font-black text-sky-900 dark:text-white">
              {formatCurrency(totalMonthly)}
            </h3>
          </div>
        </motion.div>

        {/* Budget Progress Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-sky-900/40 p-8 rounded-[2rem] shadow-soft border border-sky-100/50 dark:border-sky-800/50 hover:border-sky-300 dark:hover:border-sky-400 transition-all group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className={cn(
              "p-4 rounded-2xl group-hover:scale-110 transition-transform",
              isOverBudget ? "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400" : "bg-sky-50 dark:bg-sky-800/40 text-sky-600 dark:text-sky-300"
            )}>
              <Target size={24} />
            </div>
            <button 
              onClick={onEditBudget}
              className="text-xs font-bold text-sky-500 dark:text-sky-400 uppercase tracking-widest hover:text-sky-700 dark:hover:text-sky-200 transition-colors"
            >
              Edit Budget
            </button>
          </div>
          <p className="text-sm font-semibold text-sky-500/80 dark:text-sky-400/80 mb-1">Budget Goal: {formatCurrency(budget)}</p>
          <div className="flex items-end justify-between mb-3">
            <h3 className="text-4xl font-black text-sky-900 dark:text-white">
              {Math.min(100, Math.round(budgetProgress))}%
            </h3>
            {isOverBudget && (
              <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-3 py-1 rounded-full animate-pulse">
                <AlertCircle size={14} />
                EXCEEDED
              </span>
            )}
          </div>
          <div className="w-full h-3 bg-sky-50 dark:bg-sky-950 rounded-full overflow-hidden p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, budgetProgress)}%` }}
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                isOverBudget ? "bg-rose-500" : "bg-sky-500 shadow-sm shadow-sky-500/50"
              )}
            />
          </div>
        </motion.div>

        {/* Top Category Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-sky-900/40 p-8 rounded-[2rem] shadow-soft border border-sky-100/50 dark:border-sky-800/50 hover:border-sky-300 dark:hover:border-sky-400 transition-all group"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl group-hover:scale-110 transition-transform">
              <TrendingUp size={24} />
            </div>
            <div className="text-xs font-bold text-sky-400 dark:text-sky-500 uppercase tracking-widest">
              Insights
            </div>
          </div>
          <p className="text-sm font-semibold text-sky-500/80 dark:text-sky-400/80 mb-1">Top Category</p>
          <h3 className="text-3xl font-black text-sky-900 dark:text-white truncate">
            {highestCategory ? highestCategory.name : 'No data'}
          </h3>
          <p className="text-sm text-sky-400/60 dark:text-sky-500/60 mt-2 font-medium">
            {highestCategory ? `${formatCurrency(highestCategory.value)} this month` : 'Start tracking expenses'}
          </p>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-sky-900/40 p-8 rounded-[2rem] shadow-soft border border-sky-100/50 dark:border-sky-800/50 min-h-[400px] flex flex-col"
        >
          <h3 className="text-xl font-black mb-8 text-sky-900 dark:text-sky-100">Category Mix</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 20, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(14, 165, 233, 0.1)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  width={120}
                  tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(14, 165, 233, 0.05)' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: '#fff' }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#0ea5e9' : '#bae6fd'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-sky-900/40 p-8 rounded-[2rem] shadow-soft border border-sky-100/50 dark:border-sky-800/50 min-h-[400px] flex flex-col"
        >
          <h3 className="text-xl font-black mb-8 text-sky-900 dark:text-sky-100">Budget Split</h3>
          <div className="flex-1 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={[
                        '#0ea5e9', // sky-500
                        '#38bdf8', // sky-400
                        '#7dd3fc', // sky-300
                        '#0284c7', // sky-600
                        '#0369a1', // sky-700
                        '#0c4a6e'  // sky-900
                      ][index % 6]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', background: '#fff' }}
                  formatter={(value: any) => formatCurrency(Number(value))}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-sky-400 dark:text-sky-500 text-xs font-bold uppercase tracking-widest">Spent</span>
              <span className="text-3xl font-black text-sky-900 dark:text-sky-50">{formatCurrency(totalMonthly)}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
