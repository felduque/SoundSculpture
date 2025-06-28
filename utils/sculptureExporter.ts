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
      
      // Create a proper file URI for mobile platforms
      if (Platform.OS !== 'web') {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        
        // Copy the image to a proper location
        await FileSystem.copyAsync({
          from: imageUri,
          to: fileUri,
        });
        
        // Try to save to gallery first
        try {
          const permission = await MediaLibrary.requestPermissionsAsync();
          if (permission.granted) {
            const asset = await MediaLibrary.createAssetAsync(fileUri);
            await MediaLibrary.createAlbumAsync('Sound Sculptures', asset, false);
            Alert.alert('Success', 'Image saved to gallery!');
            return;
          }
        } catch (galleryError) {
          console.log('Gallery save failed, trying share:', galleryError);
        }
        
        // Fallback to sharing
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "image/png",
            dialogTitle: "Save Sculpture Image",
          });
        } else {
          Alert.alert('Error', 'Unable to save or share the image');
        }
      } else {
        // Web implementation
        const response = await fetch(imageUri);
        const blob = await response.blob();
        this.downloadBlobWeb(blob, fileName);
      }
    } catch (error) {
      console.error("Error exporting PNG:", error);
      throw new Error("Could not export sculpture as PNG");
    }
  }

  static async exportAsGIF(sculpture: Sculpture): Promise<void> {
    try {
      const fileName = `sculpture-${sculpture.id}-animated.gif`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Create a simple animated representation
      const gifContent = await this.generateSimpleGIF(sculpture);
      
      // Write the content to file
      await FileSystem.writeAsStringAsync(fileUri, gifContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      
      if (Platform.OS === 'web') {
        const blob = new Blob([gifContent], { type: 'image/gif' });
        this.downloadBlobWeb(blob, fileName);
      } else {
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
      const fileName = `sculpture-${sculpture.id}-animation.mp4`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      
      // Create a placeholder video file
      const videoContent = "Video export placeholder - feature coming soon";
      
      await FileSystem.writeAsStringAsync(fileUri, videoContent);
      
      if (Platform.OS === 'web') {
        const blob = new Blob([videoContent], { type: 'video/mp4' });
        this.downloadBlobWeb(blob, fileName);
      } else {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "text/plain",
            dialogTitle: "Export Sculpture Video",
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
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

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
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

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
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

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
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

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
        // For web, create a download link
        const response = await fetch(sculpture.uri);
        const blob = await response.blob();
        this.downloadBlobWeb(blob, fileName);
      } else {
        // For mobile, try to save to gallery
        try {
          const permission = await MediaLibrary.requestPermissionsAsync();
          if (permission.granted) {
            const asset = await MediaLibrary.createAssetAsync(sculpture.uri);
            await MediaLibrary.createAlbumAsync('Sound Sculptures', asset, false);
            Alert.alert('Success', 'Audio saved to gallery!');
            return;
          }
        } catch (galleryError) {
          console.log('Gallery save failed, trying share:', galleryError);
        }
        
        // Fallback to sharing
        if (await Sharing.isAvailableAsync()) {
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
    if (Platform.OS === 'web') {
      return this.generateWebCanvas(sculpture, format);
    } else {
      return this.generateMobileSVG(sculpture);
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

  private static async generateMobileSVG(sculpture: Sculpture): Promise<string> {
    // Generate SVG content and convert to data URL
    const svgContent = this.generateSVGContent(sculpture);
    
    // Create a temporary file with the SVG content
    const fileName = `temp-sculpture-${Date.now()}.svg`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(fileUri, svgContent);
    return fileUri;
  }

  private static async generateSimpleGIF(sculpture: Sculpture): Promise<string> {
    // Create a simple text-based representation for GIF
    return `GIF Animation Data for ${sculpture.name}\nShape: ${sculpture.shapeType}\nPoints: ${sculpture.points.length}\nColor: ${sculpture.color}`;
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
}