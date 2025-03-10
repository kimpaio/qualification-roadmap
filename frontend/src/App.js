import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import Reminder from './components/Reminder';
import StudyLog from './components/StudyLog';
import Milestone from './components/Milestone';
import Header from './components/Header';
import { getOrientation, addDimensionsListener } from './utils/responsive';
import { BRAND_COLORS, SHADOWS, SPACING, BORDER_RADIUS } from './utils/theme';

const App = () => {
  const [orientation, setOrientation] = useState(getOrientation());
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  useEffect(() => {
    // 画面回転や画面サイズ変更を監視
    const cleanup = addDimensionsListener((width, height) => {
      setDimensions({ width, height });
      setOrientation(width < height ? 'portrait' : 'landscape');
    });

    // コンポーネントのアンマウント時にリスナーをクリーンアップ
    return cleanup;
  }, []);

  // 横向きレイアウト用のスタイル
  const landscapeLayout = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  };

  // 縦向きレイアウト用のスタイル
  const portraitLayout = {
    flexDirection: 'column',
  };

  // 画面の向きに応じたセクションのスタイル
  const getSectionStyle = () => {
    if (orientation === 'landscape') {
      return {
        width: dimensions.width > 1024 ? '30%' : '48%',
        marginBottom: 20
      };
    }
    return { marginBottom: 30 };
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView contentContainerStyle={[styles.scrollContainer, orientation === 'landscape' ? { paddingHorizontal: 10 } : {}]}>
        <View style={[styles.container, orientation === 'landscape' ? landscapeLayout : portraitLayout]}>
          <View style={[styles.section, getSectionStyle()]}>
            <Reminder />
          </View>
          <View style={[styles.section, getSectionStyle()]}>
            <StudyLog />
          </View>
          <View style={[styles.section, getSectionStyle()]}>
            <Milestone />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.primary,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  container: {
    flex: 1,
    backgroundColor: BRAND_COLORS.background.primary,
  },
  section: {
    padding: SPACING.md,
    backgroundColor: BRAND_COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md,
  }
});

export default App;
