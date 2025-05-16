# Todo App

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

Key dependencies:

```json
{
  "@react-native-async-storage/async-storage": "^2.1.2",
  "expo-haptics": "^14.1.4"
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
