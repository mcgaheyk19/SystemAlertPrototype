export type AlertSegmentType = 'plain' | 'cta';

export interface AlertSegment {
  type: AlertSegmentType;
  text: string;
  onPress?: () => void;
}

export interface AlertData {
  id: string;
  dismissible: boolean;
  segments: AlertSegment[];
}
