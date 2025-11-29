# EcommerceApp - React Native E-commerce Application

A full-featured e-commerce mobile application built with React Native CLI, TypeScript, and modern best practices.

## 🎯 Features

### Core Features
- **Home Screen**: Beautiful banner carousel and product listings with categories
- **Search Screen**: Real-time product search with debouncing
- **Product Details**: Image slider, detailed product information, and add to cart
- **Shopping Cart**: Full cart management with quantity adjustment and removal
- **Checkout**: Payment method selection and order summary
- **Order Confirmation**: Success screen with order details

### Technical Features
- ✅ TypeScript for type safety
- ✅ React Navigation (Stack & Bottom Tabs)
- ✅ Context API for global state management
- ✅ AsyncStorage for cart persistence
- ✅ Axios for API integration
- ✅ DummyJSON API for mock data
- ✅ Scalable folder structure
- ✅ Reusable components
- ✅ Custom theme system
- ✅ Infinite scroll pagination
- ✅ Loading states and error handling
- ✅ Beautiful UI/UX with animations

## 📱 Screens

1. **Home Screen**
   - Promotional banner carousel
   - Multiple product carousels:
     - Featured products horizontal scroll
     - Trending products horizontal scroll (sorted by rating)
   - All products grid view with infinite scroll
   - Pull to refresh with pagination reset
   - Cart button in header and bottom navigation

2. **Search Screen**
   - Search bar with autocomplete
   - Real-time search results with infinite scroll
   - Results counter
   - Empty state handling

3. **Product Details Screen**
   - Product image slider
   - Detailed product information
   - Quantity selector
   - Add to cart/Update cart
   - Stock status indicators

4. **Cart Screen**
   - List of cart items
   - Quantity management (increment/decrement)
   - Remove items
   - Order summary
   - Proceed to checkout

5. **Checkout Screen**
   - Order items review
   - Payment method selection
   - Order summary with tax and shipping
   - Place order button

6. **Order Confirmation Screen**
   - Success animation
   - Order ID display
   - Continue shopping button

## 🏗️ Architecture

### Project Structure
```
EcommerceApp/
├── src/
│   ├── api/              # API services and client
│   │   ├── apiClient.ts
│   │   ├── productService.ts
│   │   └── index.ts
│   ├── components/       # Reusable components
│   │   ├── Button.tsx
│   │   ├── ProductCard.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── EmptyState.tsx
│   │   ├── SearchBar.tsx
│   │   ├── CartButton.tsx
│   │   └── index.ts
│   ├── constants/        # Constants and theme
│   │   ├── theme.ts
│   │   └── index.ts
│   ├── context/          # Global state management
│   │   ├── CartContext.tsx
│   │   └── index.ts
│   ├── navigation/       # Navigation setup
│   │   ├── RootNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   └── index.ts
│   ├── screens/          # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── SearchScreen.tsx
│   │   ├── ProductDetailsScreen.tsx
│   │   ├── CartScreen.tsx
│   │   ├── CheckoutScreen.tsx
│   │   ├── OrderConfirmationScreen.tsx
│   │   └── index.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   └── utils/            # Utility functions
│       ├── helpers.ts
│       └── index.ts
├── App.tsx               # Root component
└── package.json
```

### Tech Stack

- **React Native CLI** - Framework
- **TypeScript** - Type safety
- **React Navigation** - Navigation
- **Context API** - State management
- **Axios** - HTTP client
- **AsyncStorage** - Local storage
- **React Native Vector Icons** - Icons
- **React Native Gesture Handler** - Gestures
- **React Native Safe Area Context** - Safe area handling

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- npm or yarn
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

### Installation

1. **Clone the repository**
   ```bash
   cd /path/to/EcommerceApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Configure Android (Optional)**
   
   The vector icons should auto-link, but if needed, add to `android/app/build.gradle`:
   ```gradle
   apply from: "../../node_modules/react-native-vector-icons/fonts.gradle"
   ```

### Running the App

#### iOS
```bash
npm run ios
# or
npx react-native run-ios
```

#### Android
```bash
npm run android
# or
npx react-native run-android
```

#### Start Metro Bundler
```bash
npm start
```

## 📦 API Integration

The app uses [DummyJSON](https://dummyjson.com/) for mock data:

- **Products**: `GET https://dummyjson.com/products`
- **Product Details**: `GET https://dummyjson.com/products/{id}`
- **Search**: `GET https://dummyjson.com/products/search?q={query}`

## 🎨 Theme & Styling

The app uses a centralized theme system with:
- Color palette
- Typography scale
- Spacing system
- Shadow presets
- Reusable size constants

Located in `src/constants/theme.ts`

## 🔧 State Management

### Cart Context
- Add items to cart
- Remove items from cart
- Update item quantities
- Clear cart
- Persist cart data with AsyncStorage
- Global cart state across the app

## 🧪 Code Quality

### Best Practices Implemented
- ✅ TypeScript strict mode
- ✅ Component composition
- ✅ Custom hooks
- ✅ Proper error handling
- ✅ Loading states
- ✅ Optimized re-renders with useMemo/useCallback
- ✅ Clean code principles
- ✅ Consistent naming conventions
- ✅ Modular architecture

## 📝 Key Features Implemented

### Home Screen
- ✅ Banner carousel with auto-pagination
- ✅ Featured products horizontal scroll
- ✅ Product grid with cards
- ✅ Pull to refresh
- ✅ Cart badge in header

### Search
- ✅ Debounced search (500ms)
- ✅ Real-time results
- ✅ Empty states
- ✅ Loading indicators

### Product Details
- ✅ Image slider with indicators
- ✅ Discount badges
- ✅ Stock status
- ✅ Rating display
- ✅ Quantity selector
- ✅ Dynamic add/update cart

### Cart Management
- ✅ Persistent storage
- ✅ Quantity management
- ✅ Item removal
- ✅ Total calculation
- ✅ Empty state handling

### Checkout
- ✅ Order review
- ✅ Payment method selection
- ✅ Tax calculation (8%)
- ✅ Shipping calculation
- ✅ Free shipping threshold ($50)
- ✅ Loading state during order placement

### Order Confirmation
- ✅ Success animation
- ✅ Unique order ID generation
- ✅ Clear cart on success
- ✅ Navigation reset

## 🎯 Performance Optimizations

- ✅ **React.memo** for ProductCard components
- ✅ **Deterministic tag generation** (no flickering during scroll)
- ✅ **useCallback** for event handlers
- ✅ **useMemo** for expensive calculations
- ✅ **Optimized FlatList** configuration
- ✅ **Debounced search** (500ms)
- ✅ **Stable key extractors**
- ✅ **Image optimization**
- ✅ **60 fps smooth scrolling**

## 🔐 Security & Best Practices

- Type-safe TypeScript implementation
- Input validation
- Error boundary handling
- Secure API client setup
- Environment-based logging

## 📱 Responsive Design

- Supports various screen sizes
- Safe area handling
- Adaptive layouts
- Platform-specific adjustments

## 🐛 Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   npm start -- --reset-cache
   ```

2. **iOS build fails**
   ```bash
   cd ios
   pod deintegrate
   pod install
   cd ..
   ```

3. **Android build fails**
   ```bash
   cd android
   ./gradlew clean
   cd ..
   ```

4. **Vector icons not showing**
   - iOS: Re-run pod install
   - Android: Rebuild the app

## 📄 License

This project is created for evaluation purposes.

## 👤 Author

Senior React Native Developer with 10+ years of experience

## 🙏 Acknowledgments

- [DummyJSON](https://dummyjson.com/) for mock API
- React Native community for excellent libraries
- Material Community Icons for icon set

---

## 🚀 Next Steps for Production

If this were a production app, consider:
- [ ] Add authentication
- [ ] Implement real payment gateway
- [ ] Add product reviews and ratings
- [ ] Implement wishlist feature
- [ ] Add user profile management
- [ ] Implement order tracking
- [ ] Add push notifications
- [ ] Implement analytics
- [ ] Add unit and integration tests
- [ ] Set up CI/CD pipeline
- [ ] Add Sentry for error tracking
- [ ] Implement deep linking
- [ ] Add multi-language support
- [ ] Optimize bundle size

---

**Built with ❤️ using React Native**
