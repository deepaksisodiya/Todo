import * as Haptics from 'expo-haptics';

export const HapticFeedback = {
  // Light feedback for general interactions
  light: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // Silently fail if haptics aren't available
    }
  },

  // Medium feedback for more significant interactions
  medium: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      // Silently fail if haptics aren't available
    }
  },

  // Heavy feedback for important interactions
  heavy: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      // Silently fail if haptics aren't available
    }
  },

  // Success feedback
  success: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      // Silently fail if haptics aren't available
    }
  },

  // Warning feedback
  warning: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      // Silently fail if haptics aren't available
    }
  },

  // Error feedback
  error: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      // Silently fail if haptics aren't available
    }
  },

  // Selection feedback
  selection: async () => {
    try {
      await Haptics.selectionAsync();
    } catch (error) {
      // Silently fail if haptics aren't available
    }
  },
}; 