"use client";

import { motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
  hiddenLeft: { opacity: 0, x: -40 },
  visibleLeft: { opacity: 1, x: 0 },
  hiddenRight: { opacity: 0, x: 40 },
  visibleRight: { opacity: 1, x: 0 },
  hiddenScale: { opacity: 0, scale: 0.9 },
  visibleScale: { opacity: 1, scale: 1 },
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.6,
  className = "",
  once = true,
}) {
  const dirMap = {
    up: { hidden: "hidden", visible: "visible" },
    down: { hidden: "hidden", visible: "visible" },
    left: { hidden: "hiddenLeft", visible: "visibleLeft" },
    right: { hidden: "hiddenRight", visible: "visibleRight" },
    scale: { hidden: "hiddenScale", visible: "visibleScale" },
  };

  const selected = dirMap[direction] || dirMap.up;

  return (
    <motion.div
      initial={selected.hidden}
      whileInView={selected.visible}
      viewport={{ once, margin: "-60px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
