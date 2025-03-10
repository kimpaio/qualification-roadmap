// 学習記録を表示および追加するためのコンポーネント
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { getBooks, getStudyLogs, createStudyLog, updateStudyLog, deleteStudyLog, getUserStudyLogs } from '../api/api';
import { normalize, getBreakpointName, responsiveStyle } from '../utils/responsive';

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

  // レスポンシブスタイルを計算
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
      logItemPadding: isSmallDevice ? normalize(12) : normalize(16),
    };
  };

  const responsiveStyles = getResponsiveStyles();

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

  // 日付の整形
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };
  
  const renderStudyLogItem = ({ item }) => {
    // バックエンドから取得したデータでは、bookフィールドはすでにpopulateされている可能性がある
    const relatedBook = item.book && typeof item.book === 'object' ? item.book : books.find(book => book._id === item.book);
    
    return (
      <View style={[styles.logItem, { padding: responsiveStyles.logItemPadding }]}>
        <View style={styles.logContent}>
          <Text style={styles.logDate}>{formatDate(item.date)}</Text>
          <Text style={styles.logDuration}>{formatDuration(Number(item.duration))}</Text>
          <Text style={styles.logTopic}>{item.topic}</Text>
          {relatedBook && (
            <Text style={styles.relatedBook}>参考書: {relatedBook.title}</Text>
          )}
          {item.notes && (
            <Text style={styles.notes}>メモ: {item.notes}</Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteStudyLog(item._id)}
          activeOpacity={0.7} // タッチフィードバックを改善
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} // タッチ領域を拡大
        >
          <Text style={styles.deleteButtonText}>削除</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // 参考書の選択肢をレンダリング
  const renderBookOptions = () => (
    <FlatList
      data={books}
      keyExtractor={item => item._id}
      horizontal={dimensions.width < 500} // 画面幅が狭い場合は水平スクロール
      showsHorizontalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.bookOption,
            studySession.book === item._id && styles.selectedBook,
            dimensions.width < 500 ? { marginRight: 10, minWidth: 150 } : {}
          ]}
          onPress={() => setStudySession({ ...studySession, book: item._id })}
          activeOpacity={0.7} // タッチフィードバックを改善
        >
          <Text style={[studySession.book === item._id && styles.selectedBookText]}>
            {item.title} ({item.author})
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
      <Text style={styles.header}>学習記録</Text>
      
      {/* 新しい学習記録フォーム */}
      <View style={[styles.formContainer, responsiveStyles.formContainerStyle]}>
        <TextInput
          style={[styles.input, responsiveStyles.inputStyle]}
          placeholder="日付 (YYYY-MM-DD)"
          value={studySession.date}
          onChangeText={(text) => setStudySession({ ...studySession, date: text })}
        />
        <TextInput
          style={[styles.input, responsiveStyles.inputStyle]}
          placeholder="学習時間（分）"
          keyboardType="numeric"
          value={studySession.duration}
          onChangeText={(text) => setStudySession({ ...studySession, duration: text })}
        />
        <TextInput
          style={[styles.input, responsiveStyles.inputStyle]}
          placeholder="学習トピック"
          value={studySession.topic}
          onChangeText={(text) => setStudySession({ ...studySession, topic: text })}
        />
        <TextInput
          style={[styles.input, responsiveStyles.inputStyle, { minHeight: normalize(80) }]}
          placeholder="メモ（任意）"
          multiline
          numberOfLines={3}
          value={studySession.notes}
          onChangeText={(text) => setStudySession({ ...studySession, notes: text })}
        />
        
        {/* 参考書の選択 */}
        {books.length > 0 && (
          <View style={styles.bookSelector}>
            <Text style={styles.selectorLabel}>関連する参考書:</Text>
            {renderBookOptions()}
          </View>
        )}
        
        <TouchableOpacity 
          style={[styles.addButton, { padding: responsiveStyles.buttonPadding }]}
          onPress={handleSaveSession}
          activeOpacity={0.7} // タッチフィードバックを改善
        >
          <Text style={styles.addButtonText}>記録する</Text>
        </TouchableOpacity>
        
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>
      
      {/* 学習記録リスト */}
      <Text style={styles.subHeader}>過去の学習記録</Text>
      
      {studyLogs.length === 0 ? (
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
    padding: normalize(20),
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    marginBottom: normalize(16),
    color: '#333',
  },
  subHeader: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginTop: normalize(16),
    marginBottom: normalize(12),
    color: '#333',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: normalize(16),
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
  bookSelector: {
    marginBottom: normalize(16),
  },
  selectorLabel: {
    marginBottom: normalize(8),
    fontWeight: 'bold',
    color: '#333',
    fontSize: normalize(14),
  },
  bookOption: {
    padding: normalize(10),
    marginBottom: normalize(4),
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
  logContent: {
    flex: 1,
  },
  logDate: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginBottom: normalize(4),
    color: '#333',
  },
  logDuration: {
    fontSize: normalize(14),
    fontWeight: 'bold',
    color: '#4285f4',
    marginBottom: normalize(4),
  },
  logTopic: {
    fontSize: normalize(16),
    marginBottom: normalize(6),
    color: '#333',
  },
  relatedBook: {
    fontSize: normalize(14),
    color: '#4285f4',
    marginBottom: normalize(4),
  },
  notes: {
    fontSize: normalize(14),
    fontStyle: 'italic',
    color: '#666',
    marginBottom: normalize(6),
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

export default StudyLog;
