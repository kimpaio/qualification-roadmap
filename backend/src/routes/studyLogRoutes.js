const express = require('express');
const router = express.Router();
const studyLogsController = require('../controllers/studyLogsController');

// すべての学習記録を取得
router.get('/', studyLogsController.getStudyLogs);

// 特定のユーザーの学習記録を取得
router.get('/user/:userId', studyLogsController.getUserStudyLogs);

// 特定の参考書に関連する学習記録を取得
router.get('/book/:bookId', studyLogsController.getBookStudyLogs);

// 期間指定で学習記録を取得
router.get('/date-range', studyLogsController.getStudyLogsByDateRange);

// ユーザーの学習統計情報を取得
router.get('/stats/user/:userId', studyLogsController.getUserStudyStats);

// IDによる特定の学習記録を取得
router.get('/:id', studyLogsController.getStudyLogById);

// 新しい学習記録を作成
router.post('/', studyLogsController.createStudyLog);

// 学習記録を更新
router.put('/:id', studyLogsController.updateStudyLog);

// 学習記録を削除
router.delete('/:id', studyLogsController.deleteStudyLog);

module.exports = router;
