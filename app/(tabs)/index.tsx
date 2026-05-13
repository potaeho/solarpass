import { useRef, useState, useMemo, useCallback } from 'react';
import {
  ActivityIndicator, FlatList, Keyboard,
  StyleSheet, Text, TextInput,
  TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMapStore } from '../../src/stores/useMapStore';
import RegionBottomSheet from '../../src/components/map/RegionBottomSheet';
import MapLegend from '../../src/components/map/MapLegend';
import SolarZoneMarker from '../../src/components/map/SolarZoneMarker';
import GridCapacityModal from '../../src/components/map/GridCapacityModal';
import AddressDetailCard from '../../src/components/map/AddressDetailCard';
import { MOCK_REGIONS } from '../../src/constants/regions';
import { CITIES_BY_PROVINCE, getCitiesByProvince } from '../../src/constants/cities';
import { Colors } from '../../src/constants/colors';
import { searchAddress, normalizeProvince } from '../../src/api/addressSearch';
import type { Region } from '../../src/types/region';
import type { AddressResult } from '../../src/api/addressSearch';

// ── 검색 결과 통합 타입 ───────────────────────────────────────────────────────
type ResultItem =
  | { kind: 'region';  data: Region }
  | { kind: 'address'; data: AddressResult };

// ── 지역 검색 대상 (도 + 모든 시·군) ──────────────────────────────────────────
const ALL_REGIONS: Region[] = [
  ...MOCK_REGIONS,
  ...Object.values(CITIES_BY_PROVINCE).flat(),
];

// ── 주소 → 매칭 Region 찾기 ───────────────────────────────────────────────────
function findRegionForAddress(addr: AddressResult): Region | null {
  const province = normalizeProvince(addr.province);
  const cityName = addr.city;

  // 1. 시·군 단위 매칭
  const cities = getCitiesByProvince(province);
  const cityMatch = cities.find(c =>
    c.shortName === cityName ||
    cityName.startsWith(c.shortName) ||
    c.shortName.startsWith(cityName),
  );
  if (cityMatch) return cityMatch;

  // 2. 도 단위 매칭
  const provMatch = MOCK_REGIONS.find(r =>
    r.province === province || r.name === province,
  );
  return provMatch ?? null;
}

const INITIAL_REGION = {
  latitude: 36.5, longitude: 127.8,
  latitudeDelta: 4.5, longitudeDelta: 4.5,
};

// ── 검색 결과 아이템 ──────────────────────────────────────────────────────────
function ResultRow({ item, onPress }: { item: ResultItem; onPress: () => void }) {
  if (item.kind === 'region') {
    const r = item.data;
    const badgeColor = r.feasibilityStatus === 'available' ? Colors.available
      : r.feasibilityStatus === 'conditional' ? Colors.conditional : Colors.unavailable;
    const badgeBg = r.feasibilityStatus === 'available' ? Colors.availableBg
      : r.feasibilityStatus === 'conditional' ? Colors.conditionalBg : Colors.unavailableBg;
    const badgeLabel = r.feasibilityStatus === 'available' ? '설치 가능'
      : r.feasibilityStatus === 'conditional' ? '조건부' : '설치 불가';
    const isProvince = MOCK_REGIONS.some(p => p.id === r.id);

    return (
      <TouchableOpacity style={styles.resultItem} onPress={onPress} activeOpacity={0.7}>
        <View style={styles.resultIconWrap}>
          <Ionicons name={isProvince ? 'map-outline' : 'location-outline'} size={15} color={Colors.textTertiary} />
        </View>
        <View style={styles.resultTextWrap}>
          {!isProvince && <Text style={styles.resultSub}>{r.province}</Text>}
          <Text style={styles.resultName}>{isProvince ? r.name : r.shortName}</Text>
        </View>
        <View style={[styles.resultBadge, { backgroundColor: badgeBg }]}>
          <Text style={[styles.resultBadgeText, { color: badgeColor }]}>{badgeLabel}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // address result
  const a = item.data;
  return (
    <TouchableOpacity style={styles.resultItem} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.resultIconWrap, { backgroundColor: '#FFF3E0' }]}>
        <Ionicons name="pin-outline" size={15} color="#E65100" />
      </View>
      <View style={styles.resultTextWrap}>
        <Text style={styles.resultSub}>{a.province} {a.city}</Text>
        <Text style={styles.resultName} numberOfLines={1}>{a.displayName}</Text>
      </View>
      <View style={styles.jibunBadge}>
        <Text style={styles.jibunBadgeText}>지번</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────────────────
export default function MapHome() {
  const router         = useRouter();
  const insets         = useSafeAreaInsets();
  const mapRef         = useRef<MapView>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const timerRef       = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { selectedRegion, setSelectedRegion } = useMapStore();
  const [zoomLevel, setZoomLevel]             = useState(7);
  const [showGridModal, setShowGridModal]     = useState(false);
  const [query, setQuery]                     = useState('');
  const [searchFocused, setSearchFocused]     = useState(false);

  // 주소 검색
  const [addrResults, setAddrResults]         = useState<AddressResult[]>([]);
  const [isSearching, setIsSearching]         = useState(false);

  // 주소 상세 카드
  const [addrDetailVisible, setAddrDetailVisible] = useState(false);
  const [selectedAddr, setSelectedAddr]           = useState<AddressResult | null>(null);
  const [matchedRegion, setMatchedRegion]         = useState<Region | null>(null);

  // ── 로컬 지역 필터 ─────────────────────────────────────────────────────────
  const localResults = useMemo<Region[]>(() => {
    const q = query.trim();
    if (!q) return [];
    return ALL_REGIONS.filter(r =>
      r.name.includes(q) || r.shortName.includes(q) || r.province?.includes(q),
    ).slice(0, 5);
  }, [query]);

  // ── 통합 결과 ──────────────────────────────────────────────────────────────
  const allResults = useMemo<ResultItem[]>(() => [
    ...localResults.map(r => ({ kind: 'region' as const, data: r })),
    ...addrResults
      .filter(a => !localResults.some(r => r.shortName === a.city))
      .map(a  => ({ kind: 'address' as const, data: a })),
  ], [localResults, addrResults]);

  const showResults = searchFocused && query.trim().length > 0;

  // ── 검색 입력 핸들러 (디바운스 400ms) ─────────────────────────────────────
  const handleQueryChange = useCallback((text: string) => {
    setQuery(text);
    setAddrResults([]);

    if (timerRef.current) clearTimeout(timerRef.current);
    if (text.trim().length < 2) return;

    timerRef.current = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchAddress(text);
      setAddrResults(results);
      setIsSearching(false);
    }, 400);
  }, []);

  // ── 지역(Region) 선택 ──────────────────────────────────────────────────────
  const handleSelectRegion = useCallback((region: Region) => {
    Keyboard.dismiss();
    setQuery(region.name);
    setSearchFocused(false);
    setAddrResults([]);

    mapRef.current?.animateToRegion(
      { latitude: region.latitude, longitude: region.longitude, latitudeDelta: 0.6, longitudeDelta: 0.6 },
      600,
    );

    const isProvince = MOCK_REGIONS.some(r => r.id === region.id);
    if (isProvince) {
      setSelectedRegion(region);
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      router.push(`/region/${region.id}`);
    }
  }, [router, setSelectedRegion]);

  // ── 주소(Address) 선택 → 상세 카드 ───────────────────────────────────────
  const handleSelectAddress = useCallback((addr: AddressResult) => {
    Keyboard.dismiss();
    setQuery(addr.displayName);
    setSearchFocused(false);
    setAddrResults([]);

    // 지도 이동
    mapRef.current?.animateToRegion(
      { latitude: addr.latitude, longitude: addr.longitude, latitudeDelta: 0.05, longitudeDelta: 0.05 },
      700,
    );

    // 매칭 Region 찾기
    const matched = findRegionForAddress(addr);
    setSelectedAddr(addr);
    setMatchedRegion(matched);
    setAddrDetailVisible(true);
  }, []);

  // ── 검색 초기화 ────────────────────────────────────────────────────────────
  const clearSearch = useCallback(() => {
    setQuery('');
    setSearchFocused(false);
    setAddrResults([]);
    Keyboard.dismiss();
  }, []);

  // ── 마커 탭 ────────────────────────────────────────────────────────────────
  const handleMarkerPress = (region: Region) => {
    setSelectedRegion(region);
    bottomSheetRef.current?.snapToIndex(0);
  };

  return (
    <View style={styles.container}>
      {/* 지도 */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        onRegionChange={r => {
          setZoomLevel(Math.round(Math.log(360 / r.longitudeDelta) / Math.LN2));
        }}
        onPress={() => {
          if (searchFocused) { setSearchFocused(false); Keyboard.dismiss(); }
        }}
      >
        {MOCK_REGIONS.map(region => (
          <Marker
            key={region.id}
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            onPress={() => handleMarkerPress(region)}
            tracksViewChanges={false}
          >
            <SolarZoneMarker solarGrade={region.solarGrade} label={region.shortName} zoomLevel={zoomLevel} />
          </Marker>
        ))}
      </MapView>

      {/* 범례 — 좌하단 */}
      {!searchFocused && (
        <View style={[styles.legend, { bottom: insets.bottom + 90 }]}>
          <MapLegend />
        </View>
      )}

      {/* ── 검색 영역 ── */}
      <View style={[styles.searchContainer, { top: insets.top + 10 }]}>

        {/* 검색 바 */}
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="지역명 또는 지번 주소 검색"
            placeholderTextColor={Colors.textTertiary}
            value={query}
            onChangeText={handleQueryChange}
            onFocus={() => setSearchFocused(true)}
            returnKeyType="search"
            clearButtonMode="never"
          />
          {isSearching && <ActivityIndicator size="small" color={Colors.primary} />}
          {!isSearching && query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* 결과 드롭다운 */}
        {showResults && (
          <View style={styles.resultCard}>
            {allResults.length > 0 ? (
              <>
                {/* 섹션 구분선: 로컬 vs 주소 */}
                {localResults.length > 0 && addrResults.length > 0 && (
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionLabel}>지역</Text>
                  </View>
                )}
                <FlatList
                  data={allResults}
                  keyExtractor={(item, i) => item.kind === 'region' ? item.data.id : `a_${i}`}
                  keyboardShouldPersistTaps="handled"
                  scrollEnabled={false}
                  renderItem={({ item, index }) => {
                    // 주소 섹션 헤더 표시
                    const showAddrHeader =
                      localResults.length > 0 &&
                      item.kind === 'address' &&
                      index === localResults.length;

                    return (
                      <>
                        {showAddrHeader && (
                          <View style={styles.sectionHeader}>
                            <Text style={styles.sectionLabel}>주소</Text>
                          </View>
                        )}
                        <ResultRow
                          item={item}
                          onPress={() => {
                            if (item.kind === 'region')  handleSelectRegion(item.data);
                            else                         handleSelectAddress(item.data);
                          }}
                        />
                        <View style={styles.resultDivider} />
                      </>
                    );
                  }}
                />
              </>
            ) : !isSearching ? (
              <View style={styles.noResult}>
                <Text style={styles.noResultText}>'{query}' 검색 결과가 없습니다</Text>
                <Text style={styles.noResultSub}>시·도, 시·군·구 또는 지번 주소로 검색해보세요</Text>
              </View>
            ) : null}
          </View>
        )}
      </View>

      {/* 바텀시트 */}
      <RegionBottomSheet
        ref={bottomSheetRef}
        region={selectedRegion}
        onDetailPress={r => router.push(`/region/${r.id}`)}
        onGridPress={() => setShowGridModal(true)}
        onCityListPress={r => (router.push as (href: string) => void)(`/province/${r.id}`)}
      />

      {/* 계통망 모달 */}
      <GridCapacityModal
        visible={showGridModal}
        onClose={() => setShowGridModal(false)}
        region={selectedRegion}
      />

      {/* 주소 상세 카드 */}
      <AddressDetailCard
        visible={addrDetailVisible}
        address={selectedAddr}
        region={matchedRegion}
        noData={!matchedRegion}
        onClose={() => setAddrDetailVisible(false)}
        onDetailPress={region => {
          setAddrDetailVisible(false);
          router.push(`/region/${region.id}`);
        }}
      />
    </View>
  );
}

// ── 스타일 ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  legend:    { position: 'absolute', left: 16 },

  // ── 검색 ──
  searchContainer: {
    position: 'absolute', left: 16, right: 16, zIndex: 100,
  },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 11,
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 }, elevation: 6,
  },
  searchBarFocused: { borderWidth: 1.5, borderColor: Colors.primary },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, padding: 0 },

  // ── 드롭다운 ──
  resultCard: {
    marginTop: 6, backgroundColor: '#fff', borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000', shadowOpacity: 0.10, shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 }, elevation: 5,
    maxHeight: 420,
  },
  sectionHeader: {
    paddingHorizontal: 14, paddingTop: 10, paddingBottom: 4,
    backgroundColor: Colors.background,
  },
  sectionLabel: { fontSize: 11, fontWeight: '700', color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 },

  resultItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 11, gap: 10,
  },
  resultIconWrap: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center', alignItems: 'center',
  },
  resultTextWrap:  { flex: 1 },
  resultSub:       { fontSize: 11, color: Colors.textTertiary, marginBottom: 1 },
  resultName:      { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  resultBadge:     { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  resultBadgeText: { fontSize: 11, fontWeight: '700' },
  jibunBadge:      { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3, backgroundColor: '#FFF3E0' },
  jibunBadgeText:  { fontSize: 11, fontWeight: '700', color: '#E65100' },
  resultDivider:   { height: 1, backgroundColor: Colors.border, marginLeft: 52 },

  // ── 결과 없음 ──
  noResult:     { paddingVertical: 24, paddingHorizontal: 16, alignItems: 'center', gap: 4 },
  noResultText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  noResultSub:  { fontSize: 12, color: Colors.textTertiary },
});
