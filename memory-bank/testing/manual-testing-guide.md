# Manual Testing Guide

## Test Environment Setup

### Prerequisites
1. Clean app state (clear AsyncStorage)
2. Fresh app installation
3. Stable internet connection
4. Both iOS and Android devices/simulators

### Test Data
```typescript
const testTodos = [
  { text: "Short todo", expected: "valid" },
  { text: "A very long todo text that exceeds the maximum character limit", expected: "invalid" },
  { text: "", expected: "invalid" },
  { text: "   ", expected: "invalid" },
  { text: "Normal todo with special chars !@#$", expected: "valid" }
];
```

## Test Scenarios

### 1. Todo Creation
#### Basic Flow
1. Launch app
2. Tap todo input
3. Enter text
4. Submit

#### Test Cases
- [ ] Empty input validation
- [ ] Whitespace-only input validation
- [ ] Character limit validation
- [ ] Special characters handling
- [ ] Loading state during creation
- [ ] Success feedback (haptics)
- [ ] Error feedback (toast)

### 2. Todo Interaction
#### Toggle Completion
1. Tap checkbox
2. Verify animation
3. Check persistence

#### Test Cases
- [ ] Toggle animation
- [ ] Haptic feedback
- [ ] Visual state update
- [ ] Loading indicator
- [ ] Persistence after reload
- [ ] Error handling

#### Delete Todo
1. Tap delete button
2. Verify animation
3. Check persistence

#### Test Cases
- [ ] Delete animation
- [ ] Haptic feedback
- [ ] Item removal
- [ ] Loading indicator
- [ ] Persistence after reload
- [ ] Error handling

### 3. Data Persistence
#### App Restart
1. Add multiple todos
2. Close app
3. Reopen app

#### Test Cases
- [ ] Data loads correctly
- [ ] Loading indicator shows
- [ ] Error handling works
- [ ] Completion states persist
- [ ] Order maintains

### 4. Error Handling
#### Network Error
1. Enable airplane mode
2. Perform actions
3. Verify error handling

#### Test Cases
- [ ] Error messages appear
- [ ] Retry mechanism works
- [ ] UI remains responsive
- [ ] Data integrity maintains

#### Invalid Input
1. Test various invalid inputs
2. Verify validation messages
3. Check UI feedback

#### Test Cases
- [ ] All validation rules work
- [ ] Error messages are clear
- [ ] UI feedback is immediate
- [ ] Can retry after error

### 5. Performance
#### List Performance
1. Add 50+ todos
2. Scroll list
3. Perform actions

#### Test Cases
- [ ] Smooth scrolling
- [ ] No visible lag
- [ ] Animations remain smooth
- [ ] Memory usage stable

### 6. Accessibility
#### Screen Reader
1. Enable VoiceOver/TalkBack
2. Navigate app
3. Perform actions

#### Test Cases
- [ ] All elements are labeled
- [ ] Actions are clear
- [ ] Navigation is logical
- [ ] Feedback is adequate

## Bug Reporting Template

### Bug Details
```markdown
**Title:**
[Brief description of the issue]

**Environment:**
- Device:
- OS Version:
- App Version:
- Network State:

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Screenshots/Videos:**
[If applicable]

**Additional Context:**
[Any other relevant information]
```

## Test Results Tracking

### Session Template
```markdown
**Test Session:**
Date:
Tester:
Focus Area:

**Completed Test Cases:**
- [ ] Case 1
- [ ] Case 2

**Issues Found:**
1.
2.

**Notes:**
[Additional observations]
```

## Common Issues Checklist
- [ ] Animation glitches
- [ ] Haptic feedback missing
- [ ] Persistence failures
- [ ] UI inconsistencies
- [ ] Performance degradation
- [ ] Memory leaks
- [ ] Accessibility issues

## Testing Schedule
- Daily: Basic functionality
- Weekly: Performance testing
- Bi-weekly: Accessibility testing
- Monthly: Comprehensive testing 