import { FlatList, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { getFacilityStat } from '../../constants/solarFacilityData';
import type { Region } from '../../types/region';

type Props = { region: Region };

type TopItem = { name: string; capacityKW: number; status: string; address: string };

const STATUS_COLOR: Record<string, string> = {
  '정상가동': Colors.available,
  '가동중단': Colors.textTertiary,
  '공사중':   Colors.conditional,
  '폐기':     Colors.unavailable,
};

function capacityLabel(kw: number): string {
  return kw >= 1000 ? `${(kw / 1000).toFixed(1)} MW` : `${kw.toFixed(0)} kW`;
}

function FacilityRow({ item }: { item: TopItem }) {
  const color = STATUS_COLOR[item.status] ?? Colors.textSecondary;
  return (
    <View style={styles.row}>
      <View style={styles.rowLeft}>
        <Text style={styles.facilityName} numberOfLines={1}>
          {item.name || '(이름 없음)'}
        </Text>
        <Text style={styles.address} numberOfLines={1}>
          {item.address || '-'}
        </Text>
      </View>
      <View style={styles.rowRight}>
        <Text style={styles.capacity}>{capacityLabel(item.capacityKW)}</Text>
        <Text style={[styles.status, { color }]}>{item.status || '-'}</Text>
      </View>
    </View>
  );
}

export default function NearbyFacilitiesCard({ region }: Props) {
  const isCity   = region.id.includes('-');
  const stat     = getFacilityStat(region.province, isCity ? region.shortName : undefined);
  const cardTitle = isCity
    ? `${region.shortName} 태양광 발전소`
    : `${region.shortName} 태양광 허가 현황`;

  if (!stat) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="flash" size={16} color="#FAB400" />
            <Text style={styles.headerTitle}>{cardTitle}</Text>
          </View>
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyText}>등록된 발전소 데이터가 없습니다</Text>
        </View>
      </View>
    );
  }

  const totalMW = (stat.totalCapacityKW / 1000).toFixed(1);
  const avgMW   = stat.totalCount > 0
    ? ((stat.totalCapacityKW / stat.totalCount) / 1000).toFixed(2)
    : '—';
  const displayItems = stat.topFacilities.slice(0, 10);

  return (
    <View style={styles.card}>
      {/* 헤더 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="flash" size={16} color="#FAB400" />
          <Text style={styles.headerTitle}>{cardTitle}</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>{stat.totalCount.toLocaleString()}개소</Text>
        </View>
      </View>

      {/* 요약 통계 */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{stat.totalCount.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>발전소 수</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {totalMW} <Text style={styles.summaryUnit}>MW</Text>
          </Text>
          <Text style={styles.summaryLabel}>총 설비용량</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>
            {avgMW} <Text style={styles.summaryUnit}>MW</Text>
          </Text>
          <Text style={styles.summaryLabel}>평균 용량</Text>
        </View>
      </View>

      {/* 운영 현황 뱃지 */}
      <View style={styles.statusRow}>
        <View style={styles.statusBadge}>
          <View style={[styles.dot, { backgroundColor: Colors.available }]} />
          <Text style={styles.statusText}>운영 {stat.operatingCount.toLocaleString()}개</Text>
        </View>
        {stat.constructingCount > 0 && (
          <View style={styles.statusBadge}>
            <View style={[styles.dot, { backgroundColor: Colors.conditional }]} />
            <Text style={styles.statusText}>공사중 {stat.constructingCount.toLocaleString()}개</Text>
          </View>
        )}
      </View>

      {/* 상위 발전소 목록 */}
      {displayItems.length > 0 && (
        <>
          <View style={styles.listHeader}>
            <Text style={styles.listHeaderText}>용량 상위 발전소</Text>
          </View>
          <FlatList
            data={displayItems}
            keyExtractor={(item, i) => `${item.name}-${i}`}
            renderItem={({ item }) => <FacilityRow item={item} />}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={
              stat.totalCount > 10
                ? <Text style={styles.moreText}>외 {(stat.totalCount - 10).toLocaleString()}개소</Text>
                : null
            }
          />
        </>
      )}

      {/* 출처 */}
      <View style={styles.sourceBanner}>
        <Ionicons name="information-circle-outline" size={11} color={Colors.textTertiary} />
        <Text style={styles.sourceText}>전국 전기사업 허가 발전소 기준 (data.go.kr)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    marginTop: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  headerTitle: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
  headerBadge: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  headerBadgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  summaryRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryItem:   { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: Colors.border },
  summaryValue:  { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  summaryUnit:   { fontSize: 12, fontWeight: '400', color: Colors.textSecondary },
  summaryLabel:  { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  statusRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  statusBadge:  { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot:          { width: 7, height: 7, borderRadius: 4 },
  statusText:   { fontSize: 12, color: Colors.textSecondary },
  listHeader: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
  },
  listHeaderText: { fontSize: 11, fontWeight: '600', color: Colors.textTertiary, textTransform: 'uppercase' },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  rowLeft:      { flex: 1, marginRight: 12 },
  rowRight:     { alignItems: 'flex-end' },
  facilityName: { fontSize: 13, fontWeight: '600', color: Colors.textPrimary },
  address:      { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  capacity:     { fontSize: 13, fontWeight: '700', color: Colors.primary },
  status:       { fontSize: 11, marginTop: 2 },
  separator:    { height: 1, backgroundColor: Colors.border, marginHorizontal: 14 },
  moreText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textTertiary,
    paddingVertical: 10,
  },
  center:    { alignItems: 'center', paddingVertical: 20 },
  emptyText: { fontSize: 13, color: Colors.textSecondary },
  sourceBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  sourceText: { fontSize: 10, color: Colors.textTertiary },
});
