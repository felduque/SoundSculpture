// import { ThemedText } from "@/components/ThemedText";
// import { ThemedView } from "@/components/ThemedView";
// import { useSculptures } from "@/contexts/SculptureContext";
// import { useThemeColor } from "@/hooks/useThemeColor";
// import { SoundSculpture } from "@/services/SculptureService";
// import { FontAwesome } from '@expo/vector-icons';
// import * as Haptics from 'expo-haptics';
// import * as MediaLibrary from 'expo-media-library';
// import { useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, Alert, SafeAreaView, ScrollView, TouchableOpacity, View } from "react-native";

// // Tipo para las esculturas sonoras
// type SoundSculpture = {
//   id: string;
//   name: string;
//   uri: string;
//   duration: number;
//   date: string;
//   thumbnail?: string;
// };

// // Importar el tipo desde el servicio

// // Formatos de exportación disponibles
// const EXPORT_FORMATS = [
//   { id: 'stl', name: 'STL (3D)', extension: '.stl', icon: 'cube', description: 'Para impresión 3D' },
//   { id: 'obj', name: 'OBJ (3D)', extension: '.obj', icon: 'cubes', description: 'Formato 3D universal' },
//   { id: 'png', name: 'PNG (Imagen)', extension: '.png', icon: 'image', description: 'Imagen estática' },
//   { id: 'mp4', name: 'MP4 (Video)', extension: '.mp4', icon: 'film', description: 'Animación de la escultura' },
//   { id: 'm4a', name: 'M4A (Audio)', extension: '.m4a', icon: 'music', description: 'Audio original' },
// ];

// export default function ExportScreen() {
//   const params = useLocalSearchParams<{ sculptureId: string }>();
//   const [selectedFormat, setSelectedFormat] = useState<string>('stl');
//   const [isExporting, setIsExporting] = useState(false);
//   const [exportProgress, setExportProgress] = useState(0);
//   const [hasMediaPermission, setHasMediaPermission] = useState(false);
  
//   const backgroundColor = useThemeColor({}, 'background');
//   const tintColor = useThemeColor({}, 'tint');
//   const cardColor = useThemeColor({}, 'card');
  
//   // Usar el contexto de esculturas
//   const { sculptures, isLoading, currentSculpture, setCurrentSculpture, exportSculpture } = useSculptures();

//   // Solicitar permisos para guardar archivos
//   useEffect(() => {
//     (async () => {
//       const { status } = await MediaLibrary.requestPermissionsAsync();
//       setHasMediaPermission(status === 'granted');
//     })();
//   }, []);

//   useEffect(() => {
//     // Cargar la escultura seleccionada
//     if (params.sculptureId) {
//       // Buscar la escultura en el contexto
//       const selectedSculpture = sculptures.find(s => s.id === params.sculptureId) || null;
//       if (selectedSculpture) {
//         setCurrentSculpture(selectedSculpture);
//       }
//     }
//   }, [params.sculptureId, sculptures]);

//   const handleFormatSelect = (formatId: string) => {
//     setSelectedFormat(formatId);
//   };

//   // Función para iniciar la exportación
//   const handleExport = async () => {
//     if (!currentSculpture) return;
    
//     try {
//       // Feedback háptico
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
//       setIsExporting(true);
//       setExportProgress(0);
      
//       // Simulamos el progreso de exportación
//       const progressInterval = setInterval(() => {
//         setExportProgress((prev) => {
//           const newProgress = prev + 0.05;
//           if (newProgress >= 0.95) {
//             clearInterval(progressInterval);
//             return 0.95;
//           }
//           return newProgress;
//         });
//       }, 100);
      
//       // Exportar la escultura usando el servicio
//       const result = await exportSculpture(currentSculpture.id, selectedFormat);
      
//       // Limpiar el intervalo y completar el progreso
//       clearInterval(progressInterval);
//       setExportProgress(1);
      
//       setTimeout(() => {
//         setIsExporting(false);
        
//         if (result.success) {
//           Alert.alert(
//             "Exportación completada",
//             `La escultura "${currentSculpture.name}" ha sido exportada como ${selectedFormat.toUpperCase()}.\n\nGuardada en: ${result.filePath}`,
//             [{ text: "OK" }]
//           );
//         } else {
//           Alert.alert(
//             "Error en la exportación",
//             `No se pudo exportar la escultura: ${result.error}`,
//             [{ text: "OK" }]
//           );
//         }
//       }, 500);
//     } catch (error) {
//       console.error('Error al exportar:', error);
//       setIsExporting(false);
      
//       // Feedback háptico de error
//       Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
//       Alert.alert(
//         "Error",
//         "Ocurrió un error al exportar la escultura. Inténtalo de nuevo.",
//         [{ text: "OK" }]
//       );
//     }
//   };

//   if (isLoading) {
//     return (
//       <SafeAreaView className="flex-1 px-5 pt-10 pb-5" style={{ backgroundColor }}>
//         <ThemedText type="title" className="mb-6">
//           Exportar Escultura
//         </ThemedText>
//         <View className="flex-1 justify-center items-center">
//           <ActivityIndicator size="large" color={tintColor} />
//           <ThemedText type="default" className="mt-4 text-center">
//             Cargando...
//           </ThemedText>
//         </View>
//       </SafeAreaView>
//     );
//   }
  
//   if (!currentSculpture) {
//     return (
//       <SafeAreaView className="flex-1 px-5 pt-10 pb-5" style={{ backgroundColor }}>
//         <ThemedText type="title" className="mb-6">
//           Exportar Escultura
//         </ThemedText>
//         <View className="flex-1 justify-center items-center">
//           <ThemedText type="default" className="opacity-50 text-center">
//             Selecciona una escultura sonora desde la galería para exportarla.
//           </ThemedText>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 px-5 pt-10 pb-5" style={{ backgroundColor }}>
//       <ScrollView showsVerticalScrollIndicator={false}>
//         <ThemedText type="title" className="mb-2">
//           Exportar Escultura
//         </ThemedText>
        
//         <ThemedText type="subtitle" className="mb-6">
//         {currentSculpture.name}
//       </ThemedText>
        
//         <ThemedText type="defaultSemiBold" className="mb-4">
//           Selecciona un formato de exportación:
//         </ThemedText>
        
//         {EXPORT_FORMATS.map((format) => (
//           <TouchableOpacity
//             key={format.id}
//             onPress={() => handleFormatSelect(format.id)}
//             className={`mb-4 p-4 rounded-lg border ${selectedFormat === format.id ? 'border-2' : 'border'}`}
//             style={{ 
//               borderColor: selectedFormat === format.id ? tintColor : 'rgba(0,0,0,0.1)',
//             }}
//           >
//             <ThemedView className="flex-row items-center">
//               <View 
//                 className="justify-center items-center mr-3 rounded-full w-10 h-10"
//                 style={{ backgroundColor: selectedFormat === format.id ? tintColor : 'rgba(0,0,0,0.1)' }}
//               >
//                 <FontAwesome 
//                   name={format.icon as any} 
//                   size={18} 
//                   color={selectedFormat === format.id ? 'white' : 'black'} 
//                 />
//               </View>
//               <View className="flex-1">
//                 <ThemedText type="defaultSemiBold">
//                   {format.name}
//                 </ThemedText>
//                 <ThemedText type="default" className="opacity-70 text-sm">
//                   {format.description}
//                 </ThemedText>
//               </View>
//             </ThemedView>
//           </TouchableOpacity>
//         ))}
        
//         <TouchableOpacity
//           onPress={handleExport}
//           disabled={!selectedFormat || isExporting}
//           className="justify-center items-center mt-6 mb-10 p-4 rounded-lg"
//           style={{ 
//             backgroundColor: !selectedFormat || isExporting ? 'rgba(0,0,0,0.1)' : tintColor,
//             opacity: !selectedFormat || isExporting ? 0.7 : 1,
//           }}
//         >
//           {isExporting ? (
//             <View className="flex-row items-center">
//               <ActivityIndicator color="white" size="small" style={{ marginRight: 10 }} />
//               <ThemedText type="defaultSemiBold" style={{ color: 'white' }}>
//                 Exportando...
//               </ThemedText>
//             </View>
//           ) : (
//             <ThemedText type="defaultSemiBold" style={{ color: 'white' }}>
//               Exportar Escultura
//             </ThemedText>
//           )}
//         </TouchableOpacity>
        
//         <ThemedText type="default" className="opacity-70 mb-6 text-center">
//           Los archivos exportados se guardarán en la galería de tu dispositivo.
//           Los formatos 3D pueden abrirse con aplicaciones de modelado 3D o enviarse
//           directamente a una impresora 3D compatible.
//         </ThemedText>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }