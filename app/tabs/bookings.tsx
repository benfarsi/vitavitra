import { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Plus, MapPin, CalendarDays } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import { db } from '../../lib/supabase';
import { SERVICES } from '../../constants/services';
import { Colors, Spacing, BorderRadius, Border } from '../../constants/theme';
import ServiceIcon from '../../components/ServiceIcon';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string }> = {
  pending: { label: 'Pending', bg: Colors.warningLight, text: Colors.warning, border: Colors.warning + '40' },
  confirmed: { label: 'Confirmed', bg: Colors.blue + '15', text: Colors.blue, border: Colors.blue + '40' },
  completed: { label: 'Completed', bg: Colors.successLight, text: Colors.success, border: Colors.success + '40' },
  cancelled: { label: 'Cancelled', bg: Colors.errorLight, text: Colors.error, border: Colors.error + '40' },
};

export default function Bookings() {
  const router = useRouter();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadBookings();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadBookings = async () => {
    const { data } = await db.getUserBookings(user!.id);
    setBookings(data || []);
    setLoading(false);
  };

  if (!user) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>
        <View style={styles.empty}>
          <CalendarDays size={48} color={Colors.grayMid} strokeWidth={1} />
          <Text style={styles.emptyTitle}>Sign in to view bookings</Text>
          <Text style={styles.emptySub}>Track all your scheduled services in one place.</Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/auth/login')}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <TouchableOpacity
          style={styles.newBtn}
          onPress={() => router.push('/tabs/services')}
          activeOpacity={0.85}
        >
          <Plus size={15} color={Colors.white} strokeWidth={2.5} />
          <Text style={styles.newBtnText}>New</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.blue} size="large" />
        </View>
      ) : bookings.length === 0 ? (
        <View style={styles.empty}>
          <CalendarDays size={48} color={Colors.grayMid} strokeWidth={1} />
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptySub}>Book your first service to get started.</Text>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => router.push('/tabs/services')}
            activeOpacity={0.85}
          >
            <Text style={styles.actionBtnText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
          {bookings.map(booking => {
            const service = SERVICES.find(s => s.id === booking.service_id);
            const status = STATUS_CONFIG[booking.status] || STATUS_CONFIG.pending;
            return (
              <View key={booking.id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={styles.cardIconCol}>
                    <View style={styles.cardIconBox}>
                      <ServiceIcon
                        name={service?.iconName || 'Home'}
                        size={20}
                        color={Colors.navy}
                      />
                    </View>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{service?.title || booking.service_id}</Text>
                    <Text style={styles.cardDate}>{booking.date} — {booking.time_slot}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: status.bg, borderColor: status.border },
                    ]}
                  >
                    <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
                  </View>
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardBottom}>
                  <View style={styles.cardAddressRow}>
                    <MapPin size={13} color={Colors.gray} strokeWidth={2} />
                    <Text style={styles.cardAddress} numberOfLines={1}>{booking.address}</Text>
                  </View>
                  <Text style={styles.cardPrice}>${booking.price}</Text>
                </View>
              </View>
            );
          })}
          <View style={{ height: 24 }} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.offWhite,
  },
  header: {
    backgroundColor: Colors.navy,
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  newBtn: {
    backgroundColor: Colors.blue,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  newBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.dark,
    marginTop: Spacing.sm,
  },
  emptySub: {
    color: Colors.text.secondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionBtn: {
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 32,
    paddingVertical: 14,
    marginTop: Spacing.sm,
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: Border.width,
    borderColor: Border.color,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  cardIconCol: {},
  cardIconBox: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.offWhite,
    borderWidth: Border.width,
    borderColor: Border.color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 2,
  },
  cardDate: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  statusBadge: {
    borderRadius: BorderRadius.xs,
    borderWidth: Border.width,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cardDivider: {
    height: 1,
    backgroundColor: Border.color,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
  },
  cardAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardAddress: {
    color: Colors.text.secondary,
    fontSize: 12,
    flex: 1,
  },
  cardPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.navy,
  },
});
