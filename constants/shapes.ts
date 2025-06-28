import { ShapeTypeConfig } from "@/types";

export const shapeTypes: ShapeTypeConfig[] = [
  {
    id: "wave",
    name: "Wave", // Will be translated in components
    icon: "Waves",
    description: "Circular wave form",
  },
  {
    id: "spiral",
    name: "Spiral",
    icon: "Rotate3d",
    description: "Growing spiral",
  },
  {
    id: "flower",
    name: "Flower",
    icon: "Flower",
    description: "Floral pattern",
  },
  {
    id: "mountain",
    name: "Mountain",
    icon: "MountainSnow",
    description: "Mountain profile",
  },
  {
    id: "3d",
    name: "3D",
    icon: "Diameter",
    description: "3D pattern",
  },
];

export const shapesFilter: ShapeTypeConfig[] = [
  {
    id: "all",
    name: "All", // Will be translated in components
    icon: "Funnel",
    description: "All sculptures",
  },
  ...shapeTypes,
];

export const shapeColors: string[] = [
  "#FF6B6B",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#98D8C8",
  "#F7DC6F",
];