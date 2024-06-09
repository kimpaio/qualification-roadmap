// ユーザーモデルのスキーマを定義します。認証情報もここに含めることができます。
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // その他のフィールドを追加可能
});

const User = mongoose.model('User', userSchema);

module.exports = User;
