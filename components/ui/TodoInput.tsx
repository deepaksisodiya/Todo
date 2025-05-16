import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { HapticFeedback } from '../../utils/haptics';
import { Transitions } from '../../utils/transitions';
import { validateTodo } from '../../utils/validation';
import { useToast } from './ToastManager';

interface TodoInputProps {
  onAdd: (text: string) => void;
  isLoading?: boolean;
}

export function TodoInput({ onAdd, isLoading }: TodoInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isTouched, setIsTouched] = useState(false);
  const { showToast } = useToast();
  const shakeAnim = useRef(new Animated.Value(0)).current;

  const handleAdd = async () => {
    const validationResult = validateTodo(text);
    if (validationResult.isValid) {
      await HapticFeedback.success();
      onAdd(text.trim());
      setText('');
      setError(undefined);
      setIsTouched(false);
      showToast('success', 'Todo added successfully');
      Transitions.configureLayout('spring');
    } else {
      await HapticFeedback.error();
      setError(validationResult.error);
      showToast('error', validationResult.error || 'Invalid todo');
      // Shake animation for error
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 10,
          ...Transitions.timing.quick,
        }),
        Animated.timing(shakeAnim, {
          toValue: -10,
          ...Transitions.timing.quick,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          ...Transitions.timing.quick,
        }),
      ]).start();
    }
  };

  const handleChangeText = async (value: string) => {
    setText(value);
    if (isTouched) {
      const validationResult = validateTodo(value);
      if (validationResult.error !== error) {
        await HapticFeedback.selection();
        Transitions.configureLayout();
        setError(validationResult.error);
      }
    }
  };

  const handleBlur = async () => {
    setIsTouched(true);
    const validationResult = validateTodo(text);
    if (validationResult.error !== error) {
      await HapticFeedback.selection();
      Transitions.configureLayout();
      setError(validationResult.error);
    }
    if (validationResult.error) {
      await HapticFeedback.warning();
      showToast('error', validationResult.error);
    }
  };

  const handlePress = async () => {
    if (!isLoading && text.trim() && !error) {
      await handleAdd();
    } else if (!text.trim() || error) {
      await HapticFeedback.error();
    }
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View 
        style={[
          styles.container, 
          error && styles.errorContainer,
          {
            transform: [{ translateX: shakeAnim }]
          }
        ]}
      >
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={handleChangeText}
          onBlur={handleBlur}
          placeholder="Add a new todo..."
          placeholderTextColor="#999"
          returnKeyType="done"
          onSubmitEditing={handleAdd}
          maxLength={100}
          editable={!isLoading}
        />
        <TouchableOpacity 
          style={[
            styles.addButton,
            (!text.trim() || error || isLoading) && styles.disabledButton
          ]}
          onPress={handlePress}
          disabled={!text.trim() || !!error || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <MaterialIcons 
              name="add" 
              size={24} 
              color={(text.trim() && !error) ? "white" : "#999"} 
            />
          )}
        </TouchableOpacity>
      </Animated.View>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  errorContainer: {
    borderColor: '#FF5252',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 12,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
}); 