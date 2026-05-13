import { useState } from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform,
  Pressable, SafeAreaView, ScrollView, StyleSheet, Text,
  TextInput, TouchableOpacity, View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../src/constants/colors';
import { useAuthStore } from '../src/stores/useAuthStore';

const schema = z.object({
  email:    z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});
type FormData = z.infer<typeof schema>;

export default function LoginScreen() {
  const router = useRouter();
  const login  = useAuthStore(s => s.login);
  const [showPw, setShowPw]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setServerError('');
    const result = await login(data.email, data.password);
    setSubmitting(false);
    if (result.success) {
      router.replace('/(tabs)/my');
    } else {
      setServerError(result.error ?? '로그인에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* 뒤로가기 */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          {/* 로고 영역 */}
          <View style={styles.logoArea}>
            <View style={styles.logoIcon}>
              <Ionicons name="sunny" size={32} color="#fff" />
            </View>
            <Text style={styles.logoTitle}>SolarPass</Text>
            <Text style={styles.logoSub}>태양광 인허가 플랫폼</Text>
          </View>

          {/* 폼 */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>로그인</Text>

            {/* 이메일 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>이메일</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="example@email.com"
                    placeholderTextColor={Colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                  />
                )}
              />
              {errors.email && (
                <Text style={styles.errorMsg}>{errors.email.message}</Text>
              )}
            </View>

            {/* 비밀번호 */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>비밀번호</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputWrap, errors.password && styles.inputError]}>
                    <TextInput
                      style={styles.inputInner}
                      placeholder="비밀번호 입력"
                      placeholderTextColor={Colors.textTertiary}
                      secureTextEntry={!showPw}
                      autoCapitalize="none"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                    />
                    <Pressable onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
                      <Ionicons
                        name={showPw ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={Colors.textTertiary}
                      />
                    </Pressable>
                  </View>
                )}
              />
              {errors.password && (
                <Text style={styles.errorMsg}>{errors.password.message}</Text>
              )}
            </View>

            {/* 서버 에러 */}
            {serverError ? (
              <View style={styles.serverError}>
                <Ionicons name="alert-circle" size={14} color={Colors.unavailable} />
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            ) : null}

            {/* 로그인 버튼 */}
            <TouchableOpacity
              style={[styles.btnPrimary, submitting && styles.btnDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnPrimaryText}>로그인</Text>
              }
            </TouchableOpacity>

            {/* 구분선 */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>또는</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* 소셜 로그인 (UI only) */}
            <TouchableOpacity style={styles.btnSocial} activeOpacity={0.8}>
              <Ionicons name="logo-google" size={18} color="#4285F4" />
              <Text style={styles.btnSocialText}>Google로 계속하기</Text>
            </TouchableOpacity>
          </View>

          {/* 회원가입 링크 */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>아직 계정이 없으신가요?</Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text style={styles.footerLink}>회원가입</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.background },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },

  backBtn: { marginTop: 8, alignSelf: 'flex-start', padding: 4 },

  logoArea: { alignItems: 'center', marginTop: 24, marginBottom: 36 },
  logoIcon: {
    width: 64, height: 64, borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  logoTitle: { fontSize: 24, fontWeight: '800', color: Colors.textPrimary },
  logoSub:   { fontSize: 13, color: Colors.textSecondary, marginTop: 4 },

  form:      { backgroundColor: Colors.surface, borderRadius: 16, padding: 24, elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  formTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: 20 },

  fieldGroup: { marginBottom: 16 },
  label:      { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, color: Colors.textPrimary, backgroundColor: Colors.background,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border, borderRadius: 10,
    backgroundColor: Colors.background,
  },
  inputInner: { flex: 1, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: Colors.textPrimary },
  inputError: { borderColor: Colors.unavailable },
  eyeBtn:     { paddingHorizontal: 12 },
  errorMsg:   { fontSize: 12, color: Colors.unavailable, marginTop: 4 },

  serverError: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: Colors.unavailableBg, borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: 10, marginBottom: 14,
  },
  serverErrorText: { fontSize: 13, color: Colors.unavailable, flex: 1 },

  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: 10,
    paddingVertical: 15, alignItems: 'center', marginTop: 4,
  },
  btnDisabled:     { opacity: 0.6 },
  btnPrimaryText:  { color: '#fff', fontSize: 16, fontWeight: '700' },

  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 10 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 12, color: Colors.textTertiary },

  btnSocial: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1.5, borderColor: Colors.border, borderRadius: 10,
    paddingVertical: 13, backgroundColor: Colors.surface,
  },
  btnSocialText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },

  footer:     { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 28 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});
