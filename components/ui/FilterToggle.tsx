import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

interface FilterToggleProps {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({ 
  active, 
  onToggle,
  disabled = false 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const animatePress = useCallback(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        speed: 12,
        bounciness: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim]);

  const handlePress = useCallback(() => {
    if (!disabled) {
      animatePress();
      onToggle();
    }
  }, [disabled, animatePress, onToggle]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          active && styles.filterButtonActive,
          disabled && styles.filterButtonDisabled
        ]}
        onPress={handlePress}
        disabled={disabled}
        accessibilityLabel={active ? "Hide completed todos" : "Show completed todos"}
        accessibilityRole="button"
        accessibilityState={{ 
          selected: active,
          disabled 
        }}
      >
        <MaterialIcons
          name="filter-list"
          size={24}
          color={active ? '#4CAF50' : disabled ? '#CCC' : '#666'}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'transparent',
    marginLeft: 'auto',
    minWidth: 44,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#E8F5E9',
  },
  filterButtonDisabled: {
    opacity: 0.5,
  },
}); 