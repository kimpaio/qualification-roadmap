// src/components/Milestone.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, Switch } from 'react-native';
import { getExams, getMilestones, createMilestone, updateMilestone, deleteMilestone, getUserMilestones } from '../api/api';

const Milestone = ({ userId = '650e1d8145fa1e67aad7e2ff' }) => { // 仮のユーザーID
  const [milestones, setMilestones] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    targetDate: '',
    description: '',
    exam: '',
    user: userId,
    completed: false
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 試験データとマイルストーンデータを並行して取得
        const [examsData, milestonesData] = await Promise.all([
          getExams(),
          getUserMilestones(userId)
        ]);
        
        setExams(examsData);
        setMilestones(milestonesData);
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

  const handleAddMilestone = async () => {
    // バリデーション
    if (!newMilestone.title || !newMilestone.targetDate) {
      setError('タイトルと目標日は必須です');
      return;
    }

    try {
      // バックエンドに新しいマイルストーンを保存
      const createdMilestone = await createMilestone(newMilestone);
      
      // 画面のマイルストーン一覧を更新
      setMilestones([...milestones, createdMilestone]);
      
      // フォームをリセット
      setNewMilestone({
        title: '',
        targetDate: '',
        description: '',
        exam: '',
        user: userId,
        completed: false
      });
      
      setError(null);
    } catch (err) {
      setError('マイルストーンの作成中にエラーが発生しました');
      console.error(err);
    }
  };

  const toggleMilestoneCompletion = async (id) => {
    try {
      // 更新するマイルストーンを見つける
      const milestoneToUpdate = milestones.find(milestone => milestone._id === id);
      if (!milestoneToUpdate) return;
      
      // 完了状態を反転
      const updatedData = { ...milestoneToUpdate, completed: !milestoneToUpdate.completed };
      
      // バックエンドのデータを更新
      const updatedMilestone = await updateMilestone(id, updatedData);
      
      // 画面のマイルストーン一覧を更新
      const updatedMilestones = milestones.map(milestone => 
        milestone._id === id ? updatedMilestone : milestone
      );
      
      setMilestones(updatedMilestones);
    } catch (err) {
      setError('マイルストーンの更新中にエラーが発生しました');
      console.error(err);
    }
  };
  
  const handleDeleteMilestone = async (id) => {
    try {
      // バックエンドからマイルストーンを削除
      await deleteMilestone(id);
      
      // 画面のマイルストーン一覧から削除
      setMilestones(milestones.filter(milestone => milestone._id !== id));
    } catch (err) {
      setError('マイルストーンの削除中にエラーが発生しました');
      console.error(err);
    }
  };

  const renderMilestoneItem = ({ item }) => {
    // バックエンドから取得したデータでは、examフィールドはすでにpopulateされている可能性がある
    const relatedExam = item.exam && typeof item.exam === 'object' ? item.exam : exams.find(exam => exam._id === item.exam);
    const isUpcoming = new Date(item.targetDate) > new Date();
    
    return (
      <View style={[styles.milestoneItem, item.completed && styles.completedMilestone]}>
        <TouchableOpacity 
          style={styles.checkbox} 
          onPress={() => toggleMilestoneCompletion(item._id)}
        >
          <View style={[styles.checkboxInner, item.completed && styles.checkboxChecked]} />
        </TouchableOpacity>
        
        <View style={styles.milestoneContent}>
          <Text style={[styles.milestoneTitle, item.completed && styles.completedText]}>
            {item.title}
          </Text>
          <Text style={styles.milestoneDate}>
            目標日: {new Date(item.targetDate).toLocaleDateString('ja-JP')}
            {isUpcoming ? ` (残り${Math.ceil((new Date(item.targetDate) - new Date()) / (1000 * 60 * 60 * 24))}日)` : ''}
          </Text>
          <Text style={styles.milestoneDescription}>{item.description}</Text>
          {relatedExam && (
            <Text style={styles.relatedExam}>関連試験: {relatedExam.name}</Text>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteMilestone(item._id)}
        >
          <Text style={styles.deleteButtonText}>削除</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>マイルストーン</Text>
      
      {/* 新しいマイルストーンを追加するフォーム */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="タイトル"
          value={newMilestone.title}
          onChangeText={(text) => setNewMilestone({ ...newMilestone, title: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="目標日 (YYYY-MM-DD)"
          value={newMilestone.targetDate}
          onChangeText={(text) => setNewMilestone({ ...newMilestone, targetDate: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="説明"
          value={newMilestone.description}
          onChangeText={(text) => setNewMilestone({ ...newMilestone, description: text })}
          multiline={true}
          numberOfLines={3}
        />
        
        {/* 試験の選択 */}
        {!loading && exams.length > 0 && (
          <View style={styles.examSelector}>
            <Text style={styles.selectorLabel}>関連する試験:</Text>
            {exams.map((exam) => (
              <TouchableOpacity
                key={exam._id}
                style={[
                  styles.examOption,
                  newMilestone.exam === exam._id && styles.selectedExam,
                ]}
                onPress={() => setNewMilestone({ ...newMilestone, exam: exam._id })}
              >
                <Text
                  style={[newMilestone.exam === exam._id && styles.selectedExamText]}
                >
                  {exam.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
        
        <View style={styles.completedToggle}>
          <Text style={styles.toggleLabel}>既に完了済み:</Text>
          <Switch
            value={newMilestone.completed}
            onValueChange={(value) => setNewMilestone({ ...newMilestone, completed: value })}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={newMilestone.completed ? '#4285f4' : '#f4f3f4'}
          />
        </View>
        
        <Button
          title="マイルストーンを追加"
          onPress={handleAddMilestone}
          color="#4285f4"
        />
        
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>
      
      {/* マイルストーン一覧 */}
      {loading ? (
        <Text style={styles.message}>読み込み中...</Text>
      ) : milestones.length === 0 ? (
        <Text style={styles.message}>マイルストーンはありません</Text>
      ) : (
        <FlatList
          data={milestones}
          renderItem={renderMilestoneItem}
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
    borderRadius: 8,
    marginBottom: 16,
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
    marginBottom: 12,
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
  completedToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  toggleLabel: {
    flex: 1,
    color: '#333',
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  completedMilestone: {
    backgroundColor: '#f5f5f5',
    borderColor: '#4285f4',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#4285f4',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  milestoneDate: {
    fontSize: 14,
    color: '#4285f4',
    marginBottom: 4,
  },
  milestoneDescription: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  relatedExam: {
    fontSize: 14,
    fontStyle: 'italic',
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
    marginLeft: 8,
    backgroundColor: '#f44336',
    padding: 6,
    borderRadius: 4,
    alignSelf: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default Milestone;
