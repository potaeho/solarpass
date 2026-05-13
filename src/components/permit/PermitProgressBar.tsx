import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

type Props = {
  currentStep: number;
  totalSteps: number;
  estimatedMonths: { min: number; max: number };
};

const PermitProgressBar = ({ currentStep, totalSteps, estimatedMonths }: Props) => {
  const progress = Math.round((currentStep / totalSteps) * 100);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>전체 진행률</Text>
        <Text style={styles.step}>
          {currentStep} / {totalSteps} 단계
        </Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` as never }]} />
      </View>
      <Text style={styles.estimate}>
        예상 잔여기간: 약 {estimatedMonths.min}~{estimatedMonths.max}개월
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, paddingVertical: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, color: Colors.textSecondary },
  step: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    overflow: 'hidden',
    marginBottom: 6,
  },
  fill: { height: '100%', borderRadius: 4, backgroundColor: Colors.primary },
  estimate: { fontSize: 12, color: Colors.textSecondary },
});

export default PermitProgressBar;
