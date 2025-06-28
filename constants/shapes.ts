import { ShapeTypeConfig } from "@/types";

export const shapeTypes: ShapeTypeConfig[] = [
  {
    id: "wave",
    name: "Wave",
    icon: "Waves",
    description: "Circular wave form",
    imageUrl: "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "spiral",
    name: "Spiral",
    icon: "Rotate3d",
    description: "Growing spiral",
    imageUrl: "https://images.pexels.com/photos/1029624/pexels-photo-1029624.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "flower",
    name: "Flower",
    icon: "Flower",
    description: "Floral pattern",
    imageUrl: "https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "mountain",
    name: "Mountain",
    icon: "MountainSnow",
    description: "Mountain profile",
    imageUrl: "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "galaxy",
    name: "Galaxy",
    icon: "Sparkles",
    description: "Cosmic spiral pattern",
    imageUrl: "https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "crystal",
    name: "Crystal",
    icon: "Gem",
    description: "Crystalline structure",
    imageUrl: "https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "dna",
    name: "DNA",
    icon: "Dna",
    description: "Double helix pattern",
    imageUrl: "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "mandala",
    name: "Mandala",
    icon: "CircleDot",
    description: "Sacred geometry",
    imageUrl: "https://images.pexels.com/photos/1020315/pexels-photo-1020315.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "tornado",
    name: "Tornado",
    icon: "Tornado",
    description: "Vortex pattern",
    imageUrl: "https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
  {
    id: "3d",
    name: "3D",
    icon: "Diameter",
    description: "3D pattern",
    imageUrl: "https://images.pexels.com/photos/1029641/pexels-photo-1029641.jpeg?auto=compress&cs=tinysrgb&w=400"
  },
];

export const shapesFilter: ShapeTypeConfig[] = [
  {
    id: "all",
    name: "All",
    icon: "Funnel",
    description: "All sculptures",
    imageUrl: ""
  },
  ...shapeTypes,
];

export const shapeColors: string[] = [
  "#FF6B6B", // Coral Red
  "#4ECDC4", // Turquoise
  "#45B7D1", // Sky Blue
  "#96CEB4", // Mint Green
  "#FFEAA7", // Warm Yellow
  "#DDA0DD", // Plum
  "#98D8C8", // Seafoam
  "#F7DC6F", // Golden Yellow
  "#FF8A80", // Light Red
  "#80CBC4", // Teal
  "#A5D6A7", // Light Green
  "#FFCC80", // Peach
  "#CE93D8", // Light Purple
  "#90CAF9", // Light Blue
  "#FFAB91", // Deep Orange
  "#B39DDB", // Deep Purple
];

export const exportFormats = [
  {
    id: 'obj',
    name: 'OBJ (3D Model)',
    extension: '.obj',
    icon: 'Box',
    description: 'For 3D printing and modeling software',
    mimeType: 'application/octet-stream'
  },
  {
    id: 'stl',
    name: 'STL (3D Print)',
    extension: '.stl',
    icon: 'Printer',
    description: 'Standard format for 3D printing',
    mimeType: 'application/octet-stream'
  },
  {
    id: 'png',
    name: 'PNG (Image)',
    extension: '.png',
    icon: 'Image',
    description: 'High quality image export',
    mimeType: 'image/png'
  },
  {
    id: 'svg',
    name: 'SVG (Vector)',
    extension: '.svg',
    icon: 'Shapes',
    description: 'Scalable vector graphics',
    mimeType: 'image/svg+xml'
  },
  {
    id: 'json',
    name: 'JSON (Data)',
    extension: '.json',
    icon: 'FileJson',
    description: 'Raw sculpture data',
    mimeType: 'application/json'
  },
  {
    id: 'audio',
    name: 'Audio (Original)',
    extension: '.m4a',
    icon: 'Music',
    description: 'Original audio recording',
    mimeType: 'audio/mp4'
  }
];