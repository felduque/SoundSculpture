import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSculptures } from "@/contexts/SculptureContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FontAwesome } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, Image, SafeAreaView, TouchableOpacity, View } from "react-native";

// Importar el tipo desde el servicio
import { SoundSculpture } from "@/services/SculptureService";

export default function GalleryScreen() {
  const [selectedSculpture, setSelectedSculpture] = useState<string | null>(null);
  
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  // Usar el contexto de esculturas
  const { sculptures, isLoading, error, refreshSculptures, deleteSculpture, setCurrentSculpture } = useSculptures();

  // Cargar esculturas al montar el componente
  useEffect(() => {
    refreshSculptures();
  }, []);

  const handleSculpturePress = (id: string) => {
    setSelectedSculpture(id === selectedSculpture ? null : id);
  };

  const handleVisualize = (sculpture: SoundSculpture) => {
    // Navegar a la pantalla de visualización con los datos de la escultura
    router.push({
      pathname: '/visualize',
      params: { sculptureId: sculpture.id }
    });
  };

  const handleExport = (sculpture: SoundSculpture) => {
    // Navegar a la pantalla de exportación con los datos de la escultura
    router.push({
      pathname: '/export',
      params: { sculptureId: sculpture.id }
    });
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      "Eliminar escultura",
      "¿Estás seguro de que deseas eliminar esta escultura sonora?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: async () => {
            try {
              await deleteSculpture(id);
              setSelectedSculpture(null);
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            } catch (error) {
              console.error('Error al eliminar la escultura:', error);
              Alert.alert("Error", "No se pudo eliminar la escultura. Inténtalo de nuevo.");
            }
          }
        }
      ]
    );
  };

  // Formatear la duración en formato mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Formatear la fecha para mostrarla
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const renderSculptureItem = ({ item }: { item: SoundSculpture }) => {
    const isSelected = selectedSculpture === item.id;
    
    return (
      <TouchableOpacity
        onPress={() => handleSculpturePress(item.id)}
        className={`mb-4 rounded-lg overflow-hidden ${isSelected ? 'border-2' : 'border'}`}
        style={{ 
          borderColor: isSelected ? tintColor : 'rgba(0,0,0,0.1)',
        }}
      >
        <ThemedView className="flex-row">
          <Image 
            source={{ uri: item.thumbnail }}
            className="w-24 h-24"
            resizeMode="cover"
          />
          <View className="flex-1 justify-center p-3">
            <ThemedText type="defaultSemiBold" numberOfLines={1}>
              {item.name}
            </ThemedText>
            <ThemedText type="default" className="opacity-70 text-sm">
              {formatDate(item.date)} • {formatDuration(item.duration)}
            </ThemedText>
          </View>
        </ThemedView>
        
        {isSelected && (
          <ThemedView className="flex-row justify-around p-2 border-t" 
            style={{ borderTopColor: 'rgba(0,0,0,0.1)' }}
          >
            <TouchableOpacity 
              onPress={() => handleVisualize(item)}
              className="flex-row items-center p-2"
            >
              <FontAwesome name="cube" size={16} color={tintColor} />
              <ThemedText type="default" className="ml-2" style={{ color: tintColor }}>
                Visualizar
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleExport(item)}
              className="flex-row items-center p-2"
            >
              <FontAwesome name="download" size={16} color={tintColor} />
              <ThemedText type="default" className="ml-2" style={{ color: tintColor }}>
                Exportar
              </ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={() => handleDelete(item.id)}
              className="flex-row items-center p-2"
            >
              <FontAwesome name="trash" size={16} color="#FF3B30" />
              <ThemedText type="default" className="ml-2" style={{ color: '#FF3B30' }}>
                Eliminar
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 px-5 pt-10 pb-5" style={{ backgroundColor }}>
      <View className="flex-row justify-between items-center mb-6">
        <ThemedText type="title">
          Galería de Esculturas
        </ThemedText>
        
        <TouchableOpacity 
          onPress={refreshSculptures}
          className="p-2"
          disabled={isLoading}
        >
          <FontAwesome name="refresh" size={20} color={tintColor} />
        </TouchableOpacity>
      </View>
      
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={tintColor} />
          <ThemedText type="default" className="mt-4">
            Cargando esculturas...
          </ThemedText>
        </View>
      ) : error ? (
        <View className="flex-1 justify-center items-center">
          <FontAwesome name="exclamation-triangle" size={64} color="#FF3B30" />
          <ThemedText type="default" className="mt-4 text-center">
            {error}
            Toca el botón de actualizar para intentar de nuevo.
          </ThemedText>
        </View>
      ) : sculptures.length > 0 ? (
        <FlatList
          data={sculptures}
          renderItem={renderSculptureItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshing={isLoading}
          onRefresh={refreshSculptures}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <FontAwesome name="music" size={64} color="rgba(0,0,0,0.2)" />
          <ThemedText type="default" className="opacity-50 mt-4 text-center">
            No hay esculturas sonoras guardadas.
            Graba un sonido para comenzar a crear.
          </ThemedText>
        </View>
      )}
    </SafeAreaView>
  );
}