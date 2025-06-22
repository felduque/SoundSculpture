import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SculptureService, SoundSculpture } from '@/services/SculptureService';

// Tipo para el contexto
type SculptureContextType = {
  sculptures: SoundSculpture[];
  currentSculpture: SoundSculpture | null;
  isLoading: boolean;
  error: string | null;
  refreshSculptures: () => Promise<void>;
  saveSculpture: (recording: any, name: string, duration: number) => Promise<SoundSculpture>;
  deleteSculpture: (id: string) => Promise<void>;
  setCurrentSculpture: (sculpture: SoundSculpture | null) => void;
  exportSculpture: (id: string, format: 'audio' | 'png' | 'stl' | 'obj' | 'mp4') => Promise<string>;
};

// Crear el contexto
const SculptureContext = createContext<SculptureContextType | undefined>(undefined);

// Proveedor del contexto
export function SculptureProvider({ children }: { children: ReactNode }) {
  const [sculptures, setSculptures] = useState<SoundSculpture[]>([]);
  const [currentSculpture, setCurrentSculpture] = useState<SoundSculpture | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar esculturas al iniciar
  useEffect(() => {
    refreshSculptures();
  }, []);

  // Función para refrescar la lista de esculturas
  const refreshSculptures = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedSculptures = await SculptureService.getAllSculptures();
      setSculptures(loadedSculptures);
    } catch (err) {
      setError('Error al cargar las esculturas');
      console.error('Error al cargar esculturas:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para guardar una nueva escultura
  const saveSculpture = async (recording: any, name: string, duration: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const newSculpture = await SculptureService.saveSculpture(recording, name, duration);
      await refreshSculptures();
      return newSculpture;
    } catch (err) {
      setError('Error al guardar la escultura');
      console.error('Error al guardar escultura:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar una escultura
  const deleteSculpture = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await SculptureService.deleteSculpture(id);
      if (currentSculpture?.id === id) {
        setCurrentSculpture(null);
      }
      await refreshSculptures();
    } catch (err) {
      setError('Error al eliminar la escultura');
      console.error('Error al eliminar escultura:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para exportar una escultura
  const exportSculpture = async (id: string, format: 'audio' | 'png' | 'stl' | 'obj' | 'mp4') => {
    try {
      setIsLoading(true);
      setError(null);
      const exportedUri = await SculptureService.exportSculpture(id, format);
      return exportedUri;
    } catch (err) {
      setError('Error al exportar la escultura');
      console.error('Error al exportar escultura:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    sculptures,
    currentSculpture,
    isLoading,
    error,
    refreshSculptures,
    saveSculpture,
    deleteSculpture,
    setCurrentSculpture,
    exportSculpture,
  };

  return <SculptureContext.Provider value={value}>{children}</SculptureContext.Provider>;
}

// Hook para usar el contexto
export function useSculptures() {
  const context = useContext(SculptureContext);
  if (context === undefined) {
    throw new Error('useSculptures debe ser usado dentro de un SculptureProvider');
  }
  return context;
}