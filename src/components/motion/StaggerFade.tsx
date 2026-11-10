"use client";

import { Children, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

function itemVariants(distance: number) {
  return {
    hidden: { opacity: 0, y: distance },
    show: { opacity: 1, y: 0, transition: { duration: 0.2, ease: "easeOut" } },
  };
}

/**
 * Wraps a grid/row of cards (metric cards, widget grids) and staggers
 * their fade-in by 50ms each — a premium touch used sparingly, per the
 * brief's animation guidance (150-250ms, not everywhere). Pass through
 * `className` so this can drop in wherever a plain grid `<div>` was.
 */
export function StaggerFade({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const distance = shouldReduceMotion ? 0 : 10;

  return (
    <motion.div className={className} variants={container} initial="hidden" animate="show">
      {Children.toArray(children).map((child, i) => (
        <motion.div key={i} variants={itemVariants(distance)}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
