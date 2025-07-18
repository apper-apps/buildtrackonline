import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children,
  hover = false,
  ...props 
}, ref) => {
  const baseStyles = "bg-white rounded-xl shadow-soft border border-secondary-100";
  
  const Component = hover ? motion.div : "div";
  
  const motionProps = hover ? {
    whileHover: { y: -2, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" },
    transition: { duration: 0.2 }
  } : {};

  return (
    <Component
      ref={ref}
      className={cn(baseStyles, className)}
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
});

Card.displayName = "Card";

export default Card;