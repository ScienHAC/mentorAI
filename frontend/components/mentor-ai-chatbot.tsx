"use client"

import { motion } from "framer-motion"
import { Sparkles, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MentorAIChatbot() {
    return (
        <section className="py-16 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-2xl my-16">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <h2 className="text-3xl font-bold mb-4">Meet Your AI Career Mentor</h2>
                            <p className="text-lg mb-6">
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
                                    MentorAI
                                </span>{" "}
                                provides personalized guidance tailored to your skills, goals, and target companies.
                            </p>
                            <ul className="space-y-3 mb-6">
                                {[
                                    "Personalized learning paths based on your career goals",
                                    "Company-specific interview preparation",
                                    "Technical skill development recommendations",
                                    "24/7 guidance and support throughout your journey",
                                ].map((feature, index) => (
                                    <motion.li
                                        key={index}
                                        className="flex items-start"
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.3, delay: 0.1 * index }}
                                    >
                                        <div className="mr-2 mt-1 bg-purple-100 dark:bg-purple-900/30 rounded-full p-1">
                                            <svg className="h-3 w-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <span>{feature}</span>
                                    </motion.li>
                                ))}
                            </ul>
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
                            >
                                <Sparkles className="mr-2 h-4 w-4" />
                                Try MentorAI Now
                            </Button>
                        </motion.div>
                    </div>

                    <div className="md:w-1/2">
                        <motion.div
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 text-white">
                                <h3 className="font-bold flex items-center">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    MentorAI Chat
                                </h3>
                            </div>
                            <div className="p-4 h-80 overflow-y-auto flex flex-col space-y-4">
                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                                    <p className="text-sm">
                                        Hi there! I&apos;m your MentorAI assistant. How can I help with your tech career today?
                                    </p>
                                </div>

                                <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-3 rounded-lg rounded-tr-none max-w-[80%] self-end text-white">
                                    <p className="text-sm">
                                        I want to prepare for software engineering roles at Google. Where should I start?
                                    </p>
                                </div>

                                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg rounded-tl-none max-w-[80%]">
                                    <p className="text-sm">
                                        Great goal! For Google SWE roles, I recommend starting with these key areas:
                                    </p>
                                    <ol className="list-decimal pl-5 mt-2 text-sm space-y-1">
                                        <li>Data Structures & Algorithms (focus on efficiency)</li>
                                        <li>System Design fundamentals</li>
                                        <li>Google&apos;s coding practices and engineering culture</li>
                                    </ol>
                                    <p className="text-sm mt-2">
                                        Would you like me to create a personalized 12-week study plan for you?
                                    </p>
                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="Ask MentorAI anything..."
                                        className="flex-1 bg-gray-100 dark:bg-gray-700 border-none rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    <button className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-2 rounded-r-lg">
                                        <Send className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}