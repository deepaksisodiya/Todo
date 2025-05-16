import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { validateTodo } from '../../utils/validation';
import { useToast } from './ToastManager';

interface TodoInputProps {
  onAdd: (text: string) => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [text, setText] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [isTouched, setIsTouched] = useState(false);
  const { showToast } = useToast();

  const handleAdd = () => {
    const validationResult = validateTodo(text);
    if (validationResult.isValid) {
      onAdd(text.trim());
      setText('');
      setError(undefined);
      setIsTouched(false);
      showToast('success', 'Todo added successfully');
    } else {
      setError(validationResult.error);
      showToast('error', validationResult.error || 'Invalid todo');
    }
  };

  const handleChangeText = (value: string) => {
    setText(value);
    if (isTouched) {
      const validationResult = validateTodo(value);
      setError(validationResult.error);
    }
  };

  const handleBlur = () => {
    setIsTouched(true);
    const validationResult = validateTodo(text);
    setError(validationResult.error);
    if (validationResult.error) {
      showToast('error', validationResult.error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={[styles.container, error && styles.errorContainer]}>
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
        />
        <TouchableOpacity 
          style={[
            styles.addButton,
            (!text.trim() || error) && styles.disabledButton
          ]}
          onPress={handleAdd}
          disabled={!text.trim() || !!error}
        >
          <MaterialIcons 
            name="add" 
            size={24} 
            color={(text.trim() && !error) ? "white" : "#999"} 
          />
        </TouchableOpacity>
      </View>
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