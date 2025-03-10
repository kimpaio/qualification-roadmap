// Expressアプリケーションのメインファイルを定義します。
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// セキュリティ関連パッケージをインポート
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// パフォーマンス最適化パッケージ
const compression = require('compression');

// ロガーのインポート
const { logger, requestLogger } = require('./utils/logger');

// .envファイルを読み込みます。
require('dotenv').config();

// ルートファイルをインポートします。
const booksRouter = require('./routes/books');
const examsRouter = require('./routes/exams');
const usersRouter = require('./routes/users');
const remindersRouter = require('./routes/reminders');
const studyLogsRouter = require('./routes/studyLogs');
const milestonesRouter = require('./routes/milestones');

// エラーハンドリングミドルウェアをインポート
const { notFoundHandler, errorConverter } = require('./middleware/errorHandlers');

const app = express();
const PORT = process.env.PORT || 3000;

// データベースへの接続を初期化します。
connectDB();

// セキュリティミドルウェア設定
// HTTPヘッダーをセキュアに設定
app.use(helmet());

// レートリミッターを設定
const limiter = rateLimit({
  max: 100, // 100リクエストまで
  windowMs: 60 * 60 * 1000, // 1時間あたり
  message: 'このIPからのリクエストが多すぎます。しばらくしてから再試行してください。'
});
app.use('/api', limiter);

// クロスサイトスクリプティング(XSS)攻撃の防止
app.use(xss());

// NoSQLクエリインジェクション防止
app.use(mongoSanitize());

// HTTPパラメータ汚染の防止
app.use(hpp());

// データ圧縮を有効化（パフォーマンス最適化）
app.use(compression());

// キャッシュ制御ヘッダーを設定
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// CORS設定
app.use(cors());

// リクエストのJSONボディを解析するためのミドルウェアを設定します。
app.use(express.json({ limit: '10kb' })); // リクエストボディサイズを制限
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 構造化されたリクエストロギングミドルウェア
app.use(requestLogger);

// APIルートを設定します。
app.use('/api/books', booksRouter);
app.use('/api/exams', examsRouter);
app.use('/api/users', usersRouter);
app.use('/api/reminders', remindersRouter);
app.use('/api/study-logs', studyLogsRouter);
app.use('/api/milestones', milestonesRouter);

// 404エラーハンドリング（未定義のルートに対する処理）
app.use(notFoundHandler);

// グローバルエラーハンドリング
app.use(errorConverter);

// アプリケーションの起動状態をログに記録
process.on('unhandledRejection', (err) => {
  logger.error('未処理の拒否があります！ アプリケーションを終了します...', err);
  // サーバーを適切に閉じて、プロセスを終了
  server.close(() => {
    process.exit(1);
  });
});

// サーバーを起動します。
const server = app.listen(PORT, () => {
  logger.info(`サーバーが起動しました：ポート ${PORT}`);
});
