const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// ユーザー登録
router.post('/register', authController.register);

// ログイン
router.post('/login', authController.login);

// ログアウト
router.get('/logout', authController.logout);

// パスワードを忘れた場合のリセットトークン生成
router.post('/forgotPassword', authController.forgotPassword);

// パスワードリセット（トークンを使用）
router.post('/resetPassword/:token', authController.resetPassword);

// 以下のルートは認証が必要
// 現在のユーザー情報を取得
router.get('/me', protect, authController.getMe);

// パスワード更新
router.put('/updatePassword', protect, authController.updatePassword);

module.exports = router;
