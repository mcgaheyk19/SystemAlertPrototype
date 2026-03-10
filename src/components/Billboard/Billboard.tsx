import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Animated, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import * as Haptics from 'expo-haptics';
import { BillboardData } from '../../types/billboard';
import BillboardCard from './BillboardCard';
import { PageIndicators } from '../SystemAlert';

const SCREEN_WIDTH = Dimensions.get('window').width;
const H_PADDING = 16;
const CARD_GAP = 8;
const SHADOW_BLEED = 8;

const CARD_WIDTH = SCREEN_WIDTH - H_PADDING * 2;
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;

const SWIPE_VELOCITY_THRESHOLD = 0.2;

interface Props {
  cards: BillboardData[];
}

export default function Billboard({ cards: initialCards }: Props) {
  const [activeCards, setActiveCards] = useState<BillboardData[]>(initialCards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const currentIndexRef = useRef(0);
  const needsScrollSyncRef = useRef(false);

  const updateIndex = useCallback((next: number) => {
    currentIndexRef.current = next;
    setCurrentIndex(next);
  }, []);

  const handleDismiss = useCallback((id: string) => {
    setActiveCards(prev => {
      const dismissedIndex = prev.findIndex(c => c.id === id);
      const next = prev.filter(c => c.id !== id);
      if (dismissedIndex <= currentIndexRef.current && currentIndexRef.current > 0) {
        updateIndex(currentIndexRef.current - 1);
        needsScrollSyncRef.current = true;
      }
      return next;
    });
  }, [updateIndex]);

  const handleScrollEndDrag = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, velocity } = e.nativeEvent;
    const vx = velocity?.x ?? 0;
    const idx = currentIndexRef.current;
    const maxIndex = activeCards.length - 1;

    let next: number;
    if (vx > SWIPE_VELOCITY_THRESHOLD) {
      next = Math.min(idx + 1, maxIndex);
    } else if (vx < -SWIPE_VELOCITY_THRESHOLD) {
      next = Math.max(idx - 1, 0);
    } else {
      next = Math.max(0, Math.min(Math.round(contentOffset.x / SNAP_INTERVAL), maxIndex));
    }

    if (next !== idx) {
      updateIndex(next);
      setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid), 80);
    }
  }, [activeCards.length, updateIndex]);

  const handleMomentumScrollEnd = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const settled = Math.max(
      0,
      Math.min(
        Math.round(e.nativeEvent.contentOffset.x / SNAP_INTERVAL),
        activeCards.length - 1,
      ),
    );
    if (settled !== currentIndexRef.current) {
      updateIndex(settled);
    }
  }, [activeCards.length, updateIndex]);

  useEffect(() => {
    if (needsScrollSyncRef.current && activeCards.length > 1) {
      scrollRef.current?.scrollTo({ x: currentIndex * SNAP_INTERVAL, animated: true });
      needsScrollSyncRef.current = false;
    }
  }, [currentIndex, activeCards.length]);

  if (activeCards.length === 0) {
    return null;
  }

  if (activeCards.length === 1) {
    return (
      <View style={styles.singleContainer}>
        <BillboardCard
          card={activeCards[0]}
          width={CARD_WIDTH}
          onDismiss={handleDismiss}
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
            {activeCards.map((card, i) => (
              <BillboardCard
                key={card.id}
                card={card}
                width={CARD_WIDTH}
                leftGap={i > 0 ? CARD_GAP : 0}
                onDismiss={handleDismiss}
              />
            ))}
          </View>
        </ScrollView>
      </View>
      <PageIndicators
        count={activeCards.length}
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
