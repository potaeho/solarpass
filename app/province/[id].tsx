import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { MOCK_REGIONS } from '../../src/constants/regions';
import { getCitiesByProvince } from '../../src/constants/cities';
import FeasibilityBadge from '../../src/components/region/FeasibilityBadge';
import type { Region, SolarGrade } from '../../src/types/region';

const GRADE_COLOR: Record<SolarGrade, string> = {
  excellent: '#1565C0',
  good:      '#43A047',
  fair:      '#8BC34A',
  average:   '#FDD835',
  low:       '#B0BEC5',
};

const GRADE_LABEL: Record<SolarGrade, string> = {
  excellent: '최우수',
  good:      '우수',
  fair:      '양호',
  average:   '보통',
  low:       '낮음',
};

function CityCard({ city, onPress }: { city: Region; onPress: () => void }) {
  const gradeColor = GRADE_COLOR[city.solarGrade];
  const passCount = city.checks.filter(c => c.status === 'pass').length;
  const failCount = city.checks.filter(c => c.status === 'fail').length;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={[styles.cardGrade, { backgroundColor: gradeColor }]}>
        <Text style={styles.cardGradeText}>{GRADE_LABEL[city.solarGrade]}</Text>
      </View>
      <Text style={styles.cardName}>{city.shortName}</Text>
      <FeasibilityBadge status={city.feasibilityStatus} />
      <View style={styles.cardStats}>
        <View style={styles.cardStat}>
          <Ionicons name="checkmark-circle" size={12} color={Colors.available} />
          <Text style={styles.cardStatText}>{passCount}</Text>
        </View>
        {failCount > 0 && (
          <View style={styles.cardStat}>
            <Ionicons name="close-circle" size={12} color={Colors.unavailable} />
            <Text style={styles.cardStatText}>{failCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function ProvinceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const province = MOCK_REGIONS.find(r => r.id === id);
  const cities = province ? getCitiesByProvince(province.province) : [];

  if (!province) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>지역 정보를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const availableCount = cities.filter(c => c.feasibilityStatus === 'available').length;
  const conditionalCount = cities.filter(c => c.feasibilityStatus === 'conditional').length;
  const unavailableCount = cities.filter(c => c.feasibilityStatus === 'unavailable').length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 도 요약 헤더 */}
      <View style={styles.header}>
        <Text style={styles.provinceName}>{province.name}</Text>
        <Text style={styles.provinceSubtitle}>시·군 선택 후 상세 분석</Text>
      </View>

      {/* 가능 여부 요약 */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { borderColor: Colors.available }]}>
          <Text style={[styles.summaryCount, { color: Colors.available }]}>{availableCount}</Text>
          <Text style={styles.summaryLabel}>설치 가능</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: Colors.conditional }]}>
          <Text style={[styles.summaryCount, { color: Colors.conditional }]}>{conditionalCount}</Text>
          <Text style={styles.summaryLabel}>조건부</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: Colors.unavailable }]}>
          <Text style={[styles.summaryCount, { color: Colors.unavailable }]}>{unavailableCount}</Text>
          <Text style={styles.summaryLabel}>설치 불가</Text>
        </View>
        <View style={[styles.summaryCard, { borderColor: Colors.border }]}>
          <Text style={[styles.summaryCount, { color: Colors.textSecondary }]}>{cities.length}</Text>
          <Text style={styles.summaryLabel}>분석 지역</Text>
        </View>
      </View>

      {cities.length === 0 ? (
        <View style={styles.noCities}>
          <Ionicons name="map-outline" size={40} color={Colors.border} />
          <Text style={styles.noCitiesText}>아직 세부 분석 데이터가 없는 지역입니다</Text>
          <Text style={styles.noCitiesSubtext}>순차적으로 추가될 예정입니다</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>시·군 선택</Text>
          <View style={styles.grid}>
            {cities.map(city => (
              <CityCard
                key={city.id}
                city={city}
                onPress={() => router.push(`/region/${city.id}`)}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 40 },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  provinceName: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  provinceSubtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  summaryRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 10,
    borderWidth: 1.5,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 3,
  },
  summaryCount: { fontSize: 20, fontWeight: '800' },
  summaryLabel: { fontSize: 10, color: Colors.textSecondary },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 10,
  },
  card: {
    width: '47%',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  cardGrade: {
    alignSelf: 'flex-start',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cardGradeText: { fontSize: 10, fontWeight: '700', color: '#fff' },
  cardName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  cardStats: { flexDirection: 'row', gap: 8, marginTop: 2 },
  cardStat: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  cardStatText: { fontSize: 11, color: Colors.textSecondary },
  noCities: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 10,
  },
  noCitiesText: { fontSize: 15, color: Colors.textSecondary },
  noCitiesSubtext: { fontSize: 12, color: Colors.textTertiary },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
});
