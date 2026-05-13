import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '../../../src/constants/colors';
import { usePermitFlow } from '../../../src/hooks/usePermitFlow';
import PermitProgressBar from '../../../src/components/permit/PermitProgressBar';
import PermitStepCard from '../../../src/components/permit/PermitStepCard';
import LoadingOverlay from '../../../src/components/common/LoadingOverlay';

export default function PermitFlowScreen() {
  const { regionId } = useLocalSearchParams<{ regionId: string }>();
  const router = useRouter();
  const { data: flow, isLoading } = usePermitFlow(regionId);

  if (isLoading) return <LoadingOverlay />;
  if (!flow) return null;

  const completedCount = flow.steps.filter(s => s.status === 'completed').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <PermitProgressBar
        currentStep={completedCount}
        totalSteps={flow.steps.length}
        estimatedMonths={flow.estimatedMonths}
      />
      <View style={styles.parallelBanner}>
        <Text style={styles.bannerText}>
          ⇌ 2단계(발전사업허가)와 3단계(개발행위허가)는 동시에 진행할 수 있어요.
          단, 두 단계 모두 완료되어야 다음으로 진행됩니다.
        </Text>
      </View>
      {flow.steps.map(step => (
        <PermitStepCard
          key={step.id}
          step={step}
          onPress={() => router.push(`/permit-flow/${regionId}/step/${step.id}`)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16, paddingBottom: 32 },
  parallelBanner: {
    backgroundColor: '#EEF2FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#6A1B9A',
  },
  bannerText: { fontSize: 13, color: '#4A148C', lineHeight: 18 },
});
