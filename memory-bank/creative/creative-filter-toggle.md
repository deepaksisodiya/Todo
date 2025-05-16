# Filter Toggle UI Design

## Overview
Add a filter toggle button to show/hide completed todos with clear visual feedback and smooth transitions.

## UI Components

### 1. Filter Toggle Button
```jsx
// Location: Header section, right side
<TouchableOpacity 
  style={[
    styles.filterButton,
    showCompleted && styles.filterButtonActive
  ]}
  onPress={toggleShowCompleted}
>
  <MaterialIcons 
    name="filter-list" 
    size={24} 
    color={showCompleted ? '#4CAF50' : '#666'} 
  />
</TouchableOpacity>
```

#### Styling
```javascript
filterButton: {
  padding: 8,
  borderRadius: 20,
  backgroundColor: 'transparent',
  marginLeft: 'auto',
},
filterButtonActive: {
  backgroundColor: '#E8F5E9',
},
```

### 2. Header Layout
```jsx
<View style={styles.header}>
  <View style={styles.titleContainer}>
    <Text style={styles.title}>Todo List</Text>
    <Text style={styles.subtitle}>
      {filteredCount} of {totalCount} tasks
    </Text>
  </View>
  <FilterToggle 
    active={showCompleted}
    onToggle={toggleShowCompleted}
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
    {showCompleted 
      ? "No todos yet. Add one above!"
      : "No active todos. All tasks completed!"}
  </Text>
</View>
```

## Animations

### 1. Toggle Button Press
```javascript
const scaleAnim = useRef(new Animated.Value(1)).current;

const animatePress = () => {
  Animated.sequence([
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.spring(scaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();
};
```

### 2. Filter State Transition
```javascript
const filterAnim = useRef(new Animated.Value(1)).current;

useEffect(() => {
  Animated.sequence([
    Animated.timing(filterAnim, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(filterAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start();
}, [showCompleted]);
```

## Color Scheme
- Active Filter: `#4CAF50` (Primary Green)
- Active Background: `#E8F5E9` (Light Green)
- Inactive: `#666666` (Gray)
- Text: `#333333` (Dark Gray)
- Subtitle: `#666666` (Gray)

## Accessibility
- Button minimum touch target: 44x44
- Clear color contrast for active/inactive states
- Meaningful accessibility labels:
  ```jsx
  accessibilityLabel={showCompleted 
    ? "Hide completed todos" 
    : "Show completed todos"}
  accessibilityRole="button"
  accessibilityState={{ selected: showCompleted }}
  ```

## User Interaction Flow
1. User taps filter icon
2. Button scales down briefly
3. Icon color changes
4. Background fades in/out
5. List updates with transition
6. Empty state message updates if needed

## Error States
- If filter preference fails to save:
  - Show toast message
  - Maintain visual state
  - Retry on next app launch

## Implementation Notes
1. Use `useMemo` for filtered list to optimize performance
2. Implement smooth list transitions using `FlatList` props
3. Maintain button state during loading
4. Handle edge cases (all completed, no todos)

## Testing Checklist
- [ ] Button responds to taps
- [ ] Animations are smooth
- [ ] State persists after reload
- [ ] Empty states are correct
- [ ] Accessibility works
- [ ] Error states handled 