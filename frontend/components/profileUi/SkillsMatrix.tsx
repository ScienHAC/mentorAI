import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const skills = [
  { name: "JavaScript", level: 80, verified: true },
  { name: "React", level: 75, verified: true },
  { name: "Node.js", level: 70, verified: false },
  { name: "Python", level: 65, verified: true },
  { name: "SQL", level: 60, verified: false },
];

export default function SkillsMatrix() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Skills Matrix</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-6">
        <div className="space-y-4 sm:space-y-6">
          {skills.map((skill, index) => (
            <div
              key={skill.name}
              className="space-y-2"
              style={{
                opacity: 0,
                transform: "translateY(20px)",
                animation: `fadeIn 0.5s ease-out ${index * 0.1}s forwards`,
              }}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-medium text-sm sm:text-base">{skill.name}</span>
                  {skill.verified && <Badge variant="secondary" className="text-xs whitespace-nowrap">Verified</Badge>}
                </div>
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 dark:bg-gray-700">
                <div 
                  className="bg-emerald-500 h-2 sm:h-2.5 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Card>
  );
}