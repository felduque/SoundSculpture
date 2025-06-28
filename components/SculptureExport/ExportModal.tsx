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
} from 'react-native';
import Icon from '@/components/ui/IconLucide';
import { useTranslation } from '@/hooks/useTranslation';
import { Sculpture, ExportFormat } from '@/types';
import { SculptureExporter } from '@/utils/sculptureExporter';
import { exportFormats } from '@/constants/shapes';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
  sculpture: Sculpture | null;
}

export function ExportModal({ visible, onClose, sculpture }: ExportModalProps) {
  const { t } = useTranslation();
  const [selectedFormat, setSelectedFormat] = useState<string>('obj');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!sculpture) return;

    try {
      setIsExporting(true);
      
      switch (selectedFormat) {
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

      Alert.alert(
        'Export Successful',
        `Your sculpture has been exported as ${selectedFormat.toUpperCase()}.`,
        [{ text: 'OK', onPress: onClose }]
      );
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
            <Icon name="X" size={24} color="#666" />
          </TouchableOpacity>
          <Text style={styles.title}>Export Sculpture</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Sculpture Info */}
        <View style={styles.sculptureInfo}>
          <Text style={styles.sculptureName}>{sculpture.name}</Text>
          <Text style={styles.sculptureDetails}>
            {sculpture.shapeType} • {sculpture.points.length} points • {(sculpture.duration / 1000).toFixed(1)}s
          </Text>
        </View>

        {/* Format Selection */}
        <ScrollView style={styles.formatList} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Choose Export Format</Text>
          
          {exportFormats.map((format) => (
            <TouchableOpacity
              key={format.id}
              style={[
                styles.formatItem,
                selectedFormat === format.id && styles.formatItemSelected
              ]}
              onPress={() => setSelectedFormat(format.id)}
            >
              <View style={styles.formatIcon}>
                <Icon 
                  name={format.icon} 
                  size={24} 
                  color={selectedFormat === format.id ? '#3b82f6' : '#666'} 
                />
              </View>
              <View style={styles.formatInfo}>
                <Text style={[
                  styles.formatName,
                  selectedFormat === format.id && styles.formatNameSelected
                ]}>
                  {format.name}
                </Text>
                <Text style={styles.formatDescription}>
                  {format.description}
                </Text>
              </View>
              {selectedFormat === format.id && (
                <Icon name="Check" size={20} color="#3b82f6" />
              )}
            </TouchableOpacity>
          ))}
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
                <Icon name="Download" size={20} color="white" />
                <Text style={styles.exportButtonText}>
                  Export as {selectedFormat.toUpperCase()}
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
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  sculptureName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
    marginBottom: 4,
  },
  sculptureDetails: {
    fontSize: 14,
    color: '#666',
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
    marginBottom: 8,
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
    marginRight: 12,
  },
  formatInfo: {
    flex: 1,
  },
  formatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 2,
  },
  formatNameSelected: {
    color: '#3b82f6',
  },
  formatDescription: {
    fontSize: 14,
    color: '#666',
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