import { fireEvent, render, waitFor } from '@testing-library/react-native';
import React from 'react';
import { Todo, TodoItem } from '../Todo';

const mockTodo: TodoItem = {
  id: '1',
  text: 'Test todo',
  completed: false,
};

const mockHandlers = {
  onToggle: jest.fn(),
  onDelete: jest.fn(),
  onEdit: jest.fn(),
};

describe('Todo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <Todo
        item={mockTodo}
        {...mockHandlers}
      />
    );

    expect(getByTestId('todo-text')).toHaveTextContent('Test todo');
    expect(getByTestId('edit-button')).toBeTruthy();
  });

  it('enters edit mode when edit button is pressed', async () => {
    const { getByTestId } = render(
      <Todo
        item={mockTodo}
        {...mockHandlers}
      />
    );

    fireEvent.press(getByTestId('edit-button'));
    
    await waitFor(() => {
      expect(getByTestId('edit-input')).toBeTruthy();
      expect(getByTestId('save-button')).toBeTruthy();
      expect(getByTestId('cancel-button')).toBeTruthy();
    });
  });

  it('updates todo text when save is pressed', async () => {
    const { getByTestId } = render(
      <Todo
        item={mockTodo}
        {...mockHandlers}
      />
    );

    // Enter edit mode
    fireEvent.press(getByTestId('edit-button'));
    
    // Update text
    const input = getByTestId('edit-input');
    fireEvent.changeText(input, 'Updated todo');
    
    // Save changes
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(mockHandlers.onEdit).toHaveBeenCalledWith('1', 'Updated todo');
    });
  });

  it('cancels edit mode when cancel is pressed', async () => {
    const { getByTestId, queryByTestId } = render(
      <Todo
        item={mockTodo}
        {...mockHandlers}
      />
    );

    // Enter edit mode
    fireEvent.press(getByTestId('edit-button'));
    
    // Update text
    const input = getByTestId('edit-input');
    fireEvent.changeText(input, 'Updated todo');
    
    // Cancel changes
    fireEvent.press(getByTestId('cancel-button'));

    await waitFor(() => {
      expect(queryByTestId('edit-input')).toBeNull();
      expect(getByTestId('todo-text')).toHaveTextContent('Test todo');
    });
    
    expect(mockHandlers.onEdit).not.toHaveBeenCalled();
  });

  it('disables edit button when todo is completed', () => {
    const completedTodo = { ...mockTodo, completed: true };
    const { getByTestId } = render(
      <Todo
        item={completedTodo}
        {...mockHandlers}
      />
    );

    const editButton = getByTestId('edit-button');
    expect(editButton).toBeDisabled();
  });

  it('prevents empty todo text on save', async () => {
    const { getByTestId, queryByTestId } = render(
      <Todo
        item={mockTodo}
        {...mockHandlers}
      />
    );

    // Enter edit mode
    fireEvent.press(getByTestId('edit-button'));
    
    // Try to save empty text
    const input = getByTestId('edit-input');
    fireEvent.changeText(input, '   ');
    fireEvent.press(getByTestId('save-button'));

    await waitFor(() => {
      expect(queryByTestId('edit-input')).toBeTruthy();
    });
    
    expect(mockHandlers.onEdit).not.toHaveBeenCalled();
  });

  it('disables actions while editing', async () => {
    const { getByTestId } = render(
      <Todo
        item={mockTodo}
        {...mockHandlers}
      />
    );

    // Enter edit mode
    fireEvent.press(getByTestId('edit-button'));

    await waitFor(() => {
      expect(getByTestId('checkbox-button')).toBeDisabled();
      expect(getByTestId('delete-button')).toBeDisabled();
    });
  });
}); 