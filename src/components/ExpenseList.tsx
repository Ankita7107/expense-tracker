"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Edit2, Trash2, Search, ArrowUpDown } from "lucide-react";
import { Expense, Category } from "@/types/expense";
import { CategoryIcon, CATEGORY_COLORS } from "./CategoryIcon";
import { formatCurrency } from "@/lib/utils";
import { format, parseISO } from "date-fns";

interface ExpenseListProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES: (Category | "All")[] = [
  "All",
  "Room Rent",
  "Travel to Home",
  "Daily Travelling",
  "Extra Travelling",
  "Vegetables",
  "Outside Food",
];

export const ExpenseList = ({
  expenses,
  onEdit,
  onDelete,
}: ExpenseListProps) => {
  const [filterCategory, setFilterCategory] = useState<Category | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  const filteredExpenses = expenses
    .filter(
      (exp) => filterCategory === "All" || exp.category === filterCategory,
    )
    .filter(
      (exp) =>
        exp.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
      return sortOrder === "desc" ? -diff : diff;
    });

  return (
    <div className="space-y-4">
      {/* Search + Sort */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search notes or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-sky-400 text-gray-900 placeholder-gray-400 transition-all"
          />
        </div>
        <button
          onClick={() => setSortOrder((s) => (s === "desc" ? "asc" : "desc"))}
          className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium bg-white border border-gray-100 rounded-xl text-gray-500 hover:text-sky-500 hover:border-sky-200 transition-all"
        >
          <ArrowUpDown size={15} />
          {sortOrder === "desc" ? "Newest" : "Oldest"}
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              filterCategory === cat
                ? "bg-sky-500 text-white shadow-sm"
                : "bg-white text-gray-500 border border-gray-100 hover:border-sky-200 hover:text-sky-500"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Notes
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredExpenses.map((expense) => (
                  <motion.tr
                    key={expense.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    className="hover:bg-gray-50/60 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-700">
                        {format(parseISO(expense.date), "MMM dd")}
                        <span className="text-xs text-gray-400 ml-1">
                          {format(parseISO(expense.date), "yyyy")}
                        </span>
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-2 rounded-lg ${CATEGORY_COLORS[expense.category]}`}
                        >
                          <CategoryIcon category={expense.category} size={15} />
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {expense.category}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg">
                        {formatCurrency(expense.amount)}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400 line-clamp-1 max-w-50">
                        {expense.notes || "—"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => onEdit(expense)}
                          className="p-2 text-gray-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-all active:scale-90"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => onDelete(expense.id)}
                          className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-90"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredExpenses.map((expense) => (
            <motion.div
              key={expense.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-xl ${CATEGORY_COLORS[expense.category]}`}
                  >
                    <CategoryIcon category={expense.category} size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">
                      {expense.category}
                    </h4>
                    <p className="text-[11px] font-medium text-gray-400">
                      {format(parseISO(expense.date), "MMMM dd, yyyy")}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-xl">
                  {formatCurrency(expense.amount)}
                </span>
              </div>

              {expense.notes && (
                <div className="bg-gray-50/50 p-2.5 rounded-xl">
                  <p className="text-xs text-gray-500 italic leading-relaxed">
                    "{expense.notes}"
                  </p>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-50">
                <button
                  onClick={() => onEdit(expense)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-sky-600 hover:bg-sky-50 rounded-lg transition-all"
                >
                  <Edit2 size={13} />
                  Edit
                </button>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                >
                  <Trash2 size={13} />
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredExpenses.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
          <div className="inline-flex p-5 bg-gray-50 rounded-2xl mb-4">
            <Search className="text-gray-300" size={28} />
          </div>
          <p className="text-sm font-medium text-gray-500">No entries found</p>
          <p className="text-xs text-gray-400 mt-1">
            Try adjusting your filters or search
          </p>
        </div>
      )}
    </div>
  );
};
