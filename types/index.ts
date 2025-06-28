import { icons } from "lucide-react-native";

export interface Point3D {
  x: number;
  y: number;
  z: number;
  size: number;
}

export interface AudioData {
  amplitude: number;
  frequency?: number;
  timestamp: number;
}

export interface Sculpture {
  id: number;
  audioData: number[];
  shapeType: ShapeType;
  color: string;
  points: Point3D[];
  duration: number;
  createdAt: string;
  uri?: string;
  name?: string;
  thumbnail?: string;
}

export type ShapeType = "wave" | "spiral" | "flower" | "mountain" | "galaxy" | "crystal" | "dna" | "mandala" | "tornado" | "3d" | "all";

export interface ShapeTypeConfig {
  id: ShapeType;
  name: string;
  icon: keyof typeof icons;
  description?: string;
  imageUrl?: string;
}

export interface AudioAnalysisResult {
  uri: string;
  audioData: number[];
  duration: number;
}

export interface RecordingState {
  isRecording: boolean;
  duration: number;
  isPaused: boolean;
}

export interface ExportFormat {
  id: string;
  name: string;
  extension: string;
  icon: keyof typeof icons;
  description: string;
  mimeType: string;
}