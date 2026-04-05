import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ChevronRight } from 'lucide-react-native';
import { SERVICES } from '../../constants/services';
import { Colors, Spacing, BorderRadius, Border } from '../../constants/theme';
import ServiceIcon from '../../components/ServiceIcon';

export default function Services() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Services</Text>
        <Text style={styles.headerSub}>Ottawa — Visibly Vital</Text>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {SERVICES.map(service => (
          <TouchableOpacity
            key={service.id}
            style={styles.card}
            onPress={() => router.push(`/booking/${service.id}`)}
            activeOpacity={0.85}
          >
            <View style={styles.cardLeft}>
              <View style={styles.iconBox}>
                <ServiceIcon name={service.iconName} size={24} color={Colors.navy} />
              </View>
            </View>

            <View style={styles.cardContent}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle}>{service.title}</Text>
                {service.popular && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Popular</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardSub}>{service.subtitle}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>{service.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.cardPrice}>
                  <Text style={styles.cardUnit}>{service.unit}  </Text>
                  ${service.basePrice}
                </Text>
                <View style={styles.bookBtn}>
                  <Text style={styles.bookBtnText}>Book</Text>
                  <ChevronRight size={13} color={Colors.white} strokeWidth={2.5} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>
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
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerSub: {
    color: Colors.blue,
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  list: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    flexDirection: 'row',
    borderWidth: Border.width,
    borderColor: Border.color,
  },
  cardLeft: {
    marginRight: Spacing.md,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.offWhite,
    borderWidth: Border.width,
    borderColor: Border.color,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
  },
  badge: {
    backgroundColor: Colors.blue,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  cardSub: {
    color: Colors.text.secondary,
    fontSize: 12,
    marginBottom: 5,
    letterSpacing: 0.1,
  },
  cardDesc: {
    color: Colors.text.secondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: Spacing.sm,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardPrice: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.navy,
  },
  cardUnit: {
    fontSize: 11,
    fontWeight: '400',
    color: Colors.gray,
  },
  bookBtn: {
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  bookBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '700',
  },
});
