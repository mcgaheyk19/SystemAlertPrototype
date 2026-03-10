# SystemAlert Prototype

An iOS design prototype built with Expo and React Native. It demonstrates two carousel components — `SystemAlert` and `Billboard` — intended to sit on the parent and/or kid homepage of the Till app. Both feature swipeable cards with haptic feedback, animated page indicators, and dismissal animations, set against a skeleton wireframe layout for context.

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

To test on a physical device, install [Expo Go](https://expo.dev/go) from the App Store, make sure your phone is on the same WiFi network as your Mac, then scan the QR code that appears in the terminal.

---

## What's in here

### `SystemAlert` component

Sits at the top of the homescreen. Accepts an array of `AlertData` and renders either a single card or a swipeable carousel.

- Swipe left/right to move between alerts — snaps to each card with haptic feedback
- Page indicator dots animate in size on snap and blend color in real time as you drag
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

---

### `Billboard` component

Sits below the promotional banner skeleton on the homescreen. Accepts an array of `BillboardData` and renders a swipeable carousel of richer action cards.

- Same swipe, snap, haptic, and page indicator behaviour as `SystemAlert`
- Each card has a blue gradient icon circle, bold headline, support text, and a CTA button
- Pressing the CTA button plays a subtle card-level press-in effect — the whole card scales down slightly on finger down and springs back on release
- Dismissible cards have an X button with the same shrink + fade dismiss animation
- Automatically collapses when all cards are dismissed

**Billboard data shape:**

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

---

### Skeleton homescreen

A static wireframe layout that gives both carousel components realistic visual context: header, promotional banner, account card, and quick-action grid.

### Test buttons

At the bottom of the screen, four buttons let you hot-swap between alert scenarios without restarting the app. Pressing any button also resets the Billboard carousel back to all three cards.

| Button | Scenario |
|---|---|
| 4 mixed alerts | Full set — 2 dismissible, 2 non-dismissible with CTAs |
| 1 fixed alert | Single non-dismissible alert with a CTA |
| 1 fixed + 2 dismissible | Mixed set of three |
| 2 dismissible alerts | Two dismissible-only alerts |

---

## Project structure

```
App.tsx                         # Entry point, loads fonts
src/
  types/
    alerts.ts                   # AlertData and AlertSegment types
    billboard.ts                # BillboardData type
  data/
    sampleAlerts.ts             # Pre-built alert fixtures
    sampleBillboards.ts         # Pre-built billboard fixtures
  components/
    SystemAlert/                # Alert carousel and sub-components
      SystemAlert.tsx           # Stateful container, scroll + dismiss logic
      AlertCard.tsx             # Individual card with dismiss animation
      AlertIcon.tsx             # Gradient red SVG icon
      AlertText.tsx             # Inline text with tappable CTA segments
      PageIndicators.tsx        # Animated dot row (shared with Billboard)
    Billboard/                  # Billboard carousel and sub-components
      Billboard.tsx             # Stateful container, scroll + dismiss logic
      BillboardCard.tsx         # Individual card with icon, text, CTA, dismiss
      BillboardIconCircle.tsx   # Blue gradient SVG icon circle
    skeleton/                   # Wireframe placeholder components
  screens/
    HomeScreen.tsx              # Full layout + test buttons
assets/
  IconSpendLimit.svg            # Spend limit icon
  IconGMOOT.svg                 # Get the most out of Till icon
  IconTrip.svg                  # Trip icon
```

---

## Tech

- [Expo SDK 54](https://docs.expo.dev) — managed workflow
- [React Native Animated API](https://reactnative.dev/docs/animations) — all animations (no third-party animation library)
- [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) — haptic feedback on card snap
- [react-native-svg](https://github.com/software-mansion/react-native-svg) — SVG icons and gradients
- [Nunito](https://fonts.google.com/specimen/Nunito) variable font via expo-font
