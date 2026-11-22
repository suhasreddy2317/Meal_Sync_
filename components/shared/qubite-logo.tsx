import React from "react";
import { cn } from "@/lib/utils";

export interface QubiteLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  imgClassName?: string;
  variant?: "cream" | "transparent";
}

const sizeMap = {
  xs: "h-7 w-7 rounded-lg",
  sm: "h-9 w-9 rounded-xl",
  md: "h-11 w-11 rounded-2xl",
  lg: "h-14 w-14 rounded-3xl",
  xl: "h-16 w-16 rounded-3xl",
};

/**
 * Official MealSync application mark.
 */
export function QubiteLogo({
  size = "md",
  className,
  imgClassName,
  variant = "cream",
}: QubiteLogoProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden bg-white flex items-center justify-center shadow-xs border border-[#FFBFA5]/70 select-none",
        sizeMap[size],
        className
      )}
    >
      <img
        src="/mealsync-logo.svg"
        alt="MealSync"
        className={cn("h-full w-full object-cover", imgClassName)}
      />
    </div>
  );
}
