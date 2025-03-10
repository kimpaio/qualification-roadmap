// Mongooseスキーマを使用して、参考書オブジェクトのモデルを定義します。
const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  description: { type: String, required: false },
  publisher: { type: String },
  publishedDate: { type: Date },
  coverImage: { type: String },
  pageCount: { type: Number },
  price: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // その他のフィールドを追加可能
  relatedExams: [{ type: Schema.Types.ObjectId, ref: 'Exam' }]
});

// 更新時には updatedAt を更新する
bookSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
