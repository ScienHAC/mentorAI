"use client"

import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

export default function AnimatedFuelChevron() {
  return (
    <div className="flex flex-col items-center my-12 relative">
      {/* Fuel tank */}
      <motion.div
        className="w-16 h-8 bg-gradient-to-r from-purple-600 to-blue-500 rounded-t-lg mb-1"
        animate={{
          boxShadow: ["0 0 0 rgba(139, 92, 246, 0)", "0 0 20px rgba(139, 92, 246, 0.7)", "0 0 0 rgba(139, 92, 246, 0)"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
        }}
      />

      {/* Fuel pipe */}
      <div className="h-32 w-1 bg-gradient-to-b from-purple-600 to-blue-500 relative">
        {/* Animated fuel droplets */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 -ml-2 w-4 h-4 rounded-full bg-blue-500"
            initial={{ y: -10, opacity: 0 }}
            animate={{
              y: [0, 120],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: i * 0.6,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Engine/destination */}
      <motion.div
        className="w-16 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-b-lg mt-1"
        animate={{
          scale: [1, 1.1, 1],
          boxShadow: ["0 0 0 rgba(59, 130, 246, 0)", "0 0 20px rgba(59, 130, 246, 0.7)", "0 0 0 rgba(59, 130, 246, 0)"],
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          delay: 1,
        }}
      />

      {/* Chevron arrows */}
      <div className="mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, 15, 30],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "loop",
              delay: i * 0.3,
            }}
          >
            <ChevronDown className="h-6 w-6 text-purple-500" />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
