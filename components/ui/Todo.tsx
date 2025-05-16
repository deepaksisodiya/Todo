import { MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  UIManager,
  View
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
  onEdit: (id: string, newText: string) => void;
  isToggling?: boolean;
  isDeleting?: boolean;
  isEditing?: boolean;
}

export function Todo({ 
  item, 
  onToggle, 
  onDelete, 
  onEdit,
  isToggling, 
  isDeleting,
  isEditing 
}: TodoProps) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const inputRef = useRef<TextInput>(null);

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

  const handleEdit = async () => {
    await HapticFeedback.light();
    setIsEditMode(true);
    setEditText(item.text);
    // Focus the input after a short delay to ensure it's rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const handleSave = async () => {
    if (editText.trim() === '') {
      await HapticFeedback.error();
      return;
    }
    await HapticFeedback.success();
    onEdit(item.id, editText.trim());
    setIsEditMode(false);
  };

  const handleCancel = async () => {
    await HapticFeedback.light();
    setEditText(item.text);
    setIsEditMode(false);
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
        disabled={isToggling || isEditMode}
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
      
      {isEditMode ? (
        <View style={styles.editContainer}>
          <TextInput
            ref={inputRef}
            testID="edit-input"
            style={styles.input}
            value={editText}
            onChangeText={setEditText}
            maxLength={100}
            autoCapitalize="none"
            autoCorrect={false}
            accessibilityLabel="Edit todo text"
            accessibilityHint="Enter new todo text"
          />
          <TouchableOpacity
            testID="save-button"
            style={styles.actionButton}
            onPress={handleSave}
            disabled={isEditing}
            accessibilityLabel="Save changes"
          >
            <MaterialIcons name="check" size={20} color="#4CAF50" />
          </TouchableOpacity>
          <TouchableOpacity
            testID="cancel-button"
            style={styles.actionButton}
            onPress={handleCancel}
            accessibilityLabel="Cancel editing"
          >
            <MaterialIcons name="close" size={20} color="#FF5252" />
          </TouchableOpacity>
        </View>
      ) : (
        <>
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
            testID="edit-button"
            style={styles.actionButton}
            onPress={handleEdit}
            disabled={item.completed || isEditing}
            accessibilityLabel="Edit todo"
            accessibilityHint="Double tap to edit todo text"
          >
            <MaterialIcons 
              name="edit" 
              size={20} 
              color={item.completed ? "#BDBDBD" : "#757575"} 
            />
          </TouchableOpacity>
          
          <TouchableOpacity 
            testID="delete-button"
            style={styles.deleteButton}
            onPress={() => handlePressDelete(item.id)}
            disabled={isDeleting || isEditMode}
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
        </>
      )}
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
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    padding: 8,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 4,
    marginRight: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
}); 