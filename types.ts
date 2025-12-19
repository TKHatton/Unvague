
export enum ContextMode {
  WORK = 'Work',
  SCHOOL = 'School',
  FAMILY = 'Family',
  DATING = 'Dating',
  FRIENDSHIP = 'Friendship',
  HEALTHCARE = 'Healthcare'
}

export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export interface ResponseOption {
  type: 'Direct' | 'Clarifying' | 'Delayed' | 'Minimal' | 'Boundary-setting' | 'Decline';
  wording: string;
  toneDescription: string;
  socialImpact: string;
  riskLevel: number;
}

export interface AnalysisResult {
  id: string;
  timestamp: number;
  originalText: string;
  mode: ContextMode;
  whatWasSaid: string; // Mandatory literal restatement
  whatIsExpected: string[];
  whatIsOptional: string[];
  whatCarriesRisk: string[];
  whatIsNotAskingFor: string[];
  hiddenRules: string[];
  confidence: {
    level: ConfidenceLevel;
    reason: string;
  };
  riskMeter: {
    score: number;
    explanation: string;
  };
  responseSupport: ResponseOption[];
}

export interface AppState {
  currentAnalysis: AnalysisResult | null;
  history: AnalysisResult[];
  isAnalyzing: boolean;
  error: string | null;
  activeMode: ContextMode;
  showInsights: boolean;
}
