"use client";

import Link from "next/link";
import { ChefHat, ArrowRight } from "lucide-react";

export function PromotionalBanner() {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-[#241D1B] text-white p-6 md:p-7 border border-[#A91D32]/25 shadow-[0_24px_55px_-34px_rgba(36,29,27,0.45)] flex flex-col justify-between min-h-[220px]">
      {/* Decorative Glow */}
      <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />
      <div className="absolute right-36 bottom-0 w-24 h-24 rounded-full bg-amber-400/5 blur-xl pointer-events-none" />

      {/* Background Food Artwork with Soft Overlay */}
      <div className="absolute right-0 top-0 bottom-0 w-2/5 overflow-hidden opacity-30 sm:opacity-40 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=600&auto=format&fit=crop&q=80"
          alt="Traditional Indian Meal"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
          <ChefHat className="w-3.5 h-3.5" /> Chef&apos;s Special Today
        </div>

        <div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-tight">
            Enjoy your meals!
          </h3>
          <p className="text-xs text-slate-300 font-medium mt-1">
            Healthy food. Happy you.
          </p>
        </div>

        <p className="text-[11px] text-slate-400 leading-relaxed pr-4">
          Nutritionally balanced ingredients cooked fresh daily with minimal spices and low oil.
        </p>
      </div>

      {/* Button */}
      <div className="relative z-10 pt-3">
        <Link
          href="/student/menu"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EF6A32] hover:bg-[#A91D32] text-white text-xs font-semibold transition-all hover:gap-2.5 shadow-xs"
        >
          <span>Explore Menu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
