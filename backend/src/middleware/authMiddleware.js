const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { logger } = require('../utils/logger');

// JWT認証ミドルウェア - トークンの検証と認証済みユーザーの取得
exports.protect = async (req, res, next) => {
  try {
    let token;

    // 認証ヘッダーからトークンを取得
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Cookie経由のトークン確認
    else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // トークンが存在しない場合
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '認証されていません。ログインしてください。'
      });
    }

    // トークンを検証
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // トークンのユーザーIDを使用してユーザーを検索
    const currentUser = await User.findById(decoded.id);

    // ユーザーが存在しない場合
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'このトークンに該当するユーザーが存在しません。'
      });
    }

    // トークン発行後にパスワードが変更された場合
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        success: false,
        message: 'パスワードが最近変更されました。再度ログインしてください。'
      });
    }

    // 認証に成功したユーザーをリクエストに追加
    req.user = currentUser;
    next();
  } catch (error) {
    logger.error('認証エラー:', error);
    return res.status(401).json({
      success: false,
      message: '認証に失敗しました。ログインしてください。'
    });
  }
};

// ロールベースの認可ミドルウェア - 特定の役割のユーザーのみアクセスを許可
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // すでに認証済みのユーザーのロールを確認
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'このアクションを実行する権限がありません。'
      });
    }

    next();
  };
};

// 現在のユーザーを取得するミドルウェア（認証は必須ではない）
exports.getCurrentUser = async (req, res, next) => {
  try {
    let token;

    // リクエストヘッダーまたはクッキーからトークンを取得
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // トークンがない場合は、認証されていないユーザーとして処理
    if (!token) {
      return next();
    }

    // トークンを検証してユーザー情報を取得
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);

    // ユーザーが存在しない、またはパスワードが変更されている場合
    if (!currentUser || currentUser.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    // 現在のユーザーをリクエストに追加
    req.user = currentUser;
    res.locals.user = currentUser; // ビューテンプレートでアクセス可能に
    next();
  } catch (error) {
    // トークンの検証に失敗した場合も次のミドルウェアに進む
    next();
  }
};
