"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import { Loader2, Pencil, Plus, Trash2, Wallet } from "lucide-react";
import { tripService } from "@/services/trip.service";
import type { CreateExpenseInput, TripExpense } from "@/types/trip";
import { EXPENSE_CATEGORIES } from "@/types/trip";
import { AddExpenseModal } from "./AddExpenseModal";

interface ExpensesSectionProps {
  tripId: string;
  onExpensesChange?: (expenses: TripExpense[]) => void;
}

function categoryLabel(category?: string): string {
  return EXPENSE_CATEGORIES.find((c) => c.value === category)?.label ?? category ?? "Other";
}

function formatExpenseDate(dateStr?: string): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ExpensesSection({ tripId, onExpensesChange }: ExpensesSectionProps) {
  const [expenses, setExpenses] = useState<TripExpense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<TripExpense | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await tripService.listExpenses({ tripId, perPage: 50 });
      setExpenses(response.data);
      onExpensesChange?.(response.data);
    } catch {
      toast.error("Could not load expenses");
    } finally {
      setIsLoading(false);
    }
  }, [tripId, onExpensesChange]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExpenses();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchExpenses]);

  const totalByCurrency = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const exp of expenses) {
      const currency = exp.currency ?? "EGP";
      totals[currency] = (totals[currency] ?? 0) + exp.amount;
    }
    return totals;
  }, [expenses]);

  const handleAddOrUpdate = async (input: CreateExpenseInput) => {
    setIsSubmitting(true);
    try {
      if (editingExpense) {
        const updated = await tripService.updateExpense(tripId, editingExpense.id, input);
        setExpenses((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
        toast.success("Expense updated");
      } else {
        const created = await tripService.createExpense(tripId, input);
        setExpenses((prev) => [...prev, created]);
        toast.success("Expense added");
      }
      setModalOpen(false);
      setEditingExpense(null);
    } catch (err) {
      const message = isAxiosError(err)
        ? err.response?.data?.error?.message ?? "Failed to save expense"
        : "Failed to save expense";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (expenseId: string) => {
    setDeletingId(expenseId);
    try {
      await tripService.deleteExpense(tripId, expenseId);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      toast.success("Expense deleted");
    } catch {
      toast.error("Failed to delete expense");
    } finally {
      setDeletingId(null);
    }
  };

  const openAdd = () => {
    setEditingExpense(null);
    setModalOpen(true);
  };

  const openEdit = (expense: TripExpense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  return (
    <div>
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="text-base font-medium text-white">Expenses</h3>
          <p className="text-sm text-[#666] mt-0.5">Track your trip spending by category</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-white bg-[#1a1a1a] hover:bg-[#222] rounded-lg transition-colors"
        >
          <Plus size={13} />
          Add expense
        </button>
      </div>

      {Object.keys(totalByCurrency).length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
          {Object.entries(totalByCurrency).map(([currency, total]) => (
            <div
              key={currency}
              className="rounded-xl border border-border bg-[#0d0d0d] px-4 py-3 flex items-center gap-3"
            >
              <div className="w-9 h-9 rounded-lg bg-[#161616] flex items-center justify-center">
                <Wallet size={16} className="text-[#F7EA00]" />
              </div>
              <div>
                <p className="text-xs text-[#666]">Total ({currency})</p>
                <p className="text-lg font-clash font-bold text-white">
                  {total.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#555]" />
        </div>
      ) : expenses.length === 0 ? (
        <div className="rounded-xl border border-border bg-[#0d0d0d] py-16 text-center">
          <Wallet size={24} className="text-[#444] mx-auto mb-3" />
          <p className="text-sm text-[#888]">No expenses yet</p>
          <p className="text-xs text-[#555] mt-1 mb-4">Start tracking your trip budget.</p>
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex px-4 py-2 text-sm text-white bg-[#1a1a1a] hover:bg-[#222] rounded-lg transition-colors"
          >
            Add first expense
          </button>
        </div>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#0d0d0d]">
                <th className="text-left px-4 py-3 text-xs font-medium text-[#666]">Description</th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#666] hidden sm:table-cell">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-medium text-[#666] hidden md:table-cell">
                  Date
                </th>
                <th className="text-right px-4 py-3 text-xs font-medium text-[#666]">Amount</th>
                <th className="w-20" />
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => {
                const isDeleting = deletingId === expense.id;
                return (
                  <tr
                    key={expense.id}
                    className="group border-b border-border last:border-0 hover:bg-[#111] transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <p className="text-white truncate max-w-[200px]">
                        {expense.description || "—"}
                      </p>
                      <p className="text-xs text-[#555] sm:hidden mt-0.5">
                        {categoryLabel(expense.category)}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-[#777] hidden sm:table-cell capitalize">
                      {categoryLabel(expense.category)}
                    </td>
                    <td className="px-4 py-3.5 text-[#555] text-xs hidden md:table-cell">
                      {formatExpenseDate(expense.date)}
                    </td>
                    <td className="px-4 py-3.5 text-right text-white font-medium whitespace-nowrap">
                      {expense.amount.toLocaleString()} {expense.currency ?? "EGP"}
                    </td>
                    <td className="px-2 py-3.5">
                      <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => openEdit(expense)}
                          className="p-2 rounded-lg text-[#444] hover:text-[#F7EA00] hover:bg-[#F7EA00]/10 transition-all"
                          aria-label="Edit expense"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(expense.id)}
                          disabled={isDeleting}
                          className="p-2 rounded-lg text-[#444] hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                          aria-label="Delete expense"
                        >
                          {isDeleting ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <AddExpenseModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingExpense(null);
        }}
        onSubmit={handleAddOrUpdate}
        initialData={editingExpense}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
