"use client"

import { useState, useEffect, useRef } from "react"
import Cookies from "js-cookie";
import { motion } from "framer-motion"
import { ChevronRight, ExternalLink, Code, Database, LineChart, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Chatbot from "@/components/Chatbot"
import AnimatedCompanyLogos from "@/components/AnimatedCompanyLogos"
import BackgroundAnimation from "@/components/BackgroundAnimation"

const techDomains = [
  {
    name: "Software Engineering",
    companies: [
      { name: "Microsoft", salary: "₹25-55 LPA" },
      { name: "Meta", salary: "₹30-65 LPA" },
      { name: "Amazon", salary: "₹25-50 LPA" },
      { name: "Oracle", salary: "₹18-40 LPA" },
    ],
  },
  {
    name: "AIML/DS",
    companies: [
      { name: "Google", salary: "₹30-60 LPA" },
      { name: "Amazon", salary: "₹25-50 LPA" },
      { name: "IBM", salary: "₹20-45 LPA" },
      { name: "Microsoft", salary: "₹28-55 LPA" },
    ],
  },
  {
    name: "Cybersecurity",
    companies: [
      { name: "Palo Alto Networks", salary: "₹20-45 LPA" },
      { name: "Cisco", salary: "₹18-40 LPA" },
      { name: "FireEye", salary: "₹15-35 LPA" },
      { name: "CrowdStrike", salary: "₹18-42 LPA" },
    ],
  },
  {
    name: "Blockchain",
    companies: [
      { name: "Coinbase", salary: "₹25-50 LPA" },
      { name: "ConsenSys", salary: "₹20-45 LPA" },
      { name: "Ripple", salary: "₹22-48 LPA" },
      { name: "Binance", salary: "₹20-45 LPA" },
    ],
  },
  {
    name: "UX/UI",
    companies: [
      { name: "Apple", salary: "₹25-55 LPA" },
      { name: "Adobe", salary: "₹20-45 LPA" },
      { name: "Airbnb", salary: "₹22-48 LPA" },
      { name: "Figma", salary: "₹18-40 LPA" },
    ],
  },
  {
    name: "Full Stack Development",
    companies: [
      { name: "Netflix", salary: "₹30-60 LPA" },
      { name: "Uber", salary: "₹25-50 LPA" },
      { name: "Shopify", salary: "₹20-45 LPA" },
      { name: "Spotify", salary: "₹22-48 LPA" },
    ],
  },
]

export default function HOME() {
  const [mounted, setMounted] = useState(false)
  const [selectedDomain, setSelectedDomain] = useState<string>("Software Engineering");
  const domainSectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleDomainClick = (domainName: string) => {
    setSelectedDomain(domainName);
  }

  const handleGenerateRoadmap = (domain: string) => {
    const selectedDomainData = techDomains.find((d) => d.name === domain)
    if (selectedDomainData) {
      Cookies.set(
        "selectedCareerPath",
        JSON.stringify({
          domain: selectedDomainData.name,
          companies: selectedDomainData.companies,
        }),
        { expires: 7 }
      );
      window.location.href = "/roadmap"
    }
  }

  const scrollToDomainSection = () => {
    domainSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <BackgroundAnimation />
        <Header />
        <main className="container mx-auto px-4">
          <section className="py-20 text-center">
            <motion.h2
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Shape Your Future in Tech
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Guiding college students to land their dream jobs in top tech companies
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button size="lg" onClick={scrollToDomainSection}>
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </section>

          <section className="py-16">
            <h3 className="text-2xl font-semibold text-center mb-8">Prepare for Top Companies</h3>
            <AnimatedCompanyLogos />
          </section>

          <section className="py-16">
            <h3 className="text-2xl font-semibold text-center mb-8">How We Help You Succeed</h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Career Guidance", description: "Personalized advice to help you choose the right path" },
                { title: "Skill Development", description: "Curated resources to build in-demand tech skills" },
                { title: "Interview Preparation", description: "Mock interviews and tips from industry experts" },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="bg-card text-card-foreground p-6 rounded-lg shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                >
                  <h4 className="text-xl font-semibold mb-4">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </section>

          <section ref={domainSectionRef} className="py-16 mb-8">
            <h3 className="text-2xl font-semibold text-center mb-10">Explore Tech Career Paths</h3>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {techDomains.map((domain, index) => (
                <motion.div
                  key={domain.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={selectedDomain === domain.name ? "default" : "outline"}
                    size="lg"
                    className={`text-md font-medium px-6 py-6 ${selectedDomain === domain.name ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"}`}
                    onClick={() => handleDomainClick(domain.name)}
                  >
                    {domain.name}
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Selected Domain Companies */}
            {selectedDomain && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
              >
                <Card className="bg-black/5 backdrop-blur-md border-none shadow-xl">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-2xl font-bold">{selectedDomain} Companies</h4>
                      <Badge variant="outline" className="px-3 py-1">
                        Top Employers
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {techDomains
                        .find((d) => d.name === selectedDomain)
                        ?.companies.map((company, index) => (
                          <motion.div
                            key={company.name}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <Card className="bg-white/20 backdrop-blur-md border-none overflow-hidden">
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center">
                                  <h5 className="text-lg font-semibold">{company.name}</h5>
                                  <Badge variant="secondary" className="bg-primary/20">
                                    {company.salary}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                    </div>

                    <div className="text-center">
                      <p className="text-muted-foreground mb-4">
                        ...and many more companies offering competitive packages
                      </p>
                      <Button
                        onClick={() => handleGenerateRoadmap(selectedDomain)}
                        className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                      >
                        Generate Career Roadmap
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </section>

          <motion.div
            className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              {
                icon: <Code className="h-10 w-10 text-purple-500" />,
                title: "Software Engineering",
                description: "Master coding skills needed for top tech companies",
              },
              {
                icon: <Database className="h-10 w-10 text-blue-500" />,
                title: "Data Science",
                description: "Learn analytics and machine learning fundamentals",
              },
              {
                icon: <Shield className="h-10 w-10 text-green-500" />,
                title: "Cybersecurity",
                description: "Develop skills to protect digital assets",
              },
              {
                icon: <LineChart className="h-10 w-10 text-orange-500" />,
                title: "Product Management",
                description: "Build, launch and scale successful products",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700"
                whileHover={{
                  y: -5,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            className="mt-24 bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Share Your Goals",
                  description: "Tell us about your experience and career aspirations",
                },
                {
                  step: "2",
                  title: "Select Target Companies",
                  description: "Choose from our database of top tech companies",
                },
                {
                  step: "3",
                  title: "Follow Your Roadmap",
                  description: "Get a personalized learning path to achieve your goals",
                },
              ].map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center text-white font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300">{step.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <section className="py-20 text-center">
            <h3 className="text-3xl font-bold mb-6">Ready to Launch Your Tech Career?</h3>
            <p className="text-xl text-muted-foreground mb-8">
              Join logikxmind today and take the first step towards your dream job
            </p>
            <Button size="lg">
              Start Your Journey
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </section>
        </main>
        <Chatbot />
        <footer className="bg-muted py-6 mt-16">
          <div className="container mx-auto px-4 text-center text-muted-foreground">
            © 2025 logikxmind. All rights reserved.
          </div>
        </footer>
      </div>
    </>
  )
}

