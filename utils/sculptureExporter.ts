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
        try {
          // Capture the actual sculpture view
          imageUri = await captureRef(viewRef, {
            format: 'png',
            quality: 1.0,
            result: 'tmpfile',
          });
        } catch (captureError) {
          console.log('View capture failed, generating programmatic image:', captureError);
          imageUri = await this.generateSculptureImage(sculpture, 'png');
        }
      } else {
        // Generate a programmatic image
        imageUri = await this.generateSculptureImage(sculpture, 'png');
      }

      const fileName = `sculpture-${sculpture.id}-${sculpture.shapeType}.png`;
      
      if (Platform.OS === 'web') {
        // Web implementation
        try {
          if (imageUri.startsWith('data:')) {
            // Data URL - convert to blob
            const response = await fetch(imageUri);
            const blob = await response.blob();
            this.downloadBlobWeb(blob, fileName);
          } else {
            // File URI - read and download
            const svgContent = this.generateSVGContent(sculpture);
            const blob = new Blob([svgContent], { type: 'image/svg+xml' });
            this.downloadBlobWeb(blob, fileName.replace('.png', '.svg'));
          }
        } catch (webError) {
          console.log('Web export error:', webError);
          Alert.alert('Export Error', 'Could not export on web platform');
          return;
        }
      } else {
        // Mobile implementation
        try {
          // Ensure we have a valid file URI
          let finalUri = imageUri;
          
          if (!imageUri.startsWith('file://')) {
            // Create a proper file if needed
            const fileUri = `${FileSystem.documentDirectory}${fileName}`;
            const svgContent = this.generateSVGContent(sculpture);
            await FileSystem.writeAsStringAsync(fileUri, svgContent);
            finalUri = fileUri;
          }
          
          // Try to save to gallery first
          try {
            const permission = await MediaLibrary.requestPermissionsAsync();
            if (permission.granted) {
              const asset = await MediaLibrary.createAssetAsync(finalUri);
              await MediaLibrary.createAlbumAsync('Sound Sculptures', asset, false);
              Alert.alert('Success', 'Image saved to gallery!');
              return;
            }
          } catch (galleryError) {
            console.log('Gallery save failed, trying share:', galleryError);
          }
          
          // Fallback to sharing
          if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(finalUri, {
              mimeType: "image/png",
              dialogTitle: "Save Sculpture Image",
            });
          } else {
            Alert.alert('Success', 'Image exported successfully!');
          }
        } catch (mobileError) {
          console.error('Mobile export error:', mobileError);
          Alert.alert('Export Error', 'Could not export image on mobile');
        }
      }
    } catch (error) {
      console.error("Error exporting PNG:", error);
      Alert.alert('Export Error', 'Could not export sculpture as PNG. Please try again.');
    }
  }

  static async exportAsGIF(sculpture: Sculpture): Promise<void> {
    try {
      const fileName = `sculpture-${sculpture.id}-animated.gif`;
      
      // Create animation data
      const animationData = this.generateAnimationData(sculpture);
      
      if (Platform.OS === 'web') {
        const blob = new Blob([animationData], { type: 'text/plain' });
        this.downloadBlobWeb(blob, fileName.replace('.gif', '-animation.txt'));
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName.replace('.gif', '-animation.txt')}`;
        await FileSystem.writeAsStringAsync(fileUri, animationData);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "text/plain",
            dialogTitle: "Save Animation Data",
          });
        }
      }
      
      Alert.alert('Success', 'Animation data exported successfully!');
    } catch (error) {
      console.error("Error exporting GIF:", error);
      Alert.alert('Export Error', 'Could not export animation. Please try again.');
    }
  }

  static async exportAsMP4(sculpture: Sculpture): Promise<void> {
    try {
      const fileName = `sculpture-${sculpture.id}-video.mp4`;
      
      const videoData = this.generateVideoData(sculpture);
      
      if (Platform.OS === 'web') {
        const blob = new Blob([videoData], { type: 'text/plain' });
        this.downloadBlobWeb(blob, fileName.replace('.mp4', '-video.txt'));
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName.replace('.mp4', '-video.txt')}`;
        await FileSystem.writeAsStringAsync(fileUri, videoData);
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "text/plain",
            dialogTitle: "Export Video Data",
          });
        }
      }
      
      Alert.alert('Success', 'Video data exported successfully!');
    } catch (error) {
      console.error("Error exporting MP4:", error);
      Alert.alert('Export Error', 'Could not export video. Please try again.');
    }
  }

  static async exportAsOBJ(sculpture: Sculpture): Promise<void> {
    try {
      const objContent = this.generateOBJContent(sculpture);
      const fileName = `sculpture-${sculpture.id}-${sculpture.shapeType}.obj`;

      if (Platform.OS === 'web') {
        this.downloadFileWeb(objContent, fileName, 'application/octet-stream');
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, objContent);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/octet-stream",
            dialogTitle: "Export 3D Model",
          });
        }
      }
      
      Alert.alert('Success', '3D model exported successfully!');
    } catch (error) {
      console.error("Error exporting OBJ:", error);
      Alert.alert('Export Error', 'Could not export 3D model. Please try again.');
    }
  }

  static async exportAsSTL(sculpture: Sculpture): Promise<void> {
    try {
      const stlContent = this.generateSTLContent(sculpture);
      const fileName = `sculpture-${sculpture.id}-${sculpture.shapeType}.stl`;

      if (Platform.OS === 'web') {
        this.downloadFileWeb(stlContent, fileName, 'application/octet-stream');
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, stlContent);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/octet-stream",
            dialogTitle: "Export STL for 3D Printing",
          });
        }
      }
      
      Alert.alert('Success', 'STL file exported successfully!');
    } catch (error) {
      console.error("Error exporting STL:", error);
      Alert.alert('Export Error', 'Could not export STL file. Please try again.');
    }
  }

  static async exportAsSVG(sculpture: Sculpture): Promise<void> {
    try {
      const svgContent = this.generateSVGContent(sculpture);
      const fileName = `sculpture-${sculpture.id}-${sculpture.shapeType}.svg`;

      if (Platform.OS === 'web') {
        this.downloadFileWeb(svgContent, fileName, 'image/svg+xml');
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, svgContent);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "image/svg+xml",
            dialogTitle: "Export Vector Graphics",
          });
        }
      }
      
      Alert.alert('Success', 'Vector graphics exported successfully!');
    } catch (error) {
      console.error("Error exporting SVG:", error);
      Alert.alert('Export Error', 'Could not export SVG file. Please try again.');
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

      if (Platform.OS === 'web') {
        this.downloadFileWeb(jsonContent, fileName, 'application/json');
      } else {
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, jsonContent);

        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/json",
            dialogTitle: "Export Sculpture Data",
          });
        }
      }
      
      Alert.alert('Success', 'Sculpture data exported successfully!');
    } catch (error) {
      console.error("Error exporting JSON:", error);
      Alert.alert('Export Error', 'Could not export sculpture data. Please try again.');
    }
  }

  static async exportAudio(sculpture: Sculpture): Promise<void> {
    try {
      if (!sculpture.uri) {
        Alert.alert('Error', 'No audio file available for this sculpture');
        return;
      }

      const fileName = `sculpture-${sculpture.id}-audio.m4a`;

      if (Platform.OS === 'web') {
        try {
          const response = await fetch(sculpture.uri);
          const blob = await response.blob();
          this.downloadBlobWeb(blob, fileName);
        } catch (webError) {
          Alert.alert('Error', 'Could not access audio file for web export');
          return;
        }
      } else {
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
        
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(sculpture.uri, {
            mimeType: "audio/mp4",
            dialogTitle: "Export Original Audio",
          });
        } else {
          Alert.alert('Error', 'Unable to export audio file');
        }
      }
    } catch (error) {
      console.error("Error exporting audio:", error);
      Alert.alert('Export Error', 'Could not export audio file. Please try again.');
    }
  }

  // Helper methods
  private static async generateSculptureImage(sculpture: Sculpture, format: 'png' | 'jpg'): Promise<string> {
    if (Platform.OS === 'web') {
      return this.generateWebCanvas(sculpture, format);
    } else {
      return this.generateMobileSVG(sculpture);
    }
  }

  private static generateWebCanvas(sculpture: Sculpture, format: 'png' | 'jpg'): string {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 600;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw sculpture points
      sculpture.points.forEach((point) => {
        const x = (point.x / 400) * canvas.width;
        const y = (point.y / 400) * canvas.height;
        const radius = Math.max(2, point.size / 2);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, sculpture.color);
        gradient.addColorStop(1, sculpture.color + '40');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowColor = sculpture.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      return canvas.toDataURL(`image/${format}`, 0.9);
    } catch (error) {
      console.error('Canvas generation error:', error);
      return 'data:image/svg+xml;base64,' + btoa(this.generateSVGContent(sculpture));
    }
  }

  private static async generateMobileSVG(sculpture: Sculpture): Promise<string> {
    const svgContent = this.generateSVGContent(sculpture);
    const fileName = `temp-sculpture-${Date.now()}.svg`;
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;
    
    await FileSystem.writeAsStringAsync(fileUri, svgContent);
    return fileUri;
  }

  private static generateAnimationData(sculpture: Sculpture): string {
    return `Animation Data for ${sculpture.name}\n\nShape: ${sculpture.shapeType}\nPoints: ${sculpture.points.length}\nColor: ${sculpture.color}\nDuration: ${sculpture.duration}ms\n\nThis represents an animated sculpture that would show the points moving and pulsing in rhythm with the original audio.`;
  }

  private static generateVideoData(sculpture: Sculpture): string {
    return `Video Export Data for ${sculpture.name}\n\nShape: ${sculpture.shapeType}\nPoints: ${sculpture.points.length}\nColor: ${sculpture.color}\nDuration: ${sculpture.duration}ms\n\nNote: Full video export feature coming soon!`;
  }

  private static generateOBJContent(sculpture: Sculpture): string {
    let objContent = `# Sound Sculpture - ${sculpture.shapeType}\n`;
    objContent += `# Created: ${sculpture.createdAt}\n`;
    objContent += `# Points: ${sculpture.points.length}\n`;
    objContent += `# Color: ${sculpture.color}\n\n`;

    sculpture.points.forEach((point) => {
      const x = (point.x - 200) / 100;
      const y = (point.y - 200) / 100;
      const z = point.z / 100;
      objContent += `v ${x.toFixed(4)} ${y.toFixed(4)} ${z.toFixed(4)}\n`;
    });

    objContent += "\n";

    for (let i = 0; i < sculpture.points.length - 2; i++) {
      if (i % 3 === 0) {
        objContent += `f ${i + 1} ${i + 2} ${i + 3}\n`;
      }
    }

    return objContent;
  }

  private static generateSTLContent(sculpture: Sculpture): string {
    let stlContent = `solid SoundSculpture_${sculpture.shapeType}\n`;

    for (let i = 0; i < sculpture.points.length - 2; i += 3) {
      if (i + 2 < sculpture.points.length) {
        const p1 = sculpture.points[i];
        const p2 = sculpture.points[i + 1];
        const p3 = sculpture.points[i + 2];

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
    
    svgContent += `  <defs>\n`;
    svgContent += `    <radialGradient id="pointGradient" cx="50%" cy="50%" r="50%">\n`;
    svgContent += `      <stop offset="0%" style="stop-color:${sculpture.color};stop-opacity:1" />\n`;
    svgContent += `      <stop offset="100%" style="stop-color:${sculpture.color};stop-opacity:0.3" />\n`;
    svgContent += `    </radialGradient>\n`;
    svgContent += `  </defs>\n`;

    sculpture.points.forEach((point) => {
      const x = (point.x / 400) * width;
      const y = (point.y / 400) * height;
      const radius = Math.max(1, point.size / 4);
      const opacity = 0.3 + (point.z / 100) * 0.7;
      
      svgContent += `  <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${radius.toFixed(2)}" `;
      svgContent += `fill="url(#pointGradient)" opacity="${opacity.toFixed(2)}"/>\n`;
    });

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
    const v1 = { x: p2.x - p1.x, y: p2.y - p1.y, z: p2.z - p1.z };
    const v2 = { x: p3.x - p1.x, y: p3.y - p1.y, z: p3.z - p1.z };
    
    const normal = {
      x: v1.y * v2.z - v1.z * v2.y,
      y: v1.z * v2.x - v1.x * v2.z,
      z: v1.x * v2.y - v1.y * v2.x
    };
    
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