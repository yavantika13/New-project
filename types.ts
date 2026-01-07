
export enum SoundType {
  WILDLIFE = 'Wildlife',
  LOGGING = 'Chainsaw/Logging',
  POACHING = 'Poaching/Gunshot',
  FIRE = 'Forest Fire',
  VEHICLE = 'Vehicle Intrusion',
  HUMAN = 'Human Presence',
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
  detectedSound: string;
  detectedSpecies?: string;
  confidence: number;
  riskLevel: RiskLevel;
  audioBlobUrl?: string;
  details: string;
  explanation: string;
  status: 'Under Threat' | 'Wildlife Activity' | 'Safe' | 'Caution';
}

export interface DashboardStats {
  totalDetections: number;
  activeThreats: number;
  wildlifeActivityIndex: number; // 0-100
  forestSafetyStatus: 'Secure' | 'Caution' | 'Under Threat';
}
