import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

export type BadgeVariant =
  | 'available' | 'conditional' | 'unavailable'
  | 'completed' | 'in_progress' | 'pending' | 'delayed' | 'parallel';

const BADGE_CONFIG: Record<BadgeVariant, { label: string; bg: string; text: string }> = {
  available:    { label: '설치 가능',  bg: Colors.availableBg,   text: '#0D7A38' },
  conditional:  { label: '조건부 가능', bg: Colors.conditionalBg, text: '#8A6500' },
  unavailable:  { label: '설치 불가',  bg: Colors.unavailableBg, text: '#B71C1C' },
  completed:    { label: '완료',       bg: '#E6F7EE',             text: '#0D7A38' },
  in_progress:  { label: '진행중',     bg: '#E3F2FD',             text: '#1565C0' },
  parallel:     { label: '병행중',     bg: '#F3E5F5',             text: '#6A1B9A' },
  pending:      { label: '대기',       bg: '#F5F5F5',             text: '#757575' },
  delayed:      { label: '지연',       bg: Colors.unavailableBg, text: '#B71C1C' },
};

type Props = { variant: BadgeVariant };

const StatusBadge = ({ variant }: Props) => {
  const config = BADGE_CONFIG[variant];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StatusBadge;
