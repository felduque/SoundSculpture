import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import type { Sculpture } from "../types";

export class SculptureExporter {
  static async exportAsOBJ(sculpture: Sculpture): Promise<void> {
    try {
      const objContent = this.generateOBJContent(sculpture);
      const fileName = `sculpture-${sculpture.id}-${sculpture.shapeType}.obj`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, objContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/octet-stream",
          dialogTitle: "Exportar Escultura 3D",
        });
      }
    } catch (error) {
      console.error("Error exporting OBJ:", error);
      throw new Error("No se pudo exportar la escultura");
    }
  }

  static async exportImage(sculpture: Sculpture): Promise<void> {
    try {
      const imageUri = sculpture.uri; 
      console.log(imageUri)
      if (!imageUri) {
        throw new Error("No se encontró la imagen de la escultura");
      }

      const fileName = `sculpture-${sculpture.id}.png`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.copyAsync({ from: imageUri, to: fileUri });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "image/png",
          dialogTitle: "Exportar Imagen de Escultura",
        });
      }
    } catch (error) {
      console.error("Error exporting image:", error);
      throw new Error("No se pudo exportar la imagen de la escultura");
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
        metadata: {
          version: "1.0.0",
          exportedAt: new Date().toISOString(),
        },
      };

      const jsonContent = JSON.stringify(exportData, null, 2);
      const fileName = `sculpture-${sculpture.id}.json`;
      const fileUri = FileSystem.documentDirectory + fileName;

      await FileSystem.writeAsStringAsync(fileUri, jsonContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: "application/json",
          dialogTitle: "Exportar Datos de Escultura",
        });
      }
    } catch (error) {
      console.error("Error exporting JSON:", error);
      throw new Error("No se pudo exportar los datos");
    }
  }

  private static generateOBJContent(sculpture: Sculpture): string {
    let objContent = `# Sound Sculpture - ${sculpture.shapeType}\n`;
    objContent += `# Created: ${sculpture.createdAt}\n`;
    objContent += `# Points: ${sculpture.points.length}\n\n`;

    // Vertices
    sculpture.points.forEach((point, index) => {
      objContent += `v ${point.x / 100} ${point.y / 100} ${point.z / 100}\n`;
    });

    objContent += "\n";

    // Generar caras triangulares simples
    for (let i = 0; i < sculpture.points.length - 2; i++) {
      objContent += `f ${i + 1} ${i + 2} ${i + 3}\n`;
    }

    return objContent;
  }
}
