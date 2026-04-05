import { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Alert, ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Pencil, Check, ChevronRight, LogOut, CalendarDays, FileText, Phone, User } from 'lucide-react-native';
import { useAuth } from '../../lib/auth';
import { db } from '../../lib/supabase';
import { Colors, Spacing, BorderRadius, Border } from '../../constants/theme';
import { useRouter } from 'expo-router';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '', address: '' });

  useEffect(() => {
    if (user) loadProfile();
  }, [user]);

  const loadProfile = async () => {
    const { data } = await db.getProfile(user!.id);
    if (data) {
      setProfile(data);
      setForm({
        full_name: data.full_name || user?.user_metadata?.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
      });
    }
  };

  const saveProfile = async () => {
    setSaving(true);
    await db.upsertProfile({ id: user!.id, ...form });
    setSaving(false);
    setEditing(false);
    loadProfile();
  };

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.root}>
        <StatusBar style="light" />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <User size={32} color={Colors.grayMid} strokeWidth={1.25} />
          </View>
          <Text style={styles.emptyTitle}>Not signed in</Text>
          <Text style={styles.emptySub}>Sign in to manage your profile and bookings.</Text>
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

  const initials = (form.full_name || user.email || 'U')[0].toUpperCase();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName} numberOfLines={1}>
            {form.full_name || 'Your Name'}
          </Text>
          <Text style={styles.headerEmail} numberOfLines={1}>{user.email}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Personal info */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            <TouchableOpacity
              onPress={() => editing ? saveProfile() : setEditing(true)}
              style={styles.editBtn}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator size="small" color={Colors.blue} />
              ) : editing ? (
                <>
                  <Check size={14} color={Colors.blue} strokeWidth={2.5} />
                  <Text style={styles.editBtnText}>Save</Text>
                </>
              ) : (
                <>
                  <Pencil size={14} color={Colors.blue} strokeWidth={2} />
                  <Text style={styles.editBtnText}>Edit</Text>
                </>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {[
              { label: 'Full Name', key: 'full_name', placeholder: 'Your full name' },
              { label: 'Phone', key: 'phone', placeholder: '(613) 000-0000' },
              { label: 'Address', key: 'address', placeholder: 'Your property address' },
            ].map((field, idx, arr) => (
              <View
                key={field.key}
                style={[styles.field, idx < arr.length - 1 && styles.fieldBorder]}
              >
                <Text style={styles.fieldLabel}>{field.label}</Text>
                {editing ? (
                  <TextInput
                    style={styles.fieldInput}
                    value={form[field.key as keyof typeof form]}
                    onChangeText={val => setForm(f => ({ ...f, [field.key]: val }))}
                    placeholder={field.placeholder}
                    placeholderTextColor={Colors.grayMid}
                  />
                ) : (
                  <Text style={[
                    styles.fieldValue,
                    !form[field.key as keyof typeof form] && styles.fieldEmpty,
                  ]}>
                    {form[field.key as keyof typeof form] || field.placeholder}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Quick links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={[styles.card, { marginTop: Spacing.md }]}>
            {[
              {
                icon: CalendarDays,
                label: 'My Bookings',
                onPress: () => router.push('/tabs/bookings'),
              },
              {
                icon: FileText,
                label: 'Request a Quote',
                onPress: () => router.push('/quote'),
              },
              {
                icon: Phone,
                label: 'Contact Us',
                onPress: () => {},
              },
            ].map((item, idx, arr) => (
              <TouchableOpacity
                key={item.label}
                style={[styles.menuItem, idx < arr.length - 1 && styles.menuItemBorder]}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <item.icon size={17} color={Colors.navy} strokeWidth={1.75} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <ChevronRight size={16} color={Colors.grayMid} strokeWidth={2} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sign out */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={handleSignOut}
            activeOpacity={0.85}
          >
            <LogOut size={16} color={Colors.error} strokeWidth={2} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  headerTitle: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: Colors.white,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 2,
  },
  headerEmail: {
    color: Colors.gray,
    fontSize: 13,
  },
  scroll: {
    paddingBottom: 40,
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
    fontSize: 17,
    fontWeight: '700',
    color: Colors.dark,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  editBtnText: {
    color: Colors.blue,
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    borderWidth: Border.width,
    borderColor: Border.color,
    overflow: 'hidden',
  },
  field: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  fieldBorder: {
    borderBottomWidth: Border.width,
    borderBottomColor: Border.color,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text.light,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  fieldValue: {
    fontSize: 15,
    color: Colors.dark,
  },
  fieldEmpty: {
    color: Colors.grayMid,
  },
  fieldInput: {
    fontSize: 15,
    color: Colors.dark,
    borderWidth: Border.width,
    borderColor: Colors.blue + '60',
    borderRadius: BorderRadius.xs,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 15,
    gap: Spacing.sm,
  },
  menuItemBorder: {
    borderBottomWidth: Border.width,
    borderBottomColor: Border.color,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: Colors.dark,
    fontWeight: '500',
  },
  signOutBtn: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.sm,
    borderWidth: Border.width,
    borderColor: Colors.error + '40',
    paddingVertical: 15,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  signOutText: {
    color: Colors.error,
    fontSize: 15,
    fontWeight: '700',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.offWhite,
    borderWidth: Border.width,
    borderColor: Border.color,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: Colors.dark,
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
});
