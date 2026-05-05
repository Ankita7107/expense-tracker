"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Calendar, IndianRupee, Tag, FileText } from "lucide-react";
import { Expense, Category } from "@/types/expense";
import { CategoryIcon, CATEGORY_COLORS } from "./CategoryIcon";
import { cn } from "@/lib/utils";

interface ExpenseFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (expense: Omit<Expense, 'id'>) => void;
  onUpdate: (id: string, expense: Omit<Expense, 'id'>) => void;
  editingExpense?: Expense | null;
}

const CATEGORIES: Category[] = [
  'Room Rent',
  'Travel to Home',
  'Daily Travelling',
  'Extra Travelling',
  'Vegetables',
  'Outside Food'
];

export const ExpenseForm = ({ isOpen, onClose, onSubmit, onUpdate, editingExpense }: ExpenseFormProps) => {
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    category: 'Daily Travelling',
    amount: 0,
    notes: ''
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        date: editingExpense.date,
        category: editingExpense.category,
        amount: editingExpense.amount,
        notes: editingExpense.notes || ''
      });
    } else {
      setFormData({
        date: new Date().toISOString().split('T')[0],
        category: 'Daily Travelling',
        amount: 0,
        notes: ''
      });
    }
  }, [editingExpense, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingExpense) {
      onUpdate(editingExpense.id, formData);
    } else {
      onSubmit(formData);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold mb-8">
              {editingExpense ? 'Edit Expense' : 'Add Expense'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <IndianRupee size={20} />
                  </span>
                  <input
                    type="number"
                    value={formData.amount || ''}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 text-xl font-bold"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              {/* Date & Category Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Calendar size={20} />
                    </span>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                      <Tag size={20} />
                    </span>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 appearance-none"
                      required
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Notes (Optional)</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-gray-400">
                    <FileText size={20} />
                  </span>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Add a note..."
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-blue-500/20"
              >
                {editingExpense ? 'Update Expense' : 'Add Expense'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
