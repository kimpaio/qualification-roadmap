// 学習記録を表示および追加するためのコンポーネント
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getBooks, getStudyLogs, createStudyLog, updateStudyLog, deleteStudyLog, getUserStudyLogs } from '../api/api';

const StudyLog = ({ userId = '650e1d8145fa1e67aad7e2ff' }) => { // 仮のユーザーID
  const [studySession, setStudySession] = useState({
    date: new Date().toISOString().split('T')[0], // 今日の日付をYYYY-MM-DD形式で設定
    duration: '',
    topic: '',
    book: '',
    user: userId,
    notes: ''
  });
  
  const [studyLogs, setStudyLogs] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 参考書データと学習記録データを並行して取得
        const [booksData, studyLogsData] = await Promise.all([
          getBooks(),
          getUserStudyLogs(userId)
        ]);
        
        setBooks(booksData);
        setStudyLogs(studyLogsData);
        setError(null);
      } catch (err) {
        setError('データの取得中にエラーが発生しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);

  // 学習セッションを記録するための関数
  const handleSaveSession = async () => {
    // バリデーション
    if (!studySession.date || !studySession.duration || !studySession.topic) {
      setError('日付、学習時間、トピックは必須です');
      return;
    }
    
    // 時間が数値であることを確認
    if (isNaN(Number(studySession.duration))) {
      setError('学習時間は数値で入力してください');
      return;
    }
    
    try {
      // バックエンドに学習記録を保存
      const createdStudyLog = await createStudyLog(studySession);
      
      // 画面の学習記録一覧を更新
      setStudyLogs([createdStudyLog, ...studyLogs]);
      
      // フォームをリセット（日付は今日の日付のまま）
      setStudySession({
        date: new Date().toISOString().split('T')[0],
        duration: '',
        topic: '',
        book: '',
        user: userId,
        notes: ''
      });
      
      setError(null);
    } catch (err) {
      setError('学習記録の作成中にエラーが発生しました');
      console.error(err);
    }
  };
  
  // 学習記録を削除するための関数
  const handleDeleteStudyLog = async (id) => {
    try {
      // バックエンドから学習記録を削除
      await deleteStudyLog(id);
      
      // 画面の学習記録一覧を更新
      setStudyLogs(studyLogs.filter(log => log._id !== id));
    } catch (err) {
      setError('学習記録の削除中にエラーが発生しました');
      console.error(err);
    }
  };
  
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}時間${mins > 0 ? ` ${mins}分` : ''}`;
    }
    return `${mins}分`;
  };
  
  const renderStudyLogItem = ({ item }) => {
    // バックエンドから取得したデータでは、bookフィールドはすでにpopulateされている可能性がある
    const relatedBook = item.book && typeof item.book === 'object' ? item.book : books.find(book => book._id === item.book);
    
    return (
      <View style={styles.logItem}>
        <Text style={styles.logDate}>{new Date(item.date).toLocaleDateString('ja-JP')}</Text>
        <Text style={styles.logDuration}>{formatDuration(Number(item.duration))}</Text>
        <Text style={styles.logTopic}>{item.topic}</Text>
        {relatedBook && (
          <Text style={styles.relatedBook}>参考書: {relatedBook.title}</Text>
        )}
        {item.notes && (
          <Text style={styles.notes}>メモ: {item.notes}</Text>
        )}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteStudyLog(item._id)}
        >
          <Text style={styles.deleteButtonText}>削除</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>学習記録</Text>
      
      {/* 新しい学習記録フォーム */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="日付 (YYYY-MM-DD)"
          value={studySession.date}
          onChangeText={(text) => setStudySession({ ...studySession, date: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="学習時間（分）"
          keyboardType="numeric"
          value={studySession.duration}
          onChangeText={(text) => setStudySession({ ...studySession, duration: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="学習トピック"
          value={studySession.topic}
          onChangeText={(text) => setStudySession({ ...studySession, topic: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="メモ（任意）"
          multiline
          numberOfLines={3}
          value={studySession.notes}
          onChangeText={(text) => setStudySession({ ...studySession, notes: text })}
        />
        
        {/* 参考書の選択 */}
        {!loading && books.length > 0 && (
          <View style={styles.bookSelector}>
            <Text style={styles.selectorLabel}>関連する参考書:</Text>
            {books.map((book) => (
              <TouchableOpacity
                key={book._id}
                style={[
                  styles.bookOption,
                  studySession.book === book._id && styles.selectedBook,
                ]}
                onPress={() => setStudySession({ ...studySession, book: book._id })}
              >
                <Text
                  style={[studySession.book === book._id && styles.selectedBookText]}
                >
                  {book.title} ({book.author})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <Button title="記録する" onPress={handleSaveSession} color="#4285f4" />
        
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>
      
      {/* 学習記録リスト */}
      <Text style={styles.subHeader}>過去の学習記録</Text>
      
      {loading ? (
        <Text style={styles.message}>読み込み中...</Text>
      ) : studyLogs.length === 0 ? (
        <Text style={styles.message}>学習記録がありません</Text>
      ) : (
        <FlatList
          data={studyLogs}
          renderItem={renderStudyLogItem}
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
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
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
  bookSelector: {
    marginBottom: 16,
  },
  selectorLabel: {
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  bookOption: {
    padding: 10,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
  selectedBook: {
    backgroundColor: '#e8f0fe',
    borderColor: '#4285f4',
  },
  selectedBookText: {
    color: '#4285f4',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  logItem: {
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
  logDate: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  logDuration: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4285f4',
    marginBottom: 4,
  },
  logTopic: {
    fontSize: 16,
    marginBottom: 6,
    color: '#333',
  },
  relatedBook: {
    fontSize: 14,
    color: '#4285f4',
    marginBottom: 4,
  },
  notes: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 6,
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

export default StudyLog;
