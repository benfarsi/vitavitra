import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Logo from '../components/Logo';
import { Colors, Spacing, BorderRadius, Border } from '../constants/theme';

const { height } = Dimensions.get('window');

const SERVICES_PREVIEW = ['Pressure Washing', 'Lawn Mowing', 'Window Care', 'Pool Care', 'Auto Detailing', 'Garden Care'];

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Top: brand section */}
      <SafeAreaView style={styles.topSection}>
        <View style={styles.brandArea}>
          <Logo size="xl" variant="dark" />
          <Text style={styles.brandName}>VITA VITRA</Text>
          <Text style={styles.tagline}>Visibly Vital</Text>
        </View>

        {/* Service pills */}
        <View style={styles.pillsRow}>
          {SERVICES_PREVIEW.map((s) => (
            <View key={s} style={styles.pill}>
              <Text style={styles.pillText}>{s}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Bottom: CTA section */}
      <SafeAreaView style={styles.bottomSection}>
        <Text style={styles.headline}>Ottawa's Premier{'\n'}Property Services</Text>
        <Text style={styles.sub}>
          Book trusted local pros for pressure washing, lawn care, windows, pool care, and more.
        </Text>

        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push('/auth/signup')}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Create Account</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.secondaryBtnText}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace('/tabs/home')}
            activeOpacity={0.7}
          >
            <Text style={styles.guestText}>Continue as guest</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xxl,
  },
  brandArea: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  brandName: {
    marginTop: Spacing.md,
    fontSize: 22,
    fontWeight: '800',
    color: Colors.navy,
    letterSpacing: 5,
  },
  tagline: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.blue,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  pill: {
    borderWidth: Border.width,
    borderColor: Border.color,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: Colors.offWhite,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Border.color,
    marginHorizontal: Spacing.lg,
  },
  bottomSection: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.dark,
    lineHeight: 38,
    marginBottom: Spacing.sm,
  },
  sub: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  buttons: {
    gap: Spacing.sm,
  },
  primaryBtn: {
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.sm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    paddingVertical: 15,
    alignItems: 'center',
    borderWidth: Border.widthMedium,
    borderColor: Colors.navy,
  },
  secondaryBtnText: {
    color: Colors.navy,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  guestText: {
    color: Colors.text.secondary,
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: Spacing.sm,
    textDecorationLine: 'underline',
  },
});
