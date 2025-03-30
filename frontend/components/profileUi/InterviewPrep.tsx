import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Users } from "lucide-react";

const prepAreas = [
  { id: 1, title: "Algorithms", icon: Code, color: "text-blue-500" },
  { id: 2, title: "System Design", icon: Users, color: "text-green-500" },
  { id: 3, title: "Behavioral", icon: BookOpen, color: "text-purple-500" },
];

export default function InterviewPrep() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Interview Preparation</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {prepAreas.map((area, index) => (
            <div
              key={area.id}
              className="fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
                opacity: 0,
                transform: "translateY(20px)",
              }}
            >
              <Card className="h-full">
                <CardContent className="p-4 sm:p-6 flex flex-col items-center text-center h-full justify-between">
                  <div className="flex flex-col items-center">
                    <area.icon className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${area.color} mb-2 sm:mb-4`} />
                    <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">{area.title}</h3>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 w-full sm:w-auto">
                    Start Practice
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </Card>
  );
}