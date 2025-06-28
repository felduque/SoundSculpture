import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { Platform, Alert } from "react-native";
import { captureRef } from 'react-native-view-shot';
import type { Sculpture } from "../types";

export class SculptureExporter {
  static async exportAsPNG(sculpture: Sculpture, viewRef?: any): Promise<void> {
    try {
      let imageUri: string;
      
      if (viewRef && Platform.OS !== 'web') {
        // Capture the actual sculpture view
        imageUri = await captureRef(viewRef, {
          format: 'png',
          quality: 1.0,
          result: 'tmpfile',
        });
      } else {
        // Generate a programmatic image
        imageUri = await this.generateSculptureImage(sculpture, 'png');
      }

      const fileName = `sculpture-${sculpture.id}-${sculpture.shapeType}.png`;

      if (Platform.OS === 'web') {
        // For web, create download
        const response = await fetch(imageUri);
        const blob = await response.blob();
        this.downloadBlobWeb(blob, fileName);
      } else {
        // For mobile, save to gallery
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
          await MediaLibrary.saveToLibraryAsync(imageUri);
        } else {
          // Fallback to sharing
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(imageUri, {
              mimeType: "image/png",
              dialogTitle: "Save Sculpture Image",
            });
          }
        }
      }
    } catch (error) {
      console.error("Error exporting PNG:", error);
      throw new Error("Could not export sculpture as PNG");
    }
  }

  static async exportAsGIF(sculpture: Sculpture): Promise<void> {
    try {
      const gifData = await this.generateAnimatedGIF(sculpture);
      const fileName = `sculpture-${sculpture.id}-animated.gif`;
      
      if (Platform.OS === 'web') {
        this.downloadBlobWeb(gifData, fileName);
      } else {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, gifData, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "image/gif",
            dialogTitle: "Save Animated Sculpture",
          });
        }
      }
    } catch (error) {
      console.error("Error exporting GIF:", error);
      throw new Error("Could not export sculpture as GIF");
    }
  }

  static async exportAsMP4(sculpture: Sculpture): Promise<void> {
    try {
      const videoData = await this.generateSculptureVideo(sculpture);
      const fileName = `sculpture-${sculpture.id}-animation.mp4`;
      
      if (Platform.OS === 'web') {
        this.downloadBlobWeb(videoData, fileName);
      } else {
        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, videoData, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
          await MediaLibrary.saveToLibraryAsync(fileUri);
        } else if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "video/mp4",
            dialogTitle: "Save Sculpture Video",
          });
        }
      }
    } catch (error) {
      console.error("Error exporting MP4:", error);
      throw new Error("Could not export sculpture as MP4");
    }
  }

  static async exportAsOBJ(sculpture: Sculpture): Promise<void> {
    try {
      const objContent = this.generateOBJContent(sculpture);
      const fileName = `sculpture-${sculpture.id}-${sculpture.shapeType}.obj`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, objContent);

      if (Platform.OS === 'web') {
        this.downloadFileWeb(objContent, fileName, 'application/octet-stream');
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/octet-stream",
          dialogTitle: "Export 3D Sculpture",
        });
      }
    } catch (error) {
      console.error("Error exporting OBJ:", error);
      throw new Error("Could not export sculpture as OBJ");
    }
  }

  static async exportAsSTL(sculpture: Sculpture): Promise<void> {
    try {
      const stlContent = this.generateSTLContent(sculpture);
      const fileName = `sculpture-${sculpture.id}-${sculpture.shapeType}.stl`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, stlContent);

      if (Platform.OS === 'web') {
        this.downloadFileWeb(stlContent, fileName, 'application/octet-stream');
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/octet-stream",
          dialogTitle: "Export STL for 3D Printing",
        });
      }
    } catch (error) {
      console.error("Error exporting STL:", error);
      throw new Error("Could not export STL file");
    }
  }

  static async exportAsSVG(sculpture: Sculpture): Promise<void> {
    try {
      const svgContent = this.generateSVGContent(sculpture);
      const fileName = `sculpture-${sculpture.id}-${sculpture.shapeType}.svg`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, svgContent);

      if (Platform.OS === 'web') {
        this.downloadFileWeb(svgContent, fileName, 'image/svg+xml');
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "image/svg+xml",
          dialogTitle: "Export Vector Graphics",
        });
      }
    } catch (error) {
      console.error("Error exporting SVG:", error);
      throw new Error("Could not export SVG file");
    }
  }

  static async exportAsJSON(sculpture: Sculpture): Promise<void> {
    try {
      const exportData = {
        name: sculpture.name || `sound-sculpture-${sculpture.id}`,
        type: sculpture.shapeType,
        points: sculpture.points,
        color: sculpture.color,
        duration: sculpture.duration,
        vertices: sculpture.points.length,
        createdAt: sculpture.createdAt,
        audioData: sculpture.audioData,
        metadata: {
          version: "2.0.0",
          exportedAt: new Date().toISOString(),
          format: "Sound Sculpture JSON",
          platform: Platform.OS,
        },
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const fileName = `sculpture-${sculpture.id}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, jsonContent);

      if (Platform.OS === 'web') {
        this.downloadFileWeb(jsonContent, fileName, 'application/json');
      } else if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Export Sculpture Data",
        });
      }
    } catch (error) {
      console.error("Error exporting JSON:", error);
      throw new Error("Could not export data");
    }
  }

  static async exportAudio(sculpture: Sculpture): Promise<void> {
    try {
      if (!sculpture.uri) {
        throw new Error("No audio file available");
      }

      const fileName = `sculpture-${sculpture.id}-audio.m4a`;

      if (Platform.OS === 'web') {
        // For web, we need to read the file and create a download
        const audioData = await FileSystem.readAsStringAsync(sculpture.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const blob = this.base64ToBlob(audioData, 'audio/mp4');
        this.downloadBlobWeb(blob, fileName);
      } else {
        const permission = await MediaLibrary.requestPermissionsAsync();
        if (permission.granted) {
          await MediaLibrary.saveToLibraryAsync(sculpture.uri);
        } else if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(sculpture.uri, {
            mimeType: "audio/mp4",
            dialogTitle: "Export Original Audio",
          });
        }
      }
    } catch (error) {
      console.error("Error exporting audio:", error);
      throw new Error("Could not export audio file");
    }
  }

  // Helper methods for generating content
  private static async generateSculptureImage(sculpture: Sculpture, format: 'png' | 'jpg'): Promise<string> {
    // Create a canvas-like representation for web or generate programmatically
    if (Platform.OS === 'web') {
      return this.generateWebCanvas(sculpture, format);
    } else {
      // For mobile, create a simple representation
      return this.generateMobileImage(sculpture, format);
    }
  }

  private static generateWebCanvas(sculpture: Sculpture, format: 'png' | 'jpg'): string {
    // Create an HTML5 canvas and draw the sculpture
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw sculpture points
    sculpture.points.forEach((point, index) => {
      const x = (point.x / 400) * canvas.width;
      const y = (point.y / 400) * canvas.height;
      const radius = Math.max(2, point.size / 2);

      // Create gradient
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, sculpture.color);
      gradient.addColorStop(1, sculpture.color + '40');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Add glow effect
      ctx.shadowColor = sculpture.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    return canvas.toDataURL(`image/${format}`, 0.9);
  }

  private static async generateMobileImage(sculpture: Sculpture, format: 'png' | 'jpg'): Promise<string> {
    // For mobile, we'll create a simple SVG and convert it
    const svgContent = this.generateSVGContent(sculpture);
    
    // Convert SVG to base64 data URL
    const base64SVG = btoa(svgContent);
    return `data:image/svg+xml;base64,${base64SVG}`;
  }

  private static async generateAnimatedGIF(sculpture: Sculpture): Promise<Blob> {
    // Simplified GIF generation - in a real app, you'd use a proper GIF encoder
    const frames: string[] = [];
    const frameCount = 30;

    for (let i = 0; i < frameCount; i++) {
      const progress = i / frameCount;
      const frameData = await this.generateAnimationFrame(sculpture, progress);
      frames.push(frameData);
    }

    // Create a simple animated representation
    // In a real implementation, you'd use a library like gif.js
    return new Blob(['GIF animation placeholder'], { type: 'image/gif' });
  }

  private static async generateSculptureVideo(sculpture: Sculpture): Promise<Blob> {
    // Video generation would require a more complex implementation
    // For now, return a placeholder
    return new Blob(['MP4 video placeholder'], { type: 'video/mp4' });
  }

  private static async generateAnimationFrame(sculpture: Sculpture, progress: number): Promise<string> {
    // Generate a single frame of animation
    if (Platform.OS === 'web') {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Animate sculpture points
      sculpture.points.forEach((point, index) => {
        const animationOffset = Math.sin(progress * Math.PI * 2 + index * 0.1) * 10;
        const x = (point.x / 400) * canvas.width + animationOffset;
        const y = (point.y / 400) * canvas.height + animationOffset;
        const radius = Math.max(2, point.size / 2) * (1 + Math.sin(progress * Math.PI * 2) * 0.2);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, sculpture.color);
        gradient.addColorStop(1, sculpture.color + '40');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      });

      return canvas.toDataURL('image/png');
    }
    
    return '';
  }

  private static generateOBJContent(sculpture: Sculpture): string {
    let objContent = `# Sound Sculpture - ${sculpture.shapeType}\n`;
    objContent += `# Created: ${sculpture.createdAt}\n`;
    objContent += `# Points: ${sculpture.points.length}\n`;
    objContent += `# Color: ${sculpture.color}\n\n`;

    // Vertices
    sculpture.points.forEach((point) => {
      const x = (point.x - 200) / 100; // Normalize coordinates
      const y = (point.y - 200) / 100;
      const z = point.z / 100;
      objContent += `v ${x.toFixed(4)} ${y.toFixed(4)} ${z.toFixed(4)}\n`;
    });

    objContent += "\n";

    // Generate faces (triangles connecting nearby points)
    for (let i = 0; i < sculpture.points.length - 2; i++) {
      if (i % 3 === 0) { // Create triangular faces
        objContent += `f ${i + 1} ${i + 2} ${i + 3}\n`;
      }
    }

    return objContent;
  }

  private static generateSTLContent(sculpture: Sculpture): string {
    let stlContent = `solid SoundSculpture_${sculpture.shapeType}\n`;

    // Generate triangular facets
    for (let i = 0; i < sculpture.points.length - 2; i += 3) {
      if (i + 2 < sculpture.points.length) {
        const p1 = sculpture.points[i];
        const p2 = sculpture.points[i + 1];
        const p3 = sculpture.points[i + 2];

        // Calculate normal vector (simplified)
        const normal = this.calculateNormal(p1, p2, p3);

        stlContent += `  facet normal ${normal.x.toFixed(6)} ${normal.y.toFixed(6)} ${normal.z.toFixed(6)}\n`;
        stlContent += `    outer loop\n`;
        stlContent += `      vertex ${(p1.x / 100).toFixed(6)} ${(p1.y / 100).toFixed(6)} ${(p1.z / 100).toFixed(6)}\n`;
        stlContent += `      vertex ${(p2.x / 100).toFixed(6)} ${(p2.y / 100).toFixed(6)} ${(p2.z / 100).toFixed(6)}\n`;
        stlContent += `      vertex ${(p3.x / 100).toFixed(6)} ${(p3.y / 100).toFixed(6)} ${(p3.z / 100).toFixed(6)}\n`;
        stlContent += `    endloop\n`;
        stlContent += `  endfacet\n`;
      }
    }

    stlContent += `endsolid SoundSculpture_${sculpture.shapeType}\n`;
    return stlContent;
  }

  private static generateSVGContent(sculpture: Sculpture): string {
    const width = 800;
    const height = 600;
    
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    svgContent += `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">\n`;
    svgContent += `  <title>Sound Sculpture - ${sculpture.shapeType}</title>\n`;
    svgContent += `  <rect width="100%" height="100%" fill="#000"/>\n`;
    
    // Add gradient definition
    svgContent += `  <defs>\n`;
    svgContent += `    <radialGradient id="pointGradient" cx="50%" cy="50%" r="50%">\n`;
    svgContent += `      <stop offset="0%" style="stop-color:${sculpture.color};stop-opacity:1" />\n`;
    svgContent += `      <stop offset="100%" style="stop-color:${sculpture.color};stop-opacity:0.3" />\n`;
    svgContent += `    </radialGradient>\n`;
    svgContent += `  </defs>\n`;

    // Draw points as circles
    sculpture.points.forEach((point, index) => {
      const x = (point.x / 400) * width;
      const y = (point.y / 400) * height;
      const radius = Math.max(1, point.size / 4);
      const opacity = 0.3 + (point.z / 100) * 0.7;
      
      svgContent += `  <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${radius.toFixed(2)}" `;
      svgContent += `fill="url(#pointGradient)" opacity="${opacity.toFixed(2)}"/>\n`;
    });

    // Connect points with lines for certain shapes
    if (['spiral', 'dna', 'tornado'].includes(sculpture.shapeType)) {
      svgContent += `  <path d="M`;
      sculpture.points.forEach((point, index) => {
        const x = (point.x / 400) * width;
        const y = (point.y / 400) * height;
        svgContent += index === 0 ? `${x.toFixed(2)},${y.toFixed(2)}` : ` L${x.toFixed(2)},${y.toFixed(2)}`;
      });
      svgContent += `" stroke="${sculpture.color}" stroke-width="1" fill="none" opacity="0.5"/>\n`;
    }

    svgContent += `</svg>`;
    return svgContent;
  }

  private static calculateNormal(p1: any, p2: any, p3: any) {
    // Simplified normal calculation
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    const v2 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };
    
    const normal = {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x
    };
    
    // Normalize
    const length = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
    if (length > 0) {
      normal.x /= length;
      normal.y /= length;
      normal.z /= length;
    }
    
    return normal;
  }

  private static downloadFileWeb(content: string, fileName: string, mimeType: string) {
    if (Platform.OS !== 'web') return;
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private static downloadBlobWeb(blob: Blob, fileName: string) {
    if (Platform.OS !== 'web') return;
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  private static base64ToBlob(base64: string, mimeType: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }
}