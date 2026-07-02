"use client";

import { AlertTriangle } from "lucide-react";

interface MockDataBannerProps {
  show: boolean;
}

export function MockDataBanner({ show }: MockDataBannerProps) {
  if (!show) return null;

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 flex items-start gap-3">
      <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-amber-300">
          بيانات تجريبية وهمية — Demo / Mock Data
        </p>
        <p className="text-xs text-amber-400/80 mt-0.5">
          تعذر الاتصال بالخادم أثناء إنشاء الخطة. البيانات المعروضة للمعاينة فقط وليست من الـ API الحقيقي.
        </p>
      </div>
    </div>
  );
}
