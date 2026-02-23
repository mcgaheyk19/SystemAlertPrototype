import { AlertData } from '../types/alerts';

export const SAMPLE_ALERTS: AlertData[] = [
  {
    id: 'alert-declined',
    dismissible: true,
    segments: [
      {
        type: 'plain',
        text: "Oliver's card was declined because they didn't have enough funds.",
      },
    ],
  },
  {
    id: 'alert-payment-failed',
    dismissible: false,
    segments: [
      {
        type: 'plain',
        text: "Payment failed due to insufficient funds. Cards can't be created or shipped. ",
      },
      {
        type: 'cta',
        text: 'Try again.',
        onPress: () => console.log('Try again tapped'),
      },
    ],
  },
  {
    id: 'alert-cant-ship',
    dismissible: false,
    segments: [
      {
        type: 'plain',
        text: "Cards can't be shipped until your Till account is funded. ",
      },
      {
        type: 'cta',
        text: 'Deposit now.',
        onPress: () => console.log('Deposit now tapped'),
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
];
