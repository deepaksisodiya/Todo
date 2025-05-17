# Todo App

> This project was entirely developed using video coding with Cursor IDE and Memory Bank, showcasing an innovative approach to software development that combines AI-assisted coding with structured documentation and workflow management.

A modern, feature-rich Todo application built with React Native and Expo, focusing on smooth user experience and reliable data persistence.

## Features

- ✨ Smooth animations and transitions
- 💾 Persistent storage with AsyncStorage
- 🔄 Automatic data synchronization
- 📱 Haptic feedback for better interaction
- ✏️ Inline todo editing with validation
- ⚡️ Optimized performance
- 🛡️ Comprehensive error handling
- 🎨 Modern and clean UI

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MyApp.git
cd MyApp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

## Project Structure

```
MyApp/
├── app/                   # App screens and navigation
├── components/           # Reusable components
│   └── ui/              # UI components
├── constants/           # App constants
├── hooks/              # Custom hooks
├── utils/              # Utility functions
└── memory-bank/        # Project documentation
```

## Development

### Memory Bank Commands

This project uses a structured development workflow managed through Memory Bank commands. For a complete list of available commands and their usage, see [COMMANDS.md](COMMANDS.md).

Key commands:
- `VAN` - Initialize new task
- `PLAN` - Plan implementation
- `CREATIVE` - Design phase
- `BUILD` - Implementation phase
- `QA` - Quality validation

### Key Components

- `Todo.tsx`: Main todo item component with animations, editing, and haptic feedback
- `TodoInput.tsx`: Input component with validation
- `ErrorBoundary.tsx`: Error handling wrapper
- `Toast.tsx`: Toast notification system

### Custom Hooks

- `useTodos`: Todo management with persistence and editing support
- `useThemeColor`: Theme management
- `useColorScheme`: Color scheme detection

### Utilities

- `storage.ts`: AsyncStorage wrapper
- `validation.ts`: Input validation
- `transitions.ts`: Animation utilities
- `haptics.ts`: Haptic feedback

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test path/to/test

# Run with coverage
npm test -- --coverage
```

### Test Structure

- Unit Tests: Components, hooks, and utilities
- Integration Tests: Data flow and user interactions
- UI Tests: Component rendering and animations

## Error Handling

The app implements comprehensive error handling:

- Storage errors with retry mechanism
- Input validation with user feedback
- UI error boundaries
- Toast notifications for user feedback

## Performance

Optimizations implemented:

- Memoized components
- Efficient list rendering
- Optimized animations
- Minimal re-renders

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Dependencies

### Main Dependencies

1. **@expo/vector-icons** (^14.1.0)
   - Provides a comprehensive set of pre-made icons
   - Includes popular icon sets like FontAwesome, MaterialIcons, etc.

2. **@react-native-async-storage/async-storage** (^2.1.2)
   - Asynchronous, persistent, key-value storage system
   - Used for storing data locally on the device

3. **@react-navigation** packages:
   - **bottom-tabs** (^7.3.10): Implements bottom tab navigation
   - **elements** (^2.3.8): Core navigation elements and components
   - **native** (^7.1.6): Core navigation library for React Native

4. **Expo** related packages:
   - **expo** (^53.0.9): Main Expo framework
   - **expo-blur** (^14.1.4): Blur view component effects
   - **expo-constants** (^17.1.6): App constants and configuration
   - **expo-font** (^13.3.1): Font loading and management
   - **expo-haptics** (^14.1.4): Haptic feedback functionality
   - **expo-image** (^2.1.7): Advanced image component
   - **expo-linking** (^7.1.5): Deep linking and URL handling
   - **expo-router** (^5.0.6): File-based routing system
   - **expo-splash-screen** (^0.30.8): Splash screen management
   - **expo-status-bar** (^2.2.3): Status bar management
   - **expo-symbols** (^0.4.4): Symbol and icon system
   - **expo-system-ui** (^5.0.7): System UI integration
   - **expo-web-browser** (^14.1.6): In-app browser functionality

5. **React and React Native core:**
   - **react** (19.0.0): Core React library
   - **react-dom** (19.0.0): React DOM for web support
   - **react-native** (0.79.2): Core React Native framework
   - **react-native-web** (^0.20.0): Web support for React Native

6. **UI and Animation related:**
   - **react-native-gesture-handler** (^2.24.0): Touch and gesture system
   - **react-native-reanimated** (^3.17.4): Advanced animations library
   - **react-native-safe-area-context** (5.4.0): Safe area handling
   - **react-native-screens** (^4.10.0): Native navigation screens
   - **react-native-webview** (13.13.5): Web content display

### Development Dependencies

1. **Build and Transpilation:**
   - **@babel/core** (^7.25.2): JavaScript compiler
   - **typescript** (^5.8.3): TypeScript support

2. **Testing:**
   - **@testing-library/jest-native** (^5.4.3): Native testing utilities
   - **@testing-library/react-native** (^13.2.0): React Native testing utilities
   - **@types/jest** (^29.5.14): TypeScript definitions for Jest
   - **jest** (^29.7.0): Testing framework
   - **jest-expo** (^53.0.5): Expo-specific Jest configuration

3. **Type Definitions:**
   - **@types/react** (^19.0.10): TypeScript definitions for React

4. **Code Quality:**
   - **eslint** (^9.25.0): Code linting
   - **eslint-config-expo** (^9.2.0): Expo-specific ESLint configuration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
