import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { X, Download, Image as ImageIcon, Video, FileText, Music, Box, Printer } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { Sculpture } from '@/types';
import { SculptureExporter } from '@/utils/sculptureExporter';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  sculpture: Sculpture | null;
  viewRef?: any;
}

const exportFormats = [
  {
    id: 'png',
    name: 'PNG Image',
    extension: '.png',
    icon: ImageIcon,
    description: 'High quality static image',
    category: 'Image',
    color: '#10b981',
  },
  {
    id: 'gif',
    name: 'Animated GIF',
    extension: '.gif',
    icon: Video,
    description: 'Animated sculpture loop',
    category: 'Video',
    color: '#f59e0b',
  },
  {
    id: 'mp4',
    name: 'MP4 Video',
    extension: '.mp4',
    icon: Video,
    description: 'High quality video with animation',
    category: 'Video',
    color: '#ef4444',
  },
  {
    id: 'obj',
    name: 'OBJ 3D Model',
    extension: '.obj',
    icon: Box,
    description: 'For 3D modeling software',
    category: '3D',
    color: '#8b5cf6',
  },
  {
    id: 'stl',
    name: 'STL 3D Print',
    extension: '.stl',
    icon: Printer,
    description: 'Ready for 3D printing',
    category: '3D',
    color: '#06b6d4',
  },
  {
    id: 'svg',
    name: 'SVG Vector',
    extension: '.svg',
    icon: ImageIcon,
    description: 'Scalable vector graphics',
    category: 'Vector',
    color: '#84cc16',
  },
  {
    id: 'json',
    name: 'JSON Data',
    extension: '.json',
    icon: FileText,
    description: 'Raw sculpture data',
    category: 'Data',
    color: '#6366f1',
  },
  {
    id: 'audio',
    name: 'Original Audio',
    extension: '.m4a',
    icon: Music,
    description: 'Source audio recording',
    category: 'Audio',
    color: '#ec4899',
  },
];

export function ExportModal({ visible, onClose, sculpture, viewRef }: ExportModalProps) {
  const { t } = useTranslation();
  const [selectedFormat, setSelectedFormat] = useState<string>('png');
  const [isExporting, setIsExporting] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Image', 'Video', '3D', 'Vector', 'Data', 'Audio'];

  const handleExport = async () => {
    if (!sculpture) return;

    try {
      setIsExporting(true);
      
      const format = exportFormats.find(f => f.id === selectedFormat);
      if (!format) throw new Error('Invalid format');

      switch (selectedFormat) {
        case 'png':
          await SculptureExporter.exportAsPNG(sculpture, viewRef);
          break;
        case 'gif':
          await SculptureExporter.exportAsGIF(sculpture);
          break;
        case 'mp4':
          await SculptureExporter.exportAsMP4(sculpture);
          break;
        case 'obj':
          await SculptureExporter.exportAsOBJ(sculpture);
          break;
        case 'stl':
          await SculptureExporter.exportAsSTL(sculpture);
          break;
        case 'svg':
          await SculptureExporter.exportAsSVG(sculpture);
          break;
        case 'json':
          await SculptureExporter.exportAsJSON(sculpture);
          break;
        case 'audio':
          await SculptureExporter.exportAudio(sculpture);
          break;
        default:
          throw new Error('Unsupported format');
      }

      // Success message is handled by the exporter
      onClose();
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(
        'Export Failed',
        'There was an error exporting your sculpture. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsExporting(false);
    }
  };

  const getFilteredFormats = () => {
    if (activeCategory === 'All') return exportFormats;
    return exportFormats.filter(format => format.category === activeCategory);
  };

  if (!sculpture) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.title}>Export Sculpture</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Sculpture Info */}
        <View style={styles.sculptureInfo}>
          <View style={[styles.colorIndicator, { backgroundColor: sculpture.color }]} />
          <View style={styles.sculptureDetails}>
            <Text style={styles.sculptureName}>{sculpture.name}</Text>
            <Text style={styles.sculptureStats}>
              {sculpture.shapeType} • {sculpture.points.length} points • {(sculpture.duration / 1000).toFixed(1)}s
            </Text>
          </View>
        </View>

        {/* Category Filter */}
        <View style={styles.categoryFilter}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveCategory(category)}
                style={[
                  styles.categoryButton,
                  activeCategory === category && styles.activeCategoryButton
                ]}
              >
                <Text style={[
                  styles.categoryButtonText,
                  activeCategory === category && styles.activeCategoryButtonText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Format Selection */}
        <ScrollView style={styles.formatList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Choose Export Format</Text>
          
          {getFilteredFormats().map((format) => {
            const IconComponent = format.icon;
            const isSelected = selectedFormat === format.id;
            
            return (
              <TouchableOpacity
                key={format.id}
                style={[
                  styles.formatItem,
                  isSelected && styles.formatItemSelected
                ]}
                onPress={() => setSelectedFormat(format.id)}
              >
                <View style={[styles.formatIcon, { backgroundColor: format.color + '20' }]}>
                  <IconComponent size={24} color={format.color} />
                </View>
                <View style={styles.formatInfo}>
                  <Text style={[
                    styles.formatName,
                    isSelected && styles.formatNameSelected
                  ]}>
                    {format.name}
                  </Text>
                  <Text style={styles.formatDescription}>
                    {format.description}
                  </Text>
                  <Text style={styles.formatCategory}>
                    {format.category} • {format.extension}
                  </Text>
                </View>
                {isSelected && (
                  <View style={[styles.selectedIndicator, { backgroundColor: format.color }]}>
                    <Download size={16} color="#fff" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Export Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.exportButton, isExporting && styles.exportButtonDisabled]}
            onPress={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <View style={styles.exportingContainer}>
                <ActivityIndicator color="white" size="small" />
                <Text style={styles.exportButtonText}>Exporting...</Text>
              </View>
            ) : (
              <>
                <Download size={20} color="white" />
                <Text style={styles.exportButtonText}>
                  Export as {exportFormats.find(f => f.id === selectedFormat)?.name}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
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
    color: '#000',
  },
  placeholder: {
    width: 32,
  },
  sculptureInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    gap: 16,
  },
  colorIndicator: {
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  sculptureDetails: {
    flex: 1,
  },
  sculptureName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  sculptureStats: {
    fontSize: 14,
    color: '#666',
  },
  categoryFilter: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeCategoryButton: {
    backgroundColor: '#3b82f6',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: '#fff',
  },
  formatList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 20,
    marginBottom: 16,
  },
  formatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  formatItemSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  formatIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  formatInfo: {
    flex: 1,
  },
  formatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  formatNameSelected: {
    color: '#3b82f6',
  },
  formatDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  formatCategory: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  selectedIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  exportButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  exportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  exportingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});