import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS, StorageError, StorageUtils } from '../storage';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe('StorageUtils', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save data successfully', async () => {
      const testData = { test: 'data' };
      await StorageUtils.save(STORAGE_KEYS.TODOS, testData);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        STORAGE_KEYS.TODOS,
        JSON.stringify(testData)
      );
    });

    it('should retry on failure', async () => {
      const testData = { test: 'data' };
      const error = new Error('Storage error');
      
      // Fail twice, succeed on third try
      (AsyncStorage.setItem as jest.Mock)
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(undefined);

      await StorageUtils.save(STORAGE_KEYS.TODOS, testData);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3);
    });

    it('should throw StorageError after max retries', async () => {
      const testData = { test: 'data' };
      const error = new Error('Storage error');
      
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(error);

      await expect(StorageUtils.save(STORAGE_KEYS.TODOS, testData))
        .rejects
        .toThrow(StorageError);
      
      expect(AsyncStorage.setItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('load', () => {
    it('should load data successfully', async () => {
      const testData = { test: 'data' };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(testData));

      const result = await StorageUtils.load(STORAGE_KEYS.TODOS);
      
      expect(result).toEqual(testData);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.TODOS);
    });

    it('should return null for non-existent data', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await StorageUtils.load(STORAGE_KEYS.TODOS);
      
      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.TODOS);
    });

    it('should retry on failure', async () => {
      const testData = { test: 'data' };
      const error = new Error('Storage error');
      
      (AsyncStorage.getItem as jest.Mock)
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(JSON.stringify(testData));

      const result = await StorageUtils.load(STORAGE_KEYS.TODOS);
      
      expect(result).toEqual(testData);
      expect(AsyncStorage.getItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('remove', () => {
    it('should remove data successfully', async () => {
      await StorageUtils.remove(STORAGE_KEYS.TODOS);
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(STORAGE_KEYS.TODOS);
    });

    it('should retry on failure', async () => {
      const error = new Error('Storage error');
      
      (AsyncStorage.removeItem as jest.Mock)
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(undefined);

      await StorageUtils.remove(STORAGE_KEYS.TODOS);
      
      expect(AsyncStorage.removeItem).toHaveBeenCalledTimes(3);
    });
  });

  describe('clear', () => {
    it('should clear storage successfully', async () => {
      await StorageUtils.clear();
      
      expect(AsyncStorage.clear).toHaveBeenCalled();
    });

    it('should retry on failure', async () => {
      const error = new Error('Storage error');
      
      (AsyncStorage.clear as jest.Mock)
        .mockRejectedValueOnce(error)
        .mockRejectedValueOnce(error)
        .mockResolvedValueOnce(undefined);

      await StorageUtils.clear();
      
      expect(AsyncStorage.clear).toHaveBeenCalledTimes(3);
    });
  });
}); 