import {
  Modal, Pressable, ScrollView, StyleSheet, Text,
  TouchableOpacity, View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';
import type { AddressResult } from '../../api/addressSearch';
import type { Region } from '../../types/region';

// ── 설정 맵 ───────────────────────────────────────────────────────────────────
const CHECK_CFG = {
  pass:    { icon: 'checkmark-circle' as const, color: Colors.available,   bg: Colors.availableBg,   label: '통과' },
  warning: { icon: 'alert-circle'     as const, color: Colors.conditional, bg: Colors.conditionalBg, label: '주의' },
  fail:    { icon: 'close-circle'     as const, color: Colors.unavailable, bg: Colors.unavailableBg, label: '불가' },
};

const STATUS_CFG = {
  available:   { label: '설치 가능',   color: Colors.available,   bg: Colors.availableBg },
  conditional: { label: '조건부 가능', color: Colors.conditional, bg: Colors.conditionalBg },
  unavailable: { label: '설치 불가',   color: Colors.unavailable, bg: Colors.unavailableBg },
};

// grid_capacity 전용 요약 텍스트
function gridSummary(check: Region['checks'][number]): string {
  const g = check.gridCapacity;
  if (!g) return check.description;
  const pct = Math.round((g.usedMW / g.totalMW) * 100);
  return `용량 ${pct}% 사용 중 · 여유 ${g.availableMW} MW · 대기 ${g.waitingQueue}건`;
}

// ── 컴포넌트 ──────────────────────────────────────────────────────────────────
interface Props {
  visible: boolean;
  address: AddressResult | null;
  region: Region | null;          // 매칭된 시·군 또는 도 region
  noData: boolean;                // 데이터베이스에 없는 지역
  onClose: () => void;
  onDetailPress: (region: Region) => void;
}

export default function AddressDetailCard({
  visible, address, region, noData, onClose, onDetailPress,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* 배경 딤 */}
      <Pressable style={styles.backdrop} onPress={onClose} />

      {/* 카드 */}
      <View style={[styles.card, { paddingBottom: insets.bottom + 16 }]}>
        {/* 드래그 핸들 */}
        <View style={styles.handle} />

        {/* 주소 헤더 */}
        <View style={styles.addrRow}>
          <View style={styles.addrIconWrap}>
            <Ionicons name="location" size={16} color={Colors.primary} />
          </View>
          <View style={styles.addrTextWrap}>
            <Text style={styles.addrFull} numberOfLines={2}>{address?.fullAddress ?? ''}</Text>
          </View>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* 데이터 없음 */}
        {noData && (
          <View style={styles.noDataWrap}>
            <Ionicons name="information-circle-outline" size={32} color={Colors.border} />
            <Text style={styles.noDataTitle}>분석 데이터 없음</Text>
            <Text style={styles.noDataSub}>
              현재 해당 지역({address?.province} {address?.city})은{'\n'}
              분석 데이터베이스에 포함되어 있지 않습니다.
            </Text>
          </View>
        )}

        {/* 분석 결과 */}
        {!noData && region && (() => {
          const st = STATUS_CFG[region.feasibilityStatus];
          return (
            <>
              {/* 지역 기준 + 종합 판정 */}
              <View style={styles.regionRow}>
                <View style={styles.regionBadge}>
                  <Ionicons name="map-outline" size={12} color={Colors.textTertiary} />
                  <Text style={styles.regionBadgeText}>{region.shortName} 기준 분석</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: st.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: st.color }]}>{st.label}</Text>
                </View>
              </View>

              {/* 체크 리스트 */}
              <ScrollView
                style={styles.checkScroll}
                showsVerticalScrollIndicator={false}
              >
                {region.checks.map((check, idx) => {
                  const cfg = CHECK_CFG[check.status];
                  return (
                    <View key={check.id} style={[
                      styles.checkRow,
                      idx < region.checks.length - 1 && styles.checkRowBorder,
                    ]}>
                      <View style={[styles.checkIconWrap, { backgroundColor: cfg.bg }]}>
                        <Ionicons name={cfg.icon} size={18} color={cfg.color} />
                      </View>
                      <View style={styles.checkTextWrap}>
                        <View style={styles.checkTitleRow}>
                          <Text style={styles.checkTitle}>{check.title}</Text>
                          <View style={[styles.checkBadge, { backgroundColor: cfg.bg }]}>
                            <Text style={[styles.checkBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
                          </View>
                        </View>
                        <Text style={styles.checkDesc}>
                          {check.id === 'grid_capacity' ? gridSummary(check) : check.description}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>

              {/* 상세 보기 버튼 */}
              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => onDetailPress(region)}
                activeOpacity={0.85}
              >
                <Text style={styles.detailBtnText}>상세 인허가 정보 보기</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </>
          );
        })()}
      </View>
    </Modal>
  );
}

// ── 스타일 ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  handle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center', marginBottom: 16,
  },

  // ── 주소 헤더 ──
  addrRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 14 },
  addrIconWrap: {
    width: 30, height: 30, borderRadius: 8,
    backgroundColor: Colors.availableBg,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 2,
  },
  addrTextWrap: { flex: 1 },
  addrFull: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary, lineHeight: 20 },

  // ── 지역 + 종합 판정 ──
  regionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  regionBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.background, borderRadius: 6,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  regionBadgeText: { fontSize: 12, color: Colors.textSecondary },
  statusBadge:     { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  statusBadgeText: { fontSize: 13, fontWeight: '700' },

  // ── 체크 리스트 ──
  checkScroll:     { maxHeight: 280, marginBottom: 16 },
  checkRow:        { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 12, gap: 12 },
  checkRowBorder:  { borderBottomWidth: 1, borderBottomColor: Colors.border },
  checkIconWrap: {
    width: 34, height: 34, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    marginTop: 1,
  },
  checkTextWrap:   { flex: 1 },
  checkTitleRow:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 },
  checkTitle:      { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  checkBadge:      { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  checkBadgeText:  { fontSize: 11, fontWeight: '700' },
  checkDesc:       { fontSize: 12, color: Colors.textSecondary, lineHeight: 17 },

  // ── 상세 보기 버튼 ──
  detailBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: Colors.primary, borderRadius: 12,
    paddingVertical: 14,
  },
  detailBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // ── 데이터 없음 ──
  noDataWrap:  { alignItems: 'center', paddingVertical: 32, gap: 8 },
  noDataTitle: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
  noDataSub:   { fontSize: 13, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
