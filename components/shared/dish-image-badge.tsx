"use client";

import { useState } from "react";
import { resolveDishImage, getDishCdnFallback, CATEGORY_FALLBACKS } from "@/lib/data/dish-images";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Utensils, Sparkles, ZoomIn } from "lucide-react";

interface DishImageBadgeProps {
  name: string;
  category?: string;
  imageUrl?: string | null;
  description?: string | null;
  isVegetarian?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  enablePreview?: boolean;
}

export function DishImageBadge({
  name,
  category,
  imageUrl,
  description,
  isVegetarian = true,
  size = "md",
  className = "",
  enablePreview = true,
}: DishImageBadgeProps) {
  const [open, setOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(() => resolveDishImage(name, imageUrl, category));
  const [fallbackStage, setFallbackStage] = useState(0);
  const [imgError, setImgError] = useState(false);

  const handleImageError = () => {
    if (fallbackStage === 0) {
      // Stage 1: Try culinary CDN fallback for this exact dish
      setFallbackStage(1);
      const cdnUrl = getDishCdnFallback(name, category);
      if (cdnUrl && cdnUrl !== currentUrl) {
        setCurrentUrl(cdnUrl);
        return;
      }
    }
    if (fallbackStage <= 1 && category && CATEGORY_FALLBACKS[category]) {
      // Stage 2: Try category fallback
      setFallbackStage(2);
      const catUrl = CATEGORY_FALLBACKS[category];
      if (catUrl && catUrl !== currentUrl) {
        setCurrentUrl(catUrl);
        return;
      }
    }
    // Stage 3: Render graceful UI icon
    setImgError(true);
  };

  const sizeClasses = {
    sm: "py-0.5 px-2 text-[11px] gap-1.5",
    md: "py-1 px-2.5 text-xs gap-2",
    lg: "py-1.5 px-3.5 text-sm gap-2.5",
  };

  const imgSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <>
      <button
        type="button"
        onClick={() => enablePreview && setOpen(true)}
        className={`inline-flex items-center rounded-xl bg-white border border-slate-200/90 shadow-2xs hover:border-amber-400 hover:shadow-xs transition-all text-slate-800 font-medium text-left ${sizeClasses[size]} ${
          enablePreview ? "cursor-pointer group" : "cursor-default"
        } ${className}`}
        title={enablePreview ? `Click to preview ${name}` : name}
      >
        {/* Food Thumbnail */}
        <div className={`relative ${imgSizes[size]} rounded-lg overflow-hidden shrink-0 bg-slate-100 ring-1 ring-slate-200/60`}>
          {!imgError ? (
            <img
              src={currentUrl}
              alt={name}
              onError={handleImageError}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-amber-50 text-amber-700">
              <Utensils className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Dish Name */}
        <span className="truncate max-w-[190px] sm:max-w-[240px]">
          {name}
        </span>

        {/* Veg Dot */}
        {isVegetarian && (
          <span
            className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"
            title="Pure Vegetarian"
          />
        )}

        {/* Category Pill if provided */}
        {category && size !== "sm" && (
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
            {category}
          </span>
        )}

        {enablePreview && (
          <ZoomIn className="w-3 h-3 text-slate-600 group-hover:text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 shrink-0" />
        )}
      </button>

      {/* High-Resolution Preview Dialog */}
      {enablePreview && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-sm sm:max-w-md bg-white rounded-3xl border border-slate-200 p-0 overflow-hidden shadow-xl">
            <div className="relative h-56 sm:h-64 w-full bg-slate-100">
              <img
                src={currentUrl}
                alt={name}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase bg-black/80 text-amber-300 backdrop-blur-xs">
                  {category || "Mess Dish"}
                </span>
                {isVegetarian && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                    Pure Veg
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 space-y-3">
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-slate-900 tracking-tight">
                  {name}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 pt-1 leading-relaxed">
                  {description || `Freshly prepared culinary serving prepared daily in the mess hall according to standard recipes and nutritional guidelines.`}
                </DialogDescription>
              </DialogHeader>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Authentic Mess Preparation
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
