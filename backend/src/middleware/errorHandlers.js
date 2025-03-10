// エラーハンドリングミドルウェア

// カスタムエラークラス
class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 開発環境用エラーハンドラー（詳細なエラー情報を含む）
const developmentErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

// 本番環境用エラーハンドラー（安全なエラー情報のみを含む）
const productionErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // 運用上のエラーの場合は詳細を送信
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    // プログラミングエラーや不明なエラーの場合は詳細を隠す
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'エラーが発生しました。しばらく経ってからもう一度お試しください。'
    });
  }
};

// 未処理のルートハンドラー
const notFoundHandler = (req, res, next) => {
  const error = new AppError(404, `${req.originalUrl} というルートは存在しません`);
  next(error);
};

// mongooseエラー処理
const handleCastErrorDB = err => {
  const message = `無効な ${err.path}: ${err.value}`;
  return new AppError(400, message);
};

const handleDuplicateFieldsDB = err => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `重複したフィールド値: ${value}。別の値を使用してください。`;
  return new AppError(400, message);
};

const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `入力データが無効です。${errors.join('. ')}`;
  return new AppError(400, message);
};

const handleJWTError = () => new AppError(401, '無効なトークンです。再度ログインしてください。');

const handleJWTExpiredError = () => new AppError(401, 'トークンの有効期限が切れています。再度ログインしてください。');

// エラータイプに基づくエラー処理
const errorConverter = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  if (error.name === 'CastError') error = handleCastErrorDB(error);
  if (error.code === 11000) error = handleDuplicateFieldsDB(error);
  if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
  if (error.name === 'JsonWebTokenError') error = handleJWTError();
  if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

  // 環境に応じたエラーハンドラーを使用
  if (process.env.NODE_ENV === 'development') {
    developmentErrorHandler(error, req, res, next);
  } else {
    productionErrorHandler(error, req, res, next);
  }
};

module.exports = {
  AppError,
  notFoundHandler,
  errorConverter
};
