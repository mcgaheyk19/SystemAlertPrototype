# SystemAlert Prototype

An iOS design prototype built with Expo and React Native. It demonstrates a `SystemAlert` carousel component intended to sit at the top of the parent and/or kid homepage on the Till app — swipeable alert cards with haptic feedback, animated page indicators, and a skeleton wireframe layout for context.

---

## Getting Started

**Prerequisites**
- [Node.js](https://nodejs.org) (v18 or later)
- Xcode (install from the Mac App Store, then run `xcode-select --install`)

**Install and run**

```bash
git clone https://github.com/mcgaheyk19/SystemAlertPrototype.git
cd SystemAlertPrototype
npm install
npx expo start --ios
```

This opens the iOS simulator and loads the app automatically.

---

## What's in here

### `SystemAlert` component

The core of the prototype. Accepts an array of `AlertData` and renders either a single card or a swipeable carousel depending on how many alerts are present.

- Swipe left/right to move between alerts — snaps to each card with haptic feedback
- Page indicator dots below the carousel animate in size on snap and blend color in real time as you drag
- Dismissible alerts have an X button; tapping it plays a shrink + fade animation then closes the gap
- Automatically collapses when all alerts are dismissed

**Alert data shape:**

```ts
interface AlertData {
  id: string;
  dismissible: boolean;
  segments: AlertSegment[];
}

interface AlertSegment {
  type: 'plain' | 'cta';
  text: string;
  onPress?: () => void; // only used when type === 'cta'
}
```

The `segments` array lets you compose alerts with inline tappable CTAs — for example, plain text followed by an underlined "Complete order." link.

### Skeleton homescreen

A static wireframe layout that gives the `SystemAlert` component realistic visual context: header, promotional banner, account card, and quick-action grid.

### Test buttons

At the bottom of the screen, four buttons let you hot-swap between alert scenarios without restarting the app. Use these to review how the component looks and behaves across different states:

| Button | Scenario |
|---|---|
| 4 mixed alerts | Full set — 2 dismissible, 2 non-dismissible with CTAs |
| 1 fixed alert | Single non-dismissible alert with a CTA |
| 1 fixed + 2 dismissible | Mixed set of three |
| 2 dismissible alerts | Two dismissible-only alerts |

Dismissible alerts can be swiped away using the X button. Once all alerts are dismissed the section collapses — tap any button to reload a scenario.

---

## Project structure

```
App.tsx                         # Entry point, loads fonts
src/
  types/alerts.ts               # AlertData and AlertSegment types
  data/sampleAlerts.ts          # Pre-built alert fixtures
  components/
    SystemAlert/                # Carousel component and sub-components
      SystemAlert.tsx           # Stateful container, scroll + dismiss logic
      AlertCard.tsx             # Individual card with dismiss animation
      AlertIcon.tsx             # Gradient red SVG icon
      AlertText.tsx             # Inline text with tappable CTA segments
      PageIndicators.tsx        # Animated dot row
    skeleton/                   # Wireframe placeholder components
  screens/
    HomeScreen.tsx              # Full layout + test buttons
```

---

## Tech

- [Expo SDK 54](https://docs.expo.dev) — managed workflow
- [React Native Animated API](https://reactnative.dev/docs/animations) — all animations (no third-party animation library)
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — haptic feedback on card snap
- [react-native-svg](https://github.com/software-mansion/react-native-svg) — alert icon
- [Nunito](https://fonts.google.com/specimen/Nunito) variable font via expo-font
