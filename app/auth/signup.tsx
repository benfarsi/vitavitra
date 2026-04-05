import { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Mail } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import Logo from '../../components/Logo';
import { Colors, Spacing, BorderRadius, Border } from '../../constants/theme';

export default function Signup() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmPending, setConfirmPending] = useState(false);

  const handleSignup = async () => {
    setError('');
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const { error: authError, emailConfirmRequired } = await signUp(email, password, fullName);
    setLoading(false);

    if (authError) {
      if (authError.message?.toLowerCase().includes('already registered') || authError.message?.toLowerCase().includes('already exists')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else {
        setError(authError.message || 'Account creation failed. Please try again.');
      }
    } else if (emailConfirmRequired) {
      setConfirmPending(true);
    } else {
      // Immediately signed in
      router.replace('/tabs/home');
    }
  };

  // Email confirmation pending screen
  if (confirmPending) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        <View style={styles.confirmScreen}>
          <View style={styles.confirmIcon}>
            <Mail size={32} color={Colors.blue} strokeWidth={1.5} />
          </View>
          <Text style={styles.confirmTitle}>Check your email</Text>
          <Text style={styles.confirmSub}>
            We sent a confirmation link to{'\n'}
            <Text style={{ fontWeight: '700', color: Colors.dark }}>{email}</Text>
            {'\n\n'}Click the link in the email to activate your account, then sign in below.
          </Text>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => router.replace('/auth/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Go to Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setConfirmPending(false)} style={styles.resendLink}>
            <Text style={styles.resendText}>Use a different email</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>Join Vita Vitra today</Text>
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
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Your full name"
                placeholderTextColor={Colors.grayMid}
                value={fullName}
                onChangeText={setFullName}
                autoComplete="name"
                autoCapitalize="words"
              />
            </View>

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
                placeholder="Min. 6 characters"
                placeholderTextColor={Colors.grayMid}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            </View>

            <TouchableOpacity
              style={[styles.btn, loading && styles.btnDisabled]}
              onPress={handleSignup}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.btnText}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Terms note */}
          <Text style={styles.terms}>
            By creating an account you agree to our Terms of Service and Privacy Policy.
          </Text>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.footerLink}>Sign in</Text>
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
    marginBottom: Spacing.md,
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
  terms: {
    fontSize: 12,
    color: Colors.text.light,
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    paddingVertical: Spacing.md,
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
  // Confirm pending screen
  confirmScreen: {
    flex: 1,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.blue + '15',
    borderWidth: Border.width,
    borderColor: Colors.blue + '40',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  confirmTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.dark,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  confirmSub: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  resendLink: {
    marginTop: Spacing.md,
  },
  resendText: {
    fontSize: 14,
    color: Colors.text.light,
    textDecorationLine: 'underline',
  },
});
