import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  TouchableOpacity,
  UIManager
} from 'react-native';
import { HapticFeedback } from '../../utils/haptics';
import { Transitions } from '../../utils/transitions';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoProps {
  item: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isToggling?: boolean;
  isDeleting?: boolean;
}

export function Todo({ item, onToggle, onDelete, isToggling, isDeleting }: TodoProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade in animation when component mounts
    Animated.timing(fadeAnim, {
      toValue: 1,
      ...Transitions.timing.medium,
    }).start();
  }, []);

  const handleDelete = async (id: string) => {
    // Haptic feedback before animation
    await HapticFeedback.medium();

    // Slide out and fade animation when deleting
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        ...Transitions.timing.quick,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        ...Transitions.timing.quick,
      }),
    ]).start(() => {
      onDelete(id);
    });
  };

  const handleToggle = async (id: string) => {
    // Haptic feedback based on completion state
    if (!item.completed) {
      await HapticFeedback.success();
    } else {
      await HapticFeedback.light();
    }

    // Scale animation when toggling
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        ...Transitions.timing.quick,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        ...Transitions.timing.quick,
      }),
    ]).start(() => {
      Transitions.configureLayout('spring');
      onToggle(id);
    });
  };

  const handlePress = async (id: string) => {
    if (!isToggling) {
      await handleToggle(id);
    }
  };

  const handlePressDelete = async (id: string) => {
    if (!isDeleting) {
      await handleDelete(id);
    }
  };

  return (
    <Animated.View 
      testID="todo-container"
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [
            { 
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-100, 0]
              })
            },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity 
        testID="checkbox-button"
        style={styles.checkbox} 
        onPress={() => handlePress(item.id)}
        disabled={isToggling}
      >
        {isToggling ? (
          <ActivityIndicator testID="loading-indicator" size="small" color="#4CAF50" />
        ) : (
          <MaterialIcons
            testID="checkbox-icon"
            name={item.completed ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={item.completed ? "#4CAF50" : "#757575"}
          />
        )}
      </TouchableOpacity>
      
      <Animated.Text 
        testID="todo-text"
        style={[
          styles.text,
          item.completed && styles.completedText,
        ]}
      >
        {item.text}
      </Animated.Text>
      
      <TouchableOpacity 
        testID="delete-button"
        style={styles.deleteButton}
        onPress={() => handlePressDelete(item.id)}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <ActivityIndicator testID="loading-indicator" size="small" color="#FF5252" />
        ) : (
          <MaterialIcons 
            testID="delete-icon"
            name="delete" 
            size={24} 
            color="#FF5252" 
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  checkbox: {
    marginRight: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#757575',
  },
  deleteButton: {
    padding: 4,
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 