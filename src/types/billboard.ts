export type BillboardIconType = 'spend-limit' | 'gmoot' | 'trip';

export interface BillboardData {
  id: string;
  headline: string;
  supportText: string;
  ctaLabel: string;
  onCtaPress?: () => void;
  dismissible: boolean;
  iconType: BillboardIconType;
}
