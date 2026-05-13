import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '../../../src/constants/colors';
import SectionHeader from '../../../src/components/common/SectionHeader';
import OfficeConnectCard from '../../../src/components/permit/OfficeConnectCard';
import { getOfficesByProvince } from '../../../src/constants/vendors';
import { MOCK_REGIONS } from '../../../src/constants/regions';
import { getCitiesByProvince } from '../../../src/constants/cities';

// regionId → province 조회
function getProvinceFromRegionId(regionId: string): string {
  // 도 단위 (예: jeonnam)
  const province = MOCK_REGIONS.find(r => r.id === regionId);
  if (province) return province.province;
  // 시·군 단위 (예: jeonnam-naju) — 전체 도시 목록에서 검색
  for (const r of MOCK_REGIONS) {
    const cities = getCitiesByProvince(r.province);
    const city = cities.find(c => c.id === regionId);
    if (city) return city.province;
  }
  return '';
}

export default function OfficeConnectScreen() {
  const { regionId } = useLocalSearchParams<{ regionId: string }>();
  const province = getProvinceFromRegionId(regionId ?? '');
  const offices = getOfficesByProvince(province);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SectionHeader title="추천 토목사무소" subtitle="시청/군청 인근 사무소를 추천합니다" />
      <View style={styles.list}>
        {offices.map(office => (
          <OfficeConnectCard key={office.id} office={office} />
        ))}
        {offices.length === 0 && (
          <Text style={styles.empty}>해당 지역 토목사무소 데이터를 준비 중입니다.</Text>
        )}
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          ℹ 시청/군청 앞 토목사무소는 지자체와의 소통이 원활하여{'\n'}
          개발행위허가 처리 속도가 빠릅니다.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { paddingBottom: 32 },
  list: { padding: 16, gap: 8 },
  empty: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', paddingVertical: 24 },
  infoBox: { margin: 16, backgroundColor: '#EEF2FF', borderRadius: 8, padding: 12 },
  infoText: { fontSize: 13, color: '#1565C0', lineHeight: 20 },
});
