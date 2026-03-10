import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { SystemAlert } from '../components/SystemAlert';
import { Billboard } from '../components/Billboard';
import { AlertData } from '../types/alerts';
import { SAMPLE_ALERTS } from '../data/sampleAlerts';
import { SAMPLE_BILLBOARDS } from '../data/sampleBillboards';
import HeaderSkeleton from '../components/skeleton/HeaderSkeleton';
import BannerSkeleton from '../components/skeleton/BannerSkeleton';
import AccountCardSkeleton from '../components/skeleton/AccountCardSkeleton';
import QuickActionGrid from '../components/skeleton/QuickActionGrid';

const ALERT_SETS: { label: string; alerts: AlertData[] }[] = [
  {
    label: '4 mixed alerts',
    alerts: SAMPLE_ALERTS,
  },
  {
    label: '1 fixed alert',
    alerts: [
      {
        id: 'alert-fixed-payment',
        dismissible: false,
        segments: [
          {
            type: 'plain',
            text: "We can't create or ship any cards until you finish payment. ",
          },
          {
            type: 'cta',
            text: 'Complete order.',
            onPress: () => console.log('Complete order tapped'),
          },
        ],
      },
    ],
  },
  {
    label: '1 fixed + 2 dismissible',
    alerts: [
      {
        id: 'alert-fixed-payment-2',
        dismissible: false,
        segments: [
          {
            type: 'plain',
            text: "We can't create or ship any cards until you finish payment. ",
          },
          {
            type: 'cta',
            text: 'Complete order.',
            onPress: () => console.log('Complete order tapped'),
          },
        ],
      },
      {
        id: 'alert-oliver-declined-2',
        dismissible: true,
        segments: [
          {
            type: 'plain',
            text: "Oliver's card was declined because they didn't have enough funds.",
          },
        ],
      },
      {
        id: 'alert-sophie-declined-2',
        dismissible: true,
        segments: [
          {
            type: 'plain',
            text: "Sophie's card was declined because they didn't have enough funds.",
          },
        ],
      },
    ],
  },
  {
    label: '2 dismissible alerts',
    alerts: [
      {
        id: 'alert-oliver-declined',
        dismissible: true,
        segments: [
          {
            type: 'plain',
            text: "Oliver's card was declined because they didn't have enough funds.",
          },
        ],
      },
      {
        id: 'alert-sophie-declined',
        dismissible: true,
        segments: [
          {
            type: 'plain',
            text: "Sophie's card was declined because they didn't have enough funds.",
          },
        ],
      },
    ],
  },
];

export default function HomeScreen() {
  // resetKey forces a remount of both carousels when a test button is pressed.
  const [resetKey, setResetKey] = useState(0);
  const [testAlerts, setTestAlerts] = useState<AlertData[]>(SAMPLE_ALERTS);

  const load = (alerts: AlertData[]) => {
    setTestAlerts(alerts);
    setResetKey(k => k + 1);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header — 20px horizontal margins per spec */}
        <View style={styles.headerSection}>
          <HeaderSkeleton />
        </View>

        {/* System Alert Carousel */}
        <View style={styles.alertSection}>
          <SystemAlert key={resetKey} alerts={testAlerts} />
        </View>

        {/* Banner */}
        <View style={styles.section}>
          <BannerSkeleton />
        </View>

        {/* Billboard Carousel */}
        <View style={styles.billboardSection}>
          <Billboard key={`billboard-${resetKey}`} cards={SAMPLE_BILLBOARDS} />
        </View>

        {/* Account Card */}
        <View style={styles.section}>
          <AccountCardSkeleton />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <QuickActionGrid count={4} />
        </View>

        {/* ── Test utilities ── */}
        <View style={styles.testSection}>
          {ALERT_SETS.map(({ label, alerts }) => (
            <TouchableOpacity
              key={label}
              style={styles.testButton}
              onPress={() => load(alerts)}
              activeOpacity={0.7}
            >
              <Text style={styles.testLabel}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F0F2F5',
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  headerSection: {
    marginHorizontal: 20,
  },
  alertSection: {
    marginBottom: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  billboardSection: {
    marginBottom: 20,
  },
  testSection: {
    marginHorizontal: 16,
    marginTop: 8,
    gap: 8,
  },
  testButton: {
    height: 40,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
  },
});
