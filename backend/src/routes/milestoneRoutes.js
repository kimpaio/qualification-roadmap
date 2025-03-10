const express = require('express');
const router = express.Router();
const milestonesController = require('../controllers/milestonesController');

// すべてのマイルストーンを取得
router.get('/', milestonesController.getMilestones);

// 特定のユーザーのマイルストーンを取得
router.get('/user/:userId', milestonesController.getUserMilestones);

// 特定の試験に関連するマイルストーンを取得
router.get('/exam/:examId', milestonesController.getExamMilestones);

// 完了したマイルストーンのみを取得
router.get('/completed', milestonesController.getCompletedMilestones);

// 未完了のマイルストーンのみを取得
router.get('/pending', milestonesController.getPendingMilestones);

// IDによる特定のマイルストーンを取得
router.get('/:id', milestonesController.getMilestoneById);

// 新しいマイルストーンを作成
router.post('/', milestonesController.createMilestone);

// マイルストーンを更新
router.put('/:id', milestonesController.updateMilestone);

// マイルストーンを削除
router.delete('/:id', milestonesController.deleteMilestone);

module.exports = router;
