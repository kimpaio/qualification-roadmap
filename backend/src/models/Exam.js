// 試験に関する情報を管理するモデルのスキーマを定義します。
const mongoose = require('mongoose');
const { Schema } = mongoose;

const examSchema = new Schema({
  name: { type: String, required: true },
  examDate: { type: Date, required: true },
  fee: { type: Number, required: true },
  location: { type: String },
  applicationDeadline: { type: Date },
  description: { type: String },
  level: { type: String },
  passingScore: { type: Number },
  prerequisites: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // この試験に関連する参考書への参照
  recommendedBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
});

// 更新前に updatedAt を更新する
examSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
