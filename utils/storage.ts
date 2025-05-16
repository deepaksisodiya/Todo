import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys constants
export const STORAGE_KEYS = {
  TODOS: 'todos',
  SETTINGS: 'settings',
} as const;

// Custom error class for storage operations
export class StorageError extends Error {
  constructor(
    public type: 'save' | 'load' | 'remove' | 'clear',
    message: string,
    public key?: string,
    public retry?: () => Promise<void>
  ) {
    super(message);
    this.name = 'StorageError';
  }
}

// Storage utility class
export class StorageUtils {
  private static MAX_RETRIES = 3;
  private static RETRY_DELAY = 1000; // 1 second

  private static async retry<T>(
    operation: () => Promise<T>,
    type: StorageError['type'],
    key?: string,
    retries = 0
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (retries < this.MAX_RETRIES) {
        const retryFn = async () => {
          await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY));
          return this.retry(operation, type, key, retries + 1);
        };
        throw new StorageError(
          type,
          `Storage operation failed: ${errorMessage}. Retry ${retries + 1}/${this.MAX_RETRIES}`,
          key,
          retryFn as () => Promise<void>
        );
      }
      throw new StorageError(
        type,
        `Storage operation failed after ${this.MAX_RETRIES} retries: ${errorMessage}`,
        key
      );
    }
  }

  static async save<T>(key: string, data: T): Promise<void> {
    const operation = async () => {
      try {
        const jsonValue = JSON.stringify(data);
        await AsyncStorage.setItem(key, jsonValue);
      } catch (error: unknown) {
        throw new Error(`Failed to serialize or save data: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    return this.retry(operation, 'save', key);
  }

  static async load<T>(key: string): Promise<T | null> {
    const operation = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
      } catch (error: unknown) {
        throw new Error(`Failed to load or parse data: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    return this.retry(operation, 'load', key);
  }

  static async remove(key: string): Promise<void> {
    const operation = async () => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error: unknown) {
        throw new Error(`Failed to remove data: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    return this.retry(operation, 'remove', key);
  }

  static async clear(): Promise<void> {
    const operation = async () => {
      try {
        await AsyncStorage.clear();
      } catch (error: unknown) {
        throw new Error(`Failed to clear storage: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    return this.retry(operation, 'clear');
  }
}

// Create a singleton instance
export const storage = new StorageUtils(); 