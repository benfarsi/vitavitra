import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import Logo from '../../components/Logo';
import { Colors, Spacing, BorderRadius, Border } from '../../constants/theme';

export default function Login() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    const { error: authError } = await signIn(email, password);
    setLoading(false);
    if (authError) {
      if (authError.message?.toLowerCase().includes('confirm')) {
        setError('Please confirm your email address before signing in. Check your inbox.');
      } else if (authError.message?.toLowerCase().includes('invalid')) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(authError.message || 'Sign in failed. Please try again.');
      }
    } else {
      router.replace('/tabs/home');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <ChevronLeft size={20} color={Colors.navy} strokeWidth={2} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>
          </View>

          {/* Brand */}
          <View style={styles.brand}>
            <Logo size="md" variant="dark" />
            <View style={styles.brandText}>
              <Text style={styles.title}>Welcome back</Text>
              <Text style={styles.subtitle}>Sign in to your Vita Vitra account</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                style={styles.input}
                placeholder="you@example.com"
                placeholderTextColor={Colors.grayMid}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor={Colors.grayMid}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
              />
            </View>

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.btnText}>Sign In</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.footerLink}>Create account</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scroll: {
    flexGrow: 1,
    padding: Spacing.lg,
    paddingTop: 60,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    color: Colors.navy,
    fontWeight: '500',
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.xl,
    borderBottomWidth: Border.width,
    borderBottomColor: Border.color,
  },
  brandText: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.dark,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  form: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  errorBox: {
    backgroundColor: Colors.errorLight,
    borderWidth: Border.width,
    borderColor: Colors.error + '60',
    borderRadius: BorderRadius.sm,
    padding: Spacing.md,
  },
  errorText: {
    color: Colors.error,
    fontSize: 13,
    lineHeight: 18,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: Colors.offWhite,
    borderWidth: Border.width,
    borderColor: Border.color,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontSize: 15,
    color: Colors.dark,
  },
  btn: {
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.sm,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingTop: Spacing.md,
  },
  footerText: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  footerLink: {
    color: Colors.blue,
    fontSize: 14,
    fontWeight: '600',
  },
});
