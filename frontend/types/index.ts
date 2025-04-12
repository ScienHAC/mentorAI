export interface User {
  id: string;
  email?: string;
  name?: string;
  user_metadata?: {
    avatar_url?: string;
    full_name?: string;
    onboarded?: boolean;
    career_goal?: string;
    experience_level?: string;
    preferred_domains?: string[];
    [key: string]: any; // To allow for any other properties in user_metadata
  };
  [key: string]: any; // To allow for any other properties directly on user
}

export type Company = {
  id: string
  company_name: string
  position: string
  domain: string
  coding_languages: Record<string, string>
  dsa_level: number
  system_design: Record<string, string>
  non_technical_skills: string[]
  ug_compensation: number
  pg_compensation: number
  key_responsibilities: string[]
  subjects_to_study: string[]
  technical_questions: string[]
  created_at: string
}

export type Domain = {
  id: string
  name: string
  description: string
  icon: string
}

export type UserPreference = {
  id: string
  user_id: string
  target_companies: string[]
  target_domains: string[]
  target_skills: string[]
  created_at: string
}

export type Roadmap = {
  id: string
  user_id: string
  title: string
  description: string
  milestones: Milestone[]
  created_at: string
}

export type Milestone = {
  id: string
  title: string
  description: string
  resources: Resource[]
  completed: boolean
  order: number
}

export type Resource = {
  id: string
  title: string
  type: "video" | "article" | "course" | "book"
  url: string
}
