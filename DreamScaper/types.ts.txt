
export enum AppState {
  LANDING = 'LANDING',
  INPUT = 'INPUT',
  PROCESSING = 'PROCESSING',
  RESULT = 'RESULT',
  ERROR = 'ERROR',
  BILLING = 'BILLING'
}

export type SubscriptionStatus = 'NONE' | 'TRIALING' | 'ACTIVE' | 'CANCELED';

export interface User {
  id: string;
  email: string;
  name: string;
  subscriptionStatus: SubscriptionStatus;
  trialEndsAt?: string;
}

export interface LandscapingStyle {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
}

export interface GeneratedResult {
  originalImage: string;
  generatedImage: string;
  promptUsed: string;
}

export interface UserInput {
  image: string | null;
  prompt: string;
  styleId: string;
}
