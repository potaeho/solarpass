import { useMemo, useState } from 'react';
import {
  FlatList, Linking, SafeAreaView, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { MOCK_OFFICES } from '../../src/constants/vendors';
import type { CivilOffice } from '../../src/types/vendor';

// ── 데이터 준비 ───────────────────────────────────────────────────────────────
const PROVINCE_SHORT: Record<string, string> = {
  '전라남도': '전라남도',
  '충청남도': '충청남도',
  '경상북도': '경상북도',
  '경상남도': '경상남도',
  '전라북도': '전라북도',
  '제주특별자치도': '제주도',
  '강원도': '강원도',
  '경기도': '경기도',
};

const PROVINCES = ['전체', ...Object.keys(MOCK_OFFICES)];

const ALL_OFFICES: (CivilOffice & { province: string })[] = Object.entries(MOCK_OFFICES).flatMap(
  ([province, list]) => list.map(o => ({ ...o, province })),
);

// ── 오피스 카드 ───────────────────────────────────────────────────────────────
function OfficeCard({ office }: { office: CivilOffice & { province: string } }) {
  return (
    <View style={styles.card}>
      {/* 도·시청 뱃지 */}
      <View style={styles.cardHeader}>
        <View style={styles.provinceBadge}>
          <Text style={styles.provinceBadgeText}>{office.province}</Text>
        </View>
        <Text style={styles.cityHall}>{office.cityHall}</Text>
      </View>

      {/* 사무소명 */}
      <Text style={styles.officeName}>📌 {office.name}</Text>

      {/* 주소 */}
      <View style={styles.infoRow}>
        <Ionicons name="location-outline" size={13} color={Colors.textTertiary} />
        <Text style={styles.infoText} numberOfLines={2}>{office.address}</Text>
      </View>

      {/* 인허가 경험 */}
      {office.permitExperienceCount !== undefined && (
        <View style={styles.infoRow}>
          <Ionicons name="checkmark-circle-outline" size={13} color={Colors.available} />
          <Text style={[styles.infoText, { color: Colors.available }]}>
            개발행위허가 경험 {office.permitExperienceCount}건
          </Text>
        </View>
      )}

      {/* 버튼 */}
      <View style={styles.btnRow}>
        <TouchableOpacity
          style={styles.btnCall}
          onPress={() => Linking.openURL(`tel:${office.phone}`)}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={15} color="#fff" />
          <Text style={styles.btnCallText}>{office.phone}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btnMap}
          onPress={() => {
            const q = encodeURIComponent(office.address);
            Linking.openURL(`https://maps.google.com/?q=${q}`);
          }}
          activeOpacity={0.8}
        >
          <Ionicons name="map-outline" size={15} color={Colors.primary} />
          <Text style={styles.btnMapText}>지도</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────────────────
export default function OfficeTab() {
  const [selectedProvince, setSelectedProvince] = useState('전체');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    let list = ALL_OFFICES;
    if (selectedProvince !== '전체') {
      list = list.filter(o => o.province === selectedProvince);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter(o =>
        o.name.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q) ||
        o.cityHall.toLowerCase().includes(q),
      );
    }
    return list;
  }, [selectedProvince, query]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>토목사무소</Text>
        <Text style={styles.headerSub}>개발행위허가 경험 사무소 목록</Text>
      </View>

      {/* 검색 */}
      <View style={styles.searchWrap}>
        <Ionicons name="search" size={16} color={Colors.textTertiary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="사무소명, 주소, 시청 검색"
          placeholderTextColor={Colors.textTertiary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
            <Ionicons name="close-circle" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* 도 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
        style={styles.filterScroll}
      >
        {PROVINCES.map(prov => {
          const active = selectedProvince === prov;
          const count  = prov === '전체'
            ? ALL_OFFICES.length
            : (MOCK_OFFICES[prov]?.length ?? 0);
          const label  = prov === '전체' ? '전체' : (PROVINCE_SHORT[prov] ?? prov);
          return (
            <TouchableOpacity
              key={prov}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => setSelectedProvince(prov)}
              activeOpacity={0.8}
            >
              <Text style={[styles.chipText, active && styles.chipTextActive]}>
                {label}
              </Text>
              <View style={[styles.chipBadge, active && styles.chipBadgeActive]}>
                <Text style={[styles.chipBadgeText, active && styles.chipBadgeTextActive]}>
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* 결과 카운트 */}
      <View style={styles.resultRow}>
        <Text style={styles.resultText}>
          {selectedProvince === '전체' ? '전체' : selectedProvince} 사무소{' '}
          <Text style={styles.resultCount}>{filtered.length}곳</Text>
        </Text>
      </View>

      {/* 목록 */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <OfficeCard office={item} />}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="business-outline" size={40} color={Colors.border} />
            <Text style={styles.emptyText}>검색 결과가 없습니다</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

// ── 스타일 ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },

  header:    { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  headerSub:   { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

  searchWrap: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 16, marginBottom: 10,
    backgroundColor: Colors.surface,
    borderRadius: 12, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: 12, paddingVertical: 10,
  },
  searchIcon:  { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.textPrimary, padding: 0 },
  clearBtn:    { padding: 2 },

  filterScroll: { flexGrow: 0, flexShrink: 0, marginBottom: 4 },
  filterList:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 6, gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: Colors.border,
    backgroundColor: Colors.surface, gap: 6,
  },
  chipActive:      { borderColor: Colors.primary, backgroundColor: Colors.primary + '15' },
  chipText:        { fontSize: 13, fontWeight: '600', color: Colors.textSecondary },
  chipTextActive:  { color: Colors.primary },
  chipBadge:       { backgroundColor: Colors.border, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 2, flexShrink: 0 },
  chipBadgeActive: { backgroundColor: Colors.primary },
  chipBadgeText:   { fontSize: 11, fontWeight: '700', color: Colors.textSecondary },
  chipBadgeTextActive: { color: '#fff' },

  resultRow:    { paddingHorizontal: 16, paddingVertical: 8 },
  resultText:   { fontSize: 13, color: Colors.textSecondary },
  resultCount:  { fontWeight: '700', color: Colors.textPrimary },

  listContent: { paddingHorizontal: 16, paddingBottom: 32 },

  card: {
    backgroundColor: Colors.surface,
    borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  provinceBadge: {
    backgroundColor: Colors.primary + '20',
    borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  provinceBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.primary },
  cityHall:          { fontSize: 12, color: Colors.textSecondary },

  officeName: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },

  infoRow:  { flexDirection: 'row', alignItems: 'flex-start', gap: 5, marginBottom: 4 },
  infoText: { flex: 1, fontSize: 12, color: Colors.textSecondary, lineHeight: 18 },

  btnRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  btnCall: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: Colors.primary, borderRadius: 8, paddingVertical: 10,
  },
  btnCallText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  btnMap: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 8,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  btnMapText: { color: Colors.primary, fontSize: 13, fontWeight: '700' },

  empty:     { alignItems: 'center', paddingVertical: 60, gap: 12 },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
