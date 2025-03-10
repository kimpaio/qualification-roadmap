import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { BRAND_COLORS, FONT_SIZES, SPACING, SHADOWS } from '../utils/theme';

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image 
          source={{ uri: '/assets/logo.svg' }} 
          style={styles.logo} 
          resizeMode="contain"
        />
        <Text style={styles.title}>資格ロードマップ</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: BRAND_COLORS.background.secondary,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: BRAND_COLORS.border,
    ...SHADOWS.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: BRAND_COLORS.primary,
  },
});

export default Header;
