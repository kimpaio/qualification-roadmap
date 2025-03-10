import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import Reminder from './components/Reminder';
import StudyLog from './components/StudyLog';
import Milestone from './components/Milestone';
import { getOrientation, addDimensionsListener } from './utils/responsive';

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
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  }
});

export default App;
