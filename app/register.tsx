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
  name:            z.string().min(2, '이름은 2자 이상 입력해주세요'),
  email:           z.string().min(1, '이메일을 입력해주세요').email('올바른 이메일 형식이 아닙니다'),
  password:        z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
  passwordConfirm: z.string().min(1, '비밀번호를 다시 입력해주세요'),
  phone:           z.string().optional(),
  company:         z.string().optional(),
}).refine(d => d.password === d.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path:    ['passwordConfirm'],
});
type FormData = z.infer<typeof schema>;

function Field({
  label, error, required = false, children,
}: {
  label: string; error?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      {children}
      {error ? <Text style={styles.errorMsg}>{error}</Text> : null}
    </View>
  );
}

export default function RegisterScreen() {
  const router   = useRouter();
  const register = useAuthStore(s => s.register);
  const [showPw,   setShowPw]   = useState(false);
  const [showPw2,  setShowPw2]  = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', password: '', passwordConfirm: '', phone: '', company: '' },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    setServerError('');
    const result = await register({
      name:     data.name,
      email:    data.email,
      password: data.password,
      phone:    data.phone || undefined,
      company:  data.company || undefined,
    });
    setSubmitting(false);
    if (result.success) {
      router.replace('/(tabs)/my');
    } else {
      setServerError(result.error ?? '회원가입에 실패했습니다.');
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
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>회원가입</Text>
            <View style={{ width: 32 }} />
          </View>

          <Text style={styles.subtitle}>
            SolarPass에 오신 것을 환영합니다.{'\n'}계정 정보를 입력해주세요.
          </Text>

          {/* 폼 카드 */}
          <View style={styles.form}>
            <Text style={styles.sectionLabel}>기본 정보</Text>

            <Field label="이름" required error={errors.name?.message}>
              <Controller
                control={control} name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="홍길동"
                    placeholderTextColor={Colors.textTertiary}
                    value={value} onChangeText={onChange} onBlur={onBlur}
                  />
                )}
              />
            </Field>

            <Field label="이메일" required error={errors.email?.message}>
              <Controller
                control={control} name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.email && styles.inputError]}
                    placeholder="example@email.com"
                    placeholderTextColor={Colors.textTertiary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    value={value} onChangeText={onChange} onBlur={onBlur}
                  />
                )}
              />
            </Field>

            <Field label="비밀번호" required error={errors.password?.message}>
              <Controller
                control={control} name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputWrap, errors.password && styles.inputError]}>
                    <TextInput
                      style={styles.inputInner}
                      placeholder="8자 이상"
                      placeholderTextColor={Colors.textTertiary}
                      secureTextEntry={!showPw}
                      autoCapitalize="none"
                      value={value} onChangeText={onChange} onBlur={onBlur}
                    />
                    <Pressable onPress={() => setShowPw(v => !v)} style={styles.eyeBtn}>
                      <Ionicons name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textTertiary} />
                    </Pressable>
                  </View>
                )}
              />
            </Field>

            <Field label="비밀번호 확인" required error={errors.passwordConfirm?.message}>
              <Controller
                control={control} name="passwordConfirm"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View style={[styles.inputWrap, errors.passwordConfirm && styles.inputError]}>
                    <TextInput
                      style={styles.inputInner}
                      placeholder="비밀번호 재입력"
                      placeholderTextColor={Colors.textTertiary}
                      secureTextEntry={!showPw2}
                      autoCapitalize="none"
                      value={value} onChangeText={onChange} onBlur={onBlur}
                    />
                    <Pressable onPress={() => setShowPw2(v => !v)} style={styles.eyeBtn}>
                      <Ionicons name={showPw2 ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textTertiary} />
                    </Pressable>
                  </View>
                )}
              />
            </Field>

            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>추가 정보 (선택)</Text>

            <Field label="전화번호" error={errors.phone?.message}>
              <Controller
                control={control} name="phone"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="010-0000-0000"
                    placeholderTextColor={Colors.textTertiary}
                    keyboardType="phone-pad"
                    value={value} onChangeText={onChange} onBlur={onBlur}
                  />
                )}
              />
            </Field>

            <Field label="소속 회사 / 기관">
              <Controller
                control={control} name="company"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="(주)솔라파크"
                    placeholderTextColor={Colors.textTertiary}
                    value={value} onChangeText={onChange} onBlur={onBlur}
                  />
                )}
              />
            </Field>

            {serverError ? (
              <View style={styles.serverError}>
                <Ionicons name="alert-circle" size={14} color={Colors.unavailable} />
                <Text style={styles.serverErrorText}>{serverError}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.btnPrimary, submitting && styles.btnDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={submitting}
              activeOpacity={0.8}
            >
              {submitting
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.btnPrimaryText}>가입하기</Text>
              }
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>이미 계정이 있으신가요?</Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.footerLink}>로그인</Text>
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

  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, marginBottom: 20 },
  backBtn:     { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },

  subtitle: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 24 },

  form:          { backgroundColor: Colors.surface, borderRadius: 16, padding: 24, elevation: 1, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } },
  sectionLabel:  { fontSize: 12, fontWeight: '700', color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 },
  divider:       { height: 1, backgroundColor: Colors.border, marginVertical: 20 },

  fieldGroup: { marginBottom: 14 },
  label:      { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 6 },
  required:   { color: Colors.unavailable },
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

  btnPrimary:     { backgroundColor: Colors.primary, borderRadius: 10, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  btnDisabled:    { opacity: 0.6 },
  btnPrimaryText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  footer:     { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 28 },
  footerText: { fontSize: 14, color: Colors.textSecondary },
  footerLink: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});
