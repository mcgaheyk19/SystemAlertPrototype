import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { AlertData } from '../../types/alerts';
import AlertCard from './AlertCard';
import PageIndicators from './PageIndicators';

const SCREEN_WIDTH = Dimensions.get('window').width;
const H_PADDING = 16;
const CARD_GAP = 8;
const SHADOW_BLEED = 8;

const CARD_WIDTH = SCREEN_WIDTH - H_PADDING * 2;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

// Velocity threshold (pts/ms) above which we treat the gesture as a directional swipe
const SWIPE_VELOCITY_THRESHOLD = 0.2;

interface Props {
  alerts: AlertData[];
}

export default function SystemAlert({ alerts: initialAlerts }: Props) {
  const [activeAlerts, setActiveAlerts] = useState<AlertData[]>(initialAlerts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardHeight, setCardHeight] = useState<number | undefined>(undefined);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  // Ref mirrors currentIndex so scroll callbacks always read the latest value
  // without needing to be re-created on every state change.
  const currentIndexRef = useRef(0);
  // Only programmatically scroll after a dismissal — not after a user swipe.
  // User swipes move the scroll view themselves; calling scrollTo on top of
  // natural momentum creates a second animated scroll that fires onMomentumScrollEnd
  // a second time, causing a double haptic.
  const needsScrollSyncRef = useRef(false);

  const updateIndex = useCallback((next: number) => {
    currentIndexRef.current = next;
    setCurrentIndex(next);
  }, []);

  // Reset measured height when the alert set changes so we re-measure
  const alertsKey = activeAlerts.map(a => a.id).join(',');
  const prevKeyRef = useRef(alertsKey);
  useEffect(() => {
    if (prevKeyRef.current !== alertsKey) {
      setCardHeight(undefined);
      prevKeyRef.current = alertsKey;
    }
  }, [alertsKey]);

  const handleHeightMeasured = useCallback((height: number) => {
    setCardHeight(prev => (prev === undefined || height > prev) ? height : prev);
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setActiveAlerts(prev => {
      const dismissedIndex = prev.findIndex(a => a.id === id);
      const next = prev.filter(a => a.id !== id);
      if (dismissedIndex <= currentIndexRef.current && currentIndexRef.current > 0) {
        updateIndex(currentIndexRef.current - 1);
        needsScrollSyncRef.current = true;
      }
      return next;
    });
  }, [updateIndex]);

  // Fires the moment the finger lifts — predict the snap target from velocity
  // so the indicator and haptic land simultaneously with the snap animation start.
  const handleScrollEndDrag = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, velocity } = e.nativeEvent;
    const vx = velocity?.x ?? 0;
    const idx = currentIndexRef.current;
    const maxIndex = activeAlerts.length - 1;

    let next: number;
    if (vx > SWIPE_VELOCITY_THRESHOLD) {
      // Swiped forward
      next = Math.min(idx + 1, maxIndex);
    } else if (vx < -SWIPE_VELOCITY_THRESHOLD) {
      // Swiped backward
      next = Math.max(idx - 1, 0);
    } else {
      // Slow drag — snap to whichever card is closest
      next = Math.max(0, Math.min(Math.round(contentOffset.x / SNAP_INTERVAL), maxIndex));
    }

    if (next !== idx) {
      updateIndex(next);
    }
  }, [activeAlerts.length, updateIndex]);

  // Fires when the card fully rests — this is when the haptic lands.
  // Also corrects the index if the scroll settled on a different card than predicted.
  const handleMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const settled = Math.max(
      0,
      Math.min(
        Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL),
        activeAlerts.length - 1,
      ),
    );
    if (settled !== currentIndexRef.current) {
      updateIndex(settled);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);
  }, [activeAlerts.length, updateIndex]);

  useEffect(() => {
    if (needsScrollSyncRef.current && activeAlerts.length > 1) {
      scrollRef.current?.scrollTo({ x: currentIndex * SNAP_INTERVAL, animated: true });
      needsScrollSyncRef.current = false;
    }
  }, [currentIndex, activeAlerts.length]);

  if (activeAlerts.length === 0) {
    return null;
  }

  if (activeAlerts.length === 1) {
    return (
      <View style={styles.singleContainer}>
        <AlertCard
          alert={activeAlerts[0]}
          width={CARD_WIDTH}
          onDismiss={handleDismiss}
          fixedHeight={cardHeight}
          onHeightMeasured={handleHeightMeasured}
        />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.carouselWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          decelerationRate={0.82}
          snapToInterval={SNAP_INTERVAL}
          snapToAlignment="start"
          disableIntervalMomentum={true}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          onScrollEndDrag={handleScrollEndDrag}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.row}>
            {activeAlerts.map((alert, i) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                width={CARD_WIDTH}
                leftGap={i > 0 ? CARD_GAP : 0}
                onDismiss={handleDismiss}
                fixedHeight={cardHeight}
                onHeightMeasured={handleHeightMeasured}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <PageIndicators
        count={activeAlerts.length}
        activeIndex={currentIndex}
        scrollX={scrollX}
        snapInterval={SNAP_INTERVAL}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  singleContainer: {
    paddingHorizontal: H_PADDING,
  },
  carouselWrapper: {
    marginVertical: -SHADOW_BLEED,
  },
  scrollContent: {
    paddingHorizontal: H_PADDING,
    paddingVertical: SHADOW_BLEED,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});
