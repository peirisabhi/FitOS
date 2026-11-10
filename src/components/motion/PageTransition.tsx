"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Subtle fade + slide on route change (150-250ms per the brief's animation
 * guidance). Keyed on pathname so AnimatePresence treats each route as a
 * distinct element and animates the transition between them. Respects
 * `prefers-reduced-motion` (WCAG 2.3.3) by collapsing to a plain opacity
 * fade with no movement.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const yOffset = shouldReduceMotion ? 0 : 8;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: yOffset }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -yOffset }}
        transition={{ duration: 0.18, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
