import { ShapeTypeConfig } from "@/types";

export const shapeTypes: ShapeTypeConfig[] = [
  {
    id: "wave",
    name: "Onda",
    icon: "Waves",
    description: "Forma circular ondulante",
  },
  {
    id: "spiral",
    name: "Espiral",
    icon: "Rotate3d",
    description: "Espiral creciente",
  },
  {
    id: "flower",
    name: "Flor",
    icon: "Flower",
    description: "Patrón floral",
  },
  {
    id: "mountain",
    name: "Montaña",
    icon: "MountainSnow",
    description: "Perfil montañoso",
  },
  {
    id: "3d",
    name: "3D",
    icon: "Diameter",
    description: "Patron 3D",
  },
];

export const shapesFilter: ShapeTypeConfig[] = [
  {
    id: "all",
    name: "Todos",
    icon: "Funnel",
    description: "Todas las esculturas",
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
