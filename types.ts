
export enum SoundType {
  WILDLIFE = 'Wildlife',
  LOGGING = 'Chainsaw/Logging',
  POACHING = 'Poaching/Gunshot',
  FIRE = 'Forest Fire',
  BACKGROUND = 'Normal Background',
  UNKNOWN = 'Analyzing...'
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface DetectionEvent {
  id: string;
  timestamp: number;
  type: SoundType;
  confidence: number;
  riskLevel: RiskLevel;
  audioBlobUrl?: string;
  details: string;
}

export interface DashboardStats {
  totalDetections: number;
  activeThreats: number;
  wildlifeActivityIndex: number; // 0-100
  forestSafetyStatus: 'Secure' | 'Caution' | 'Under Threat';
}
