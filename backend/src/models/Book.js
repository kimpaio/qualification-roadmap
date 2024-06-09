// Mongooseスキーマを使用して、参考書オブジェクトのモデルを定義します。
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  description: { type: String, required: false },
  // その他のフィールドを追加可能
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
