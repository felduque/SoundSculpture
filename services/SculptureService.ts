import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// Tipo para las esculturas sonoras
export type SoundSculpture = {
  id: string;
  name: string;
  uri: string;
  duration: number;
  date: string;
  thumbnail?: string; // URI de la miniatura generada
};

// Directorio para almacenar las esculturas
const SCULPTURES_DIRECTORY = FileSystem.documentDirectory + 'sculptures/';
// Archivo para almacenar los metadatos de las esculturas
const METADATA_FILE = SCULPTURES_DIRECTORY + 'metadata.json';

/**
 * Servicio para gestionar las esculturas sonoras
 */
export class SculptureService {
  /**
   * Inicializa el servicio y crea los directorios necesarios
   */
  static async initialize(): Promise<void> {
    try {
      // Verificar si el directorio existe, si no, crearlo
      const dirInfo = await FileSystem.getInfoAsync(SCULPTURES_DIRECTORY);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(SCULPTURES_DIRECTORY, { intermediates: true });
      }

      // Verificar si el archivo de metadatos existe, si no, crearlo
      const metadataInfo = await FileSystem.getInfoAsync(METADATA_FILE);
      if (!metadataInfo.exists) {
        await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error al inicializar el servicio de esculturas:', error);
      throw error;
    }
  }

  /**
   * Guarda una nueva escultura sonora
   * @param recording Grabación de audio
   * @param name Nombre de la escultura
   * @param duration Duración en segundos
   * @returns La escultura guardada
   */
  static async saveSculpture(
    recording: { getURI: () => string | null },
    name: string,
    duration: number
  ): Promise<SoundSculpture> {
    try {
      await this.initialize();

      const uri = recording.getURI();
      if (!uri) throw new Error('URI de grabación no disponible');

      // Generar ID único
      const id = Date.now().toString();
      const date = new Date().toISOString();

      // Crear nombre de archivo
      const fileExtension = uri.split('.').pop() || 'm4a';
      const fileName = `${id}.${fileExtension}`;
      const destinationUri = SCULPTURES_DIRECTORY + fileName;

      // Copiar el archivo de grabación al directorio de esculturas
      await FileSystem.copyAsync({
        from: uri,
        to: destinationUri,
      });
      // Crear objeto de escultura
      const sculpture: SoundSculpture = {
        id,
        name,
        uri: destinationUri,
        duration,
        date,
      };

      // Guardar metadatos
      await this.saveMetadata(sculpture);

      // Generar miniatura (en una implementación real, esto generaría una visualización del audio)
      await this.generateThumbnail(sculpture);

      return sculpture;
    } catch (error) {
      console.error('Error al guardar la escultura:', error);
      throw error;
    }
  }

  /**
   * Genera una miniatura para la escultura
   * @param sculpture Escultura sonora
   */
  private static async generateThumbnail(sculpture: SoundSculpture): Promise<void> {
    // En una implementación real, aquí generaríamos una visualización del audio
    // y la guardaríamos como una imagen
    // Por ahora, simplemente asignamos un color aleatorio
    
    const colors = ['0a7ea4', 'FF3B30', '34C759', 'FF9500', 'AF52DE'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    // Crear una URL de placeholder
    const thumbnailUrl = `https://via.placeholder.com/150/${randomColor}/FFFFFF?text=Sound`;
    
    // Actualizar la escultura con la URL de la miniatura
    sculpture.thumbnail = thumbnailUrl;
    
    // Guardar los metadatos actualizados
    await this.updateSculpture(sculpture);
  }

  /**
   * Guarda los metadatos de una escultura
   * @param sculpture Escultura sonora
   */
  private static async saveMetadata(sculpture: SoundSculpture): Promise<void> {
    try {
      // Leer metadatos existentes
      const sculptures = await this.getAllSculptures();
      
      // Agregar nueva escultura
      sculptures.push(sculpture);
      
      // Guardar metadatos actualizados
      await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(sculptures));
    } catch (error) {
      console.error('Error al guardar metadatos:', error);
      throw error;
    }
  }

  /**
   * Actualiza los metadatos de una escultura existente
   * @param updatedSculpture Escultura actualizada
   */
  static async updateSculpture(updatedSculpture: SoundSculpture): Promise<void> {
    try {
      // Leer metadatos existentes
      const sculptures = await this.getAllSculptures();
      
      // Encontrar y actualizar la escultura
      const index = sculptures.findIndex(s => s.id === updatedSculpture.id);
      if (index !== -1) {
        sculptures[index] = updatedSculpture;
        
        // Guardar metadatos actualizados
        await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(sculptures));
      } else {
        throw new Error(`Escultura con ID ${updatedSculpture.id} no encontrada`);
      }
    } catch (error) {
      console.error('Error al actualizar escultura:', error);
      throw error;
    }
  }

  /**
   * Obtiene todas las esculturas guardadas
   * @returns Lista de esculturas
   */
  static async getAllSculptures(): Promise<SoundSculpture[]> {
    try {
      await this.initialize();
      
      // Leer archivo de metadatos
      const metadataJson = await FileSystem.readAsStringAsync(METADATA_FILE);
      return JSON.parse(metadataJson) as SoundSculpture[];
    } catch (error) {
      console.error('Error al obtener esculturas:', error);
      return [];
    }
  }

  /**
   * Obtiene una escultura por su ID
   * @param id ID de la escultura
   * @returns Escultura encontrada o null
   */
  static async getSculptureById(id: string): Promise<SoundSculpture | null> {
    try {
      const sculptures = await this.getAllSculptures();
      return sculptures.find(s => s.id === id) || null;
    } catch (error) {
      console.error('Error al obtener escultura por ID:', error);
      return null;
    }
  }

  /**
   * Elimina una escultura
   * @param id ID de la escultura a eliminar
   */
  static async deleteSculpture(id: string): Promise<void> {
    try {
      // Obtener la escultura
      const sculpture = await this.getSculptureById(id);
      if (!sculpture) throw new Error(`Escultura con ID ${id} no encontrada`);
      
      // Eliminar el archivo de audio
      await FileSystem.deleteAsync(sculpture.uri, { idempotent: true });
      
      // Eliminar la miniatura si existe y es un archivo local
      if (sculpture.thumbnail && sculpture.thumbnail.startsWith('file://')) {
        await FileSystem.deleteAsync(sculpture.thumbnail, { idempotent: true });
      }
      
      // Actualizar metadatos
      const sculptures = await this.getAllSculptures();
      const updatedSculptures = sculptures.filter(s => s.id !== id);
      await FileSystem.writeAsStringAsync(METADATA_FILE, JSON.stringify(updatedSculptures));
    } catch (error) {
      console.error('Error al eliminar escultura:', error);
      throw error;
    }
  }

  /**
   * Exporta una escultura a la galería del dispositivo
   * @param id ID de la escultura
   * @param format Formato de exportación
   * @returns URI del archivo exportado
   */
  static async exportSculpture(id: string, format: 'audio' | 'png' | 'stl' | 'obj' | 'mp4'): Promise<string> {
    try {
      // Obtener la escultura
      const sculpture = await this.getSculptureById(id);
      if (!sculpture) throw new Error(`Escultura con ID ${id} no encontrada`);
      
      // En una implementación real, aquí convertiríamos la escultura al formato solicitado
      // Por ahora, simplemente exportamos el archivo de audio original
      
      if (format === 'audio') {
        // Guardar el audio en la galería
        const asset = await MediaLibrary.createAssetAsync(sculpture.uri);
        await MediaLibrary.createAlbumAsync('Sound Sculptures', asset, false);
        return asset.uri;
      } else {
        // Simular la exportación de otros formatos
        // En una implementación real, aquí generaríamos el archivo en el formato solicitado
        
        // Crear un archivo temporal para simular
        const tempFileName = `${sculpture.name}.${format}`;
        const tempFilePath = FileSystem.cacheDirectory + tempFileName;
        
        // Escribir un archivo de prueba
        await FileSystem.writeAsStringAsync(tempFilePath, 'Archivo de prueba');
        
        // Guardar en la galería (solo funcionaría con imágenes y videos reales)
        if (format === 'png' || format === 'mp4') {
          const asset = await MediaLibrary.createAssetAsync(tempFilePath);
          await MediaLibrary.createAlbumAsync('Sound Sculptures', asset, false);
          return asset.uri;
        }
        
        return tempFilePath;
      }
    } catch (error) {
      console.error('Error al exportar escultura:', error);
      throw error;
    }
  }
}