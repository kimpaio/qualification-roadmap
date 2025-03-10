const express = require('express');
const router = express.Router();
const remindersController = require('../controllers/remindersController');

// 全てのリマインダーを取得
router.get('/', remindersController.getReminders);

// 特定のユーザーのリマインダーを取得
router.get('/user/:userId', remindersController.getUserReminders);

// 特定の試験に関連するリマインダーを取得
router.get('/exam/:examId', remindersController.getExamReminders);

// IDによる特定のリマインダーを取得
router.get('/:id', remindersController.getReminderById);

// 新しいリマインダーを作成
router.post('/', remindersController.createReminder);

// リマインダーを更新
router.put('/:id', remindersController.updateReminder);

// リマインダーを削除
router.delete('/:id', remindersController.deleteReminder);

module.exports = router;
