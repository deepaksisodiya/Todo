# Filter Toggle UI Design

## Overview
Add a filter toggle button to show/hide completed todos with clear visual feedback and smooth transitions.

## UI Components

### 1. Filter Toggle Button
```jsx
<FilterToggle
  active={showCompleted}
  onToggle={toggleShowCompleted}
  disabled={isLoading || counts.total === 0}
/>
```

#### Styling
```javascript
filterButton: {
  padding: 12,
  borderRadius: 20,
  backgroundColor: 'transparent',
  marginLeft: 'auto',
  minWidth: 44,
  minHeight: 44,
  justifyContent: 'center',
  alignItems: 'center',
},
filterButtonActive: {
  backgroundColor: '#E8F5E9',
},
filterButtonDisabled: {
  opacity: 0.5,
}
```

### 2. Header Layout
```jsx
<View style={styles.header}>
  <View style={styles.titleContainer}>
    <Text style={styles.title}>Todo List</Text>
    <Text style={styles.subtitle}>
      {showCompleted 
        ? `${counts.total} task${counts.total !== 1 ? 's' : ''}`
        : `${counts.active} active task${counts.active !== 1 ? 's' : ''}`}
    </Text>
  </View>
  <FilterToggle 
    active={showCompleted}
    onToggle={toggleShowCompleted}
    disabled={isLoading || counts.total === 0}
  />
</View>
```

#### Styling
```javascript
header: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
},
titleContainer: {
  flex: 1,
},
```

### 3. Empty State Messages
```jsx
<View style={styles.emptyContainer}>
  <Text style={styles.emptyText}>
    {counts.total === 0
      ? "No todos yet. Add one above!"
      : showCompleted
      ? "No todos yet. Add one above!"
      : "No active todos. All tasks completed!"}
  </Text>
</View>
```

## Animations

### 1. Toggle Button Press
```javascript
const scaleAnim = useRef(new Animated.Value(1)).current;

const animatePress = useCallback(() => {
  Animated.sequence([
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      speed: 12,
      bounciness: 8,
      useNativeDriver: true,
    }),
    Animated.spring(scaleAnim, {
      toValue: 1,
      speed: 12,
      bounciness: 8,
      useNativeDriver: true,
    }),
  ]).start();
}, [scaleAnim]);
```

## Color Scheme
- Active Filter: `#4CAF50` (Primary Green)
- Active Background: `#E8F5E9` (Light Green)
- Inactive: `#666666` (Gray)
- Disabled: `#CCCCCC` (Light Gray)
- Text: `#333333` (Dark Gray)
- Subtitle: `#666666` (Gray)

## Accessibility
- Button minimum touch target: 44x44
- Clear color contrast for active/inactive states
- Meaningful accessibility labels:
  ```jsx
  accessibilityLabel={active ? "Hide completed todos" : "Show completed todos"}
  accessibilityRole="button"
  accessibilityState={{ 
    selected: active,
    disabled 
  }}
  ```

## User Interaction Flow
1. User taps filter icon
2. Button scales down briefly with spring animation
3. Icon color changes
4. Background fades in/out
5. List updates with transition
6. Task count updates
7. Empty state message updates if needed

## Error States
- If filter preference fails to save:
  - Show error message
  - Revert to previous state
  - Enable retry through error UI
  - Maintain visual feedback

## Implementation Notes
1. Use `useMemo` for filtered list to optimize performance
2. Implement smooth list transitions
3. Maintain button state during loading
4. Handle edge cases:
   - All tasks completed
   - No todos
   - Loading states
   - Error states

## Testing Checklist
- [x] Button responds to taps
- [x] Animations are smooth
- [x] State persists after reload
- [x] Empty states are correct
- [x] Accessibility works
- [x] Error states handled
- [x] Task counts update correctly
- [x] Disabled states work properly 