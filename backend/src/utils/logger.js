const winston = require('winston');
const { format, createLogger, transports } = winston;
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// ログディレクトリの作成
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// ログフォーマットの設定
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// コンソール出力用フォーマット
const consoleFormat = format.combine(
  format.colorize(),
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.printf(
    info => `${info.timestamp} ${info.level}: ${info.message} ${info.stack || ''}`
  )
);

// 開発環境用ロガー
const developmentLogger = () => {
  return createLogger({
    level: 'debug',
    format: logFormat,
    defaultMeta: { service: 'qualification-roadmap-api' },
    transports: [
      new transports.Console({
        format: consoleFormat
      })
    ]
  });
};

// 本番環境用ロガー
const productionLogger = () => {
  return createLogger({
    level: 'info',
    format: logFormat,
    defaultMeta: { service: 'qualification-roadmap-api' },
    transports: [
      // エラーレベルのログは別ファイルに記録
      new DailyRotateFile({
        filename: path.join(logDir, 'error-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        level: 'error',
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true
      }),
      // すべてのレベルのログを記録
      new DailyRotateFile({
        filename: path.join(logDir, 'combined-%DATE%.log'),
        datePattern: 'YYYY-MM-DD',
        maxSize: '20m',
        maxFiles: '14d',
        zippedArchive: true
      }),
      new transports.Console({
        format: consoleFormat
      })
    ]
  });
};

// 環境に応じたロガーを選択
const logger = process.env.NODE_ENV === 'production' 
  ? productionLogger() 
  : developmentLogger();

// リクエストロギングミドルウェア
const requestLogger = (req, res, next) => {
  const start = new Date();
  
  // レスポンス送信後のログ記録
  res.on('finish', () => {
    const duration = new Date() - start;
    logger.info({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.headers['user-agent'] || '-',
      ip: req.ip || req.connection.remoteAddress
    });
  });
  
  next();
};

module.exports = { logger, requestLogger };
