import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Home, LayoutGrid, CalendarDays, User, LucideIcon } from 'lucide-react-native';
import { Colors, Border } from '../../constants/theme';

interface TabIconProps {
  icon: LucideIcon;
  label: string;
  focused: boolean;
}

function TabIcon({ icon: Icon, label, focused }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <Icon
        size={22}
        color={focused ? Colors.navy : Colors.gray}
        strokeWidth={focused ? 2.25 : 1.5}
      />
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Border.color,
          borderTopWidth: Border.width,
          height: Platform.OS === 'ios' ? 84 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.navy,
        tabBarInactiveTintColor: Colors.gray,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={Home} label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={LayoutGrid} label="Services" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={CalendarDays} label="Bookings" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon icon={User} label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    gap: 3,
    paddingTop: 2,
  },
  label: {
    fontSize: 10,
    color: Colors.gray,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.navy,
    fontWeight: '700',
  },
});
