import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Check, Palette } from 'lucide-react-native';

interface Props {
  visible: boolean;
  currentColor: string;
  onColorSelect: (color: string) => void;
  onClose: () => void;
}

const PRESET_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#FF8A80', '#80CBC4', '#A5D6A7', '#FFCC80',
  '#CE93D8', '#90CAF9', '#FFAB91', '#B39DDB',
  '#FF5722', '#009688', '#2196F3', '#4CAF50',
  '#FFC107', '#9C27B0', '#00BCD4', '#8BC34A',
  '#FF9800', '#673AB7', '#03DAC6', '#CDDC39',
  '#E91E63', '#3F51B5', '#00E676', '#FFEB3B',
];

const COLOR_CATEGORIES = [
  { name: 'Warm', colors: ['#FF6B6B', '#FF8A80', '#FFAB91', '#FF5722', '#FF9800', '#E91E63'] },
  { name: 'Cool', colors: ['#4ECDC4', '#45B7D1', '#80CBC4', '#009688', '#2196F3', '#00BCD4'] },
  { name: 'Nature', colors: ['#96CEB4', '#A5D6A7', '#4CAF50', '#8BC34A', '#CDDC39', '#00E676'] },
  { name: 'Vibrant', colors: ['#DDA0DD', '#CE93D8', '#9C27B0', '#673AB7', '#3F51B5', '#B39DDB'] },
];

export function ColorPicker({ visible, currentColor, onColorSelect, onClose }: Props) {
  const [selectedColor, setSelectedColor] = useState(currentColor);
  const [customColor, setCustomColor] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleCustomColorSubmit = () => {
    let color = customColor.trim();
    
    // Add # if not present
    if (color && !color.startsWith('#')) {
      color = `#${color}`;
    }
    
    // Validate hex color
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    if (hexRegex.test(color)) {
      setSelectedColor(color);
      setCustomColor('');
    } else {
      Alert.alert('Invalid Color', 'Please enter a valid hex color (e.g., #FF6B6B or FF6B6B)');
    }
  };

  const handleApply = () => {
    onColorSelect(selectedColor);
    onClose();
  };

  const getColorsToShow = () => {
    if (activeCategory === 'All') {
      return PRESET_COLORS;
    }
    const category = COLOR_CATEGORIES.find(cat => cat.name === activeCategory);
    return category ? category.colors : PRESET_COLORS;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Choose Color</Text>
          <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
            <Check size={24} color="#3b82f6" />
          </TouchableOpacity>
        </View>

        {/* Current Selection Preview */}
        <View style={styles.previewSection}>
          <View style={styles.previewContainer}>
            <View style={[styles.currentColorPreview, { backgroundColor: currentColor }]} />
            <Text style={styles.previewLabel}>Current</Text>
          </View>
          <View style={styles.previewContainer}>
            <View style={[styles.selectedColorPreview, { backgroundColor: selectedColor }]} />
            <Text style={styles.previewLabel}>Selected</Text>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Category Tabs */}
          <View style={styles.categoryTabs}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['All', ...COLOR_CATEGORIES.map(cat => cat.name)].map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setActiveCategory(category)}
                  style={[
                    styles.categoryTab,
                    activeCategory === category && styles.activeCategoryTab
                  ]}
                >
                  <Text style={[
                    styles.categoryTabText,
                    activeCategory === category && styles.activeCategoryTabText
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Color Grid */}
          <View style={styles.colorGrid}>
            {getColorsToShow().map((color, index) => (
              <TouchableOpacity
                key={`${activeCategory}-${index}`}
                onPress={() => handleColorSelect(color)}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColorOption
                ]}
              >
                {selectedColor === color && (
                  <Check size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* Custom Color Input */}
          <View style={styles.customColorSection}>
            <Text style={styles.sectionTitle}>Custom Color</Text>
            <View style={styles.customColorInput}>
              <Palette size={20} color="#666" />
              <TextInput
                style={styles.textInput}
                placeholder="Enter hex color (e.g., FF6B6B)"
                value={customColor}
                onChangeText={setCustomColor}
                onSubmitEditing={handleCustomColorSubmit}
                autoCapitalize="characters"
                maxLength={7}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={handleCustomColorSubmit} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Color Harmony Suggestions */}
          <View style={styles.harmonySection}>
            <Text style={styles.sectionTitle}>Color Harmonies</Text>
            <Text style={styles.sectionSubtitle}>Based on your current selection</Text>
            <View style={styles.harmonyGrid}>
              {generateColorHarmonies(selectedColor).map((harmony, index) => (
                <View key={index} style={styles.harmonyGroup}>
                  <Text style={styles.harmonyLabel}>{harmony.name}</Text>
                  <View style={styles.harmonyColors}>
                    {harmony.colors.map((color, colorIndex) => (
                      <TouchableOpacity
                        key={colorIndex}
                        onPress={() => handleColorSelect(color)}
                        style={[styles.harmonyColor, { backgroundColor: color }]}
                      />
                    ))}
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

// Helper function to generate color harmonies
function generateColorHarmonies(baseColor: string) {
  // Convert hex to HSL for color manipulation
  const hsl = hexToHsl(baseColor);
  
  return [
    {
      name: 'Analogous',
      colors: [
        hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
        baseColor,
        hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
      ]
    },
    {
      name: 'Complementary',
      colors: [
        baseColor,
        hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l),
      ]
    },
    {
      name: 'Triadic',
      colors: [
        baseColor,
        hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l),
        hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l),
      ]
    },
  ];
}

// Color conversion utilities
function hexToHsl(hex: string) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert 3-digit hex to 6-digit
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.slice(0, 2), 16) / 255;
  const g = parseInt(hex.slice(2, 4), 16) / 255;
  const b = parseInt(hex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  const toHex = (c: number) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  applyButton: {
    padding: 4,
  },
  previewSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#f8f9fa',
    gap: 40,
  },
  previewContainer: {
    alignItems: 'center',
    gap: 8,
  },
  currentColorPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  selectedColorPreview: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#3b82f6',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  previewLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  categoryTabs: {
    marginVertical: 20,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryTab: {
    backgroundColor: '#3b82f6',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryTabText: {
    color: '#fff',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 30,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  customColorSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  customColorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  harmonySection: {
    marginBottom: 30,
  },
  harmonyGrid: {
    gap: 16,
  },
  harmonyGroup: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
  },
  harmonyLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  harmonyColors: {
    flexDirection: 'row',
    gap: 8,
  },
  harmonyColor: {
    width: 30,
    height: 30,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});