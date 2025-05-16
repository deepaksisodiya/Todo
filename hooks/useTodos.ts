import { useCallback, useEffect, useState } from 'react';
import { TodoItem } from '../components/ui/Todo';
import { STORAGE_KEYS, StorageError, StorageUtils } from '../utils/storage';

interface TodoState {
  todos: TodoItem[];
  isLoading: boolean;
  error: string | null;
  actionLoading: {
    add: boolean;
    toggle: boolean;
    delete: boolean;
  };
}

export function useTodos() {
  const [state, setState] = useState<TodoState>({
    todos: [],
    isLoading: true,
    error: null,
    actionLoading: {
      add: false,
      toggle: false,
      delete: false,
    },
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
    setState(current => ({
      ...current,
      actionLoading: { ...current.actionLoading, add: true },
    }));

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    try {
      const newTodos = [...state.todos, newTodo];
      await saveTodos(newTodos);
      setState(current => ({
        ...current,
        todos: newTodos,
        actionLoading: { ...current.actionLoading, add: false },
      }));
    } catch (error) {
      setState(current => ({
        ...current,
        actionLoading: { ...current.actionLoading, add: false },
        error: error instanceof StorageError ? error.message : 'Failed to add todo',
      }));
    }
  }, [saveTodos, state.todos]);

  const toggleTodo = useCallback(async (id: string) => {
    setState(current => ({
      ...current,
      actionLoading: { ...current.actionLoading, toggle: true },
    }));

    try {
      const newTodos = state.todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      await saveTodos(newTodos);
      setState(current => ({
        ...current,
        todos: newTodos,
        actionLoading: { ...current.actionLoading, toggle: false },
      }));
    } catch (error) {
      setState(current => ({
        ...current,
        actionLoading: { ...current.actionLoading, toggle: false },
        error: error instanceof StorageError ? error.message : 'Failed to toggle todo',
      }));
    }
  }, [saveTodos, state.todos]);

  const deleteTodo = useCallback(async (id: string) => {
    setState(current => ({
      ...current,
      actionLoading: { ...current.actionLoading, delete: true },
    }));

    try {
      const newTodos = state.todos.filter(todo => todo.id !== id);
      await saveTodos(newTodos);
      setState(current => ({
        ...current,
        todos: newTodos,
        actionLoading: { ...current.actionLoading, delete: false },
      }));
    } catch (error) {
      setState(current => ({
        ...current,
        actionLoading: { ...current.actionLoading, delete: false },
        error: error instanceof StorageError ? error.message : 'Failed to delete todo',
      }));
    }
  }, [saveTodos, state.todos]);

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