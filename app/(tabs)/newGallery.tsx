import { ExportModal } from "@/components/SculptureExport/ExportModal";
import Icon from "@/components/ui/IconLucide";
import { shapesFilter, shapeTypes } from "@/constants/shapes";
import { useSculptureData } from "@/hooks/useSculptureData";
import { useTranslation } from "@/hooks/useTranslation";
import { Sculpture, ShapeType, ShapeTypeConfig } from "@/types";
import { useCallback, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ListRenderItem,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

export default function NewGallery() {
  const { t } = useTranslation();
  const [shapeType, setShapeType] = useState<ShapeType>("all");
  const [selectedSculpture, setSelectedSculpture] = useState<Sculpture | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const { data, loading, filteredSculpture } = useSculptureData();

  const handleShape = (e: ShapeType) => {
    setShapeType(e);
  };

  const handleSearch = useCallback(
    async (shape: ShapeType) => {
      handleShape(shape);
      await filteredSculpture({ for: "all", shape: shape });
    },
    [filteredSculpture]
  );

  const handleExportSculpture = (sculpture: Sculpture) => {
    setSelectedSculpture(sculpture);
    setShowExportModal(true);
  };

  const renderGalleryItem: ListRenderItem<Sculpture> = ({ item, index }) => {
    const shape = shapeTypes.find((e) => e.id === item.shapeType) as ShapeTypeConfig;
    
    return (
      <View style={{ width: CARD_WIDTH, marginBottom: 20 }}>
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
          <View className="relative">
            {/* Use shape preview image */}
            <Image
              source={{ 
                uri: shape?.imageUrl || "https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg?auto=compress&cs=tinysrgb&w=400"
              }}
              className="w-full h-40"
              resizeMode="cover"
            />
            <View
              className="absolute inset-0"
              style={{ backgroundColor: item.color + "40" }} // Add transparency to sculpture color
            />
            
            {/* Action Buttons */}
            <View className="top-3 right-3 absolute flex-row gap-2">
              <TouchableOpacity
                onPress={() => handleExportSculpture(item)}
                className="bg-white/90 p-2 rounded-full"
              >
                <Icon name="Download" size={16} color="#3b82f6" />
              </TouchableOpacity>
              {/* <TouchableOpacity
                className="bg-white/90 p-2 rounded-full"
              >
                <Icon name="Heart" size={16} color="#ef4444" />
              </TouchableOpacity> */}
            </View>
            
            {/* Shape Badge */}
            <View
              className="bottom-3 left-3 absolute flex-row items-center gap-1 px-2 py-1 rounded-full"
              style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            >
              <Icon name={shape?.icon} size={12} color="#fff" />
              <Text className="font-medium text-white text-xs">
                {t.recording.shapes[shape?.id]}
              </Text>
            </View>
          </View>

          <View className="p-4">
            <Text className="mb-1 font-bold text-base text-neutral-800 dark:text-neutral-100">
              {item.name}
            </Text>
            <Text className="mb-2 text-neutral-500 text-sm dark:text-neutral-400">
              {item.points.length} points • {(item.duration / 1000).toFixed(1)}s
            </Text>

            <View className="flex-row justify-between items-center">
              <Text className="text-neutral-400 text-xs dark:text-neutral-500">
                {item.createdAt}
              </Text>
              <View 
                className="rounded-full w-4 h-4"
                style={{ backgroundColor: item.color }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const headerComponent = () => (
    <View>
      {/* Header */}
      <View className="border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 border-b">
        <View className="flex-row items-center">
          <View
            className="p-3 rounded-2xl"
            style={{ backgroundColor: "#6366f1" }}
          >
            <Icon name="GalleryThumbnails" size={28} color="#ffffff" />
          </View>
          <Text className="ml-4 font-bold text-2xl text-neutral-800 dark:text-neutral-100">
            {t.gallery.title}
          </Text>
        </View>
      </View>

      {/* Filter Section */}
      <View className="bg-neutral-50 dark:bg-neutral-900 py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        >
          {shapesFilter.map((item) => {
            const isSelected = item.id === shapeType;
            const displayName = item.id === "all" ? t.gallery.filters.all : t.recording.shapes[item.id];
            
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
                  {displayName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Enhanced Stats Section */}
      <View className="border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-4 border-b">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="font-bold text-indigo-600 text-xl dark:text-indigo-400">
              {data.length}
            </Text>
            <Text className="text-neutral-500 text-sm dark:text-neutral-400">
              {t.gallery.stats.sculptures}
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-purple-600 text-xl dark:text-purple-400">
              {shapeTypes.length}
            </Text>
            <Text className="text-neutral-500 text-sm dark:text-neutral-400">
              Shape Types
            </Text>
          </View>
          <View className="items-center">
            <Text className="font-bold text-emerald-600 text-xl dark:text-emerald-400">
              {data.reduce((acc, sculpture) => acc + sculpture.duration, 0) / 1000 / 60 | 0}m
            </Text>
            <Text className="text-neutral-500 text-sm dark:text-neutral-400">
              Total Audio
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
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
        />
      </View>

      {/* Export Modal */}
      <ExportModal
        visible={showExportModal}
        onClose={() => {
          setShowExportModal(false);
          setSelectedSculpture(null);
        }}
        sculpture={selectedSculpture}
      />
    </SafeAreaView>
  );
}