import { Modal, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import {
  GRID_SATURATION_COLOR,
  GRID_SATURATION_HEX,
  getGridSaturation,
} from '../../constants/gridLines';
import { OSM_GRID_LINES } from '../../constants/osmGridLines';
import type { Region } from '../../types/region';

type Props = {
  visible: boolean;
  onClose: () => void;
  region: Region | null;
};

const LEGEND = [
  { level: 'surplus',   label: '여유 (<50%)' },
  { level: 'caution',   label: '주의 (50~75%)' },
  { level: 'shortage',  label: '부족 (75~90%)' },
  { level: 'saturated', label: '포화 (>90%)' },
] as const;

const VOLTAGE_WIDTH: Record<number, number> = {
  765000: 5,
  345000: 3,
  154000: 2,
};

// 지역별 계통 혼잡도 시드값 (mock saturation 분포용)
const PROVINCE_SATURATION_SEED: Record<string, number> = {
  '제주특별자치도': 0.95,
  '전라남도':       0.82,
  '경기도':         0.78,
  '서울특별시':     0.88,
  '인천광역시':     0.75,
  '충청남도':       0.71,
  '전라북도':       0.65,
  '경상남도':       0.68,
  '경상북도':       0.62,
  '부산광역시':     0.72,
  '대구광역시':     0.70,
  '울산광역시':     0.66,
  '광주광역시':     0.60,
  '대전광역시':     0.58,
  '강원도':         0.48,
  '충청북도':       0.52,
  '세종특별자치시': 0.45,
};

function getLineSaturationRatio(lineId: string, province: string, voltage: number): number {
  const base = PROVINCE_SATURATION_SEED[province] ?? 0.55;
  // 전압 등급별 편차
  const voltageOffset = voltage >= 765000 ? 0.05 : voltage >= 345000 ? 0.0 : -0.1;
  // 선로 id 기반 약간의 랜덤 변동 (±0.15 범위)
  const seed = lineId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const jitter = ((seed % 30) - 15) / 100;
  return Math.max(0.1, Math.min(0.99, base + voltageOffset + jitter));
}

export default function GridCapacityModal({ visible, onClose, region }: Props) {
  // 지역 필터링 (선택된 지역이 없으면 전국 표시)
  const filteredLines = region
    ? OSM_GRID_LINES.filter(l => l.province === region.province)
    : OSM_GRID_LINES;

  // 지역 실제 계통 용량 정보 (region checks에서 추출)
  const gridCheck = region?.checks.find(c => c.id === 'grid_capacity');
  const gridCap = gridCheck?.gridCapacity;

  // 포화율 계산 (지역 전체 평균 → map에 반영)
  const regionRatio = gridCap
    ? gridCap.usedMW / gridCap.totalMW
    : PROVINCE_SATURATION_SEED[region?.province ?? ''] ?? 0.55;

  // 포화 상태별 통계
  const satStats = { surplus: 0, caution: 0, shortage: 0, saturated: 0 };
  filteredLines.forEach(line => {
    const ratio = getLineSaturationRatio(line.id, line.province, line.voltage);
    const sat = getGridSaturation(ratio * 1000, 1000);
    satStats[sat]++;
  });

  const initialRegion = region
    ? {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 1.8,
        longitudeDelta: 1.8,
      }
    : {
        latitude: 36.5,
        longitude: 127.8,
        latitudeDelta: 7,
        longitudeDelta: 7,
      };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>⚡ 계통망 현황</Text>
            {region && (
              <Text style={styles.subtitle}>{region.name} 송전선로</Text>
            )}
          </View>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* 지도 */}
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
          >
            {filteredLines.map(line => {
              const ratio = getLineSaturationRatio(line.id, line.province, line.voltage);
              const saturation = getGridSaturation(ratio * 1000, 1000);
              // iOS + PROVIDER_GOOGLE: strokeColor 무시됨 → strokeColors 배열 사용
              // Android: strokeColor도 함께 지정
              const hexColor = GRID_SATURATION_HEX[saturation];
              const width = VOLTAGE_WIDTH[line.voltage] ?? 2;
              return (
                <Polyline
                  key={line.id}
                  coordinates={line.coordinates}
                  strokeColor={hexColor}
                  strokeColors={[hexColor]}
                  strokeWidth={width}
                />
              );
            })}
          </MapView>

          {/* 범례 */}
          <View style={styles.legend}>
            {LEGEND.map(item => (
              <View key={item.level} style={styles.legendItem}>
                <View style={[styles.legendLine, { backgroundColor: GRID_SATURATION_HEX[item.level] }]} />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
            <View style={styles.legendDivider} />
            <View style={styles.legendItem}>
              <View style={[styles.legendLineThick, { backgroundColor: '#555' }]} />
              <Text style={styles.legendText}>765kV</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendLineThin, { backgroundColor: '#555' }]} />
              <Text style={styles.legendText}>345kV</Text>
            </View>
          </View>
        </View>

        {/* 용량 정보 카드 */}
        {gridCap && (
          <View style={styles.capacityRow}>
            <View style={styles.capCard}>
              <Text style={styles.capLabel}>총 용량</Text>
              <Text style={styles.capValue}>{gridCap.totalMW.toLocaleString()}<Text style={styles.capUnit}> MW</Text></Text>
            </View>
            <View style={styles.capCard}>
              <Text style={styles.capLabel}>사용 중</Text>
              <Text style={[styles.capValue, { color: GRID_SATURATION_HEX[getGridSaturation(gridCap.usedMW, gridCap.totalMW)] }]}>
                {gridCap.usedMW.toLocaleString()}<Text style={styles.capUnit}> MW</Text>
              </Text>
            </View>
            <View style={styles.capCard}>
              <Text style={styles.capLabel}>여유 용량</Text>
              <Text style={[styles.capValue, { color: gridCap.availableMW < 500 ? Colors.unavailable : Colors.available }]}>
                {gridCap.availableMW.toLocaleString()}<Text style={styles.capUnit}> MW</Text>
              </Text>
            </View>
            <View style={styles.capCard}>
              <Text style={styles.capLabel}>대기 건수</Text>
              <Text style={[styles.capValue, { color: gridCap.waitingQueue > 50 ? Colors.unavailable : Colors.textPrimary }]}>
                {gridCap.waitingQueue}<Text style={styles.capUnit}> 건</Text>
              </Text>
            </View>
          </View>
        )}

        {/* 포화 현황 통계 */}
        <View style={styles.statsRow}>
          {(Object.entries(satStats) as [keyof typeof satStats, number][]).map(([sat, count]) => (
            <View key={sat} style={styles.statCard}>
              <View style={[styles.statDot, { backgroundColor: GRID_SATURATION_HEX[sat] }]} />
              <Text style={[styles.statCount, { color: GRID_SATURATION_HEX[sat] }]}>{count}</Text>
              <Text style={styles.statLabel}>
                {sat === 'surplus' ? '여유' : sat === 'caution' ? '주의' : sat === 'shortage' ? '부족' : '포화'}
              </Text>
            </View>
          ))}
          <View style={styles.statCard}>
            <Ionicons name="git-branch-outline" size={16} color={Colors.textSecondary} />
            <Text style={styles.statCount}>{filteredLines.length}</Text>
            <Text style={styles.statLabel}>총 선로</Text>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: { flex: 1 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  mapContainer: { flex: 1 },
  map: { flex: 1 },
  legend: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255,255,255,0.93)',
    borderRadius: 8,
    padding: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendLine: { width: 20, height: 4, borderRadius: 2 },
  legendLineThick: { width: 20, height: 5, borderRadius: 2 },
  legendLineThin: { width: 20, height: 3, borderRadius: 1 },
  legendDivider: { height: 1, backgroundColor: Colors.border, marginVertical: 2 },
  legendText: { fontSize: 10, color: Colors.textPrimary },
  capacityRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  capCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    gap: 2,
  },
  capLabel: { fontSize: 10, color: Colors.textSecondary },
  capValue: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
  capUnit: { fontSize: 10, fontWeight: '400', color: Colors.textSecondary },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    gap: 3,
  },
  statDot: { width: 10, height: 10, borderRadius: 5 },
  statCount: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: 10, color: Colors.textSecondary },
});
