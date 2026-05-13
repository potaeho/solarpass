import { StyleSheet, Text, View } from 'react-native';
import { FEASIBILITY_STATUS_CONFIG } from '../../constants/feasibility';
import type { FeasibilityStatus } from '../../types/region';

type Props = { status: FeasibilityStatus };

const FeasibilityBadge = ({ status }: Props) => {
  const config = FEASIBILITY_STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});

export default FeasibilityBadge;
