import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Phone, Mail, FileText, ChevronRight, AtSign } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import { SERVICES, COMBO_DEALS } from '../../constants/services';
import { Colors, Spacing, BorderRadius, Border } from '../../constants/theme';
import ServiceIcon from '../../components/ServiceIcon';

const { width } = Dimensions.get('window');

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const firstName = user?.user_metadata?.full_name?.split(' ')[0];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>
          {firstName ? `Hello, ${firstName}` : 'Welcome to'}
        </Text>
        <Text style={styles.headerBrand}>VITA VITRA</Text>
        <Text style={styles.headerTagline}>Visibly Vital</Text>

        {/* Quote banner */}
        <TouchableOpacity
          style={styles.quoteBanner}
          onPress={() => router.push('/quote')}
          activeOpacity={0.85}
        >
          <View style={styles.quoteBannerLeft}>
            <FileText size={16} color={Colors.blue} strokeWidth={2} />
            <Text style={styles.quoteBannerText}>Get a Free Quote</Text>
          </View>
          <ChevronRight size={16} color={Colors.white} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* Services grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <TouchableOpacity onPress={() => router.push('/tabs/services')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.servicesGrid}>
            {SERVICES.map(service => (
              <TouchableOpacity
                key={service.id}
                style={styles.serviceCard}
                onPress={() => router.push(`/booking/${service.id}`)}
                activeOpacity={0.85}
              >
                <View style={styles.iconBox}>
                  <ServiceIcon name={service.iconName} size={22} color={Colors.navy} />
                </View>
                {service.popular && (
                  <View style={styles.popularBadge}>
                    <Text style={styles.popularBadgeText}>Popular</Text>
                  </View>
                )}
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceSubtitle} numberOfLines={1}>{service.subtitle}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.priceUnit}>{service.unit} </Text>
                  <Text style={styles.price}>${service.basePrice}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Combo deals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bundle & Save</Text>
          <View style={styles.combos}>
            {COMBO_DEALS.map(deal => {
              const dealServices = deal.services.map(id => SERVICES.find(s => s.id === id)!).filter(Boolean);
              return (
                <View key={deal.id} style={styles.comboCard}>
                  <View style={styles.comboHeader}>
                    <View style={styles.comboIconRow}>
                      {dealServices.map(s => (
                        <View key={s.id} style={styles.comboIconBox}>
                          <ServiceIcon name={s.iconName} size={18} color={Colors.white} />
                        </View>
                      ))}
                    </View>
                    <View style={styles.discountBadge}>
                      <Text style={styles.discountText}>Save {deal.discount}%</Text>
                    </View>
                  </View>
                  <Text style={styles.comboTitle}>{deal.title}</Text>
                  <Text style={styles.comboDesc}>{deal.description}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <View style={styles.contactCard}>
            <Text style={styles.contactTitle}>Questions? We're here.</Text>
            <View style={styles.contactRow}>
              <Phone size={15} color={Colors.navy} strokeWidth={2} />
              <Text style={styles.contactPhone}>(613) 697-1761</Text>
            </View>
            <View style={styles.contactRow}>
              <Mail size={15} color={Colors.blue} strokeWidth={2} />
              <Text style={styles.contactEmail}>main@vitavitra.com</Text>
            </View>
            <View style={styles.contactRow}>
              <AtSign size={15} color={Colors.blue} strokeWidth={2} />
              <Text style={styles.contactEmail}>@vitavitraottawa</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 16 }} />
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
    paddingTop: 64,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    gap: Spacing.md,
  },
  greeting: {
    color: Colors.blue,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  headerBrand: {
    color: Colors.white,
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2.5,
    lineHeight: 34,
  },
  headerTagline: {
    color: Colors.blue,
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
    marginTop: -6,
    marginBottom: 4,
  },
  quoteBanner: {
    backgroundColor: Colors.navyLight,
    borderWidth: Border.width,
    borderColor: Colors.blue + '40',
    borderRadius: BorderRadius.sm,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quoteBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  quoteBannerText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  scroll: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.dark,
    letterSpacing: -0.3,
  },
  seeAll: {
    fontSize: 13,
    color: Colors.blue,
    fontWeight: '600',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  serviceCard: {
    width: (width - Spacing.lg * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: Border.width,
    borderColor: Border.color,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.offWhite,
    borderWidth: Border.width,
    borderColor: Border.color,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  popularBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: Colors.blue,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  popularBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 2,
  },
  serviceSubtitle: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceUnit: {
    fontSize: 10,
    color: Colors.gray,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.navy,
  },
  combos: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  comboCard: {
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
  },
  comboHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  comboIconRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  comboIconBox: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.navyLight,
    borderWidth: Border.width,
    borderColor: Colors.blue + '40',
    alignItems: 'center',
    justifyContent: 'center',
  },
  discountBadge: {
    backgroundColor: Colors.blue,
    borderRadius: BorderRadius.xs,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  discountText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  comboTitle: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  comboDesc: {
    color: Colors.gray,
    fontSize: 13,
    lineHeight: 19,
  },
  contactCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.lg,
    borderWidth: Border.width,
    borderColor: Border.color,
    gap: Spacing.sm,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.dark,
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  contactPhone: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.navy,
  },
  contactEmail: {
    fontSize: 14,
    color: Colors.blue,
  },
});
