import { motion } from "framer-motion";

export const fadeIn = (direction: "bottom" | "top" | "left" | "right" = "bottom") => ({
  hidden: {
    opacity: 0,
    y: direction === "bottom" ? 40 : direction === "top" ? -40 : 0,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
});

export const slideUp = (delay: number = 0) => ({
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1, 
    transition: { delay, type: "spring", stiffness: 300, damping: 30 } 
  },
});

export const container = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};