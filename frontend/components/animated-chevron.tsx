"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

interface AnimatedChevronProps {
  count?: number
  color?: string
  size?: number
  className?: string
}

export default function AnimatedChevron({
  count = 3,
  color = "text-purple-500",
  size = 8,
  className = "",
}: AnimatedChevronProps) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: -10 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, 20, 40],
          }}
          transition={{
            duration: 1.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "loop",
            delay: index * 0.2,
          }}
        >
          <ChevronDown className={`h-${size} w-${size} ${color}`} />
        </motion.div>
      ))}
    </div>
  )
}
