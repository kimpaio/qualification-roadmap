import React from 'react';
import { View, StyleSheet } from 'react-native';
import Reminder from './components/Reminder';
import StudyLog from './components/StudyLog';
import Milestone from './components/Milestone';

const App = () => {
  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Reminder />
      </View>
      <View style={styles.section}>
        <StudyLog />
      </View>
      <View style={styles.section}>
        <Milestone />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  section: {
    marginBottom: 30,
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
