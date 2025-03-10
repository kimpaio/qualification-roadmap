// ユーザーモデルのスキーマを定義します。認証情報もここに含めることができます。
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  fullName: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  // ユーザーの学習目標の試験への参照
  targetExams: [{ type: Schema.Types.ObjectId, ref: 'Exam' }],
  // ユーザーの学習中の参考書への参照
  studyBooks: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
});

// 更新前に updatedAt を更新する
userSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
