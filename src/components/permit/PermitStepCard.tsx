import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import type { PermitStep } from '../../types/permit';
import StatusBadge from '../common/StatusBadge';
import type { BadgeVariant } from '../common/StatusBadge';
import { formatDaysRange } from '../../utils/formatters';

type Props = { step: PermitStep; onPress?: () => void };

const STATUS_TO_VARIANT: Record<string, BadgeVariant> = {
  pending: 'pending',
  in_progress: 'in_progress',
  parallel: 'parallel',
  completed: 'completed',
  delayed: 'delayed',
};

const PermitStepCard = ({ step, onPress }: Props) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.header}>
      <Text style={styles.order}>{step.order}단계</Text>
      <Text style={styles.title}>{step.title}</Text>
      <StatusBadge variant={STATUS_TO_VARIANT[step.status]} />
    </View>
    <Text style={styles.duration}>
      예상 {formatDaysRange(step.estimatedDays.min, step.estimatedDays.max)}
    </Text>
    {step.criticalRisks.length > 0 && (
      <Text style={styles.risk}>⚠ {step.criticalRisks[0]}</Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 14,
    marginVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  order: { fontSize: 12, color: Colors.textSecondary, minWidth: 36 },
  title: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  duration: { fontSize: 13, color: Colors.textSecondary },
  risk: { fontSize: 12, color: Colors.unavailable, marginTop: 4 },
});

export default PermitStepCard;
