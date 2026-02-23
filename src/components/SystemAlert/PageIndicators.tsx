import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';

interface Props {
  count: number;
  activeIndex: number;
  scrollX: Animated.Value;
  snapInterval: number;
}

export default function PageIndicators({ count, activeIndex, scrollX, snapInterval }: Props) {
  const animsRef = useRef<Animated.Value[]>([]);

  // Rebuild the animated value array whenever count changes (e.g. after a dismiss).
  // New values are seeded to the correct target width so they start correct.
  if (animsRef.current.length !== count) {
    animsRef.current = Array.from(
      { length: count },
      (_, i) => new Animated.Value(i === activeIndex ? 16 : 8),
    );
  }

  useEffect(() => {
    Animated.parallel(
      animsRef.current.map((anim, i) =>
        Animated.timing(anim, {
          toValue: i === activeIndex ? 16 : 8,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [activeIndex, count]);

  return (
    <View style={styles.row}>
      {animsRef.current.map((anim, i) => {
        // Interpolate color in real-time from scroll position.
        // At i*snapInterval the dot is fully active; at adjacent snaps it's fully inactive.
        const backgroundColor = scrollX.interpolate({
          inputRange: [
            (i - 1) * snapInterval,
            i * snapInterval,
            (i + 1) * snapInterval,
          ],
          outputRange: ['#C2CBD2', '#0F1419', '#C2CBD2'],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[styles.dot, { width: anim, backgroundColor }]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
});
