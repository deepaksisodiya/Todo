import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { FilterToggle } from '../components/ui/FilterToggle';
import { LoadingOverlay } from '../components/ui/LoadingOverlay';
import { Todo } from '../components/ui/Todo';
import { TodoInput } from '../components/ui/TodoInput';
import { useTodos } from '../hooks/useTodos';
import { errorReporter } from '../utils/errorReporting';

export default function TodoScreen() {
  const insets = useSafeAreaInsets();
  const { 
    todos, 
    counts,
    isLoading, 
    error,
    showCompleted,
    actionLoading,
    addTodo, 
    toggleTodo, 
    deleteTodo,
    editTodo,
    toggleShowCompleted,
    retryLastOperation 
  } = useTodos();

  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    errorReporter.reportComponentError(error, errorInfo);
  };

  const renderError = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={retryLastOperation}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    if (isLoading) {
      return <LoadingOverlay visible message="Loading your todos..." />;
    }

    return (
      <View style={styles.container}>
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

        <TodoInput onAdd={addTodo} isLoading={actionLoading.add} />

        {error ? (
          renderError()
        ) : (
          <FlatList
            data={todos}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Todo
                item={item}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onEdit={editTodo}
                isToggling={actionLoading.toggle}
                isDeleting={actionLoading.delete}
                isEditing={actionLoading.edit}
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {counts.total === 0
                    ? "No todos yet. Add one above!"
                    : showCompleted
                    ? "No todos yet. Add one above!"
                    : "No active todos. All tasks completed!"}
                </Text>
              </View>
            }
          />
        )}
      </View>
    );
  };

  return (
    <ErrorBoundary onError={handleError}>
      <View style={[styles.root, { paddingTop: insets.top }]}>
        {renderContent()}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  list: {
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 