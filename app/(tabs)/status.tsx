import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../src/constants/colors';

export default function StatusTab() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>인허가 진행현황</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>아직 완료된 프로젝트가 없습니다.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  heading: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 16 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { fontSize: 14, color: Colors.textSecondary },
});
