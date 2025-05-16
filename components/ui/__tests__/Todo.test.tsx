import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { HapticFeedback } from '../../../utils/haptics';
import { Transitions } from '../../../utils/transitions';
import { Todo, TodoItem } from '../Todo';

// Mock Animated module
const mockAnimatedValue = {
  setValue: jest.fn(),
  setOffset: jest.fn(),
  flattenOffset: jest.fn(),
  interpolate: jest.fn(() => ({
    __getValue: () => 0,
  })),
  __getValue: () => 0,
};

const AnimatedMock = {
  Value: jest.fn(() => mockAnimatedValue),
  timing: jest.fn(() => ({
    start: jest.fn(callback => callback && callback()),
  })),
  parallel: jest.fn(() => ({
    start: jest.fn(callback => callback && callback()),
  })),
  sequence: jest.fn(() => ({
    start: jest.fn(callback => callback && callback()),
  })),
  View: 'Animated.View',
  Text: 'Animated.Text',
};

jest.mock('react-native/Libraries/Animated/Animated', () => AnimatedMock);

// Mock dependencies
jest.mock('../../../utils/haptics', () => ({
  HapticFeedback: {
    medium: jest.fn(),
    success: jest.fn(),
    light: jest.fn(),
  },
}));

jest.mock('../../../utils/transitions', () => ({
  Transitions: {
    timing: {
      quick: {
        duration: 200,
        useNativeDriver: true,
      },
      medium: {
        duration: 300,
        useNativeDriver: true,
      },
    },
    configureLayout: jest.fn(),
  },
}));

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
}));

describe('Todo Component', () => {
  const mockTodo: TodoItem = {
    id: '1',
    text: 'Test Todo',
    completed: false,
  };

  const mockProps = {
    item: mockTodo,
    onToggle: jest.fn(),
    onDelete: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Reset animated value mock
    Object.values(mockAnimatedValue).forEach(fn => {
      if (jest.isMockFunction(fn)) {
        fn.mockClear();
      }
    });
    // Reset Animated mock functions
    Object.values(AnimatedMock).forEach(fn => {
      if (jest.isMockFunction(fn)) {
        fn.mockClear();
      }
    });
  });

  describe('Rendering', () => {
    it('should render todo item correctly', () => {
      const { getByText, getByTestId } = render(<Todo {...mockProps} />);
      
      expect(getByText('Test Todo')).toBeTruthy();
      expect(getByTestId('checkbox-icon')).toBeTruthy();
      expect(getByTestId('delete-icon')).toBeTruthy();
    });

    it('should render completed todo with strikethrough', () => {
      const completedTodo = {
        ...mockProps,
        item: { ...mockTodo, completed: true },
      };
      const { getByTestId } = render(<Todo {...completedTodo} />);
      
      const todoText = getByTestId('todo-text');
      expect(todoText.props.style[1]).toBeTruthy();
      expect(todoText.props.style[1]).toEqual({
        textDecorationLine: 'line-through',
        color: '#757575',
      });
    });

    it('should show loading indicators when toggling/deleting', () => {
      const loadingProps = {
        ...mockProps,
        isToggling: true,
        isDeleting: true,
      };
      const { getAllByTestId } = render(<Todo {...loadingProps} />);
      
      const loadingIndicators = getAllByTestId('loading-indicator');
      expect(loadingIndicators).toHaveLength(2);
    });
  });

  describe('Interactions', () => {
    it('should handle toggle with animation and haptic feedback', async () => {
      const { getByTestId } = render(<Todo {...mockProps} />);
      
      await act(async () => {
        fireEvent.press(getByTestId('checkbox-button'));
        // Wait for all promises to resolve
        await Promise.resolve();
      });

      expect(HapticFeedback.success).toHaveBeenCalled();
      expect(AnimatedMock.sequence).toHaveBeenCalled();
      expect(Transitions.configureLayout).toHaveBeenCalledWith('spring');
      expect(mockProps.onToggle).toHaveBeenCalledWith('1');
    });

    it('should handle delete with animation and haptic feedback', async () => {
      const { getByTestId } = render(<Todo {...mockProps} />);
      
      await act(async () => {
        fireEvent.press(getByTestId('delete-button'));
        // Wait for all promises to resolve
        await Promise.resolve();
      });

      expect(HapticFeedback.medium).toHaveBeenCalled();
      expect(AnimatedMock.parallel).toHaveBeenCalled();
      expect(mockProps.onDelete).toHaveBeenCalledWith('1');
    });

    it('should not trigger actions when loading', async () => {
      const loadingProps = {
        ...mockProps,
        isToggling: true,
        isDeleting: true,
      };
      const { getByTestId } = render(<Todo {...loadingProps} />);
      
      await act(async () => {
        fireEvent.press(getByTestId('checkbox-button'));
        fireEvent.press(getByTestId('delete-button'));
      });

      expect(mockProps.onToggle).not.toHaveBeenCalled();
      expect(mockProps.onDelete).not.toHaveBeenCalled();
    });
  });

  describe('Animations', () => {
    it('should initialize animations on mount', () => {
      render(<Todo {...mockProps} />);
      expect(AnimatedMock.Value).toHaveBeenCalledTimes(3);
    });

    it('should start fade in animation on mount', () => {
      render(<Todo {...mockProps} />);
      expect(AnimatedMock.timing).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      );
    });

    it('should apply transform styles correctly', () => {
      const { getByTestId } = render(<Todo {...mockProps} />);
      const container = getByTestId('todo-container');
      
      const styles = container.props.style;
      expect(styles[1]).toEqual({
        opacity: mockAnimatedValue,
        transform: [
          { 
            translateX: expect.any(Object)
          },
          { 
            scale: mockAnimatedValue
          }
        ]
      });
    });
  });
}); 