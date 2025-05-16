import { useCallback, useEffect, useRef, useState } from 'react';
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
    edit: boolean;
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
      edit: false,
    },
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const setLoadingState = useCallback((action: keyof TodoState['actionLoading'], isLoading: boolean) => {
    setState(current => ({
      ...current,
      actionLoading: { ...current.actionLoading, [action]: isLoading },
    }));
  }, []);

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
    setLoadingState('add', true);

    const newTodo: TodoItem = {
      id: Date.now().toString(),
      text,
      completed: false,
    };

    try {
      const newTodos = [...stateRef.current.todos, newTodo];
      await saveTodos(newTodos);
      setState(current => ({
        ...current,
        todos: newTodos,
        actionLoading: { ...current.actionLoading, add: false },
      }));
    } catch (error) {
      setLoadingState('add', false);
      setState(current => ({
        ...current,
        error: error instanceof StorageError ? error.message : 'Failed to add todo',
      }));
      throw error;
    }
  }, [saveTodos, setLoadingState]);

  const toggleTodo = useCallback(async (id: string) => {
    setLoadingState('toggle', true);
    const originalTodos = stateRef.current.todos;

    try {
      const newTodos = originalTodos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      );
      await saveTodos(newTodos);
      setState(current => ({
        ...current,
        todos: newTodos,
        actionLoading: { ...current.actionLoading, toggle: false },
      }));
    } catch (error) {
      setLoadingState('toggle', false);
      setState(current => ({
        ...current,
        error: error instanceof StorageError ? error.message : 'Failed to toggle todo',
      }));
      throw error;
    }
  }, [saveTodos, setLoadingState]);

  const deleteTodo = useCallback(async (id: string) => {
    setLoadingState('delete', true);
    const originalTodos = stateRef.current.todos;

    try {
      const newTodos = originalTodos.filter(todo => todo.id !== id);
      await saveTodos(newTodos);
      setState(current => ({
        ...current,
        todos: newTodos,
        actionLoading: { ...current.actionLoading, delete: false },
      }));
    } catch (error) {
      setLoadingState('delete', false);
      setState(current => ({
        ...current,
        error: error instanceof StorageError ? error.message : 'Failed to delete todo',
      }));
      throw error;
    }
  }, [saveTodos, setLoadingState]);

  const editTodo = useCallback(async (id: string, newText: string) => {
    setLoadingState('edit', true);
    const originalTodos = stateRef.current.todos;

    try {
      const newTodos = originalTodos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      );
      await saveTodos(newTodos);
      setState(current => ({
        ...current,
        todos: newTodos,
        actionLoading: { ...current.actionLoading, edit: false },
      }));
    } catch (error) {
      setLoadingState('edit', false);
      setState(current => ({
        ...current,
        error: error instanceof StorageError ? error.message : 'Failed to edit todo',
      }));
      throw error;
    }
  }, [saveTodos, setLoadingState]);

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
    editTodo,
    retryLastOperation,
  };
} 