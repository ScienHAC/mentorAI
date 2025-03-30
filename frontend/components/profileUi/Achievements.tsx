import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star } from "lucide-react";

const achievements = [
  { id: 1, title: "First Project Completed", xp: 100, unlocked: true },
  { id: 2, title: "Coding Streak: 7 Days", xp: 50, unlocked: true },
  { id: 3, title: "Algorithm Master", xp: 200, unlocked: false },
  { id: 4, title: "Open Source Contributor", xp: 150, unlocked: false },
];

export default function Achievements() {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Achievements</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={achievement.id}
              className="animate-fade-scale"
              style={{ 
                animationDelay: `${index * 100}ms`,
                opacity: 0,
                transform: "scale(0.9)"
              }}
            >
              <Card
                className={`${
                  achievement.unlocked 
                    ? "bg-emerald-50 dark:bg-emerald-900/20" 
                    : "bg-gray-100 dark:bg-gray-800/50"
                } transition-all hover:shadow-md`}
              >
                <CardContent className="p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
                  <div 
                    className={`p-2 rounded-full flex-shrink-0 ${
                      achievement.unlocked ? "bg-emerald-500" : "bg-gray-400"
                    }`}
                  >
                    {achievement.unlocked ? (
                      <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    ) : (
                      <Star className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">
                      {achievement.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {achievement.unlocked 
                        ? `${achievement.xp} XP Earned` 
                        : "Locked"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </CardContent>
      <style jsx global>{`
        @keyframes fadeScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-scale {
          animation: fadeScale 0.5s ease-out forwards;
        }
      `}</style>
    </Card>
  );
}