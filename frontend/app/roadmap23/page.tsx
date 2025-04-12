"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/header";
import RoadmapComponent from "@/components/roadmap/RoadmapComponent";
import QueryProvider from "@/components/providers/QueryProvider";

type Segment = {
    name: string;
    items: string[];
};

const companySegments: Segment[] = [
    {
        name: "1-8 LPA",
        items: ["TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "Cognizant"],
    },
    {
        name: "15-30 LPA",
        items: ["IBM", "Accenture", "Deloitte", "Capgemini", "Oracle", "SAP"],
    },
    {
        name: "50 LPA+ (FAANG)",
        items: ["Facebook", "Amazon", "Apple", "Netflix", "Google", "Microsoft"],
    },
    {
        name: "Others (Startups)",
        items: ["Uber", "Airbnb", "Stripe", "Slack", "Zoom", "Twilio"],
    },
];

const skillSegments: Segment[] = [
    {
        name: "Programming",
        items: ["Python", "JavaScript", "Java", "C++", "Ruby", "Go"],
    },
    {
        name: "Soft Skills",
        items: ["Communication", "Leadership", "Problem Solving", "Time Management", "Teamwork", "Adaptability"],
    },
    {
        name: "Frameworks",
        items: ["React", "Angular", "Vue.js", "Django", "Spring Boot", "Express.js"],
    },
    {
        name: "Additional Skills",
        items: ["Machine Learning", "DevOps", "Cloud Computing", "Blockchain", "UI/UX Design", "Data Analysis"],
    },
];

export default function Dashboard() {
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const [phase, setPhase] = useState<"companies" | "skills" | "roadmap">("companies");

    const handleMouseMove = (e: React.MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleItemSelect = (
        item: string,
        currentSelection: string[],
        setSelection: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setSelection((prev) => {
            if (prev.includes(item)) {
                return prev.filter((c) => c !== item);
            } else {
                const segmentItems =
                    (phase === "companies" ? companySegments : skillSegments).find((s) => s.items.includes(item))?.items || [];
                const segmentSelections = prev.filter((c) => segmentItems.includes(c));
                if (segmentSelections.length < 3 && prev.length < 12) {
                    return [...prev, item];
                }
                return prev;
            }
        });
    };

    const isNextEnabled = phase === "companies" ? selectedCompanies.length >= 4 : selectedSkills.length >= 4;

    const handleNext = () => {
        if (phase === "companies") {
            setPhase("skills");
        } else if (phase === "skills") {
            console.log("Companies selected:", selectedCompanies);
            console.log("Skills selected:", selectedSkills);
            setPhase("roadmap");
        }
    };

    const handleBack = () => {
        if (phase === "skills") {
            setPhase("companies");
        }
    };

    const renderSegments = (
        segments: Segment[],
        selectedItems: string[],
        setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
    ) => (
        <div className="flex flex-col md:flex-row justify-center items-start space-y-6 md:space-y-0 md:space-x-6 relative">
            {segments.map((segment, index) => (
                <div key={segment.name} className="w-full md:w-1/4 relative">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-purple-200 rounded-lg -z-10" />
                        <h3 className="text-lg font-semibold mb-4 text-center py-2 bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-t-lg">
                            {segment.name}
                        </h3>
                        <div className="space-y-2 p-4">
                            {segment.items.map((item) => (
                                <Button
                                    key={item}
                                    variant={selectedItems.includes(item) ? "default" : "outline"}
                                    className="w-full justify-start transition-all duration-200 ease-in-out transform hover:scale-105 hover:shadow-md"
                                    onClick={() => handleItemSelect(item, selectedItems, setSelectedItems)}
                                >
                                    {item}
                                </Button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            ))}
        </div>
    );

    // 👇 Conditionally rendering based on the phase 👇
    return (
        <>
            {phase === "roadmap" ? (
                <QueryProvider>
                    <RoadmapComponent />
                </QueryProvider>
            ) : (
                // 🌟 Normal companies/skills phase layout
                <div
                    className="min-h-screen flex flex-col bg-background text-foreground"
                    onMouseMove={handleMouseMove}
                >
                    <Header />
                    <main className="flex-grow container my-8">
                        <motion.div
                            className="absolute z-0"
                            style={{
                                background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.3) 0%, transparent 50%)`,
                            }}
                        />
                        <Card className="mx-auto max-w-6xl bg-white/90 backdrop-blur-md shadow-2xl relative z-10">
                            <CardContent className="p-6">
                                {phase === "skills" && (
                                    <button
                                        onClick={handleBack}
                                        className="flex items-center text-gray-800 hover:underline group transition-all"
                                    >
                                        <ChevronLeft className="h-6 w-6 transition-transform group-hover:-translate-x-1" />
                                        <span className="ml-2">Back</span>
                                    </button>
                                )}

                                <h1 className="text-4xl font-bold text-center mb-12 text-gray-800 relative">
                                    {phase === "companies"
                                        ? "Select Your Target Companies"
                                        : "Select Skills to Upgrade"}
                                </h1>

                                <div className="relative mb-8">
                                    <div className="absolute left-1/2 -translate-x-1/2 h-8 w-px bg-gradient-to-b from-blue-400 to-purple-400" />
                                    <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400" />
                                    <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-4 bg-gradient-to-b from-purple-400 to-transparent" />
                                </div>

                                {phase === "companies"
                                    ? renderSegments(companySegments, selectedCompanies, setSelectedCompanies)
                                    : renderSegments(skillSegments, selectedSkills, setSelectedSkills)}

                                <div className="mt-8 flex justify-between items-center">
                                    <p className="text-sm text-gray-600">
                                        Selected:{" "}
                                        {phase === "companies"
                                            ? selectedCompanies.length
                                            : selectedSkills.length}{" "}
                                        / 12 (Min: 4)
                                    </p>
                                    <Button
                                        disabled={!isNextEnabled}
                                        onClick={handleNext}
                                        className="group bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white transition-all duration-300"
                                    >
                                        {phase === "companies" ? "Next" : "Submit"}
                                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </main>

                    <footer className="bg-muted py-6">
                        <div className="container mx-auto px-4 text-center text-muted-foreground">
                            © 2025 logikxmind. All rights reserved.
                        </div>
                    </footer>
                </div>
            )}
        </>
    );

}
