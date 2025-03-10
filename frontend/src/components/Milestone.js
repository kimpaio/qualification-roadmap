// src/components/Milestone.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Button, Switch, Dimensions, Platform } from 'react-native';
import { getExams, getMilestones, createMilestone, updateMilestone, deleteMilestone, getUserMilestones } from '../api/api';
import { normalize, getBreakpointName, responsiveStyle } from '../utils/responsive';

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
  // 画面の向きとサイズを管理
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
      const response = await createMilestone({
        ...newMilestone,
        user: userId
      });
      setMilestones([...milestones, response]);
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

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const updatedMilestone = await updateMilestone(id, { completed: !currentStatus });
      setMilestones(milestones.map(m => m._id === id ? updatedMilestone : m));
    } catch (err) {
      setError('マイルストーンの更新中にエラーが発生しました');
      console.error(err);
    }
  };

  const handleDeleteMilestone = async (id) => {
    try {
      await deleteMilestone(id);
      setMilestones(milestones.filter(m => m._id !== id));
    } catch (err) {
      setError('マイルストーンの削除中にエラーが発生しました');
      console.error(err);
    }
  };

  // 入力フォームの値変更を処理
  const handleChange = (name, value) => {
    setNewMilestone({ ...newMilestone, [name]: value });
  };

  const handleSelectExam = (examId) => {
    setNewMilestone({ ...newMilestone, exam: examId });
  };

  // 試験名を取得する関数
  const getExamName = (examId) => {
    const exam = exams.find(e => e._id === examId);
    return exam ? exam.name : '未選択';
  };

  // 画面サイズに応じたレスポンシブスタイルを取得
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
      milestoneItemPadding: isSmallDevice ? normalize(12) : normalize(16),
    };
  };

  const responsiveStyles = getResponsiveStyles();

  // 日付の整形
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>マイルストーン</Text>
      
      {/* マイルストーン作成フォーム */}
      <View style={[styles.formContainer, responsiveStyles.formContainerStyle]}>
        <TextInput
          style={[styles.input, responsiveStyles.inputStyle]}
          placeholder="タイトル"
          value={newMilestone.title}
          onChangeText={(text) => handleChange('title', text)}
        />
        <TextInput
          style={[styles.input, responsiveStyles.inputStyle]}
          placeholder="目標日 (YYYY-MM-DD)"
          value={newMilestone.targetDate}
          onChangeText={(text) => handleChange('targetDate', text)}
        />
        <TextInput
          style={[styles.input, responsiveStyles.inputStyle]}
          placeholder="説明（任意）"
          value={newMilestone.description}
          onChangeText={(text) => handleChange('description', text)}
          multiline
        />
        
        {/* 試験選択 */}
        <View style={styles.examSelector}>
          <Text style={styles.selectorLabel}>関連する試験</Text>
          <FlatList
            data={exams}
            keyExtractor={item => item._id}
            horizontal={dimensions.width < 500} // 画面幅が狭い場合は水平スクロール
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.examOption,
                  newMilestone.exam === item._id && styles.selectedExam,
                  dimensions.width < 500 ? { marginRight: 10, minWidth: 150 } : {}
                ]}
                onPress={() => handleSelectExam(item._id)}
                activeOpacity={0.7} // タッチフィードバックを改善
              >
                <Text style={[newMilestone.exam === item._id && styles.selectedExamText]}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
        
        {/* 完了状態トグル */}
        <View style={styles.completedToggle}>
          <Text style={styles.toggleLabel}>完了済み</Text>
          <Switch
            value={newMilestone.completed}
            onValueChange={(value) => handleChange('completed', value)}
            trackColor={{ false: '#c0c0c0', true: '#81b0ff' }}
            thumbColor={newMilestone.completed ? '#4285f4' : '#f4f3f4'}
            ios_backgroundColor="#c0c0c0"
          />
        </View>
        
        {/* 追加ボタン */}
        <TouchableOpacity 
          style={[styles.addButton, { padding: responsiveStyles.buttonPadding }]}
          onPress={handleAddMilestone}
          activeOpacity={0.7} // タッチフィードバックを改善
        >
          <Text style={styles.addButtonText}>マイルストーンを追加</Text>
        </TouchableOpacity>
        
        {error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>
      
      {/* マイルストーン一覧 */}
      {milestones.length > 0 ? (
        <FlatList
          data={milestones}
          keyExtractor={item => item._id}
          style={styles.list}
          renderItem={({ item }) => (
            <View style={[
              styles.milestoneItem, 
              item.completed && styles.completedMilestone,
              { padding: responsiveStyles.milestoneItemPadding }
            ]}>
              {/* 完了チェックボックス */}
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => handleToggleComplete(item._id, item.completed)}
                activeOpacity={0.7} // タッチフィードバックを改善
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} // タッチ領域を拡大
              >
                <View style={[styles.checkboxInner, item.completed && styles.checkboxChecked]} />
              </TouchableOpacity>
              
              <View style={styles.milestoneContent}>
                <Text style={[styles.milestoneTitle, item.completed && styles.completedText]}>
                  {item.title}
                </Text>
                <Text style={styles.milestoneDate}>
                  目標日: {formatDate(item.targetDate)}
                </Text>
                {item.description && (
                  <Text style={[styles.milestoneDescription, item.completed && styles.completedText]}>
                    {item.description}
                  </Text>
                )}
                {item.exam && (
                  <Text style={styles.relatedExam}>
                    試験: {getExamName(item.exam)}
                  </Text>
                )}
              </View>
              
              {/* 削除ボタン */}
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeleteMilestone(item._id)}
                activeOpacity={0.7} // タッチフィードバックを改善
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }} // タッチ領域を拡大
              >
                <Text style={styles.deleteButtonText}>削除</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.message}>まだマイルストーンがありません。新しいマイルストーンを追加してください。</Text>
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
    borderRadius: 8,
    marginBottom: normalize(16),
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
    marginRight: normalize(8),
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
    marginBottom: normalize(16),
  },
  toggleLabel: {
    flex: 1,
    color: '#333',
    fontWeight: 'bold',
    fontSize: normalize(14),
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
  list: {
    flex: 1,
  },
  milestoneItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  completedMilestone: {
    backgroundColor: '#f5f5f5',
    borderColor: '#4285f4',
  },
  checkbox: {
    width: normalize(24),
    height: normalize(24),
    borderRadius: normalize(12),
    borderWidth: 2,
    borderColor: '#4285f4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
    marginTop: normalize(2),
  },
  checkboxInner: {
    width: normalize(12),
    height: normalize(12),
    borderRadius: normalize(6),
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#4285f4',
  },
  milestoneContent: {
    flex: 1,
  },
  milestoneTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    marginBottom: normalize(4),
    color: '#333',
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  milestoneDate: {
    fontSize: normalize(14),
    color: '#4285f4',
    marginBottom: normalize(4),
  },
  milestoneDescription: {
    fontSize: normalize(14),
    color: '#555',
    marginBottom: normalize(6),
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
    marginLeft: normalize(8),
    backgroundColor: '#f44336',
    padding: normalize(6),
    borderRadius: 4,
    alignSelf: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: normalize(12),
  },
});

export default Milestone;
