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

      case 'galaxy':
        const galaxyArms = 3;
        const galaxyRadius = 40 + (index / audioData.length) * 100;
        const galaxyAngle = angle * galaxyArms + (index / audioData.length) * Math.PI * 4;
        const galaxyNoise = Math.sin(angle * 10) * 20;
        point = {
          x: centerX + Math.cos(galaxyAngle) * (galaxyRadius + galaxyNoise) * normalizedAmplitude,
          y: centerY + Math.sin(galaxyAngle) * (galaxyRadius + galaxyNoise) * normalizedAmplitude,
          z: amplitude + Math.sin(angle * 5) * 30,
          size: size * (0.5 + normalizedAmplitude),
        };
        break;

      case 'crystal':
        const crystalFaces = 6;
        const crystalRadius = 60 + amplitude * 1.2;
        const crystalAngle = Math.floor(angle * crystalFaces / (Math.PI * 2)) * (Math.PI * 2 / crystalFaces);
        const crystalHeight = amplitude * 2;
        point = {
          x: centerX + Math.cos(crystalAngle) * crystalRadius,
          y: centerY + Math.sin(crystalAngle) * crystalRadius - crystalHeight / 2,
          z: amplitude + crystalHeight,
          size: size * 1.5,
        };
        break;

      case 'dna':
        const dnaHeight = screenHeight * 0.6;
        const dnaY = centerY - dnaHeight / 2 + (index / audioData.length) * dnaHeight;
        const dnaRadius = 40 + amplitude * 0.8;
        const dnaStrand = index % 2 === 0 ? 1 : -1;
        const dnaAngle = (index / audioData.length) * Math.PI * 8;
        point = {
          x: centerX + Math.cos(dnaAngle) * dnaRadius * dnaStrand,
          y: dnaY,
          z: amplitude + Math.sin(dnaAngle) * 20,
          size: size * 0.8,
        };
        break;

      case 'mandala':
        const mandalaLayers = 5;
        const mandalaLayer = Math.floor((index / audioData.length) * mandalaLayers);
        const mandalaRadius = 20 + mandalaLayer * 25 + amplitude * 0.5;
        const mandalaSegments = 8 + mandalaLayer * 4;
        const mandalaAngle = (index % mandalaSegments) * (Math.PI * 2 / mandalaSegments);
        point = {
          x: centerX + Math.cos(mandalaAngle) * mandalaRadius,
          y: centerY + Math.sin(mandalaAngle) * mandalaRadius,
          z: amplitude + mandalaLayer * 10,
          size: size * (1 + mandalaLayer * 0.2),
        };
        break;

      case 'tornado':
        const tornadoHeight = screenHeight * 0.7;
        const tornadoY = centerY - tornadoHeight / 2 + (index / audioData.length) * tornadoHeight;
        const tornadoRadius = 20 + (1 - index / audioData.length) * 80 + amplitude * 0.5;
        const tornadoAngle = angle * 5 + (index / audioData.length) * Math.PI * 10;
        point = {
          x: centerX + Math.cos(tornadoAngle) * tornadoRadius,
          y: tornadoY,
          z: amplitude + Math.sin(tornadoAngle) * 15,
          size: size * (1 + (1 - index / audioData.length)),
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