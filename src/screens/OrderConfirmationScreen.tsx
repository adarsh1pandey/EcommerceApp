/**
 * Order Confirmation Screen - Display order success message
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../types';
import { Button } from '../components';
import { COLORS, SPACING, TYPOGRAPHY, LAYOUT } from '../constants/theme';

type RouteProps = RouteProp<RootStackParamList, 'OrderConfirmation'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const OrderConfirmationScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProp>();
  const { orderId } = route.params;

  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainTabs' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.iconContainer,
            {
              transform: [{ scale: scaleValue }],
            },
          ]}>
          <View style={styles.iconCircle}>
            <Icon name="check" size={80} color={COLORS.white} />
          </View>
        </Animated.View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.message}>
          Thank you for your order. Your order has been placed and is being processed.
        </Text>

        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID</Text>
          <Text style={styles.orderId}>{orderId}</Text>
        </View>

        <View style={styles.infoBox}>
          <Icon name="information-outline" size={24} color={COLORS.info} />
          <Text style={styles.infoText}>
            You will receive a confirmation email shortly with your order details.
          </Text>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <Button
          title="Continue Shopping"
          onPress={handleContinueShopping}
          variant="primary"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: LAYOUT.screenPadding,
  },
  iconContainer: {
    marginBottom: SPACING['3xl'],
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: TYPOGRAPHY.fontSize['4xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.relaxed,
    marginBottom: SPACING['3xl'],
  },
  orderIdContainer: {
    alignItems: 'center',
    marginBottom: SPACING['3xl'],
  },
  orderIdLabel: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  orderId: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.primary,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.info + '10',
    padding: SPACING.lg,
    borderRadius: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
  },
  infoText: {
    flex: 1,
    fontSize: TYPOGRAPHY.fontSize.base,
    color: COLORS.text,
    marginLeft: SPACING.md,
    lineHeight: TYPOGRAPHY.fontSize.base * TYPOGRAPHY.lineHeight.relaxed,
  },
  bottomContainer: {
    padding: LAYOUT.screenPadding,
  },
});

export default OrderConfirmationScreen;

