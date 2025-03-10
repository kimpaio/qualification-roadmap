const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// ユーザースキーマの定義
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'ユーザー名を入力してください'],
    trim: true,
    maxlength: [50, 'ユーザー名は50文字以内で入力してください']
  },
  email: {
    type: String,
    required: [true, 'メールアドレスを入力してください'],
    unique: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, '有効なメールアドレスを入力してください']
  },
  password: {
    type: String,
    required: [true, 'パスワードを入力してください'],
    minlength: [8, 'パスワードは8文字以上で入力してください'],
    select: false // クエリ結果にパスワードを含めない
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // createdAt, updatedAtフィールドを自動追加
  toJSON: { virtuals: true }, // JSON変換時に仮想フィールドを含める
  toObject: { virtuals: true } // オブジェクト変換時に仮想フィールドを含める
});

// パスワード保存前の自動ハッシュ化
userSchema.pre('save', async function(next) {
  // パスワードが変更されていない場合は処理をスキップ
  if (!this.isModified('password')) return next();
  
  // パスワードをハッシュ化（コスト係数：12）
  this.password = await bcrypt.hash(this.password, 12);
  
  next();
});

// パスワード変更時に変更日時を更新
userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();
  
  // トークン発行より少し前の時間を設定（タイムスタンプの誤差対策）
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// アクティブなユーザーのみ取得するクエリフィルタ
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// パスワード検証メソッド
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// JWTトークン発行後にパスワードが変更されたかを確認
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    // パスワード変更日時をUnixタイムスタンプに変換
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    
    // JWTの発行時刻よりパスワード変更時刻が新しい場合はtrueを返す
    return JWTTimestamp < changedTimestamp;
  }
  
  // パスワードが変更されていない場合はfalseを返す
  return false;
};

// パスワードリセットトークンの生成
userSchema.methods.createPasswordResetToken = function() {
  // ランダムなリセットトークンを生成
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // リセットトークンをハッシュ化してデータベースに保存
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  
  // リセットトークンの有効期限を設定（10分間）
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
  // 生成した（ハッシュ化前の）リセットトークンを返す
  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
