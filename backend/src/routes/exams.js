// 資格試験情報を扱うルートの例
const express = require('express');
const router = express.Router();
const examsController = require('../controllers/examsController');

// 試験情報の一覧を取得
router.get('/', examsController.getExams);

// 試験情報のIDを取得
router.get('/:id', examsController.getExamById);

// 日付で試験情報を検索
router.get('/search/date', examsController.getExamsByDate);

// 新しい試験情報を登録
router.post('/', examsController.createExam);

// 試験情報を更新
router.put('/:id', examsController.updateExam);

// 試験情報を削除
router.delete('/:id', examsController.deleteExam);

module.exports = router;
