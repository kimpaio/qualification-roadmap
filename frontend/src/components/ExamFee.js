// src/components/ExamFee.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getExams } from '../api/api';

const ExamFee = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const examsData = await getExams();
        setExams(examsData);
        setError(null);
      } catch (err) {
        setError('試験情報の取得中にエラーが発生しました');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const renderExamItem = ({ item }) => (
    <View style={styles.examItem}>
      <Text style={styles.examName}>{item.name}</Text>
      <Text style={styles.examFee}>受験料: ¥{item.fee.toLocaleString()}</Text>
      <Text style={styles.examDate}>試験日: {new Date(item.examDate).toLocaleDateString('ja-JP')}</Text>
      {item.applicationDeadline && (
        <Text style={styles.deadlineDate}>
          申込締切日: {new Date(item.applicationDeadline).toLocaleDateString('ja-JP')}
        </Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>試験受験料一覧</Text>
      
      {loading ? (
        <Text style={styles.message}>読み込み中...</Text>
      ) : error ? (
        <Text style={styles.errorMessage}>{error}</Text>
      ) : exams.length === 0 ? (
        <Text style={styles.message}>試験情報がありません</Text>
      ) : (
        <FlatList
          data={exams}
          renderItem={renderExamItem}
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
  list: {
    flex: 1,
  },
  examItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4285f4',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  examName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  examFee: {
    fontSize: 16,
    color: '#e53935',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  examDate: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  deadlineDate: {
    fontSize: 14,
    color: '#555',
    fontStyle: 'italic',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    color: '#666',
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 24,
    color: '#e53935',
  },
});

export default ExamFee;
