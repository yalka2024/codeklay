// packages/types/src/index.ts

export interface UserProfile {
  id: string;
  codingPatterns: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  preferredLanguages: string[];
}

export interface CodeSuggestion {
  code: string;
  explanation: string;
} 