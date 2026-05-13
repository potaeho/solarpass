import { ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../../src/constants/colors';
import { useVendorList } from '../../../../src/hooks/useVendorList';
import VendorCard from '../../../../src/components/permit/VendorCard';
import LoadingOverlay from '../../../../src/components/common/LoadingOverlay';
import SectionHeader from '../../../../src/components/common/SectionHeader';
import type { PermitStepId } from '../../../../src/types/permit';
import type { Vendor } from '../../../../src/types/vendor';

export default function StepVendorScreen() {
  const { regionId, stepId } = useLocalSearchParams<{ regionId: string; stepId: string }>();
  const { data: vendors, isLoading } = useVendorList(stepId as PermitStepId, regionId);

  if (isLoading) return <LoadingOverlay />;

  const handleRequestQuote = (_vendor: Vendor) => {
    // TODO: 견적 요청 모달
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader title="전문 업체 선택" subtitle="추천순으로 정렬됩니다" />
      <View style={styles.list}>
        {vendors?.map(vendor => (
          <VendorCard key={vendor.id} vendor={vendor} onRequestQuote={handleRequestQuote} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  list: { padding: 16, gap: 8 },
});
