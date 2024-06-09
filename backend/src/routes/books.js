// 参考書情報に関するAPIエンドポイントを定義します。
const express = require('express');
const booksController = require('../controllers/booksController');
const router = express.Router();

router.get('/', booksController.getBooks);
router.post('/', booksController.createBook);
router.get('/:id', booksController.getBookById);
router.put('/:id', booksController.updateBook);
router.delete('/:id', booksController.deleteBook);

module.exports = router;
