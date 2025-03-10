// src/components/Reminder.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, Dimensions, Platform } from 'react-native';
import { getExams, getReminders, createReminder, updateReminder, deleteReminder } from '../api/api';
import { normalize, getBreakpointName, responsiveStyle } from '../utils/responsive';

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
  // 画面サイズの状態を管理
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

  // 画面サイズの変更を監視
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription.remove();
  }, []);

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

  // 画面サイズに応じたレスポンシブスタイルを計算
  const getResponsiveStyles = () => {
    const breakpoint = getBreakpointName();
    const isSmallDevice = ['xsmall', 'small'].includes(breakpoint);
    
    return {
      formContainerStyle: {
        padding: isSmallDevice ? normalize(12) : normalize(16),
      },
      inputStyle: {
        height: isSmallDevice ? normalize(40) : normalize(50),
        fontSize: isSmallDevice ? normalize(14) : normalize(16),
      },
      buttonPadding: isSmallDevice ? normalize(8) : normalize(12),
      reminderItemPadding: isSmallDevice ? normalize(12) : normalize(16),
    };
  };

  const responsiveStyles = getResponsiveStyles();

  // 日付の整形
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const renderReminderItem = ({ item }) => {
    // バックエンドから取得したデータでは、examフィールドはすでにpopulateされている可能性がある
    const relatedExam = item.exam && typeof item.exam === 'object' ? item.exam : exams.find(exam => exam._id === item.exam);
    
    return (
      <View style={[styles.reminderItem, { padding: responsiveStyles.reminderItemPadding }]}>
        <View style={styles.reminderContent}>
          <Text style={styles.reminderTitle}>{item.title}</Text>
          <Text style={styles.reminderDescription}>{item.description}</Text>
          <Text style={styles.reminderDate}>日付: {formatDate(item.date)}</Text>
          {relatedExam && (
            <Text style={styles.relatedExam}>関連試験: {relatedExam.name}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteReminder(item._id)}
          activeOpacity={0.7} // タッチフィードバックを改善
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} // タッチ領域を拡大
        >
          <Text style={styles.deleteButtonText}>削除</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 試験の選択肢をレンダリング
  const renderExamOptions = () => (
    <FlatList
      data={exams}
      keyExtractor={item => item._id}
      horizontal={dimensions.width < 500} // 画面幅が狭い場合は水平スクロール
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.examOption,
            newReminder.exam === item._id && styles.selectedExam,
            dimensions.width < 500 ? { marginRight: 10, minWidth: 150 } : {}
          ]}
          onPress={() => setNewReminder({ ...newReminder, exam: item._id })}
          activeOpacity={0.7} // タッチフィードバックを改善
        >
          <Text style={[newReminder.exam === item._id && styles.selectedExamText]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>学習リマインダー</Text>
      
      {/* 新しいリマインダーを追加するフォーム */}
      <View style={[styles.formContainer, responsiveStyles.formContainerStyle]}>
        <TextInput
          style={[styles.input, responsiveStyles.inputStyle]}
          placeholder="タイトル"
          value={newReminder.title}
          onChangeText={(text) => setNewReminder({ ...newReminder, title: text })}
        />
        <TextInput
          style={[styles.input, responsiveStyles.inputStyle]}
          placeholder="説明"
          value={newReminder.description}
          onChangeText={(text) => setNewReminder({ ...newReminder, description: text })}
          multiline
        />
        <TextInput
          style={[styles.input, responsiveStyles.inputStyle]}
          placeholder="日付 (YYYY-MM-DD)"
          value={newReminder.date}
          onChangeText={(text) => setNewReminder({ ...newReminder, date: text })}
        />
        
        {/* 試験の選択 */}
        {exams.length > 0 && (
          <View style={styles.examSelector}>
            <Text style={styles.selectorLabel}>関連する試験:</Text>
            {renderExamOptions()}
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.addButton, { padding: responsiveStyles.buttonPadding }]}
          onPress={handleAddReminder}
          activeOpacity={0.7} // タッチフィードバックを改善
        >
          <Text style={styles.addButtonText}>リマインダーを追加</Text>
        </TouchableOpacity>
        
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>
      
      {/* リマインダーのリスト */}
      {reminders.length === 0 ? (
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
    padding: normalize(16),
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginBottom: normalize(16),
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: normalize(16),
    marginBottom: normalize(16),
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  input: {
    marginBottom: normalize(12),
    padding: normalize(10),
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
    fontSize: normalize(16),
    minHeight: Platform.OS === 'ios' ? normalize(40) : normalize(44),
  },
  examSelector: {
    marginBottom: normalize(12),
  },
  selectorLabel: {
    marginBottom: normalize(8),
    fontWeight: 'bold',
    color: '#333',
    fontSize: normalize(14),
  },
  examOption: {
    padding: normalize(10),
    marginBottom: normalize(4),
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: normalize(16),
    marginBottom: normalize(8),
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  reminderContent: {
    flex: 1,
  },
  reminderTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginBottom: normalize(4),
    color: '#333',
  },
  reminderDescription: {
    fontSize: normalize(14),
    color: '#555',
    marginBottom: normalize(6),
  },
  reminderDate: {
    fontSize: normalize(14),
    color: '#4285f4',
    marginBottom: normalize(4),
  },
  relatedExam: {
    fontSize: normalize(14),
    fontStyle: 'italic',
    color: '#4285f4',
  },
  message: {
    fontSize: normalize(16),
    textAlign: 'center',
    marginTop: normalize(24),
    color: '#888',
  },
  errorMessage: {
    color: 'red',
    marginTop: normalize(10),
    fontSize: normalize(14),
  },
  deleteButton: {
    backgroundColor: '#f44336',
    padding: normalize(6),
    borderRadius: 4,
    alignSelf: 'center',
    marginLeft: normalize(8),
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: normalize(12),
  },
  addButton: {
    backgroundColor: '#4285f4',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(8),
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: normalize(16),
  },
});

export default Reminder;
