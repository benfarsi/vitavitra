import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// DB helpers
export const db = {
  // Bookings
  async createBooking(booking: {
    user_id?: string | null;
    service_id: string;
    date: string;
    time_slot: string;
    address: string;
    notes?: string;
    price: number;
    status?: string;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
  }) {
    return supabase.from('bookings').insert(booking).select().single();
  },

  async getUserBookings(userId: string) {
    return supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
  },

  async updateBookingStatus(bookingId: string, status: string) {
    return supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);
  },

  // Quotes
  async createQuote(quote: {
    name: string;
    email: string;
    phone: string;
    service_id: string;
    address: string;
    details: string;
  }) {
    return supabase.from('quotes').insert(quote).select().single();
  },

  // Profile
  async getProfile(userId: string) {
    return supabase.from('profiles').select('*').eq('id', userId).single();
  },

  async upsertProfile(profile: {
    id: string;
    full_name?: string;
    phone?: string;
    address?: string;
    avatar_url?: string;
  }) {
    return supabase.from('profiles').upsert(profile).select().single();
  },
};
