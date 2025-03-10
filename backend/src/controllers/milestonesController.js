const Milestone = require('../models/Milestone');

// すべてのマイルストーンを取得
exports.getMilestones = async (req, res) => {
  try {
    const milestones = await Milestone.find({}).populate('exam');
    res.status(200).json(milestones);
  } catch (error) {
    console.error('マイルストーン取得エラー:', error);
    res.status(500).json({ message: 'マイルストーンの取得中にエラーが発生しました', error: error.message });
  }
};

// 特定のユーザーに関連するマイルストーンを取得
exports.getUserMilestones = async (req, res) => {
  try {
    const { userId } = req.params;
    const milestones = await Milestone.find({ user: userId }).populate('exam');
    res.status(200).json(milestones);
  } catch (error) {
    console.error(`ユーザーID: ${req.params.userId} のマイルストーン取得エラー:`, error);
    res.status(500).json({ message: 'ユーザーのマイルストーン取得中にエラーが発生しました', error: error.message });
  }
};

// 特定のマイルストーンをIDで取得
exports.getMilestoneById = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id).populate('exam');
    if (!milestone) {
      return res.status(404).json({ message: '指定されたIDのマイルストーンが見つかりません' });
    }
    res.status(200).json(milestone);
  } catch (error) {
    console.error(`マイルストーンID: ${req.params.id} の取得エラー:`, error);
    res.status(500).json({ message: 'マイルストーンの取得中にエラーが発生しました', error: error.message });
  }
};

// 新しいマイルストーンを作成
exports.createMilestone = async (req, res) => {
  try {
    const newMilestone = new Milestone(req.body);
    const savedMilestone = await newMilestone.save();
    const populatedMilestone = await Milestone.findById(savedMilestone._id).populate('exam');
    res.status(201).json(populatedMilestone);
  } catch (error) {
    console.error('マイルストーン作成エラー:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: '入力データが無効です', error: error.message });
    }
    res.status(500).json({ message: 'マイルストーンの作成中にエラーが発生しました', error: error.message });
  }
};

// マイルストーンを更新
exports.updateMilestone = async (req, res) => {
  try {
    // 完了フラグが変更された場合、completedDateを更新
    if (req.body.completed && req.body.completed !== null) {
      const currentMilestone = await Milestone.findById(req.params.id);
      if (currentMilestone && currentMilestone.completed !== req.body.completed) {
        if (req.body.completed) {
          req.body.completedDate = new Date();
        } else {
          req.body.completedDate = null;
        }
      }
    }

    const updatedMilestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('exam');
    
    if (!updatedMilestone) {
      return res.status(404).json({ message: '更新するマイルストーンが見つかりません' });
    }
    
    res.status(200).json(updatedMilestone);
  } catch (error) {
    console.error(`マイルストーンID: ${req.params.id} の更新エラー:`, error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: '入力データが無効です', error: error.message });
    }
    res.status(500).json({ message: 'マイルストーンの更新中にエラーが発生しました', error: error.message });
  }
};

// マイルストーンを削除
exports.deleteMilestone = async (req, res) => {
  try {
    const deletedMilestone = await Milestone.findByIdAndDelete(req.params.id);
    
    if (!deletedMilestone) {
      return res.status(404).json({ message: '削除するマイルストーンが見つかりません' });
    }
    
    res.status(200).json({ message: 'マイルストーンが正常に削除されました', data: deletedMilestone });
  } catch (error) {
    console.error(`マイルストーンID: ${req.params.id} の削除エラー:`, error);
    res.status(500).json({ message: 'マイルストーンの削除中にエラーが発生しました', error: error.message });
  }
};

// 特定の試験に関連するマイルストーンを取得
exports.getExamMilestones = async (req, res) => {
  try {
    const { examId } = req.params;
    const milestones = await Milestone.find({ exam: examId }).populate('exam');
    res.status(200).json(milestones);
  } catch (error) {
    console.error(`試験ID: ${req.params.examId} のマイルストーン取得エラー:`, error);
    res.status(500).json({ message: '試験に関連するマイルストーン取得中にエラーが発生しました', error: error.message });
  }
};

// 完了したマイルストーンのみを取得
exports.getCompletedMilestones = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = { completed: true };
    
    if (userId) {
      query.user = userId;
    }
    
    const milestones = await Milestone.find(query).populate('exam');
    res.status(200).json(milestones);
  } catch (error) {
    console.error('完了したマイルストーン取得エラー:', error);
    res.status(500).json({ message: '完了したマイルストーンの取得中にエラーが発生しました', error: error.message });
  }
};

// 未完了のマイルストーンのみを取得
exports.getPendingMilestones = async (req, res) => {
  try {
    const { userId } = req.query;
    const query = { completed: false };
    
    if (userId) {
      query.user = userId;
    }
    
    const milestones = await Milestone.find(query).populate('exam').sort({ targetDate: 1 });
    res.status(200).json(milestones);
  } catch (error) {
    console.error('未完了のマイルストーン取得エラー:', error);
    res.status(500).json({ message: '未完了のマイルストーンの取得中にエラーが発生しました', error: error.message });
  }
};
