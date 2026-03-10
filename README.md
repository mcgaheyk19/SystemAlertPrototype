# SystemAlert Prototype

A React Native / Expo prototype demonstrating two carousel components — `SystemAlert` and `Billboard` — built for the Till app homescreen. This README is a technical reference for engineers implementing or extending these components. It focuses on the interaction patterns, animation logic, and implementation decisions rather than describing the app.

---

## Running the project

```bash
git clone https://github.com/mcgaheyk19/SystemAlertPrototype.git
cd SystemAlertPrototype
npm install
npx expo start --ios        # iOS simulator
npx expo start              # scan QR code with Expo Go on a physical device
```

**Prerequisites:** Node.js v18+, Xcode with command line tools installed.

---

## Project structure

```
App.tsx                         # Entry point, loads Nunito variable font
src/
  types/
    alerts.ts                   # AlertData, AlertSegment
    billboard.ts                # BillboardData, BillboardIconType
  data/
    sampleAlerts.ts             # Alert fixtures for test buttons
    sampleBillboards.ts         # Billboard fixtures
  components/
    SystemAlert/
      SystemAlert.tsx           # Carousel container — scroll, dismiss, index logic
      AlertCard.tsx             # Card with dismiss animation
      AlertIcon.tsx             # Gradient SVG icon (react-native-svg)
      AlertText.tsx             # Inline text with tappable CTA segments
      PageIndicators.tsx        # Animated dot row — shared by both carousels
    Billboard/
      Billboard.tsx             # Carousel container (same logic as SystemAlert)
      BillboardCard.tsx         # Card with icon circle, CTA, press-in effect
      BillboardIconCircle.tsx   # Blue gradient SVG icon circle
    skeleton/                   # Static wireframe placeholder components
  screens/
    HomeScreen.tsx              # Layout + test buttons
```

---

## Interactions and animations

### Swipe behavior

Both carousels use a `ScrollView` with `horizontal` and the following scroll configuration:

```tsx
<ScrollView
  horizontal
  decelerationRate={0.82}
  snapToInterval={SNAP_INTERVAL}
  snapToAlignment="start"
  disableIntervalMomentum={true}
  scrollEventThrottle={16}
  showsHorizontalScrollIndicator={false}
/>
```

`decelerationRate={0.82}` is intentionally higher than React Native's built-in `"fast"` preset (0.99) and `"normal"` (0.998). It produces a feel that's snappy without being abrupt — the scroll decelerates quickly but has enough momentum to feel physical.

`disableIntervalMomentum={true}` prevents the scroll from skipping multiple cards on a fast fling. No matter how fast the user swipes, the carousel moves exactly one card at a time.

---

### Snap-to-center behavior

Cards are not centered — they're full width minus padding, so they fill the visible area. "Snap-to-center" here means snap-to-card. The snap interval is:

```ts
const CARD_WIDTH = SCREEN_WIDTH - H_PADDING * 2;   // 16px padding each side
const SNAP_INTERVAL = CARD_WIDTH + CARD_GAP;        // card width + 8px gap
```

`snapToAlignment="start"` combined with `paddingHorizontal: H_PADDING` in `contentContainerStyle` means the first card's left edge aligns with the screen's left padding, and each subsequent snap lands exactly one card-width + gap further right.

**Single card case:** when only one card is present, the `ScrollView` is replaced with a plain `View` and the card is rendered directly with `paddingHorizontal: H_PADDING`. No scroll container, no page indicators.

**Last card:** `disableIntervalMomentum` handles this — you can't swipe past the last card even with high velocity.

**Shadow clipping:** the `carouselWrapper` applies `marginVertical: -SHADOW_BLEED` (8px) and the scroll content adds matching `paddingVertical: SHADOW_BLEED`. This gives the card shadows room to render outside the ScrollView's bounds without being clipped.

---

### Haptic feedback

Haptics fire in `onScrollEndDrag`, not `onMomentumScrollEnd`.

```ts
const handleScrollEndDrag = (e) => {
  // ... calculate next index from velocity or scroll position ...
  if (next !== idx) {
    updateIndex(next);
    setTimeout(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid), 80);
  }
};
```

`onScrollEndDrag` fires the instant the finger lifts. At that point the snap target is already determined — the scroll is committed and the animation is beginning. Firing the haptic here means it lands as the card starts moving into place, confirming the user's choice at the moment of commitment rather than as a receipt once everything has stopped.

The 80ms `setTimeout` adds a slight delay so the haptic doesn't feel instantaneous. Without it the feedback lands before the card has visibly started moving, which feels disconnected. At 80ms it coincides with the early part of the snap animation.

`onMomentumScrollEnd` still runs but only for index correction — if the scroll settles on a different card than predicted (rare edge case), the index is corrected silently. No haptic fires there.

**Velocity threshold:** swipes with `vx > 0.2` (pts/ms) are treated as directional and committed to the next card in that direction. Below that threshold, the carousel snaps to whichever card is closest based on current scroll position:

```ts
const SWIPE_VELOCITY_THRESHOLD = 0.2;

if (vx > SWIPE_VELOCITY_THRESHOLD) {
  next = Math.min(idx + 1, maxIndex);       // forward
} else if (vx < -SWIPE_VELOCITY_THRESHOLD) {
  next = Math.max(idx - 1, 0);              // backward
} else {
  next = Math.round(contentOffset.x / SNAP_INTERVAL);  // closest card
}
```

---

### Dismissal animation

Dismissing a card is a two-phase animation, split across two drivers.

**Phase 1 — shrink and fade (native driver, 140ms ease-in):**

```ts
Animated.parallel([
  Animated.timing(opacity, { toValue: 0, duration: 140, easing: Easing.in(Easing.ease), useNativeDriver: true }),
  Animated.timing(scale,   { toValue: 0.8, duration: 140, easing: Easing.in(Easing.ease), useNativeDriver: true }),
]).start(() => { /* phase 2 */ });
```

The card shrinks to 80% and fades to transparent. This runs on the native thread.

**Phase 2 — collapse gap (JS driver, 110ms ease-out):**

```ts
Animated.parallel([
  Animated.timing(animWidth,       { toValue: 0, duration: 110, easing: Easing.out(Easing.ease), useNativeDriver: false }),
  Animated.timing(animMarginLeft,  { toValue: 0, duration: 110, easing: Easing.out(Easing.ease), useNativeDriver: false }),
]).start(() => onDismiss(card.id));
```

Once the card is invisible, its width and left margin collapse to 0 so the remaining cards slide into the gap. Width and margin can't use the native driver, which is why they're separated into a second phase. The callback at the end removes the card from state.

**Why two phases and not one:** React Native's native driver can't animate layout properties like `width` and `marginLeft`. Mixing native and JS properties in a single `Animated.parallel` isn't allowed. Sequencing them also avoids a visible pop — by the time the layout collapses, the card is already invisible.

**Index correction after dismiss:** if the dismissed card was at or before the current index, the index decrements by one and `needsScrollSyncRef` is set to trigger a programmatic `scrollTo` on the next render. This scroll is not triggered on user swipes — only after dismissals — to avoid double-firing `onMomentumScrollEnd` and producing a duplicate haptic.

---

### Pagination dot animations

Each dot has two separate animated properties: **width** and **background color**.

**Width** — driven by a discrete `Animated.Value` per dot, updated on `activeIndex` change:

```ts
Animated.timing(anim, {
  toValue: i === activeIndex ? 16 : 8,
  duration: 200,
  easing: Easing.out(Easing.ease),
  useNativeDriver: false,   // width can't use native driver
})
```

Active dot: 16px wide pill. Inactive: 8px circle. All dots animate simultaneously via `Animated.parallel`.

**Color** — driven by `scrollX`, a continuous `Animated.Value` tracking the scroll offset in real time:

```ts
const backgroundColor = scrollX.interpolate({
  inputRange:  [(i - 1) * snapInterval, i * snapInterval, (i + 1) * snapInterval],
  outputRange: ['#C2CBD2', '#0F1419', '#C2CBD2'],
  extrapolate: 'clamp',
});
```

This means color updates every frame as the user drags, not just on snap. As you drag from card 0 toward card 1, dot 1 starts transitioning from `#C2CBD2` (inactive gray) to `#0F1419` (active near-black) in real time. `scrollX` is wired up via `Animated.event` with `useNativeDriver: false` (required for color interpolation).

The `animsRef` array is rebuilt from scratch whenever `count` changes (e.g. after a dismiss). New values are seeded to their correct target width immediately so there's no flash on remount.

---

### Billboard press-in effect

When the user presses the CTA button on a Billboard card, the whole card scales down slightly. This is driven by a dedicated `pressScale` animated value:

```ts
const pressScale = useRef(new Animated.Value(1)).current;

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
```

`pressScale` is added to the card's transform array alongside the existing dismiss `scale`:

```tsx
{ opacity, transform: [{ scale }, { scale: pressScale }] }
```

React Native multiplies transforms in array order, so the two scales compose correctly — if a dismiss and a press somehow overlap, the resulting scale is `dismissScale × pressScale`.

The CTA button uses `onPressIn` / `onPressOut` rather than wrapping the card:

```tsx
<TouchableOpacity
  onPressIn={handlePressIn}
  onPressOut={handlePressOut}
  activeOpacity={1}   // disable button's own opacity feedback — the card scale is the feedback
/>
```

`activeOpacity={1}` is intentional. The press feedback lives at the card level, so the button's built-in opacity fade would be redundant and visually noisy.

**Gesture conflict:** `useNativeDriver: true` keeps the press animation off the JS thread. If the user starts a press on the CTA button and then turns it into a horizontal swipe, the ScrollView takes over the gesture and `onPressOut` fires, snapping the card back to 100% scale before the swipe completes. No conflict.

---

### Screen adjustment when all cards are dismissed

Both `SystemAlert` and `Billboard` return `null` when their active card array is empty:

```ts
if (activeCards.length === 0) return null;
```

There's no animation on this transition — the component unmounts and the space collapses immediately. The `ScrollView` wrapper and page indicators disappear at the same time. The layout below shifts up in a single frame.

This is intentional. The dismiss animation already handles the visual "exit" of the last card (shrink + fade + gap collapse). Adding another transition on top of that — animating the outer container height to 0 — would double the exit and feel slow. By the time `null` is returned, the last card is already invisible and its space is already collapsed, so the unmount is imperceptible.

---

### Stale closure handling

Both carousel components track the current card index in two places: a `useState` value (`currentIndex`) and a `useRef` mirror (`currentIndexRef`):

```ts
const currentIndexRef = useRef(0);

const updateIndex = useCallback((next: number) => {
  currentIndexRef.current = next;
  setCurrentIndex(next);
}, []);
```

The ref is what scroll callbacks actually read. Scroll event handlers are created with `useCallback` and closed over state — without the ref, they'd read stale index values from the time they were last recreated. The ref always holds the latest value without requiring the callbacks to be rebuilt on every index change.

---

## Data shapes

**AlertData**

```ts
interface AlertData {
  id: string;
  dismissible: boolean;
  segments: AlertSegment[];
}

interface AlertSegment {
  type: 'plain' | 'cta';
  text: string;
  onPress?: () => void;
}
```

`segments` lets you compose alert text with inline tappable CTAs in a single string of nodes, e.g. plain text followed by an underlined action link.

**BillboardData**

```ts
interface BillboardData {
  id: string;
  headline: string;
  supportText: string;
  ctaLabel: string;
  onCtaPress?: () => void;
  dismissible: boolean;
  iconType: 'spend-limit' | 'gmoot' | 'trip';
}
```

`iconType` maps to one of three SVG icon paths in `BillboardIconCircle.tsx`. To add a new icon, extend the union type and add the corresponding path rendering in that component.

---

## Dependencies

- [Expo SDK 54](https://docs.expo.dev) — managed workflow
- [React Native Animated API](https://reactnative.dev/docs/animations) — all animations; no third-party animation library
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — haptic feedback
- [react-native-svg](https://github.com/software-mansion/react-native-svg) — SVG icons and gradients
- [Nunito](https://fonts.google.com/specimen/Nunito) variable font loaded via `expo-font`
