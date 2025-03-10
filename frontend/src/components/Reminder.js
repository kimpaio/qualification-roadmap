// src/components/Reminder.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button } from 'react-native';
import { getExams, getReminders, createReminder, updateReminder, deleteReminder } from '../api/api';

const Reminder = () => {
  const [exams, setExams] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    date: '',
    exam: '',
    user: '650e1d8145fa1e67aad7e2ff', // 実際の環境ではログインユーザーIDを使用
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 試験データとリマインダーデータを並行して取得
        const [examsData, remindersData] = await Promise.all([
          getExams(),
          getReminders()
        ]);
        
        setExams(examsData);
        setReminders(remindersData);
        setError(null);
      } catch (err) {
        setError('データの取得中にエラーが発生しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddReminder = async () => {
    // バリデーション
    if (!newReminder.title || !newReminder.date) {
      setError('タイトルと日付は必須です');
      return;
    }

    try {
      // バックエンドにリマインダーを保存
      const createdReminder = await createReminder(newReminder);
      
      // 画面のリマインダー一覧を更新
      setReminders([...reminders, createdReminder]);
      
      // フォームをリセット
      setNewReminder({
        title: '',
        description: '',
        date: '',
        exam: '',
        user: '650e1d8145fa1e67aad7e2ff', // 実際の環境ではログインユーザーIDを使用
      });
      
      setError(null);
    } catch (err) {
      setError('リマインダーの追加中にエラーが発生しました');
      console.error(err);
    }
  };

  const handleDeleteReminder = async (id) => {
    try {
      // バックエンドからリマインダーを削除
      await deleteReminder(id);
      
      // 画面のリマインダー一覧を更新
      setReminders(reminders.filter(reminder => reminder._id !== id));
    } catch (err) {
      setError('リマインダーの削除中にエラーが発生しました');
      console.error(err);
    }
  };

  const renderReminderItem = ({ item }) => {
    // バックエンドから取得したデータでは、examフィールドはすでにpopulateされている可能性がある
    const relatedExam = item.exam && typeof item.exam === 'object' ? item.exam : exams.find(exam => exam._id === item.exam);
    
    return (
      <View style={styles.reminderItem}>
        <Text style={styles.reminderTitle}>{item.title}</Text>
        <Text style={styles.reminderDescription}>{item.description}</Text>
        <Text style={styles.reminderDate}>日付: {new Date(item.date).toLocaleDateString('ja-JP')}</Text>
        {relatedExam && (
          <Text style={styles.relatedExam}>関連試験: {relatedExam.name}</Text>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteReminder(item._id)}
        >
          <Text style={styles.deleteButtonText}>削除</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>学習リマインダー</Text>
      
      {/* 新しいリマインダーを追加するフォーム */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="タイトル"
          value={newReminder.title}
          onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="説明"
          value={newReminder.description}
          onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="日付 (YYYY-MM-DD)"
          value={newReminder.date}
          onChangeText={(text) => setNewReminder({ ...newReminder, date: text })}
        />
        
        {/* 試験の選択（実際にはドロップダウンを使用） */}
        {!loading && exams.length > 0 && (
          <View style={styles.examSelector}>
            <Text style={styles.selectorLabel}>関連する試験:</Text>
            {exams.map((exam) => (
              <TouchableOpacity
                key={exam._id}
                style={[
                  styles.examOption,
                  newReminder.exam === exam._id && styles.selectedExam,
                ]}
                onPress={() => setNewReminder({ ...newReminder, exam: exam._id })}
              >
                <Text
                  style={[newReminder.exam === exam._id && styles.selectedExamText]}
                >
                  {exam.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <Button
          title="リマインダーを追加"
          onPress={handleAddReminder}
          color="#4285f4"
        />
        
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>
      
      {/* リマインダーのリスト */}
      {loading ? (
        <Text style={styles.message}>読み込み中...</Text>
      ) : reminders.length === 0 ? (
        <Text style={styles.message}>リマインダーがありません</Text>
      ) : (
        <FlatList
          data={reminders}
          renderItem={renderReminderItem}
          keyExtractor={(item) => item._id}
          style={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  examSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  examOption: {
    padding: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  selectedExam: {
    backgroundColor: '#e8f0fe',
    borderColor: '#4285f4',
  },
  selectedExamText: {
    color: '#4285f4',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  reminderItem: {
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  reminderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  reminderDescription: {
    fontSize: 14,
    marginBottom: 8,
    color: '#555',
  },
  reminderDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  relatedExam: {
    fontSize: 14,
    color: '#4285f4',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    color: '#888',
  },
  errorMessage: {
    color: 'red',
    marginTop: 10,
  },
  deleteButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#f44336',
    padding: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Reminder;
