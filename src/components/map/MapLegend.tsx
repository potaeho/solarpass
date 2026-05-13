import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

const LEGEND = [
  { color: '#1565C0', label: '최우수' },
  { color: '#43A047', label: '우수' },
  { color: '#8BC34A', label: '양호' },
  { color: '#FDD835', label: '보통' },
  { color: '#B0BEC5', label: '낮음' },
];

const MapLegend = () => (
  <View style={styles.container}>
    {LEGEND.map(item => (
      <View key={item.label} style={styles.item}>
        <View style={[styles.dot, { backgroundColor: item.color }]} />
        <Text style={styles.label}>{item.label}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  item: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { fontSize: 11, color: Colors.textPrimary },
});

export default MapLegend;
