import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorBoundary } from '../components/ui/ErrorBoundary';
import { Todo } from '../components/ui/Todo';
import { TodoInput } from '../components/ui/TodoInput';
import { useTodos } from '../hooks/useTodos';
import { errorReporter } from '../utils/errorReporting';

export default function TodoScreen() {
  const insets = useSafeAreaInsets();
  const { todos, isLoading, error, addTodo, toggleTodo, deleteTodo, retryLastOperation } = useTodos();

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
      return (
        <View style={[styles.container, styles.centerContent]}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Todo List</Text>
          <Text style={styles.subtitle}>
            {todos.length} task{todos.length !== 1 ? 's' : ''}
          </Text>
        </View>

        <TodoInput onAdd={addTodo} />

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
              />
            )}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  No todos yet. Add one above!
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
      <View style={{ flex: 1, paddingTop: insets.top }}>
        {renderContent()}
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 16,
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