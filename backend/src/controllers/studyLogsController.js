const StudyLog = require('../models/StudyLog');

// すべての学習記録を取得
exports.getStudyLogs = async (req, res) => {
  try {
    const studyLogs = await StudyLog.find({}).populate('book').populate('user');
    res.status(200).json(studyLogs);
  } catch (error) {
    console.error('学習記録取得エラー:', error);
    res.status(500).json({ message: '学習記録の取得中にエラーが発生しました', error: error.message });
  }
};

// 特定のユーザーに関連する学習記録を取得
exports.getUserStudyLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const studyLogs = await StudyLog.find({ user: userId }).populate('book').sort({ date: -1 });
    res.status(200).json(studyLogs);
  } catch (error) {
    console.error(`ユーザーID: ${req.params.userId} の学習記録取得エラー:`, error);
    res.status(500).json({ message: 'ユーザーの学習記録取得中にエラーが発生しました', error: error.message });
  }
};

// 特定の学習記録をIDで取得
exports.getStudyLogById = async (req, res) => {
  try {
    const studyLog = await StudyLog.findById(req.params.id).populate('book').populate('user');
    if (!studyLog) {
      return res.status(404).json({ message: '指定されたIDの学習記録が見つかりません' });
    }
    res.status(200).json(studyLog);
  } catch (error) {
    console.error(`学習記録ID: ${req.params.id} の取得エラー:`, error);
    res.status(500).json({ message: '学習記録の取得中にエラーが発生しました', error: error.message });
  }
};

// 新しい学習記録を作成
exports.createStudyLog = async (req, res) => {
  try {
    const newStudyLog = new StudyLog(req.body);
    const savedStudyLog = await newStudyLog.save();
    const populatedStudyLog = await StudyLog.findById(savedStudyLog._id).populate('book');
    res.status(201).json(populatedStudyLog);
  } catch (error) {
    console.error('学習記録作成エラー:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: '入力データが無効です', error: error.message });
    }
    res.status(500).json({ message: '学習記録の作成中にエラーが発生しました', error: error.message });
  }
};

// 学習記録を更新
exports.updateStudyLog = async (req, res) => {
  try {
    const updatedStudyLog = await StudyLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('book');
    
    if (!updatedStudyLog) {
      return res.status(404).json({ message: '更新する学習記録が見つかりません' });
    }
    
    res.status(200).json(updatedStudyLog);
  } catch (error) {
    console.error(`学習記録ID: ${req.params.id} の更新エラー:`, error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: '入力データが無効です', error: error.message });
    }
    res.status(500).json({ message: '学習記録の更新中にエラーが発生しました', error: error.message });
  }
};

// 学習記録を削除
exports.deleteStudyLog = async (req, res) => {
  try {
    const deletedStudyLog = await StudyLog.findByIdAndDelete(req.params.id);
    
    if (!deletedStudyLog) {
      return res.status(404).json({ message: '削除する学習記録が見つかりません' });
    }
    
    res.status(200).json({ message: '学習記録が正常に削除されました', data: deletedStudyLog });
  } catch (error) {
    console.error(`学習記録ID: ${req.params.id} の削除エラー:`, error);
    res.status(500).json({ message: '学習記録の削除中にエラーが発生しました', error: error.message });
  }
};

// 特定の参考書に関連する学習記録を取得
exports.getBookStudyLogs = async (req, res) => {
  try {
    const { bookId } = req.params;
    const studyLogs = await StudyLog.find({ book: bookId }).populate('user').sort({ date: -1 });
    res.status(200).json(studyLogs);
  } catch (error) {
    console.error(`参考書ID: ${req.params.bookId} の学習記録取得エラー:`, error);
    res.status(500).json({ message: '参考書に関連する学習記録取得中にエラーが発生しました', error: error.message });
  }
};

// 特定の期間の学習記録を取得
exports.getStudyLogsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const userId = req.query.userId; // オプションのユーザーID
    
    // 検索条件を作成
    const query = {};
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (userId) {
      query.user = userId;
    }
    
    const studyLogs = await StudyLog.find(query)
      .populate('book')
      .populate('user')
      .sort({ date: -1 });
      
    res.status(200).json(studyLogs);
  } catch (error) {
    console.error('期間指定学習記録取得エラー:', error);
    res.status(500).json({ message: '期間指定での学習記録取得中にエラーが発生しました', error: error.message });
  }
};

// 学習時間の統計情報を取得（ユーザーごと）
exports.getUserStudyStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { period } = req.query; // 'week', 'month', 'year' など
    
    // 期間の開始日を計算
    let startDate = new Date();
    if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    // 学習記録を取得
    const studyLogs = await StudyLog.find({
      user: userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    // 合計学習時間を計算
    const totalDuration = studyLogs.reduce((total, log) => total + log.duration, 0);
    
    // 日付ごとの学習時間を集計
    const dailyStats = {};
    studyLogs.forEach(log => {
      const dateStr = log.date.toISOString().split('T')[0]; // YYYY-MM-DD形式
      if (!dailyStats[dateStr]) {
        dailyStats[dateStr] = 0;
      }
      dailyStats[dateStr] += log.duration;
    });
    
    // トピックごとの学習時間を集計
    const topicStats = {};
    studyLogs.forEach(log => {
      if (!topicStats[log.topic]) {
        topicStats[log.topic] = 0;
      }
      topicStats[log.topic] += log.duration;
    });
    
    res.status(200).json({
      totalDuration,
      dailyStats,
      topicStats,
      studyCount: studyLogs.length
    });
  } catch (error) {
    console.error(`ユーザーID: ${req.params.userId} の学習統計取得エラー:`, error);
    res.status(500).json({ message: 'ユーザーの学習統計情報取得中にエラーが発生しました', error: error.message });
  }
};
