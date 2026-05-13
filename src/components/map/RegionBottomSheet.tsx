import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import type { FeasibilityCheck, Region } from '../../types/region';
import FeasibilityBadge from '../region/FeasibilityBadge';

type Props = {
  region: Region | null;
  onDetailPress: (region: Region) => void;
  onGridPress: () => void;
  onCityListPress: (region: Region) => void;
};

const SNAP_POINTS = ['28%', '65%'];

const CHECK_IDS: { id: FeasibilityCheck['id']; label: string }[] = [
  { id: 'grid_capacity',    label: '계통망' },
  { id: 'setback_distance', label: '이격거리' },
  { id: 'national_law',     label: '공통법규' },
  { id: 'local_ordinance',  label: '지자체조례' },
];

const STATUS_ICON: Record<string, { name: string; color: string }> = {
  pass:    { name: 'checkmark-circle', color: '#19A050' },
  warning: { name: 'alert-circle',     color: '#FAB400' },
  fail:    { name: 'close-circle',     color: '#DC3232' },
};

const RegionBottomSheet = forwardRef<BottomSheet, Props>(({ region, onDetailPress, onGridPress, onCityListPress }, ref) => (
  <BottomSheet
    ref={ref}
    index={-1}
    snapPoints={SNAP_POINTS}
    enablePanDownToClose
    handleIndicatorStyle={styles.handle}
    backgroundStyle={styles.background}
  >
    <BottomSheetScrollView contentContainerStyle={styles.content}>
      {region && (
        <>
          <View style={styles.headerRow}>
            <Text style={styles.regionName}>{region.name}</Text>
            <FeasibilityBadge status={region.feasibilityStatus} />
          </View>

          <View style={styles.checkGrid}>
            {CHECK_IDS.map(({ id, label }) => {
              const check = region.checks.find(c => c.id === id);
              const status = check?.status ?? 'warning';
              const icon = STATUS_ICON[status];
              const isGrid = id === 'grid_capacity';
              return (
                <TouchableOpacity
                  key={id}
                  style={[styles.checkItem, isGrid && styles.checkItemActive]}
                  onPress={isGrid ? onGridPress : undefined}
                  activeOpacity={isGrid ? 0.7 : 1}
                >
                  <Ionicons name={icon.name as never} size={22} color={icon.color} />
                  <Text style={styles.checkLabel}>{label}</Text>
                  {isGrid && <Text style={styles.checkTap}>지도 보기</Text>}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, styles.btnOutline]}
              onPress={() => onCityListPress(region)}
            >
              <Ionicons name="location-outline" size={15} color={Colors.primary} />
              <Text style={styles.btnOutlineText}>시·군 선택</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btn, styles.btnFill]} onPress={() => onDetailPress(region)}>
              <Text style={styles.btnFillText}>도 전체 분석 →</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </BottomSheetScrollView>
  </BottomSheet>
));

RegionBottomSheet.displayName = 'RegionBottomSheet';

const styles = StyleSheet.create({
  handle: { backgroundColor: Colors.border },
  background: { backgroundColor: Colors.surface },
  content: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 24 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  regionName: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  checkGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  checkItem: { flex: 1, alignItems: 'center', gap: 4 },
  checkItemActive: { backgroundColor: '#EEF2FF', borderRadius: 8, paddingVertical: 6 },
  checkLabel: { fontSize: 11, color: Colors.textSecondary, textAlign: 'center' },
  checkTap: { fontSize: 10, color: '#4F6EF7', fontWeight: '600' },
  btnRow: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, borderRadius: 8, paddingVertical: 13, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 4 },
  btnOutline: { borderWidth: 1.5, borderColor: Colors.primary, backgroundColor: Colors.surface },
  btnOutlineText: { color: Colors.primary, fontWeight: '700', fontSize: 14 },
  btnFill: { backgroundColor: Colors.primary },
  btnFillText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});

export default RegionBottomSheet;
