// 資格試験情報を扱うルートの例
const express = require('express');
const router = express.Router();
const examsController = require('../controllers/examsController');

// 試験情報の一覧を取得
router.get('/', examsController.getExams);

// 新しい試験情報を登録
router.post('/', examsController.createExam);

// 他のルートも必要に応じて追加...

module.exports = router;
