"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

// Your custom AuthProvider hook
import { useAuth } from "@/auth/AuthProvider";

export default function Settings() {
  // 1. Grab the Supabase client and the current user from your AuthProvider
  const { supabase, user } = useAuth();

  // 2. Local state for user settings
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [publicProfile, setPublicProfile] = useState(false);
  const [aiAssistant, setAiAssistant] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Track loading, saving and error states
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // 3. Fetch existing user settings when user logs in
  useEffect(() => {
    if (!user) return;
    fetchUserSettings();
  }, [user, fetchUserSettings]);

  async function fetchUserSettings() {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("id, email_notifications, public_profile, ai_learning_assistant")
        .eq("user_id", user.id)
        .single();

      if (error) {
        // PGRST116 means no rows found - this is expected for new users
        if (error.code === "PGRST116") {
          // For new users, we'll create a settings record when they toggle a setting
          console.log("No settings found for user, will create on first update");
        } else {
          console.error("Error fetching user settings:", error.message);
          toast({
            title: "Error loading settings",
            description: "Your settings could not be loaded. Please try again later.",
            variant: "destructive",
          });
        }
        return;
      }

      // Update local state with fetched settings
      if (data) {
        setSettingsId(data.id);
        setEmailNotifications(data.email_notifications);
        setPublicProfile(data.public_profile);
        setAiAssistant(data.ai_learning_assistant);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({
        title: "Error loading settings",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  // 4. Save user settings - using insert or update based on whether we have an ID
  async function saveSettings({
    newEmailNotifications,
    newPublicProfile,
    newAiAssistant,
  }: {
    newEmailNotifications: boolean;
    newPublicProfile: boolean;
    newAiAssistant: boolean;
  }) {
    if (!user?.id) return;

    setSaving(true);
    try {
      let error;

      if (settingsId) {
        // If we have a settings ID, update the existing record
        const { error: updateError } = await supabase
          .from("user_settings")
          .update({
            email_notifications: newEmailNotifications,
            public_profile: newPublicProfile,
            ai_learning_assistant: newAiAssistant,
            updated_at: new Date().toISOString(),
          })
          .eq("id", settingsId);

        error = updateError;
      } else {
        // If no settings ID, insert a new record
        const { error: insertError, data } = await supabase
          .from("user_settings")
          .insert({
            user_id: user.id,
            email_notifications: newEmailNotifications,
            public_profile: newPublicProfile,
            ai_learning_assistant: newAiAssistant,
          })
          .select("id");

        error = insertError;

        // If insert was successful, store the new ID
        if (!insertError && data && data.length > 0) {
          setSettingsId(data[0].id);
        }
      }

      if (error) {
        console.error("Error saving user settings:", error.message);
        toast({
          title: "Error saving settings",
          description: "Your settings could not be saved. Please try again.",
          variant: "destructive",
        });

        // Revert local state on error
        fetchUserSettings();
        return false;
      }

      toast({
        title: "Settings updated",
        description: "Your preferences have been saved successfully.",
      });
      return true;
    } catch (err) {
      console.error("Unexpected error during save:", err);
      toast({
        title: "Error saving settings",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }

  // 5. Generic toggle handler
  async function handleToggle(setting: "notifications" | "public" | "ai", value: boolean) {
    // Optimistically update UI
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

    // Save changes to DB
    const success = await saveSettings({
      newEmailNotifications: updatedEmail,
      newPublicProfile: updatedPublic,
      newAiAssistant: updatedAi,
    });
    console.log("Settings saved:", success);

    // If save fails, we'll revert in the saveSettings function
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
              disabled={loading || saving}
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
              disabled={loading || saving}
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
              disabled={loading || saving}
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