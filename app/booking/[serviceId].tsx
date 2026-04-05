import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronLeft, Check, Clock, MapPin } from 'lucide-react-native';
import { SERVICES } from '../../constants/services';
import { db } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';
import { Colors, Spacing, BorderRadius, Border } from '../../constants/theme';

const TIME_SLOTS = [
  '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
];

export default function BookingScreen() {
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const service = SERVICES.find(s => s.id === serviceId);

  const [guestName, setGuestName] = useState(user?.user_metadata?.full_name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!service) {
    return (
      <View style={styles.root}>
        <Text style={{ color: Colors.dark, padding: Spacing.lg }}>Service not found.</Text>
      </View>
    );
  }

  const handleBook = async () => {
    if (!guestName.trim() || !guestEmail.trim() || !guestPhone.trim()) {
      Alert.alert('Missing info', 'Please fill in your name, email, and phone number.');
      return;
    }
    if (!date || !timeSlot || !address) {
      Alert.alert('Missing info', 'Please fill in the date, time, and address.');
      return;
    }

    setLoading(true);
    const { error } = await db.createBooking({
      user_id: user?.id ?? null,
      service_id: service.id,
      date,
      time_slot: timeSlot,
      address,
      notes,
      price: service.basePrice,
      status: 'pending',
      guest_name: guestName.trim(),
      guest_email: guestEmail.trim(),
      guest_phone: guestPhone.trim(),
    });
    setLoading(false);

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert(
        'Booking Submitted',
        "We'll reach out to confirm your appointment.",
        [{
          text: 'Done',
          onPress: () => user
            ? router.replace('/tabs/bookings')
            : router.replace('/tabs/home'),
        }],
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
        <Text style={styles.serviceTitle}>{service.title}</Text>
        <Text style={styles.servicePrice}>
          <Text style={styles.servicePriceUnit}>{service.unit}  </Text>
          <Text style={styles.servicePriceNum}>${service.basePrice}</Text>
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* What's included */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>What's included</Text>
          {service.features.map(f => (
            <View key={f} style={styles.featureRow}>
              <View style={styles.checkBox}>
                <Check size={11} color={Colors.success} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Contact details */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Your Details</Text>
          <TextInput
            style={[styles.input, styles.inputSpaced]}
            placeholder="Full Name"
            placeholderTextColor={Colors.grayMid}
            value={guestName}
            onChangeText={setGuestName}
            autoCapitalize="words"
          />
          <TextInput
            style={[styles.input, styles.inputSpaced]}
            placeholder="Email Address"
            placeholderTextColor={Colors.grayMid}
            value={guestEmail}
            onChangeText={setGuestEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={Colors.grayMid}
            value={guestPhone}
            onChangeText={setGuestPhone}
            keyboardType="phone-pad"
          />
        </View>

        {/* Date */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Preferred Date</Text>
            <Text style={styles.required}>Required</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="e.g. May 15, 2025"
            placeholderTextColor={Colors.grayMid}
            value={date}
            onChangeText={setDate}
          />
        </View>

        {/* Time slots */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.cardTitleWithIcon}>
              <Clock size={14} color={Colors.text.secondary} strokeWidth={2} />
              <Text style={styles.cardTitle}>Preferred Time</Text>
            </View>
            <Text style={styles.required}>Required</Text>
          </View>
          <View style={styles.slotsGrid}>
            {TIME_SLOTS.map(slot => (
              <TouchableOpacity
                key={slot}
                style={[styles.slot, timeSlot === slot && styles.slotActive]}
                onPress={() => setTimeSlot(slot)}
                activeOpacity={0.8}
              >
                <Text style={[styles.slotText, timeSlot === slot && styles.slotTextActive]}>
                  {slot}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Address */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <View style={styles.cardTitleWithIcon}>
              <MapPin size={14} color={Colors.text.secondary} strokeWidth={2} />
              <Text style={styles.cardTitle}>Property Address</Text>
            </View>
            <Text style={styles.required}>Required</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="123 Main St, Ottawa, ON"
            placeholderTextColor={Colors.grayMid}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Notes */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Text style={styles.cardTitle}>Additional Notes</Text>
            <Text style={styles.optional}>Optional</Text>
          </View>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            placeholder="Any specific instructions, gate codes, or details..."
            placeholderTextColor={Colors.grayMid}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Sticky footer */}
      <View style={styles.footer}>
        <View style={styles.footerPriceRow}>
          <Text style={styles.footerPriceLabel}>Starting at</Text>
          <Text style={styles.footerPriceValue}>${service.basePrice}</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, loading && styles.bookBtnDisabled]}
          onPress={handleBook}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.bookBtnText}>Confirm Booking</Text>
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
    paddingBottom: Spacing.lg,
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
  serviceTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.dark,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  servicePriceUnit: {
    fontSize: 12,
    color: Colors.grayMid,
  },
  servicePriceNum: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.navy,
  },
  scroll: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: Border.width,
    borderColor: Border.color,
  },
  cardTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  cardTitleWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: Spacing.md,
  },
  required: {
    fontSize: 11,
    color: Colors.blue,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.md,
  },
  optional: {
    fontSize: 11,
    color: Colors.text.light,
    marginBottom: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 10,
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.successLight,
    borderWidth: Border.width,
    borderColor: Colors.success + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
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
  inputSpaced: {
    marginBottom: Spacing.sm,
  },
  inputMultiline: {
    height: 96,
    paddingTop: 13,
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  slot: {
    borderWidth: Border.width,
    borderColor: Border.color,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 18,
    paddingVertical: 12,
    backgroundColor: Colors.offWhite,
  },
  slotActive: {
    backgroundColor: Colors.navy,
    borderColor: Colors.navy,
  },
  slotText: {
    fontSize: 14,
    color: Colors.dark,
    fontWeight: '500',
  },
  slotTextActive: {
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
    paddingBottom: 36,
    gap: Spacing.sm,
  },
  footerPriceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  footerPriceLabel: {
    fontSize: 12,
    color: Colors.text.light,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerPriceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.navy,
  },
  bookBtn: {
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.sm,
    paddingVertical: 18,
    alignItems: 'center',
    width: '100%',
  },
  bookBtnDisabled: {
    opacity: 0.6,
  },
  bookBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
