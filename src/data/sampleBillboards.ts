import { BillboardData } from '../types/billboard';

export const SAMPLE_BILLBOARDS: BillboardData[] = [
  {
    id: 'billboard-spend-limit',
    headline: 'Set spending limits',
    supportText: 'Set limits that guide spending without taking away their freedom',
    ctaLabel: 'Explore limits',
    onCtaPress: () => console.log('Explore limits tapped'),
    dismissible: true,
    iconType: 'spend-limit',
  },
  {
    id: 'billboard-gmoot',
    headline: 'Get the most out of Till',
    supportText: 'Explore tools that help kids build lifelong money skills',
    ctaLabel: 'Explore tools',
    onCtaPress: () => console.log('Explore tools tapped'),
    dismissible: true,
    iconType: 'gmoot',
  },
  {
    id: 'billboard-trip',
    headline: 'Your upcoming trip',
    supportText: "Your kid has a trip coming up. Here's everything you need to know.",
    ctaLabel: 'View trip details',
    onCtaPress: () => console.log('View trip details tapped'),
    dismissible: true,
    iconType: 'trip',
  },
];
