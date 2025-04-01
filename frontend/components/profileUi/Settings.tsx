"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Your custom AuthProvider hook
import { useAuth } from "@/auth/AuthProvider";

export default function Settings() {
  // 1. Grab the Supabase client and the current user from your AuthProvider
  const { supabase, user } = useAuth();

  // 2. Local state for user settings
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);
  const [aiAssistant, setAiAssistant] = useState(false);

  // Optional: track loading or error states
  const [loading, setLoading] = useState(false);

  // 3. Fetch existing user settings when user logs in
  useEffect(() => {
    if (!user) return;
    fetchUserSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  async function fetchUserSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("email_notifications, public_profile, ai_learning_assistant")
        .eq("user_id", user.id)
        .single(); // Expecting at most one row

      // If no row found, data will be null (error.code might be "PGRST116")
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user settings:", error.message);
      }

      if (data) {
        setEmailNotifications(data.email_notifications);
        setPublicProfile(data.public_profile);
        setAiAssistant(data.ai_learning_assistant);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }

  // 4. Upsert user settings
  //    This will create the row if it doesn't exist, or update if it does.
  async function upsertSettings({
    newEmailNotifications,
    newPublicProfile,
    newAiAssistant,
  }: {
    newEmailNotifications: boolean;
    newPublicProfile: boolean;
    newAiAssistant: boolean;
  }) {
    if (!user) return;

    // We rely on `upsert` with a matching user_id
    const { error } = await supabase.from("user_settings").upsert({
      user_id: user.id,
      email_notifications: newEmailNotifications,
      public_profile: newPublicProfile,
      ai_learning_assistant: newAiAssistant,
    },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Error upserting user settings:", error.message);
    }
  }

  // 5. Generic toggle handler
  function handleToggle(setting: "notifications" | "public" | "ai", value: boolean) {
    // Update local states
    let updatedEmail = emailNotifications;
    let updatedPublic = publicProfile;
    let updatedAi = aiAssistant;

    if (setting === "notifications") {
      updatedEmail = value;
      setEmailNotifications(value);
    } else if (setting === "public") {
      updatedPublic = value;
      setPublicProfile(value);
    } else if (setting === "ai") {
      updatedAi = value;
      setAiAssistant(value);
    }

    // Upsert changes to DB
    upsertSettings({
      newEmailNotifications: updatedEmail,
      newPublicProfile: updatedPublic,
      newAiAssistant: updatedAi,
    });
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Settings</CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <div className="space-y-4 sm:space-y-6 animate-fade-in">
          {/* Email Notifications */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <Label
              htmlFor="notifications"
              className="flex flex-col space-y-1 cursor-pointer"
            >
              <span className="font-medium text-sm sm:text-base">Email Notifications</span>
              <span className="font-normal text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Receive email updates about your progress
              </span>
            </Label>
            <Switch
              id="notifications"
              checked={emailNotifications}
              onCheckedChange={(checked) => handleToggle("notifications", checked)}
              disabled={loading}
              className="ml-0 mt-1 sm:mt-0"
            />
          </div>

          {/* Public Profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <Label
              htmlFor="public-profile"
              className="flex flex-col space-y-1 cursor-pointer"
            >
              <span className="font-medium text-sm sm:text-base">Public Profile</span>
              <span className="font-normal text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Allow others to see your profile
              </span>
            </Label>
            <Switch
              id="public-profile"
              checked={publicProfile}
              onCheckedChange={(checked) => handleToggle("public", checked)}
              disabled={loading}
              className="ml-0 mt-1 sm:mt-0"
            />
          </div>

          {/* AI Learning Assistant */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <Label
              htmlFor="ai-assistant"
              className="flex flex-col space-y-1 cursor-pointer"
            >
              <span className="font-medium text-sm sm:text-base">AI Learning Assistant</span>
              <span className="font-normal text-xs sm:text-sm text-gray-500 dark:text-gray-400 max-w-md">
                Enable AI-powered learning recommendations
              </span>
            </Label>
            <Switch
              id="ai-assistant"
              checked={aiAssistant}
              onCheckedChange={(checked) => handleToggle("ai", checked)}
              disabled={loading}
              className="ml-0 mt-1 sm:mt-0"
            />
          </div>
        </div>
      </CardContent>

      {/* Optional fade-in animation */}
      <style jsx global>{`
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
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </Card>
  );
}
