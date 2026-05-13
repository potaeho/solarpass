import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../src/constants/colors';

export default function PermitTab() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>진행 중인 인허가가 없습니다.</Text>
          <Text style={styles.emptySubText}>지도에서 지역을 선택해 시작하세요.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100 },
  emptyText: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
  emptySubText: { fontSize: 14, color: Colors.textSecondary, marginTop: 8 },
});
