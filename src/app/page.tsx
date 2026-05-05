"use client";

import { useState, useEffect } from "react";
import { Plus, Wallet, PieChart as PieChartIcon, List as ListIcon, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Expense } from "@/types/expense";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { ExpenseForm } from "@/components/ExpenseForm";
import { ExpenseList } from "@/components/ExpenseList";
import { Dashboard } from "@/components/Dashboard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BudgetModal } from "@/components/BudgetModal";
import { cn } from "@/lib/utils";

export default function Home() {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>("expenses", []);
  const [budget, setBudget] = useLocalStorage<number>("monthly-budget", 5000);
  const [activeTab, setActiveTab] = useState<"dashboard" | "list">("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBudgetOpen, setIsBudgetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const handleAddExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Math.random().toString(36).substr(2, 9),
    };
    setExpenses([newExpense, ...expenses]);
  };

  const handleUpdateExpense = (id: string, expenseData: Omit<Expense, 'id'>) => {
    setExpenses(expenses.map(exp => exp.id === id ? { ...expenseData, id } : exp));
    setEditingExpense(null);
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      setExpenses(expenses.filter(exp => exp.id !== id));
    }
  };

  const handleEditClick = (expense: Expense) => {
    setEditingExpense(expense);
    setIsFormOpen(true);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 md:py-12 mb-24 md:mb-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500 text-white rounded-2xl shadow-lg shadow-sky-500/30">
            <Wallet size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-sky-950 dark:text-sky-50">Expensy</h1>
            <p className="text-xs font-bold text-sky-400 dark:text-sky-500 uppercase tracking-widest">Sky Ledger</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => setIsBudgetOpen(true)}
            className="p-3 rounded-2xl bg-white dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-800 border border-sky-100 dark:border-sky-800/50 shadow-soft transition-all active:scale-95"
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex bg-sky-100/50 dark:bg-sky-950/50 p-2 rounded-[2rem] w-fit mx-auto mb-10 border border-sky-100 dark:border-sky-900/50">
        <button
          onClick={() => setActiveTab("dashboard")}
          className={cn(
            "flex items-center gap-2 px-8 py-3.5 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all",
            activeTab === "dashboard" 
              ? "bg-white dark:bg-sky-800 text-sky-600 dark:text-sky-100 shadow-xl shadow-sky-500/10 scale-105" 
              : "text-sky-400 hover:text-sky-600 dark:hover:text-sky-300"
          )}
        >
          <PieChartIcon size={18} />
          Stats
        </button>
        <button
          onClick={() => setActiveTab("list")}
          className={cn(
            "flex items-center gap-2 px-8 py-3.5 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all",
            activeTab === "list" 
              ? "bg-white dark:bg-sky-800 text-sky-600 dark:text-sky-100 shadow-xl shadow-sky-500/10 scale-105" 
              : "text-sky-400 hover:text-sky-600 dark:hover:text-sky-300"
          )}
        >
          <ListIcon size={18} />
          History
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {activeTab === "dashboard" ? (
            <Dashboard 
              expenses={expenses} 
              budget={budget} 
              onEditBudget={() => setIsBudgetOpen(true)} 
            />
          ) : (
            <ExpenseList 
              expenses={expenses} 
              onEdit={handleEditClick} 
              onDelete={handleDeleteExpense} 
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05, y: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setEditingExpense(null);
          setIsFormOpen(true);
        }}
        className="fixed bottom-8 right-8 md:bottom-12 md:right-12 p-6 bg-sky-500 text-white rounded-[2rem] shadow-2xl shadow-sky-500/50 z-40 flex items-center gap-3 hover:bg-sky-600 transition-all border-4 border-white dark:border-sky-900"
      >
        <Plus size={28} />
        <span className="font-black uppercase tracking-widest pr-2 hidden md:inline">Log Expense</span>
      </motion.button>

      {/* Modals */}
      <ExpenseForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleAddExpense}
        onUpdate={handleUpdateExpense}
        editingExpense={editingExpense}
      />

      <BudgetModal
        isOpen={isBudgetOpen}
        onClose={() => setIsBudgetOpen(false)}
        currentBudget={budget}
        onSave={(amt) => setBudget(amt)}
      />

      {/* Footer Info */}
      <footer className="mt-20 text-center pb-8">
        <p className="text-gray-400 text-sm font-medium">
          Data is saved locally in your browser.
        </p>
      </footer>
    </main>
  );
}
