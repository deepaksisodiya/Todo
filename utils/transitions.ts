import { LayoutAnimation, Platform, UIManager } from 'react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const Transitions = {
  // Configure layout animations
  configureLayout: (type: 'spring' | 'easeInOut' = 'easeInOut') => {
    if (type === 'spring') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  },

  // Timing configurations for Animated.timing
  timing: {
    quick: {
      duration: 200,
      useNativeDriver: true,
    },
    medium: {
      duration: 300,
      useNativeDriver: true,
    },
    slow: {
      duration: 500,
      useNativeDriver: true,
    },
  },
}; 