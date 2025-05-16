# API Documentation

## Components

### Todo Component
`components/ui/Todo.tsx`

A reusable todo item component with animations, haptic feedback, and loading states.

#### Props
```typescript
interface TodoProps {
  item: TodoItem;              // Todo item data
  onToggle: (id: string) => void;  // Toggle completion callback
  onDelete: (id: string) => void;  // Delete todo callback
  isToggling?: boolean;        // Loading state for toggle action
  isDeleting?: boolean;        // Loading state for delete action
}

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}
```

#### Features
- Fade-in animation on mount
- Scale animation on toggle
- Slide-out animation on delete
- Haptic feedback on actions
- Loading states with ActivityIndicator
- Accessibility support

#### Usage
```tsx
import { Todo } from '../components/ui/Todo';

function TodoList() {
  return (
    <Todo
      item={{ id: '1', text: 'Example Todo', completed: false }}
      onToggle={(id) => console.log('Toggle:', id)}
      onDelete={(id) => console.log('Delete:', id)}
      isToggling={false}
      isDeleting={false}
    />
  );
}
```

### TodoInput Component
`components/ui/TodoInput.tsx`

Input component for adding new todos with validation and error handling.

#### Props
```typescript
interface TodoInputProps {
  onAdd: (text: string) => void;  // Add todo callback
  isLoading?: boolean;            // Loading state
  maxLength?: number;             // Maximum text length
}
```

#### Features
- Text validation
- Character limit
- Loading state
- Error messages
- Clear button
- Haptic feedback

#### Usage
```tsx
import { TodoInput } from '../components/ui/TodoInput';

function AddTodo() {
  return (
    <TodoInput
      onAdd={(text) => console.log('Add:', text)}
      isLoading={false}
      maxLength={100}
    />
  );
}
```

### FilterToggle Component
`components/ui/FilterToggle.tsx`

A reusable toggle button component for filtering completed todos.

#### Props
```typescript
interface FilterToggleProps {
  active: boolean;             // Whether completed todos are shown
  onToggle: () => void;       // Toggle callback
  disabled?: boolean;         // Disable the toggle
}
```

#### Features
- Scale animation on press
- Active/inactive states
- Loading state support
- Accessibility support
- Haptic feedback

#### Usage
```tsx
import { FilterToggle } from '../components/ui/FilterToggle';

function TodoHeader() {
  return (
    <FilterToggle
      active={showCompleted}
      onToggle={toggleShowCompleted}
      disabled={isLoading}
    />
  );
}
```

## Custom Hooks

### useTodos
`hooks/useTodos.ts`

Hook for managing todo items with persistence and error handling.

#### Interface
```typescript
function useTodos(): {
  todos: TodoItem[];
  counts: {
    total: number;
    completed: number;
    active: number;
  };
  showCompleted: boolean;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  editTodo: (id: string, text: string) => Promise<void>;
  toggleShowCompleted: () => Promise<void>;
  isLoading: boolean;
  error: Error | null;
  actionLoading: {
    add: boolean;
    toggle: boolean;
    delete: boolean;
    edit: boolean;
  };
};
```

#### Features
- AsyncStorage persistence
- Loading states per action
- Error handling
- Optimistic updates
- Retry mechanism
- Filter state management
- Task count tracking

#### Usage
```tsx
import { useTodos } from '../hooks/useTodos';

function TodoApp() {
  const { 
    todos, 
    counts,
    showCompleted,
    addTodo, 
    toggleTodo,
    deleteTodo,
    editTodo,
    toggleShowCompleted,
    isLoading,
    actionLoading
  } = useTodos();
  
  // Use the hook methods
}
```

## Utilities

### Storage Utility
`utils/storage.ts`

Wrapper for AsyncStorage with type safety and error handling.

#### Interface
```typescript
const Storage = {
  save: <T>(key: string, data: T) => Promise<void>;
  load: <T>(key: string) => Promise<T | null>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
};
```

#### Usage
```typescript
import { Storage } from '../utils/storage';

// Save data
await Storage.save('todos', todoList);

// Load data
const todos = await Storage.load('todos');
```

### Validation Utility
`utils/validation.ts`

Input validation functions with error messages.

#### Interface
```typescript
const Validation = {
  validateTodoText: (text: string) => ValidationResult;
  validateMaxLength: (text: string, max: number) => ValidationResult;
};

interface ValidationResult {
  isValid: boolean;
  error?: string;
}
```

#### Usage
```typescript
import { Validation } from '../utils/validation';

const result = Validation.validateTodoText(inputText);
if (!result.isValid) {
  showError(result.error);
}
```

### Transitions Utility
`utils/transitions.ts`

Animation configuration and helper functions.

#### Interface
```typescript
const Transitions = {
  timing: {
    quick: AnimationConfig;
    medium: AnimationConfig;
  };
  configureLayout: (type: 'spring' | 'timing') => void;
};
```

#### Usage
```typescript
import { Transitions } from '../utils/transitions';

Animated.timing(fadeAnim, {
  ...Transitions.timing.medium,
  toValue: 1,
}).start();
```

### Haptics Utility
`utils/haptics.ts`

Haptic feedback patterns and helper functions.

#### Interface
```typescript
const HapticFeedback = {
  light: () => Promise<void>;
  medium: () => Promise<void>;
  success: () => Promise<void>;
};
```

#### Usage
```typescript
import { HapticFeedback } from '../utils/haptics';

await HapticFeedback.success();
``` 