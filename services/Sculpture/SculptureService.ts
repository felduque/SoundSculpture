import { Sculpture, ShapeType } from "@/types";
import * as sys from "expo-file-system";

const SCULPTURES_DIRECTORY = sys.documentDirectory + "sculptures/";

const METADATA_FILE = SCULPTURES_DIRECTORY + "metadata.json";

export class SculptureService {
  static async init(): Promise<void> {
    try {
      const dir = await sys.getInfoAsync(SCULPTURES_DIRECTORY);

      // Si no existe el directorio lo crea
      if (!dir.exists) {
        await sys.makeDirectoryAsync(SCULPTURES_DIRECTORY, {
          intermediates: true,
        });
      }

      const metaData = await sys.getInfoAsync(METADATA_FILE);

      if (!metaData.exists) {
        await sys.writeAsStringAsync(METADATA_FILE, JSON.stringify([]));
      }
    } catch (error) {
      throw error;
    }
  }

  static async saveSculpture(data: Sculpture): Promise<void> {
    try {
      await this.init();

      if (!data.uri) throw new Error("Grabacion no disponible");

      const uriExtension = data.uri.split(".").pop() || "m4a";
      const fileName = `${data.id}.${uriExtension}`;

      await sys.copyAsync({
        from: data.uri,
        to: SCULPTURES_DIRECTORY + fileName,
      });

      await this.saveMetadata(data);
    } catch (error) {
      throw error;
    }
  }

  private static async saveMetadata(data: Sculpture): Promise<void> {
    try {
      const dataSculpture = await this.getAllSculptures();

      dataSculpture.push(data);

      await sys.writeAsStringAsync(
        METADATA_FILE,
        JSON.stringify(dataSculpture)
      );
    } catch (error) {
      throw error;
    }
  }

  static async getAllSculptures(): Promise<Sculpture[]> {
    try {
      await this.init();

      const data = await sys.readAsStringAsync(METADATA_FILE);

      return JSON.parse(data) as Sculpture[];
    } catch (error) {
      throw error;
    }
  }

  static async getFilteredSculptures(search: {
    for: "all" | "id";
    shape: ShapeType;
    text?: string;
  }): Promise<Sculpture[]> {
    try {
      const data = await this.getAllSculptures();

      if (search.for === "all" && search.shape === "all") {
        return data;
      }

      return data.filter((e) => {
        if (search.for === "id") {
          return e.id === Number(search.text);
        }
        return e.shapeType === search.shape;
      });
    } catch (error) {
      throw error;
    }
  }
}
