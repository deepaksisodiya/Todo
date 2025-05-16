import { useCallback, useEffect, useState } from 'react';
import { TodoItem } from '../components/ui/Todo';
import { STORAGE_KEYS, StorageError, StorageUtils } from '../utils/storage';

interface TodoState {
  todos: TodoItem[];
  isLoading: boolean;
  error: string | null;
}

export function useTodos() {
  const [state, setState] = useState<TodoState>({
    todos: [],
    isLoading: true,
    error: null,
  });

  // Load todos from storage on mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const storedTodos = await StorageUtils.load<TodoItem[]>(STORAGE_KEYS.TODOS);
        setState(current => ({
          ...current,
          todos: storedTodos || [],
          isLoading: false,
        }));
      } catch (error) {
        setState(current => ({
          ...current,
          isLoading: false,
          error: error instanceof StorageError ? error.message : 'Failed to load todos',
        }));
      }
    };

    loadTodos();
  }, []);

  // Save todos whenever they change
  const saveTodos = useCallback(async (newTodos: TodoItem[]) => {
    try {
      await StorageUtils.save(STORAGE_KEYS.TODOS, newTodos);
      setState(current => ({
        ...current,
        error: null,
      }));
    } catch (error) {
      setState(current => ({
        ...current,
        error: error instanceof StorageError ? error.message : 'Failed to save todos',
      }));
    }
  }, []);

  const addTodo = useCallback(async (text: string) => {
    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    setState(current => {
      const newTodos = [...current.todos, newTodo];
      saveTodos(newTodos);
      return {
        ...current,
        todos: newTodos,
      };
    });
  }, [saveTodos]);

  const toggleTodo = useCallback(async (id: string) => {
    setState(current => {
      const newTodos = current.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      saveTodos(newTodos);
      return {
        ...current,
        todos: newTodos,
      };
    });
  }, [saveTodos]);

  const deleteTodo = useCallback(async (id: string) => {
    setState(current => {
      const newTodos = current.todos.filter(todo => todo.id !== id);
      saveTodos(newTodos);
      return {
        ...current,
        todos: newTodos,
      };
    });
  }, [saveTodos]);

  const retryLastOperation = useCallback(async () => {
    setState(current => ({
      ...current,
      isLoading: true,
      error: null,
    }));

    try {
      const storedTodos = await StorageUtils.load<TodoItem[]>(STORAGE_KEYS.TODOS);
      setState(current => ({
        ...current,
        todos: storedTodos || current.todos,
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      setState(current => ({
        ...current,
        isLoading: false,
        error: error instanceof StorageError ? error.message : 'Failed to retry operation',
      }));
    }
  }, []);

  return {
    ...state,
    addTodo,
    toggleTodo,
    deleteTodo,
    retryLastOperation,
  };
} 