const Reminder = require('../models/Reminder');

// すべてのリマインダーを取得
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({}).populate('exam');
    res.status(200).json(reminders);
  } catch (error) {
    console.error('リマインダー取得エラー:', error);
    res.status(500).json({ message: 'リマインダーの取得中にエラーが発生しました', error: error.message });
  }
};

// 特定のユーザーに関連するリマインダーを取得
exports.getUserReminders = async (req, res) => {
  try {
    const { userId } = req.params;
    const reminders = await Reminder.find({ user: userId }).populate('exam');
    res.status(200).json(reminders);
  } catch (error) {
    console.error(`ユーザーID: ${req.params.userId} のリマインダー取得エラー:`, error);
    res.status(500).json({ message: 'ユーザーのリマインダー取得中にエラーが発生しました', error: error.message });
  }
};

// 特定のリマインダーをIDで取得
exports.getReminderById = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id).populate('exam');
    if (!reminder) {
      return res.status(404).json({ message: '指定されたIDのリマインダーが見つかりません' });
    }
    res.status(200).json(reminder);
  } catch (error) {
    console.error(`リマインダーID: ${req.params.id} の取得エラー:`, error);
    res.status(500).json({ message: 'リマインダーの取得中にエラーが発生しました', error: error.message });
  }
};

// 新しいリマインダーを作成
exports.createReminder = async (req, res) => {
  try {
    const newReminder = new Reminder(req.body);
    const savedReminder = await newReminder.save();
    const populatedReminder = await Reminder.findById(savedReminder._id).populate('exam');
    res.status(201).json(populatedReminder);
  } catch (error) {
    console.error('リマインダー作成エラー:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: '入力データが無効です', error: error.message });
    }
    res.status(500).json({ message: 'リマインダーの作成中にエラーが発生しました', error: error.message });
  }
};

// リマインダーを更新
exports.updateReminder = async (req, res) => {
  try {
    const updatedReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('exam');
    
    if (!updatedReminder) {
      return res.status(404).json({ message: '更新するリマインダーが見つかりません' });
    }
    
    res.status(200).json(updatedReminder);
  } catch (error) {
    console.error(`リマインダーID: ${req.params.id} の更新エラー:`, error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: '入力データが無効です', error: error.message });
    }
    res.status(500).json({ message: 'リマインダーの更新中にエラーが発生しました', error: error.message });
  }
};

// リマインダーを削除
exports.deleteReminder = async (req, res) => {
  try {
    const deletedReminder = await Reminder.findByIdAndDelete(req.params.id);
    
    if (!deletedReminder) {
      return res.status(404).json({ message: '削除するリマインダーが見つかりません' });
    }
    
    res.status(200).json({ message: 'リマインダーが正常に削除されました', data: deletedReminder });
  } catch (error) {
    console.error(`リマインダーID: ${req.params.id} の削除エラー:`, error);
    res.status(500).json({ message: 'リマインダーの削除中にエラーが発生しました', error: error.message });
  }
};

// 特定の試験に関連するリマインダーを取得
exports.getExamReminders = async (req, res) => {
  try {
    const { examId } = req.params;
    const reminders = await Reminder.find({ exam: examId }).populate('exam');
    res.status(200).json(reminders);
  } catch (error) {
    console.error(`試験ID: ${req.params.examId} のリマインダー取得エラー:`, error);
    res.status(500).json({ message: '試験に関連するリマインダー取得中にエラーが発生しました', error: error.message });
  }
};
