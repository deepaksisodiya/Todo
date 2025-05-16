import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TodoItem } from '../components/ui/Todo';
import { STORAGE_KEYS, StorageError, StorageUtils } from '../utils/storage';

interface TodoState {
  todos: TodoItem[];
  isLoading: boolean;
  error: string | null;
  showCompleted: boolean;
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
    showCompleted: true,
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

  // Load todos and filter preference from storage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedTodos, storedShowCompleted] = await Promise.all([
          StorageUtils.load<TodoItem[]>(STORAGE_KEYS.TODOS),
          StorageUtils.load<boolean>(STORAGE_KEYS.SHOW_COMPLETED)
        ]);
        
        setState(current => ({
          ...current,
          todos: storedTodos || [],
          showCompleted: storedShowCompleted ?? true,
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

    loadData();
  }, []);

  // Save filter preference
  const saveFilterPreference = useCallback(async (showCompleted: boolean) => {
    try {
      await StorageUtils.save(STORAGE_KEYS.SHOW_COMPLETED, showCompleted);
    } catch (error) {
      setState(current => ({
        ...current,
        error: error instanceof StorageError ? error.message : 'Failed to save filter preference',
      }));
      throw error;
    }
  }, []);

  // Toggle filter with optimistic update
  const toggleShowCompleted = useCallback(async () => {
    const newShowCompleted = !stateRef.current.showCompleted;
    
    // Optimistic update
    setState(current => ({
      ...current,
      showCompleted: newShowCompleted,
      error: null,
    }));

    try {
      await saveFilterPreference(newShowCompleted);
    } catch (error) {
      // Revert on error
      setState(current => ({
        ...current,
        showCompleted: !newShowCompleted,
        error: error instanceof StorageError ? error.message : 'Failed to update filter preference',
      }));
    }
  }, [saveFilterPreference]);

  // Get filtered todos with proper memoization
  const filteredTodos = useMemo(() => {
    return state.showCompleted 
      ? state.todos 
      : state.todos.filter(todo => !todo.completed);
  }, [state.todos, state.showCompleted]);

  // Calculate counts for display
  const counts = useMemo(() => ({
    total: state.todos.length,
    completed: state.todos.filter(todo => todo.completed).length,
    active: state.todos.filter(todo => !todo.completed).length,
  }), [state.todos]);

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
    todos: filteredTodos,
    counts,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    toggleShowCompleted,
    retryLastOperation,
  };
} 