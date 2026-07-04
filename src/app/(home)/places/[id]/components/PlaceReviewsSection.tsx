"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, MessageSquarePlus, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { placesService } from "@/services/places.service";
import { useAuthStore } from "@/store/useAuthStore";
import type { PaginationMeta, Review } from "@/types/places";
import { formatRelativeDate } from "@/lib/placeLabels";
import { StarRating } from "./StarRating";
import { PlaceRatingOverview } from "./PlaceRatingOverview";
import { PlaceSection } from "./PlaceSection";

interface PlaceReviewsSectionProps {
  placeId: number;
  placeRating: number;
  initialReviews: Review[];
  initialMeta?: PaginationMeta;
}

interface ReviewFormState {
  rating: number;
  comment: string;
}

const emptyForm: ReviewFormState = { rating: 5, comment: "" };

export function PlaceReviewsSection({
  placeId,
  placeRating,
  initialReviews,
  initialMeta,
}: PlaceReviewsSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [meta, setMeta] = useState<PaginationMeta | undefined>(initialMeta);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [form, setForm] = useState<ReviewFormState>(emptyForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const userReview = reviews.find((review) => review.user_id === user?.id);
  const totalReviews = meta?.total ?? reviews.length;
  const hasMore = meta ? reviews.length < meta.total : false;

  const resetForm = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditingReview(null);
  };

  const openCreateForm = () => {
    setEditingReview(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEditForm = (review: Review) => {
    setEditingReview(review);
    setForm({ rating: review.rating, comment: review.comment ?? "" });
    setShowForm(true);
  };

  const handleLoadMore = async () => {
    if (!meta || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const nextPage = meta.page + 1;
      const response = await placesService.getPlaceReviews(placeId, {
        page: nextPage,
        per_page: meta.per_page,
      });
      setReviews((prev) => [...prev, ...response.data]);
      setMeta(response.meta);
    } catch {
      toast.error("Failed to load more reviews");
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) return;

    setIsSubmitting(true);
    try {
      if (editingReview) {
        const response = await placesService.updateReview(
          placeId,
          editingReview.id,
          {
            rating: form.rating,
            comment: form.comment.trim() || undefined,
          }
        );
        setReviews((prev) =>
          prev.map((review) =>
            review.id === editingReview.id ? response.data : review
          )
        );
        toast.success("Review updated");
      } else {
        const response = await placesService.createReview(placeId, {
          rating: form.rating,
          comment: form.comment.trim() || undefined,
        });
        const newReview: Review = {
          ...response.data,
          user: response.data.user ?? {
            id: user!.id,
            full_name: user!.full_name,
            avatar_url: user!.avatar_url,
          },
        };
        setReviews((prev) => [newReview, ...prev]);
        setMeta((prev) =>
          prev ? { ...prev, total: prev.total + 1 } : prev
        );
        toast.success("Review added");
      }
      resetForm();
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? "Something went wrong";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    setDeletingId(reviewId);
    try {
      await placesService.deleteReview(placeId, reviewId);
      setReviews((prev) => prev.filter((review) => review.id !== reviewId));
      setMeta((prev) =>
        prev ? { ...prev, total: Math.max(0, prev.total - 1) } : prev
      );
      if (editingReview?.id === reviewId) resetForm();
      toast.success("Review deleted");
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setDeletingId(null);
    }
  };

  const reviewAction =
    !userReview && isAuthenticated && !showForm ? (
      <button
        type="button"
        onClick={openCreateForm}
        className="inline-flex items-center gap-2 rounded-xl border border-[#DFD616]/30 bg-[#DFD616]/10 px-4 py-2 text-sm font-medium text-[#DFD616] transition-colors hover:bg-[#DFD616]/15"
      >
        <MessageSquarePlus size={16} />
        Add review
      </button>
    ) : !isAuthenticated ? (
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-xl border border-[#222] px-4 py-2 text-sm text-[#999] transition-colors hover:border-[#333] hover:text-white"
      >
        Sign in to review
      </Link>
    ) : null;

  return (
    <PlaceSection
      title="Reviews"
      subtitle={`${totalReviews} ${totalReviews === 1 ? "review" : "reviews"} from travelers`}
      action={reviewAction}
    >
      <div className="overflow-hidden rounded-2xl border border-[#1a1a1a] bg-[#0a0a0a]">
        <PlaceRatingOverview
          embedded
          rating={placeRating}
          reviews={reviews}
          totalReviews={totalReviews}
        />

        <div className="p-6 md:p-8">

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            onSubmit={handleSubmit}
            className="mb-6 overflow-hidden rounded-xl border border-[#141414] bg-[#050505] p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-white">
                {editingReview ? "Edit your review" : "Write a review"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full p-1.5 text-[#666] transition-colors hover:bg-[#141414] hover:text-white"
                aria-label="Close form"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-[#555]">
                Your rating
              </p>
              <StarRating
                rating={form.rating}
                interactive
                size={22}
                onChange={(rating) => setForm((prev) => ({ ...prev, rating }))}
              />
            </div>

            <textarea
              value={form.comment}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, comment: e.target.value }))
              }
              placeholder="Share your experience (optional)"
              rows={3}
              className="mb-4 w-full resize-none rounded-xl border border-[#1a1a1a] bg-[#050505] px-4 py-3 text-sm text-white placeholder:text-[#444] outline-none transition-colors focus:border-[#DFD616]/40"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#DFD616] px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-[#EAE121] disabled:opacity-60"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                {editingReview ? "Update review" : "Submit review"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-[#666] transition-colors hover:text-white"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#1a1a1a] px-6 py-10 text-center">
          <p className="text-sm text-[#555]">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#141414]">
          {reviews.map((review, index) => {
            const isOwner = user?.id === review.user_id;
            const displayName =
              review.user?.full_name ?? "Anonymous traveler";
            const avatarUrl = review.user?.avatar_url;

            return (
              <motion.li
                key={review.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(index * 0.05, 0.25),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="py-5 first:pt-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#141414] text-sm font-medium text-[#DFD616]">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      displayName.charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-sm font-medium text-white">
                        {displayName}
                      </span>
                      <StarRating rating={review.rating} size={13} />
                      <span className="text-xs text-[#555]">
                        {formatRelativeDate(review.created_at)}
                      </span>
                    </div>

                    {review.comment && (
                      <p className="mt-2 text-sm leading-relaxed text-[#999]">
                        {review.comment}
                      </p>
                    )}

                    {isOwner && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(review)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-[#666] transition-colors hover:bg-[#141414] hover:text-white"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(review.id)}
                          disabled={deletingId === review.id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-[#666] transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                        >
                          {deletingId === review.id ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Trash2 size={12} />
                          )}
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>
      )}

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-xl border border-[#222] px-5 py-2.5 text-sm text-[#999] transition-colors hover:border-[#333] hover:text-white disabled:opacity-60"
          >
            {isLoadingMore && <Loader2 size={14} className="animate-spin" />}
            Load more
          </button>
        </div>
      )}
        </div>
      </div>
    </PlaceSection>
  );
}
