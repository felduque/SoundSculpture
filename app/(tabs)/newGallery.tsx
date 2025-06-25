import Icon from "@/components/ui/IconLucide";
import { shapesFilter, shapeTypes } from "@/constants/shapes";
import { useSculptureData } from "@/hooks/useSculptureData";
import { Sculpture, ShapeType, ShapeTypeConfig } from "@/types";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 columnas con padding
export default function NewGallery() {
  const [shapeType, setShapeType] = useState<ShapeType>("all");
  const { data, loading, filteredSculpture } = useSculptureData();
  const viewShotRef = useRef(null);
  const handleShape = (e: ShapeType) => {
    setShapeType(e);
  };

  const handleCaptureAndSave = useCallback(async () => {
    try {
      // 1. Verificar permisos
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permiso denegado",
          "Necesitas dar permiso para guardar en la galería"
        );
        return;
      }

      // 2. Capturar la vista
      const uri = await viewShotRef.current.capture();
      console.log("Imagen capturada en:", uri);

      // 3. Guardar en la galería
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("SoundSculpture", asset, false);

      Alert.alert("¡Éxito!", "La captura se guardó en tu galería");
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "No se pudo guardar la captura");
    }
  }, []);

  
  const handleSearch = useCallback(
    async (shape: ShapeType) => {
      handleShape(shape)
      await filteredSculpture({ for: "all", shape: shape });
    },
    [filteredSculpture]
  );

  const renderGalleryItem: ListRenderItem<Sculpture> = ({
    item,
    index,
  }: {
    item: Sculpture;
    index: number;
  }) => {
    // Simplified animation or remove it for FlatList
    const shape = shapeTypes.find(
      (e) => e.id === item.shapeType
    ) as ShapeTypeConfig;
    return (
      <View
        style={{
          width: CARD_WIDTH,
          marginBottom: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.95}
          className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 24,
            elevation: 12,
          }}
        >
          {/* Imagen con overlay gradient */}
          <View className="relative">
            <Image
              source={{ uri: "https://picsum.photos/200/200?random=1" }}
              className="w-full h-40"
              resizeMode="cover"
            />
            {/* Gradient overlay */}
            <View
              className="absolute inset-0"
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
              }}
            />
            {/* Heart icon */}
            <TouchableOpacity
              className="top-3 right-3 absolute bg-white p-2 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
            >
              <Icon name="Heart" size={16} color="#ffffff" />
            </TouchableOpacity>
            {/* Likes counter */}
            <View
              className="bottom-3 left-3 absolute flex-row items-center gap-1 px-2 py-1 rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            >
              <Icon name={shape?.icon} size={12} color="#fff" />
              <Text className="font-medium text-white text-xs">
                {shape?.name}
              </Text>
            </View>
          </View>

          {/* Content */}
          <View className="p-4">
            <Text className="mb-1 font-bold text-base text-neutral-800 dark:text-neutral-100">
              {item.name}
            </Text>
            <Text className="mb-2 text-neutral-500 text-sm dark:text-neutral-400">
              {shape?.description}
            </Text>

            {/* Bottom row */}
            <View className="flex-row justify-between items-center">
              <Text className="text-neutral-400 text-xs dark:text-neutral-500">
                {item.createdAt}
              </Text>
              <TouchableOpacity className="bg-indigo-100 dark:bg-indigo-900 p-2 rounded-full">
                <Icon name="ExternalLink" size={12} color="#6366f1" />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const headerComponent = () => (
    <View>
      {/* Header */}
      <View className="flex-row justify-center items-center border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 border-b">
        <View
          className="p-3 rounded-2xl"
          style={{ backgroundColor: "#6366f1" }}
        >
          <Icon name="GalleryThumbnails" size={28} color="#ffffff" />
        </View>
        <Text className="ml-4 font-bold text-2xl text-neutral-800 dark:text-neutral-100">
          Tu Galería
        </Text>
      </View>

      {/* Filter Section */}
      <View className="bg-neutral-50 dark:bg-neutral-900 py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
          }}
        >
          {shapesFilter.map((item) => {
            const isSelected = item.id === shapeType;
            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSearch(item.id)}
                className={`flex-row items-center mx-2 px-4 py-3 rounded-2xl gap-2 ${
                  isSelected ? "bg-indigo-500" : "bg-white dark:bg-neutral-800"
                }`}
                style={{
                  shadowColor: isSelected ? "#6366f1" : "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isSelected ? 0.3 : 0.1,
                  shadowRadius: 4,
                  elevation: isSelected ? 6 : 2,
                }}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  color={isSelected ? "#ffffff" : "#6b7280"}
                />
                <Text
                  className={`font-medium ${
                    isSelected
                      ? "text-white"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Stats Section */}
      <View className="border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 border-b">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="font-bold text-indigo-600 text-xl dark:text-indigo-400">
              {data.length}
            </Text>
            <Text className="text-neutral-500 text-sm dark:text-neutral-400">
              Esculturas
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-purple-600 text-xl dark:text-purple-400">
              {/* {Math.floor(mockData.reduce((acc, item) => acc + item.likes, 0) / mockData.length)} */}
              23
            </Text>
            <Text className="text-neutral-500 text-sm dark:text-neutral-400">
              Promedio ❤️
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-emerald-600 text-xl dark:text-emerald-400">
              {shapeTypes.length}
            </Text>
            <Text className="text-neutral-500 text-sm dark:text-neutral-400">
              Categorías
            </Text>
          </View>
        </View>
      </View>
    </View>
  );


  return (
    <SafeAreaView className="flex-1 bg-neutral-50 dark:bg-neutral-950">
      <StatusBar barStyle="dark-content" backgroundColor="#fafafa" />

      <View className="flex-1">
        {headerComponent()}
        {/* <ViewShot options={{ format: "jpg", quality: 0.9 }} ref={viewShotRef}> */}
          <FlatList
            data={data}
            renderItem={renderGalleryItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingTop: 16,
              paddingBottom: 100,
            }}
            columnWrapperStyle={{
              justifyContent: "space-between",
            }}
            showsVerticalScrollIndicator={false}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={8}
          />
        {/* </ViewShot> */}
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={handleCaptureAndSave}
        className="right-6 bottom-6 absolute shadow-lg p-4 rounded-full"
        style={{
          backgroundColor: "#6366f1",
          shadowColor: "#6366f1",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Icon name="Plus" size={24} color="#ffffff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
