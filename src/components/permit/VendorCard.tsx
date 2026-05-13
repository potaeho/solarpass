import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import type { Vendor } from '../../types/vendor';

type Props = { vendor: Vendor; onRequestQuote?: (vendor: Vendor) => void };

const VendorCard = ({ vendor, onRequestQuote }: Props) => (
  <View style={[styles.card, vendor.isRecommended && styles.recommended]}>
    {vendor.isRecommended && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>추천</Text>
      </View>
    )}
    <View style={styles.row}>
      <Text style={styles.score}>★ {vendor.score ?? vendor.successRate}점</Text>
      <Text style={styles.name}>{vendor.name}</Text>
      <Text style={styles.rate}>성공률 {vendor.successRate}%</Text>
    </View>
    <Text style={styles.region}>{vendor.region} 전문 · {vendor.specialization.join(', ')}</Text>
    <View style={styles.actions}>
      <TouchableOpacity style={styles.btnOutline} onPress={() => onRequestQuote?.(vendor)}>
        <Text style={styles.btnOutlineText}>견적 요청</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.btnPrimary}
        onPress={() => Linking.openURL(`tel:${vendor.contactPhone}`)}
      >
        <Text style={styles.btnPrimaryText}>바로 연락 📞</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 8,
    padding: 14,
    marginVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  recommended: { borderColor: Colors.primary, borderWidth: 1.5 },
  badge: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  score: { fontSize: 13, fontWeight: '700', color: Colors.conditional },
  name: { flex: 1, fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
  rate: { fontSize: 13, color: Colors.textSecondary },
  region: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 8 },
  btnOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnOutlineText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
  btnPrimary: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});

export default VendorCard;
