import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/colors';

type GridCapacityData = {
  totalMW: number;
  usedMW: number;
  availableMW: number;
  waitingQueue: number;
};

type Props = { data: GridCapacityData };

const GridCapacityBar = ({ data }: Props) => {
  const usageRate = Math.round((data.usedMW / data.totalMW) * 100);
  const barColor =
    usageRate >= 90 ? Colors.unavailable : usageRate >= 70 ? Colors.conditional : Colors.available;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        계통 용량 사용률 {usageRate}% · 여유 {data.availableMW}MW
      </Text>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${usageRate}%` as never, backgroundColor: barColor }]} />
      </View>
      {data.waitingQueue > 0 && (
        <Text style={styles.queue}>접속 대기 {data.waitingQueue}건</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginTop: 6 },
  label: { fontSize: 12, color: '#666666', marginBottom: 4 },
  barTrack: { height: 8, borderRadius: 4, backgroundColor: '#E5E5E5', overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 4 },
  queue: { fontSize: 12, color: '#DC3232', marginTop: 4 },
});

export default GridCapacityBar;
