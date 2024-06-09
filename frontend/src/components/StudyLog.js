// 学習記録を表示および追加するためのコンポーネントの例
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const StudyLog = () => {
  const [studySession, setStudySession] = useState({
    date: '',
    duration: '',
    topic: '',
  });

  // 学習セッションを記録するための関数
  const handleSaveSession = () => {
    // API呼び出しやローカルの状態管理ライブラリを使用してセッションを保存する
    console.log('Saving session:', studySession);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>学習記録</Text>
      <TextInput
        style={styles.input}
        placeholder="日付"
        value={studySession.date}
        onChangeText={(text) => setStudySession({ ...studySession, date: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="学習時間"
        value={studySession.duration}
        onChangeText={(text) => setStudySession({ ...studySession, duration: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="トピック"
        value={studySession.topic}
        onChangeText={(text) => setStudySession({ ...studySession, topic: text })}
      />
      <Button title="記録する" onPress={handleSaveSession} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
});

export default StudyLog;
