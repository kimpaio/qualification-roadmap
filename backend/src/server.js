// Expressアプリケーションのメインファイルを定義します。
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
// .envファイルを読み込みます。
require('dotenv').config();
// ルートファイルをインポートします。
const booksRouter = require('./routes/books');
const examsRouter = require('./routes/exams');
const usersRouter = require('./routes/users');
const remindersRouter = require('./routes/reminders');
const studyLogsRouter = require('./routes/studyLogs');
const milestonesRouter = require('./routes/milestones');

const app = express();
const PORT = process.env.PORT || 3000;
console.log(process.env.MONGODB_URI);
// データベースへの接続を初期化します。
connectDB();

// リクエストのJSONボディを解析するためのミドルウェアを設定します。
app.use(cors());
app.use(express.json());

// APIルートを設定します。
app.use('/api/books', booksRouter);
app.use('/api/exams', examsRouter);
app.use('/api/users', usersRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/study-logs', studyLogsRouter);
app.use('/api/milestones', milestonesRouter);

// サーバーを指定したポートで起動します。
app.listen(PORT, () => {
  console.log(`サーバーがポート ${PORT} で起動しました`);
});
