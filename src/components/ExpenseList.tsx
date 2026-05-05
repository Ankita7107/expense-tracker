"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Edit2, 
  Trash2, 
  Search, 
  Filter, 
  ArrowUpDown, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Expense, Category } from "@/types/expense";
import { CategoryIcon, CATEGORY_COLORS } from "./CategoryIcon";
import { formatCurrency } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Room Rent',
  'Travel to Home',
  'Daily Travelling',
  'Extra Travelling',
  'Vegetables',
  'Outside Food'
];

export const ExpenseList = ({ expenses, onEdit, onDelete }: ExpenseListProps) => {
  const [filterCategory, setFilterCategory] = useState<(Category | 'All')>('All');
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const filteredExpenses = expenses
    .filter(exp => (filterCategory === 'All' || exp.category === filterCategory))
    .filter(exp => 
      exp.notes?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      exp.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  return (
    <div className="space-y-6">
      {/* Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-400 group-focus-within:text-sky-600 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search notes or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-sky-900/40 rounded-2xl border border-sky-100 dark:border-sky-800/50 focus:ring-2 focus:ring-sky-500 shadow-soft transition-all"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                filterCategory === cat 
                  ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30 scale-105' 
                  : 'bg-white dark:bg-sky-900/40 text-sky-600 dark:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-800 border border-sky-50 dark:border-sky-800/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-sky-900/40 rounded-[2rem] shadow-soft border border-sky-100 dark:border-sky-800/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-sky-50/50 dark:bg-sky-800/20">
                <th className="px-8 py-5 text-left text-xs font-black text-sky-400 dark:text-sky-500 uppercase tracking-widest">Date</th>
                <th className="px-8 py-5 text-left text-xs font-black text-sky-400 dark:text-sky-500 uppercase tracking-widest">Category</th>
                <th className="px-8 py-5 text-left text-xs font-black text-sky-400 dark:text-sky-500 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-5 text-left text-xs font-black text-sky-400 dark:text-sky-500 uppercase tracking-widest">Notes</th>
                <th className="px-8 py-5 text-right text-xs font-black text-sky-400 dark:text-sky-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-50/50 dark:divide-sky-800/30">
              <AnimatePresence mode="popLayout">
                {filteredExpenses.map((expense) => (
                  <motion.tr
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hover:bg-sky-50/30 dark:hover:bg-sky-800/20 transition-colors group"
                  >
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm font-bold text-sky-700 dark:text-sky-300">
                        {format(parseISO(expense.date), 'MMM dd')}
                        <span className="text-xs text-sky-400 ml-1 font-medium">{format(parseISO(expense.date), 'yyyy')}</span>
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${CATEGORY_COLORS[expense.category]} group-hover:scale-110 transition-transform`}>
                          <CategoryIcon category={expense.category} size={18} />
                        </div>
                        <span className="text-sm font-black text-sky-900 dark:text-sky-50">
                          {expense.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <span className="text-sm font-black text-sky-900 dark:text-white bg-sky-50 dark:bg-sky-800/40 px-3 py-1 rounded-lg">
                        {formatCurrency(expense.amount)}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-sky-600/60 dark:text-sky-400/60 font-medium line-clamp-1 max-w-[200px]">
                        {expense.notes || '—'}
                      </span>
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => onEdit(expense)}
                          className="p-2.5 text-sky-400 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-800/50 rounded-xl transition-all active:scale-90"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => onDelete(expense.id)}
                          className="p-2.5 text-rose-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all active:scale-90"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredExpenses.length === 0 && (
            <div className="py-24 text-center">
              <div className="inline-flex p-8 bg-sky-50 dark:bg-sky-900/30 rounded-full mb-6">
                <Search className="text-sky-200 dark:text-sky-700" size={40} />
              </div>
              <p className="text-sky-500 dark:text-sky-400 font-black text-lg uppercase tracking-widest">No entries found</p>
              <p className="text-sky-400/60 text-sm mt-2">Try adjusting your filters or search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
