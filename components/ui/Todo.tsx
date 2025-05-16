import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TodoProps {
  item: TodoItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function Todo({ item, onToggle, onDelete }: TodoProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.checkbox} 
        onPress={() => onToggle(item.id)}
      >
        <MaterialIcons
          name={item.completed ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={item.completed ? "#4CAF50" : "#757575"}
        />
      </TouchableOpacity>
      
      <Text style={[
        styles.text,
        item.completed && styles.completedText
      ]}>
        {item.text}
      </Text>
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => onDelete(item.id)}
      >
        <MaterialIcons name="delete" size={24} color="#FF5252" />
      </TouchableOpacity>
    </View>
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
  },
}); 