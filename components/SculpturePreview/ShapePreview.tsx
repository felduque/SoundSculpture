import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from '@/components/ui/IconLucide';
import { ShapeTypeConfig } from '@/types';

interface ShapePreviewProps {
  shape: ShapeTypeConfig;
  isSelected: boolean;
  onSelect: () => void;
}

export function ShapePreview({ shape, isSelected, onSelect }: ShapePreviewProps) {
  return (
    <TouchableOpacity
      style={[styles.container, isSelected && styles.containerSelected]}
      onPress={onSelect}
    >
      {shape.imageUrl ? (
        <Image source={{ uri: shape.imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.iconContainer}>
          <Icon name={shape.icon} size={32} color={isSelected ? '#3b82f6' : '#666'} />
        </View>
      )}
      
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Icon 
            name={shape.icon} 
            size={16} 
            color="white" 
            style={styles.overlayIcon}
          />
          <Text style={styles.name}>{shape.name}</Text>
        </View>
        
        {isSelected && (
          <View style={styles.selectedIndicator}>
            <Icon name="Check" size={16} color="white" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 80,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  containerSelected: {
    borderColor: '#3b82f6',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  iconContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  overlayIcon: {
    marginRight: 4,
  },
  name: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedIndicator: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 2,
  },
});