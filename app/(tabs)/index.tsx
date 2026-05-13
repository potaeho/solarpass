import { useRef, useState, useMemo, useCallback } from 'react';
import {
  FlatList, Keyboard, SafeAreaView, StyleSheet,
  Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type BottomSheet from '@gorhom/bottom-sheet';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMapStore } from '../../src/stores/useMapStore';
import RegionBottomSheet from '../../src/components/map/RegionBottomSheet';
import MapLegend from '../../src/components/map/MapLegend';
import SolarZoneMarker from '../../src/components/map/SolarZoneMarker';
import GridCapacityModal from '../../src/components/map/GridCapacityModal';
import { MOCK_REGIONS } from '../../src/constants/regions';
import { CITIES_BY_PROVINCE } from '../../src/constants/cities';
import { Colors } from '../../src/constants/colors';
import type { Region } from '../../src/types/region';

// ── 검색 대상: 도 + 모든 시·군·구 ────────────────────────────────────────────
const ALL_REGIONS: Region[] = [
  ...MOCK_REGIONS,
  ...Object.values(CITIES_BY_PROVINCE).flat(),
];

const INITIAL_REGION = {
  latitude: 36.5,
  longitude: 127.8,
  latitudeDelta: 4.5,
  longitudeDelta: 4.5,
};

// ── 검색 결과 아이템 ──────────────────────────────────────────────────────────
function SearchResultItem({
  region,
  onPress,
}: {
  region: Region;
  onPress: () => void;
}) {
  const badgeColor =
    region.feasibilityStatus === 'available'
      ? Colors.available
      : region.feasibilityStatus === 'conditional'
      ? Colors.conditional
      : Colors.unavailable;
  const badgeBg =
    region.feasibilityStatus === 'available'
      ? Colors.availableBg
      : region.feasibilityStatus === 'conditional'
      ? Colors.conditionalBg
      : Colors.unavailableBg;
  const badgeLabel =
    region.feasibilityStatus === 'available'
      ? '설치 가능'
      : region.feasibilityStatus === 'conditional'
      ? '조건부 가능'
      : '설치 불가';

  // 도 단위면 province 표기 없이, 시·군이면 "전라남도 >" 표기
  const isProvince = MOCK_REGIONS.some(r => r.id === region.id);

  return (
    <TouchableOpacity style={styles.resultItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.resultIconWrap}>
        <Ionicons
          name={isProvince ? 'map-outline' : 'location-outline'}
          size={16}
          color={Colors.textTertiary}
        />
      </View>
      <View style={styles.resultTextWrap}>
        {!isProvince && (
          <Text style={styles.resultProvince}>{region.province}</Text>
        )}
        <Text style={styles.resultName}>{isProvince ? region.name : region.shortName}</Text>
      </View>
      <View style={[styles.resultBadge, { backgroundColor: badgeBg }]}>
        <Text style={[styles.resultBadgeText, { color: badgeColor }]}>{badgeLabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────────────────
export default function MapHome() {
  const router          = useRouter();
  const mapRef          = useRef<MapView>(null);
  const bottomSheetRef  = useRef<BottomSheet>(null);
  const inputRef        = useRef<TextInput>(null);
  const { selectedRegion, setSelectedRegion } = useMapStore();
  const [zoomLevel, setZoomLevel]   = useState(7);
  const [showGridModal, setShowGridModal] = useState(false);
  const [query, setQuery]           = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  // ── 검색 필터 ──────────────────────────────────────────────────────────────
  const results = useMemo(() => {
    const q = query.trim();
    if (!q) return [];
    const lower = q.toLowerCase();
    return ALL_REGIONS.filter(r =>
      r.name.includes(q) ||
      r.shortName.includes(q) ||
      r.province?.includes(q) ||
      r.name.toLowerCase().includes(lower),
    ).slice(0, 12); // 최대 12개
  }, [query]);

  const showResults = searchFocused && query.trim().length > 0 && results.length > 0;

  // ── 검색 결과 선택 ─────────────────────────────────────────────────────────
  const handleSelectResult = useCallback((region: Region) => {
    Keyboard.dismiss();
    setQuery(region.name);
    setSearchFocused(false);

    // 지도 이동
    mapRef.current?.animateToRegion(
      {
        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      },
      600,
    );

    // 도 단위 → province 화면, 시·군 → region 상세
    const isProvince = MOCK_REGIONS.some(r => r.id === region.id);
    if (isProvince) {
      setSelectedRegion(region);
      bottomSheetRef.current?.snapToIndex(0);
    } else {
      router.push(`/region/${region.id}`);
    }
  }, [router, setSelectedRegion]);

  // ── 검색 초기화 ────────────────────────────────────────────────────────────
  const clearSearch = useCallback(() => {
    setQuery('');
    setSearchFocused(false);
    Keyboard.dismiss();
  }, []);

  // ── 마커 탭 ───────────────────────────────────────────────────────────────
  const handleMarkerPress = (region: Region) => {
    setSelectedRegion(region);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const handleDetailPress = (region: Region) => {
    router.push(`/region/${region.id}`);
  };

  const handleCityListPress = (region: Region) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (router.push as any)(`/province/${region.id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 지도 */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        initialRegion={INITIAL_REGION}
        showsUserLocation
        onRegionChange={region => {
          const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2);
          setZoomLevel(zoom);
        }}
        onPress={() => {
          if (searchFocused) {
            setSearchFocused(false);
            Keyboard.dismiss();
          }
        }}
      >
        {MOCK_REGIONS.map(region => (
          <Marker
            key={region.id}
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            onPress={() => handleMarkerPress(region)}
            tracksViewChanges={false}
          >
            <SolarZoneMarker
              solarGrade={region.solarGrade}
              label={region.shortName}
              zoomLevel={zoomLevel}
            />
          </Marker>
        ))}
      </MapView>

      {/* 범례 */}
      {!searchFocused && (
        <View style={styles.legend}>
          <MapLegend />
        </View>
      )}

      {/* ── 검색 바 ── */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, searchFocused && styles.searchBarFocused]}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} style={styles.searchIcon} />
          <TextInput
            ref={inputRef}
            style={styles.searchInput}
            placeholder="지역명 또는 주소 검색"
            placeholderTextColor={Colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            onFocus={() => setSearchFocused(true)}
            returnKeyType="search"
            clearButtonMode="never"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>

        {/* 검색 결과 드롭다운 */}
        {showResults && (
          <View style={styles.resultCard}>
            <FlatList
              data={results}
              keyExtractor={item => item.id}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <SearchResultItem region={item} onPress={() => handleSelectResult(item)} />
              )}
              ItemSeparatorComponent={() => <View style={styles.resultDivider} />}
            />
          </View>
        )}

        {/* 결과 없음 */}
        {searchFocused && query.trim().length > 0 && results.length === 0 && (
          <View style={styles.resultCard}>
            <View style={styles.noResult}>
              <Text style={styles.noResultText}>'{query}'에 대한 검색 결과가 없습니다</Text>
              <Text style={styles.noResultSub}>시·도, 시·군·구 단위로 검색해보세요</Text>
            </View>
          </View>
        )}
      </View>

      {/* 바텀시트 & 모달 */}
      <RegionBottomSheet
        ref={bottomSheetRef}
        region={selectedRegion}
        onDetailPress={handleDetailPress}
        onGridPress={() => setShowGridModal(true)}
        onCityListPress={handleCityListPress}
      />
      <GridCapacityModal
        visible={showGridModal}
        onClose={() => setShowGridModal(false)}
        region={selectedRegion}
      />
    </SafeAreaView>
  );
}

// ── 스타일 ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  legend:    { position: 'absolute', bottom: 120, right: 16 },

  // ── 검색 ──
  searchContainer: {
    position: 'absolute',
    top: 12,
    left: 16,
    right: 16,
    zIndex: 100,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  searchBarFocused: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  searchIcon:  { marginRight: 2 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, padding: 0 },

  // ── 드롭다운 ──
  resultCard: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    maxHeight: 380,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },
  resultIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTextWrap:  { flex: 1 },
  resultProvince:  { fontSize: 11, color: Colors.textTertiary, marginBottom: 1 },
  resultName:      { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  resultBadge:     { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  resultBadgeText: { fontSize: 11, fontWeight: '700' },
  resultDivider:   { height: 1, backgroundColor: Colors.border, marginLeft: 54 },

  // ── 결과 없음 ──
  noResult:    { paddingVertical: 24, paddingHorizontal: 16, alignItems: 'center', gap: 4 },
  noResultText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '600' },
  noResultSub:  { fontSize: 12, color: Colors.textTertiary },
});
