import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../src/constants/colors';
import { useAuthStore } from '../../src/stores/useAuthStore';

// ── 로그인 전 화면 ─────────────────────────────────────────────────────────────
function GuestView() {
  const router = useRouter();
  return (
    <View style={styles.guestWrap}>
      <View style={styles.guestIconWrap}>
        <Ionicons name="person-outline" size={48} color={Colors.textTertiary} />
      </View>
      <Text style={styles.guestTitle}>로그인이 필요합니다</Text>
      <Text style={styles.guestSub}>로그인하면 인허가 진행 현황과{'\n'}저장된 지역을 확인할 수 있어요.</Text>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => router.push('/login')}
        activeOpacity={0.85}
      >
        <Text style={styles.loginBtnText}>로그인</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => router.push('/register')}
        activeOpacity={0.85}
      >
        <Text style={styles.registerBtnText}>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── 메뉴 행 ───────────────────────────────────────────────────────────────────
function MenuItem({
  icon, label, value, onPress, danger = false,
}: {
  icon: string; label: string; value?: string;
  onPress?: () => void; danger?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      <View style={[styles.menuIconWrap, danger && styles.menuIconDanger]}>
        <Ionicons name={icon as never} size={18} color={danger ? Colors.unavailable : Colors.primary} />
      </View>
      <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>{label}</Text>
      {value && <Text style={styles.menuValue}>{value}</Text>}
      {onPress && !danger && (
        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
      )}
    </TouchableOpacity>
  );
}

// ── 로그인 후 화면 ─────────────────────────────────────────────────────────────
function LoggedInView() {
  const router  = useRouter();
  const user    = useAuthStore(s => s.user)!;
  const logout  = useAuthStore(s => s.logout);

  const initial = user.name.charAt(0).toUpperCase();
  const joinDate = new Date(user.createdAt).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileEmail}>{user.email}</Text>
          {user.company && (
            <Text style={styles.profileCompany}>{user.company}</Text>
          )}
        </View>
      </View>

      {/* 내 활동 요약 */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>진행 중 인허가</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>저장 지역</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>완료 인허가</Text>
        </View>
      </View>

      {/* 계정 정보 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>계정 정보</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="person-outline"  label="이름"     value={user.name} />
          <View style={styles.menuDivider} />
          <MenuItem icon="mail-outline"    label="이메일"   value={user.email} />
          <View style={styles.menuDivider} />
          <MenuItem icon="call-outline"    label="전화번호" value={user.phone ?? '미등록'} />
          <View style={styles.menuDivider} />
          <MenuItem icon="business-outline" label="소속"    value={user.company ?? '미등록'} />
          <View style={styles.menuDivider} />
          <MenuItem icon="calendar-outline" label="가입일"  value={joinDate} />
        </View>
      </View>

      {/* 앱 설정 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>설정</Text>
        <View style={styles.menuCard}>
          <MenuItem
            icon="notifications-outline"
            label="알림 설정"
            onPress={() => Alert.alert('준비 중', '곧 출시될 예정입니다.')}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="lock-closed-outline"
            label="비밀번호 변경"
            onPress={() => Alert.alert('준비 중', '곧 출시될 예정입니다.')}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="document-text-outline"
            label="이용약관"
            onPress={() => Alert.alert('준비 중', '곧 출시될 예정입니다.')}
          />
          <View style={styles.menuDivider} />
          <MenuItem
            icon="shield-checkmark-outline"
            label="개인정보처리방침"
            onPress={() => Alert.alert('준비 중', '곧 출시될 예정입니다.')}
          />
        </View>
      </View>

      {/* 로그아웃 */}
      <View style={styles.section}>
        <View style={styles.menuCard}>
          <MenuItem
            icon="log-out-outline"
            label="로그아웃"
            onPress={handleLogout}
            danger
          />
        </View>
      </View>

      <Text style={styles.versionText}>SolarPass v1.0.0</Text>
    </ScrollView>
  );
}

// ── 메인 ──────────────────────────────────────────────────────────────────────
export default function MyTab() {
  const isLoggedIn = useAuthStore(s => s.isLoggedIn);

  return (
    <SafeAreaView style={styles.safe}>
      {isLoggedIn ? <LoggedInView /> : <GuestView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.background },
  container: { flex: 1 },
  content:   { paddingBottom: 40 },

  // ── Guest ──
  guestWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  guestIconWrap: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: Colors.border,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
  },
  guestTitle:    { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, marginBottom: 10 },
  guestSub:      { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  loginBtn:      { width: '100%', backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginBottom: 10 },
  loginBtnText:  { color: '#fff', fontSize: 16, fontWeight: '700' },
  registerBtn:   { width: '100%', borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 10, paddingVertical: 14, alignItems: 'center' },
  registerBtnText: { color: Colors.primary, fontSize: 16, fontWeight: '700' },

  // ── Profile ──
  profileCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 16, marginTop: 16, marginBottom: 0,
    borderRadius: 16, padding: 20,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
  },
  avatar:      { width: 56, height: 56, borderRadius: 28, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText:  { color: '#fff', fontSize: 22, fontWeight: '800' },
  profileInfo: { flex: 1 },
  profileName:    { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },
  profileEmail:   { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  profileCompany: { fontSize: 12, color: Colors.textTertiary, marginTop: 2 },

  // ── Stats ──
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 16, paddingVertical: 16,
    elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  statItem:    { flex: 1, alignItems: 'center' },
  statValue:   { fontSize: 22, fontWeight: '800', color: Colors.textPrimary },
  statLabel:   { fontSize: 11, color: Colors.textSecondary, marginTop: 3 },
  statDivider: { width: 1, backgroundColor: Colors.border },

  // ── Menu ──
  section:      { marginTop: 20, marginHorizontal: 16 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10, marginLeft: 4 },
  menuCard:     { backgroundColor: Colors.surface, borderRadius: 16, overflow: 'hidden', elevation: 1, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 1 } },
  menuItem:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, gap: 12 },
  menuIconWrap: { width: 32, height: 32, borderRadius: 8, backgroundColor: Colors.availableBg, justifyContent: 'center', alignItems: 'center' },
  menuIconDanger: { backgroundColor: Colors.unavailableBg },
  menuLabel:    { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.textPrimary },
  menuLabelDanger: { color: Colors.unavailable },
  menuValue:    { fontSize: 13, color: Colors.textSecondary },
  menuDivider:  { height: 1, backgroundColor: Colors.border, marginLeft: 60 },

  versionText:  { textAlign: 'center', fontSize: 12, color: Colors.textTertiary, marginTop: 28 },
});
