"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();
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
        className="inline-flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent transition-colors hover:bg-accent/15"
      >
        <MessageSquarePlus size={16} />
        Add review
      </button>
    ) : !isAuthenticated ? (
      <button
        onClick={() => router.push(`/login?redirect=${encodeURIComponent(pathname)}`)}
        className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent/30 hover:text-foreground"
      >
        Sign in to review
      </button>
    ) : null;

  return (
    <PlaceSection
      title="Reviews"
      subtitle={`${totalReviews} ${totalReviews === 1 ? "review" : "reviews"} from travelers`}
      action={reviewAction}
    >
      <div className="overflow-hidden rounded-2xl border border-border bg-surface-card">
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
            className="mb-6 overflow-hidden rounded-xl border border-border bg-surface-card p-5"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">
                {editingReview ? "Edit your review" : "Write a review"}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="rounded-full p-1.5 text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
                aria-label="Close form"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-2 text-xs uppercase tracking-wider text-muted">
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
              className="mb-4 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted outline-none transition-colors focus:border-accent/40"
            />

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {isSubmitting && <Loader2 size={14} className="animate-spin" />}
                {editingReview ? "Update review" : "Submit review"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-muted transition-colors hover:text-foreground"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {reviews.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border px-6 py-10 text-center">
          <p className="text-sm text-muted">No reviews yet. Be the first!</p>
        </div>
      ) : (
        <ul className="divide-y divide-border">
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
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-elevated text-sm font-medium text-accent">
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
                      <span className="text-sm font-medium text-foreground">
                        {displayName}
                      </span>
                      <StarRating rating={review.rating} size={13} />
                      <span className="text-xs text-muted">
                        {formatRelativeDate(review.created_at)}
                      </span>
                    </div>

                    {review.comment && (
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {review.comment}
                      </p>
                    )}

                    {isOwner && (
                      <div className="mt-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(review)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:bg-surface-elevated hover:text-foreground"
                        >
                          <Pencil size={12} />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(review.id)}
                          disabled={deletingId === review.id}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs text-muted transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
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
            className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:border-accent/30 hover:text-foreground disabled:opacity-60"
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
