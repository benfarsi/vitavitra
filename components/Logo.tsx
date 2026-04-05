import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/theme';

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
  onDark?: boolean;
}

const SIZES: Record<LogoSize, { name: number; tagline: number }> = {
  sm: { name: 15, tagline: 10 },
  md: { name: 20, tagline: 12 },
  lg: { name: 26, tagline: 14 },
};

/**
 * Vita Vitra text wordmark — "VITA VITRA" bold navy with "Visibly Vital" subtitle.
 */
export default function Logo({ size = 'md', onDark = false }: LogoProps) {
  const sz = SIZES[size];
  return (
    <View>
      <Text
        style={[
          styles.name,
          { fontSize: sz.name, color: onDark ? Colors.white : Colors.navy },
        ]}
      >
        VITA VITRA
      </Text>
      <Text style={[styles.tagline, { fontSize: sz.tagline }]}>Visibly Vital</Text>
    </View>
  );
}

export function LogoWordmark({ size = 'md', onDark = false }: LogoProps) {
  return <Logo size={size} onDark={onDark} />;
}

const styles = StyleSheet.create({
  name: {
    fontWeight: '800',
    letterSpacing: 2.5,
  },
  tagline: {
    color: Colors.blue,
    fontWeight: '500',
    letterSpacing: 0.8,
    marginTop: 2,
  },
});
