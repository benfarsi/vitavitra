import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Check } from 'lucide-react-native';
import { SERVICES } from '../constants/services';
import { db } from '../lib/supabase';
import { Colors, Spacing, BorderRadius, Border } from '../constants/theme';
import ServiceIcon from '../components/ServiceIcon';

export default function Quote() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '', email: '', phone: '', service_id: '', address: '', details: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    if (!form.name || !form.email || !form.phone || !form.service_id || !form.address) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    const { error: dbError } = await db.createQuote(form);
    setLoading(false);
    if (dbError) {
      setError(dbError.message || 'Something went wrong. Please try again.');
    } else {
      Alert.alert(
        'Quote Requested',
        'We will get back to you within 24 hours.',
        [{ text: 'Done', onPress: () => router.back() }],
      );
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={20} color={Colors.navy} strokeWidth={2} />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Free Quote</Text>
        <Text style={styles.subtitle}>We'll respond within 24 hours</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Contact info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Information</Text>

          {[
            { key: 'name', label: 'Full Name', placeholder: 'Your name', keyboard: 'default' as const, capitalize: 'words' as const },
            { key: 'email', label: 'Email Address', placeholder: 'you@example.com', keyboard: 'email-address' as const, capitalize: 'none' as const },
            { key: 'phone', label: 'Phone Number', placeholder: '(613) 000-0000', keyboard: 'phone-pad' as const, capitalize: 'none' as const },
            { key: 'address', label: 'Property Address', placeholder: '123 Main St, Ottawa, ON', keyboard: 'default' as const, capitalize: 'words' as const },
          ].map((f, idx, arr) => (
            <View key={f.key} style={idx < arr.length - 1 ? styles.inputGroupBorder : styles.inputGroup}>
              <Text style={styles.label}>
                {f.label} <Text style={styles.labelRequired}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder={f.placeholder}
                placeholderTextColor={Colors.grayMid}
                value={form[f.key as keyof typeof form]}
                onChangeText={val => setForm(p => ({ ...p, [f.key]: val }))}
                keyboardType={f.keyboard}
                autoCapitalize={f.capitalize}
              />
            </View>
          ))}
        </View>

        {/* Service selector */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Service <Text style={styles.labelRequired}>*</Text>
          </Text>
          <View style={styles.serviceGrid}>
            {SERVICES.map(s => {
              const isSelected = form.service_id === s.id;
              return (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.serviceChip, isSelected && styles.serviceChipActive]}
                  onPress={() => setForm(p => ({ ...p, service_id: s.id }))}
                  activeOpacity={0.8}
                >
                  {isSelected && (
                    <Check size={12} color={Colors.white} strokeWidth={3} />
                  )}
                  <ServiceIcon
                    name={s.iconName}
                    size={14}
                    color={isSelected ? Colors.white : Colors.navy}
                  />
                  <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                    {s.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Additional Details</Text>
          <Text style={styles.optionalLabel}>Optional</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Tell us more about what you need, property size, any concerns..."
            placeholderTextColor={Colors.grayMid}
            value={form.details}
            onChangeText={val => setForm(p => ({ ...p, details: val }))}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.submitBtnText}>Request Free Quote</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  header: {
    backgroundColor: Colors.white,
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: Border.width,
    borderBottomColor: Border.color,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: Spacing.md,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    color: Colors.navy,
    fontWeight: '500',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.dark,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  scroll: {
    padding: Spacing.lg,
    gap: Spacing.md,
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: Border.width,
    borderColor: Border.color,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  inputGroup: {
    gap: 5,
  },
  inputGroupBorder: {
    gap: 5,
    marginBottom: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: Border.width,
    borderBottomColor: Border.color,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  labelRequired: {
    color: Colors.blue,
  },
  optionalLabel: {
    fontSize: 11,
    color: Colors.text.light,
    marginTop: -Spacing.sm,
    marginBottom: Spacing.md,
  },
  input: {
    backgroundColor: Colors.offWhite,
    borderWidth: Border.width,
    borderColor: Border.color,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.dark,
  },
  inputMultiline: {
    height: 100,
    paddingTop: 12,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  serviceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: Border.width,
    borderColor: Border.color,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: 11,
    paddingVertical: 8,
    backgroundColor: Colors.offWhite,
  },
  serviceChipActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  chipText: {
    fontSize: 13,
    color: Colors.dark,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: Border.width,
    borderTopColor: Border.color,
    padding: Spacing.lg,
    paddingBottom: 34,
  },
  submitBtn: {
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.sm,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitBtnDisabled: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
