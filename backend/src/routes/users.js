const express = require('express');
const usersController = require('../controllers/usersController');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const router = express.Router();

// すべてのルートで認証を必要とする
router.use(protect);

// 一般ユーザーは自分のプロフィールのみアクセス可能
router.get('/me', usersController.getUserById);
router.put('/me', usersController.updateUser);

// 以下のルートは管理者のみアクセス可能
router.use(restrictTo('admin'));

router.get('/', usersController.getUsers);
router.post('/', usersController.createUser);
router.get('/:id', usersController.getUserById);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
