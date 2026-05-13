import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/colors';
import type { CivilOffice } from '../../types/vendor';

type Props = { office: CivilOffice; onMapPress?: (office: CivilOffice) => void };

const OfficeConnectCard = ({ office, onMapPress }: Props) => (
  <View style={styles.card}>
    <Text style={styles.name}>📌 {office.name}</Text>
    <Text style={styles.address}>{office.address}</Text>
    {office.permitExperienceCount !== undefined && (
      <Text style={styles.experience}>지자체 인허가 경험 {office.permitExperienceCount}건</Text>
    )}
    <View style={styles.actions}>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => Linking.openURL(`tel:${office.phone}`)}
      >
        <Text style={styles.btnText}>전화 연결 📞</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={() => onMapPress?.(office)}>
        <Text style={styles.btnText}>지도 보기</Text>
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
  name: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary, marginBottom: 4 },
  address: { fontSize: 13, color: Colors.textSecondary, marginBottom: 2 },
  experience: { fontSize: 13, color: Colors.textSecondary, marginBottom: 10 },
  actions: { flexDirection: 'row', gap: 8 },
  btn: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 6,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnText: { color: Colors.primary, fontWeight: '600', fontSize: 14 },
});

export default OfficeConnectCard;
