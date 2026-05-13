import { StyleSheet, Text, View } from 'react-native';
import type { SolarGrade } from '../../types/region';

// 발전 잠재력 기반 색상 — 설치 가능 여부와 무관
const GRADE_COLOR: Record<SolarGrade, string> = {
  excellent: '#1565C0',
  good:      '#43A047',
  fair:      '#8BC34A',
  average:   '#FDD835',
  low:       '#B0BEC5',
};

type Props = {
  solarGrade: SolarGrade;
  label: string;
  zoomLevel: number;
};

const SolarZoneMarker = ({ solarGrade, label, zoomLevel }: Props) => {
  const size = zoomLevel < 8 ? 14 : zoomLevel < 11 ? 22 : 32;
  const color = GRADE_COLOR[solarGrade];
  const showLabel = zoomLevel >= 7;

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: color },
        ]}
      />
      {showLabel && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { alignItems: 'center' },
  circle: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.6)' },
  label: {
    fontSize: 10,
    color: '#1A1A1A',
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 3,
    borderRadius: 3,
    marginTop: 2,
  },
});

export default SolarZoneMarker;
