// 試験に関する情報を管理するモデルのスキーマを定義します。
const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
  name: { type: String, required: true },
  examDate: { type: Date, required: true },
  fee: { type: Number, required: true },
  // その他のフィールドを追加可能
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;
