# Setup Instructions

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Install iOS Dependencies (Mac only)

```bash
cd ios
pod install
cd ..
```

### 3. Run the App

**For iOS:**
```bash
npm run ios
```

**For Android:**
```bash
npm run android
```

## Detailed Setup

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v20 or higher)
- **npm** or **yarn**
- **React Native CLI**: `npm install -g react-native-cli`
- **Xcode** (Mac only, for iOS development)
- **Android Studio** (for Android development)
- **CocoaPods** (Mac only): `sudo gem install cocoapods`

### Environment Setup

#### iOS Setup (Mac only)

1. Install Xcode from the Mac App Store
2. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```
3. Install CocoaPods:
   ```bash
   sudo gem install cocoapods
   ```

#### Android Setup

1. Download and install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio and go to Settings/Preferences
3. Navigate to **Appearance & Behavior → System Settings → Android SDK**
4. Install the following:
   - Android SDK Platform 34
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools

5. Add Android SDK to your PATH:
   
   **For macOS/Linux** (add to ~/.bash_profile or ~/.zshrc):
   ```bash
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

   **For Windows** (add to Environment Variables):
   ```
   ANDROID_HOME=C:\Users\YourUsername\AppData\Local\Android\Sdk
   ```

### Troubleshooting

#### Metro Bundler Issues

If you encounter Metro bundler issues:
```bash
npm start -- --reset-cache
```

#### iOS Build Issues

1. Clean build folder in Xcode (Cmd + Shift + K)
2. Clean derived data:
   ```bash
   rm -rf ~/Library/Developer/Xcode/DerivedData
   ```
3. Reinstall pods:
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

#### Android Build Issues

1. Clean Gradle:
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```
2. Rebuild the app:
   ```bash
   npm run android
   ```

#### Vector Icons Not Showing

**iOS:**
1. Reinstall pods:
   ```bash
   cd ios && pod install && cd ..
   ```
2. Clean and rebuild the app

**Android:**
The icons should auto-link. If not, rebuild the app:
```bash
npm run android
```

### Running on Physical Devices

#### iOS (Mac only)

1. Connect your iPhone via USB
2. Open `ios/EcommerceApp.xcworkspace` in Xcode
3. Select your device from the device dropdown
4. Click the Run button

#### Android

1. Enable Developer Mode on your Android device
2. Enable USB Debugging
3. Connect your device via USB
4. Run:
   ```bash
   adb devices  # Verify device is connected
   npm run android
   ```

## Development Tips

### Hot Reload

- Shake your device or press `Cmd+D` (iOS) / `Cmd+M` (Android) to open the developer menu
- Enable "Fast Refresh" for automatic updates

### Debugging

- Enable Remote JS Debugging from the developer menu
- Use React Native Debugger for enhanced debugging experience

### API Testing

The app uses [DummyJSON](https://dummyjson.com/) for testing. No additional backend setup is required.

## Project Structure

```
src/
├── api/              # API services
├── components/       # Reusable components
├── constants/        # Constants and theme
├── context/          # Global state (Cart)
├── navigation/       # Navigation setup
├── screens/          # Screen components
├── types/            # TypeScript types
└── utils/            # Helper functions
```

## Available Scripts

- `npm start` - Start Metro bundler
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run lint` - Run ESLint
- `npm test` - Run tests

## Need Help?

If you encounter any issues, please check:
1. React Native documentation: https://reactnative.dev/
2. GitHub Issues
3. Stack Overflow

---

**Happy Coding! 🚀**

