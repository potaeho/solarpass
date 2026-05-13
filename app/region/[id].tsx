import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useRegionFeasibility } from '../../src/hooks/useRegionFeasibility';
import FeasibilityBadge from '../../src/components/region/FeasibilityBadge';
import FeasibilityCheckList from '../../src/components/region/FeasibilityCheckList';
import SectionHeader from '../../src/components/common/SectionHeader';
import LoadingOverlay from '../../src/components/common/LoadingOverlay';
import NearbyFacilitiesCard from '../../src/components/region/NearbyFacilitiesCard';
import { REGION_SOLAR_STATS } from '../../src/constants/solarStats';
import { formatGenerationMWh } from '../../src/utils/formatters';
import type { FeasibilityCheck, FeasibilityStatus } from '../../src/types/region';

// 요약 문장 생성
const CHECK_SHORT: Record<string, string> = {
  land_use: '토지이용',
  grid_capacity: '계통망 용량',
  setback_distance: '이격거리',
  national_law: '공통법규',
  local_ordinance: '지자체 조례',
};

function buildSummary(status: FeasibilityStatus, checks: FeasibilityCheck[]): string {
  const fails    = checks.filter(c => c.status === 'fail');
  const warnings = checks.filter(c => c.status === 'warning');

  if (status === 'available') {
    return '토지·계통망·법규 등 모든 설치 기준을 충족한 지역입니다.';
  }
  if (status === 'unavailable') {
    const labels = fails.map(c => CHECK_SHORT[c.id]).join('·');
    return `${labels} 기준 미충족으로 현재 태양광 설치가 불가합니다.`;
  }
  // conditional
  const issues = [...fails, ...warnings].map(c => CHECK_SHORT[c.id]).join('·');
  return `${issues} 조건 확인 후 해결하면 설치가 가능합니다.`;
}

const SUMMARY_STYLE: Record<FeasibilityStatus, { bg: string; color: string; icon: string }> = {
  available:   { bg: Colors.availableBg,   color: '#0D7A38', icon: 'checkmark-circle' },
  conditional: { bg: Colors.conditionalBg, color: '#8A6500', icon: 'alert-circle'     },
  unavailable: { bg: Colors.unavailableBg, color: '#B71C1C', icon: 'close-circle'     },
};

export default function RegionDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data: region, isLoading } = useRegionFeasibility(id);

  if (isLoading) return <LoadingOverlay />;
  if (!region) return (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>아직 분석 데이터가 없는 지역입니다.</Text>
    </View>
  );

  const stats = REGION_SOLAR_STATS[region.province];
  const rankIcon = stats
    ? stats.nationalRank <= 3 ? '🏆' : stats.nationalRank <= 9 ? '⭐' : ''
    : '';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.regionName}>{region.name}</Text>
        <FeasibilityBadge status={region.feasibilityStatus} />
      </View>

      {/* 한 줄 요약 배너 */}
      {(() => {
        const s = SUMMARY_STYLE[region.feasibilityStatus];
        return (
          <View style={[styles.summaryBanner, { backgroundColor: s.bg }]}>
            <Ionicons name={s.icon as never} size={16} color={s.color} />
            <Text style={[styles.summaryText, { color: s.color }]}>
              {buildSummary(region.feasibilityStatus, region.checks)}
            </Text>
          </View>
        );
      })()}

      {stats && (
        <View style={styles.statsCard}>
          <SectionHeader title="☀️ 실발전 실적" />
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>{formatGenerationMWh(stats.annualGenerationMWh)}</Text>
              <Text style={styles.statsLabel}>연간 발전량</Text>
            </View>
            <View style={styles.statsItem}>
              <Text style={styles.statsValue}>
                {rankIcon} 전국 {stats.nationalRank}위
              </Text>
              <Text style={styles.statsLabel}>({stats.totalRegions}개 지역)</Text>
            </View>
          </View>
          <Text style={styles.statsSource}>출처: 한국전력거래소 2025년 연간 실적</Text>
        </View>
      )}

      <SectionHeader
        title="태양광 설치 가능 여부 분석"
        subtitle={`최종 업데이트: ${region.updatedAt}`}
      />
      <FeasibilityCheckList checks={region.checks} />

      <NearbyFacilitiesCard region={region} />

      <TouchableOpacity
        style={[
          styles.cta,
          region.feasibilityStatus === 'unavailable' && styles.ctaDisabled,
        ]}
        disabled={region.feasibilityStatus === 'unavailable'}
        onPress={() => router.push(`/permit-flow/${region.id}`)}
      >
        <Text style={styles.ctaText}>
          {region.feasibilityStatus === 'unavailable'
            ? '인허가 진행 불가'
            : '이 지역으로 인허가 진행하기 →'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  regionName: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  summaryBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  summaryText: { flex: 1, fontSize: 14, fontWeight: '600', lineHeight: 20 },
  statsCard: { margin: 16, borderRadius: 8, borderWidth: 1, borderColor: '#FAB400', backgroundColor: '#FFFBEA', overflow: 'hidden' },
  statsRow: { flexDirection: 'row', padding: 16, gap: 16 },
  statsItem: { flex: 1, alignItems: 'center' },
  statsValue: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  statsLabel: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  statsSource: { fontSize: 11, color: Colors.textTertiary, textAlign: 'right', paddingHorizontal: 12, paddingBottom: 8 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
  cta: { margin: 16, backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 16, alignItems: 'center' },
  ctaDisabled: { backgroundColor: '#CCCCCC' },
  ctaText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
