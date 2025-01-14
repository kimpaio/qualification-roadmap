// MongoDBへの接続設定を定義します。
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDBに接続しました。');
  // エラーが発生した場合、コンソールにエラーメッセージを出力します。
  } catch (error) {
    console.error('MongoDBへの接続に失敗しました:', error);
    process.exit(1); // サーバーを安全に終了させます。
  }
};

module.exports = connectDB;
