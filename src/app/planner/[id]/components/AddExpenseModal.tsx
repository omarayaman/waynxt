"use client";

import React, { useState } from "react";
import type { CreateExpenseInput, ExpenseCategory, TripExpense } from "@/types/trip";
import { EXPENSE_CATEGORIES } from "@/types/trip";
import { Modal } from "@/components/Modal";

interface ExpenseFormState {
  amount: string;
  currency: string;
  category: ExpenseCategory;
  description: string;
  date: string;
}

const defaultForm = (): ExpenseFormState => ({
  amount: "",
  currency: "EGP",
  category: "other",
  description: "",
  date: new Date().toISOString().split("T")[0],
});

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: CreateExpenseInput) => Promise<void>;
  initialData?: TripExpense | null;
  isSubmitting?: boolean;
}

export function AddExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
}: AddExpenseModalProps) {
  const [form, setForm] = useState<ExpenseFormState>(() =>
    initialData
      ? {
          amount: String(initialData.amount),
          currency: initialData.currency ?? "EGP",
          category: (initialData.category as ExpenseCategory) ?? "other",
          description: initialData.description ?? "",
          date: initialData.date
            ? new Date(initialData.date).toISOString().split("T")[0]
            : new Date().toISOString().split("T")[0],
        }
      : defaultForm()
  );

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setForm(
          initialData
            ? {
                amount: String(initialData.amount),
                currency: initialData.currency ?? "EGP",
                category: (initialData.category as ExpenseCategory) ?? "other",
                description: initialData.description ?? "",
                date: initialData.date
                  ? new Date(initialData.date).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0],
              }
            : defaultForm()
        );
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!amount || amount <= 0) return;

    await onSubmit({
      amount,
      currency: form.currency,
      category: form.category,
      description: form.description || undefined,
      date: form.date,
    });
  };

  const isEdit = Boolean(initialData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? "Edit expense" : "Add expense"}
      size="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-[#888] mb-1.5">Amount *</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={form.amount}
            onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-[#F7EA00]/40"
            placeholder="0.00"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-[#888] mb-1.5">Currency</label>
            <select
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-[#F7EA00]/40"
            >
              <option value="EGP">EGP</option>
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#888] mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value as ExpenseCategory }))
              }
              className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-[#F7EA00]/40"
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#888] mb-1.5">Date</label>
          <input
            type="date"
            value={form.date}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-[#F7EA00]/40"
          />
        </div>

        <div>
          <label className="block text-xs text-[#888] mb-1.5">Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            className="w-full rounded-lg border border-[#2a2a2a] bg-[#0d0d0d] px-3 py-2 text-sm text-white outline-none focus:border-[#F7EA00]/40"
            placeholder="Hotel, meals, taxi…"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm text-[#888] border border-[#2a2a2a] rounded-lg hover:bg-[#1a1a1a] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !form.amount}
            className="flex-1 px-4 py-2 text-sm font-bold text-accent-foreground bg-accent hover:bg-accent-hover rounded-lg transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Saving…" : isEdit ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
