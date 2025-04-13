"use client"

import { motion } from "framer-motion"
import { Github, User, Building, Map } from "lucide-react"
import AnimatedChevron from "./animated-chevron"

export default function OnboardingSteps() {
  const steps = [
    {
      step: "1",
      title: "Login via GitHub",
      description: "Securely sign in with your GitHub account to get started",
      icon: Github,
    },
    {
      step: "2",
      title: "Complete Onboarding",
      description: "Tell us about your experience and career aspirations",
      icon: User,
    },
    {
      step: "3",
      title: "Select Companies",
      description: "Choose from our database of top tech companies",
      icon: Building,
    },
    {
      step: "4",
      title: "Follow Your Roadmap",
      description: "Get a personalized learning path to achieve your goals",
      icon: Map,
    },
  ]

  return (
    <div className="py-16 px-4">
      <h2 className="text-3xl font-bold mb-12 text-center">Your Journey with MentorAI</h2>

      <div className="max-w-5xl mx-auto">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            className="flex flex-col md:flex-row items-center mb-16 relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            {/* Step Number */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-2xl mb-4 md:mb-0 md:mr-8 flex-shrink-0 z-10">
              {step.step}
            </div>

            {/* Content */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 w-full md:ml-4">
              <div className="flex items-center mb-3">
                <step.icon className="h-6 w-6 text-purple-500 mr-3" />
                <h3 className="text-xl font-bold">{step.title}</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
            </div>

            {/* Connector Line (only show between steps) */}
            {index < steps.length - 1 && (
              <div className="absolute left-10 top-20 h-16 md:h-[calc(100%+64px)] w-0.5 bg-gradient-to-b from-purple-500 to-blue-500 z-0"></div>
            )}

            {/* Animated Chevron (only show between steps) */}
            {index < steps.length - 1 && (
              <div className="absolute left-10 top-[5.5rem] md:top-24 transform -translate-x-1/2 z-20">
                <AnimatedChevron count={1} size={6} />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Final Destination */}
      <motion.div
        className="max-w-5xl mx-auto bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-8 rounded-xl shadow-lg border border-purple-200 dark:border-purple-800 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-2xl font-bold mb-4">Ready to Launch Your Tech Career?</h3>
        <p className="text-lg mb-0">With MentorAI by your side, you're on the path to success!</p>
      </motion.div>
    </div>
  )
}
