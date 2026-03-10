import React, { useRef, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { BillboardData } from '../../types/billboard';
import BillboardIconCircle from './BillboardIconCircle';

const DISMISS_ICON_PATH =
  'M3.41482 12.5851C3.54336 12.7145 3.71842 12.7874 3.90081 12.7874C4.0832 12.7874 4.25825 12.7145 4.38656 12.5851L7.99995 8.97166L11.6268 12.5985C11.8951 12.8671 12.3303 12.8671 12.5985 12.5985C12.8671 12.3302 12.8671 11.8951 12.5985 11.6268L8.97166 7.99995L12.5985 4.37307C12.8671 4.10476 12.8671 3.66965 12.5985 3.40135C12.3302 3.13282 11.8951 3.13282 11.6268 3.40135L7.99995 7.02824L4.37307 3.41485C4.10476 3.14654 3.66965 3.14654 3.40135 3.41485C3.13282 3.68315 3.13282 4.11826 3.40135 4.38656L7.02824 7.99995L3.41485 11.6268C3.1541 11.8931 3.1541 12.3188 3.41485 12.5851H3.41482Z';

function DismissIcon() {
  return (
    <Svg width={16} height={16} viewBox="0 0 16 16" fill="none">
      <Path d={DISMISS_ICON_PATH} fill="#0F1419" />
    </Svg>
  );
}

const CARD_HEIGHT = 158;
// Right-side clearance for dismissible cards:
// dismiss hit area (40) + right edge (12) + gap between text and button (4) = 56
const TEXT_RIGHT_CLEARANCE_DISMISSIBLE = 56;
const TEXT_RIGHT_CLEARANCE_FIXED = 16;
const TEXT_LEFT = 68; // icon left (16) + icon width (40) + gap (12)

interface Props {
  card: BillboardData;
  width: number;
  leftGap?: number;
  onDismiss: (id: string) => void;
}

export default function BillboardCard({ card, width, leftGap = 0, onDismiss }: Props) {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const animWidth = useRef(new Animated.Value(width)).current;
  const animMarginLeft = useRef(new Animated.Value(leftGap)).current;

  const handlePressIn = () => {
    Animated.timing(pressScale, {
      toValue: 0.982,
      duration: 100,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(pressScale, {
      toValue: 1,
      duration: 150,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  useLayoutEffect(() => {
    animMarginLeft.setValue(leftGap);
  }, [leftGap]);

  const handleDismissPress = () => {
    // Phase 1: fade + shrink (native driver, 140ms ease-in)
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 140,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Phase 2: collapse width + gap (JS driver, 110ms ease-out)
      Animated.parallel([
        Animated.timing(animWidth, {
          toValue: 0,
          duration: 110,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(animMarginLeft, {
          toValue: 0,
          duration: 110,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ]).start(() => {
        onDismiss(card.id);
      });
    });
  };

  const textWidth =
    width -
    TEXT_LEFT -
    (card.dismissible ? TEXT_RIGHT_CLEARANCE_DISMISSIBLE : TEXT_RIGHT_CLEARANCE_FIXED);

  return (
    <Animated.View style={{ width: animWidth, marginLeft: animMarginLeft }}>
      <Animated.View
        style={[
          styles.card,
          { width, height: CARD_HEIGHT },
          { opacity, transform: [{ scale }, { scale: pressScale }] },
        ]}
      >
        {/* Icon circle */}
        <View style={styles.iconContainer}>
          <BillboardIconCircle iconType={card.iconType} />
        </View>

        {/* Text block */}
        <View style={[styles.textBlock, { width: textWidth }]}>
          <Text style={styles.headline} numberOfLines={2}>{card.headline}</Text>
          <Text style={styles.supportText} numberOfLines={3}>{card.supportText}</Text>
        </View>

        {/* CTA button */}
        <TouchableOpacity
          style={[styles.ctaButton, { width: width - 32 }]}
          onPress={card.onCtaPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={1}
        >
          <Text style={styles.ctaLabel}>{card.ctaLabel}</Text>
        </TouchableOpacity>

        {/* Dismiss button */}
        {card.dismissible && (
          <TouchableOpacity
            style={styles.dismissHitArea}
            onPress={handleDismissPress}
            accessibilityLabel="Dismiss"
          >
            <View style={styles.dismissCircle}>
              <DismissIcon />
            </View>
          </TouchableOpacity>
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: 'rgb(220, 223, 252)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 4,
  },
  iconContainer: {
    position: 'absolute',
    left: 16,
    top: 20,
  },
  textBlock: {
    position: 'absolute',
    left: TEXT_LEFT,
    top: 20,
    gap: 2,
  },
  headline: {
    fontFamily: 'Nunito',
    fontWeight: '700',
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: 0.18,
    color: '#0F1419',
  },
  supportText: {
    fontFamily: 'Nunito',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.24,
    color: '#0F1419',
    marginTop: 2,
  },
  ctaButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    height: 44,
    backgroundColor: '#F2F5F8',
    borderRadius: 1000,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaLabel: {
    fontFamily: 'Nunito',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.14,
    color: '#0F1419',
  },
  dismissHitArea: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
