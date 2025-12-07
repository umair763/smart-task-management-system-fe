import { motion } from "framer-motion";

export function AnimatedSection({ children, direction = "left", ...props }) {
  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -60 : 60,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 18,
        duration: 0.7,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      {...props}
    >
      {children}
    </motion.div>
  );
}
