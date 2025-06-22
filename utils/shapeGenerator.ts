import type { Point3D, ShapeType } from '../types';

interface ShapeGeneratorParams {
  audioData: number[];
  shapeType: ShapeType;
  screenWidth: number;
  screenHeight: number;
  options?: {
    minSize?: number;
    maxSize?: number;
    radiusMultiplier?: number;
  };
}

export const audioToShape = ({
  audioData,
  shapeType,
  screenWidth,
  screenHeight,
  options = {},
}: ShapeGeneratorParams): Point3D[] => {
  const {
    minSize = 2,
    maxSize = 20,
    radiusMultiplier = 1.5,
  } = options;

  const points: Point3D[] = [];
  const centerX = screenWidth / 2;
  const centerY = screenHeight / 2;
  
  audioData.forEach((amplitude, index) => {
    const angle = (index / audioData.length) * Math.PI * 2;
    const normalizedAmplitude = amplitude / 100;
    const size = minSize + (amplitude / 100) * (maxSize - minSize);
    
    let point: Point3D;
    
    switch (shapeType) {
      case 'spiral':
        const spiralRadius = 30 + (index / audioData.length) * 120;
        const spiralAngle = angle * 3;
        point = {
          x: centerX + Math.cos(spiralAngle) * spiralRadius * normalizedAmplitude,
          y: centerY + Math.sin(spiralAngle) * spiralRadius * normalizedAmplitude,
          z: amplitude,
          size,
        };
        break;
        
      case 'flower':
        const petals = 8;
        const petalRadius = 80 + Math.sin(angle * petals) * 40;
        point = {
          x: centerX + Math.cos(angle) * petalRadius * normalizedAmplitude,
          y: centerY + Math.sin(angle) * petalRadius * normalizedAmplitude,
          z: amplitude,
          size,
        };
        break;
        
      case 'mountain':
        const mountainWidth = screenWidth * 0.8;
        const mountainHeight = amplitude * 3;
        point = {
          x: centerX - mountainWidth / 2 + (index / audioData.length) * mountainWidth,
          y: centerY + 100 - mountainHeight,
          z: amplitude,
          size: Math.max(3, size / 2),
        };
        break;
        
      default: // wave
        const radius = 60 + amplitude * radiusMultiplier;
        point = {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          z: amplitude,
          size,
        };
    }
    
    points.push(point);
  });
  
  return points;
};